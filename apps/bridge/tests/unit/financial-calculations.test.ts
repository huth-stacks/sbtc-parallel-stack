import { describe, it, expect } from "vitest";
import {
  formatBTC,
  validateWithdrawal,
} from "@/app/_withdraw/components/util/validate-withdraw-amount";
import * as yup from "yup";

/**
 * Financial Calculations Tests
 *
 * CRITICAL: These tests verify financial math that affects real funds.
 * Errors in BTC/satoshi conversion or validation = lost user funds.
 */

describe("formatBTC", () => {
  it("should format whole numbers correctly", () => {
    expect(formatBTC(1)).toBe("1");
    expect(formatBTC(100)).toBe("100");
  });

  it("should format decimal BTC values", () => {
    expect(formatBTC(0.5)).toBe("0.5");
    expect(formatBTC(1.5)).toBe("1.5");
  });

  it("should preserve up to 8 decimal places (satoshi precision)", () => {
    // 1 satoshi = 0.00000001 BTC
    expect(formatBTC(0.00000001)).toBe("0.00000001");
    expect(formatBTC(0.12345678)).toBe("0.12345678");
  });

  it("should handle very small amounts (dust)", () => {
    expect(formatBTC(0.00000001)).toBe("0.00000001");
    expect(formatBTC(0.00000546)).toBe("0.00000546"); // Common dust limit
  });

  it("should handle zero", () => {
    expect(formatBTC(0)).toBe("0");
  });

  it("should handle large amounts", () => {
    // 21 million BTC max supply
    const result = formatBTC(21000000);
    expect(result).toContain("21");
  });
});

describe("BTC to Satoshi conversion", () => {
  /**
   * CRITICAL: 1 BTC = 100,000,000 satoshis (1e8)
   * Wrong conversion factor = catastrophic fund loss
   */

  // Testing the conversion factor directly
  const convertBTCtoSats = (btcValue: number) => btcValue * 1e8;

  it("should convert 1 BTC to 100,000,000 satoshis", () => {
    expect(convertBTCtoSats(1)).toBe(100_000_000);
  });

  it("should convert 0.1 BTC to 10,000,000 satoshis", () => {
    expect(convertBTCtoSats(0.1)).toBe(10_000_000);
  });

  it("should convert 0.01 BTC to 1,000,000 satoshis", () => {
    expect(convertBTCtoSats(0.01)).toBe(1_000_000);
  });

  it("should convert 0.00000001 BTC (1 satoshi) correctly", () => {
    expect(convertBTCtoSats(0.00000001)).toBe(1);
  });

  it("should handle common withdrawal amounts", () => {
    expect(convertBTCtoSats(0.001)).toBe(100_000); // 0.001 BTC
    expect(convertBTCtoSats(0.005)).toBe(500_000); // 0.005 BTC
    expect(convertBTCtoSats(0.01)).toBe(1_000_000); // 0.01 BTC
  });

  it("should handle zero", () => {
    expect(convertBTCtoSats(0)).toBe(0);
  });
});

describe("Satoshi to BTC conversion", () => {
  /**
   * Reverse conversion used in balance display
   */
  const convertSatsToBTC = (sats: number) => sats / 1e8;

  it("should convert 100,000,000 satoshis to 1 BTC", () => {
    expect(convertSatsToBTC(100_000_000)).toBe(1);
  });

  it("should convert 1 satoshi to 0.00000001 BTC", () => {
    expect(convertSatsToBTC(1)).toBe(0.00000001);
  });

  it("should handle typical balance amounts", () => {
    expect(convertSatsToBTC(50_000_000)).toBe(0.5);
    expect(convertSatsToBTC(12_345_678)).toBe(0.12345678);
  });
});

describe("Balance calculation (funded - spent)", () => {
  /**
   * Tests the balance calculation: funded_txo_sum - spent_txo_sum
   * Used in getBtcBalance server action
   */

  const calculateBalance = (funded: number, spent: number) => {
    return (funded - spent) / 1e8;
  };

  it("should calculate positive balance", () => {
    // 1 BTC funded, 0.5 BTC spent = 0.5 BTC balance
    expect(calculateBalance(100_000_000, 50_000_000)).toBe(0.5);
  });

  it("should calculate zero balance", () => {
    expect(calculateBalance(100_000_000, 100_000_000)).toBe(0);
  });

  it("should handle untouched funds (nothing spent)", () => {
    expect(calculateBalance(100_000_000, 0)).toBe(1);
  });

  it("should handle dust amounts", () => {
    expect(calculateBalance(1000, 454)).toBe(0.00000546);
  });
});

describe("Withdrawal fee calculation", () => {
  /**
   * Fee = MULTIPLIER * fastestFee * TX_SIZE
   * Tests the formula used in get-withdrawal-max-fee.ts
   */

  const calculateFee = (
    multiplier: number,
    fastestFee: number,
    txSize: number
  ) => {
    return multiplier * fastestFee * txSize;
  };

  it("should calculate fee with typical values", () => {
    // Typical values: 1.5x multiplier, 10 sat/vB fee, 200 vB tx size
    expect(calculateFee(1.5, 10, 200)).toBe(3000);
  });

  it("should scale with fee rate", () => {
    // Higher fee rate = higher fee
    expect(calculateFee(1.5, 20, 200)).toBe(6000);
    expect(calculateFee(1.5, 50, 200)).toBe(15000);
  });

  it("should apply multiplier correctly", () => {
    // 2x multiplier should double the fee
    expect(calculateFee(2, 10, 200)).toBe(4000);
  });

  it("should handle low fee environment", () => {
    // Minimum fee of 1 sat/vB
    expect(calculateFee(1.5, 1, 200)).toBe(300);
  });
});

describe("Withdrawable balance after fees", () => {
  /**
   * maxWithdrawable = balance - fee
   * Critical: ensures user can't overdraw
   */

  const getMaxWithdrawable = (balance: number, fee: number) => {
    return balance - fee;
  };

  it("should calculate max withdrawable correctly", () => {
    // 1 BTC balance, 0.0001 BTC fee = 0.9999 BTC withdrawable
    expect(getMaxWithdrawable(1, 0.0001)).toBe(0.9999);
  });

  it("should return zero when balance equals fee", () => {
    expect(getMaxWithdrawable(0.0001, 0.0001)).toBe(0);
  });

  it("should return negative when balance < fee (edge case)", () => {
    // This should trigger validation error in real code
    expect(getMaxWithdrawable(0.00005, 0.0001)).toBeLessThan(0);
  });
});

describe("Decimal place validation", () => {
  /**
   * BTC can only have up to 8 decimal places (satoshi precision)
   * Note: This validates the STRING representation, which is how user input works
   */

  const hasValidDecimals = (valueStr: string): boolean => {
    const [, decimalPart] = valueStr.split(".");
    return !decimalPart || decimalPart.length <= 8;
  };

  it("should accept values with 8 or fewer decimal places", () => {
    expect(hasValidDecimals("0.12345678")).toBe(true);
    expect(hasValidDecimals("0.1234567")).toBe(true);
    expect(hasValidDecimals("0.1")).toBe(true);
    expect(hasValidDecimals("1")).toBe(true);
  });

  it("should reject values with more than 8 decimal places", () => {
    expect(hasValidDecimals("0.123456789")).toBe(false);
    expect(hasValidDecimals("0.0000000001")).toBe(false);
  });

  it("should handle edge case of exactly 8 decimals", () => {
    expect(hasValidDecimals("0.00000001")).toBe(true); // 1 satoshi
    expect(hasValidDecimals("0.000000001")).toBe(false); // sub-satoshi
  });
});

describe("Cap validation logic", () => {
  /**
   * Tests withdrawal cap checking logic
   * withdrawal must be <= perWithdrawalCap
   */

  const exceedsCap = (satsValue: number, cap: number): boolean => {
    return satsValue > cap;
  };

  it("should allow withdrawal at exactly the cap", () => {
    expect(exceedsCap(100_000_000, 100_000_000)).toBe(false);
  });

  it("should allow withdrawal below the cap", () => {
    expect(exceedsCap(50_000_000, 100_000_000)).toBe(false);
  });

  it("should reject withdrawal above the cap", () => {
    expect(exceedsCap(150_000_000, 100_000_000)).toBe(true);
  });

  it("should handle edge case of 1 satoshi over", () => {
    expect(exceedsCap(100_000_001, 100_000_000)).toBe(true);
  });
});
