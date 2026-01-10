import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkAvailableWallets, WalletType } from "@/util/wallet-utils";
import { getWalletAddresses } from "@/util/wallet-utils/src/getAddress";
import { AddressPurpose } from "sats-connect";

/**
 * Wallet Utilities Tests
 *
 * Tests for wallet detection, address extraction, and related utilities.
 * These tests mock window globals to simulate different wallet states.
 */

describe("WalletType enum", () => {
  it("should have correct wallet type values", () => {
    expect(WalletType.xverse).toBe("xverse");
    expect(WalletType.leather).toBe("leather");
    expect(WalletType.asigna).toBe("asigna");
    expect(WalletType.fordefi).toBe("fordefi");
  });
});

describe("checkAvailableWallets", () => {
  // Store original window properties
  const originalWindow = global.window;

  beforeEach(() => {
    // Create a minimal window mock
    global.window = {
      ...originalWindow,
      LeatherProvider: undefined,
      XverseProviders: undefined,
      BitcoinProvider: undefined,
      FordefiProviders: undefined,
      top: global.window,
      self: global.window,
    } as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it("should detect no wallets when none are installed", () => {
    const wallets = checkAvailableWallets();

    expect(wallets.leather).toBe(false);
    expect(wallets.xverse).toBe(false);
    expect(wallets.fordefi).toBe(false);
    // Asigna detection is based on iframe (window.top !== window.self)
    expect(wallets.asigna).toBe(false);
  });

  it("should detect Leather wallet when LeatherProvider is present", () => {
    (global.window as any).LeatherProvider = {};

    const wallets = checkAvailableWallets();

    expect(wallets.leather).toBe(true);
    expect(wallets.xverse).toBe(false);
  });

  it("should detect Xverse via XverseProviders.BitcoinProvider", () => {
    (global.window as any).XverseProviders = { BitcoinProvider: {} };

    const wallets = checkAvailableWallets();

    expect(wallets.xverse).toBe(true);
    expect(wallets.leather).toBe(false);
  });

  it("should detect Xverse via global BitcoinProvider", () => {
    (global.window as any).BitcoinProvider = {};

    const wallets = checkAvailableWallets();

    expect(wallets.xverse).toBe(true);
  });

  it("should detect Fordefi wallet", () => {
    (global.window as any).FordefiProviders = { UtxoProvider: {} };

    const wallets = checkAvailableWallets();

    expect(wallets.fordefi).toBe(true);
  });

  it("should detect Asigna when in iframe", () => {
    // Simulate iframe by making top !== self
    (global.window as any).top = {} as Window;
    (global.window as any).self = global.window;

    const wallets = checkAvailableWallets();

    expect(wallets.asigna).toBe(true);
  });

  it("should detect multiple wallets simultaneously", () => {
    (global.window as any).LeatherProvider = {};
    (global.window as any).XverseProviders = { BitcoinProvider: {} };
    (global.window as any).FordefiProviders = { UtxoProvider: {} };

    const wallets = checkAvailableWallets();

    expect(wallets.leather).toBe(true);
    expect(wallets.xverse).toBe(true);
    expect(wallets.fordefi).toBe(true);
  });
});

describe("getWalletAddresses", () => {
  /**
   * Tests for the pure function that extracts addresses from wallet_connect response.
   * This is a critical function that maps wallet responses to the app's address format.
   */

  it("should extract payment and stacks addresses from response", () => {
    const mockResponse = {
      addresses: [
        {
          address: "bc1qtest123",
          publicKey: "pubkey123",
          purpose: AddressPurpose.Payment,
        },
        {
          address: "SP123456789",
          publicKey: "stxpubkey",
          purpose: AddressPurpose.Stacks,
        },
      ],
    };

    const result = getWalletAddresses(mockResponse);

    expect(result.payment).toEqual({
      address: "bc1qtest123",
      publicKey: "pubkey123",
      purpose: AddressPurpose.Payment,
    });
    expect(result.stacks).toEqual({
      address: "SP123456789",
      publicKey: "stxpubkey",
      purpose: AddressPurpose.Stacks,
    });
    expect(result.musig).toBeNull();
  });

  it("should return null for missing payment address", () => {
    const mockResponse = {
      addresses: [
        {
          address: "SP123456789",
          publicKey: "stxpubkey",
          purpose: AddressPurpose.Stacks,
        },
      ],
    };

    const result = getWalletAddresses(mockResponse);

    expect(result.payment).toBeNull();
    expect(result.stacks).not.toBeNull();
  });

  it("should return null for missing stacks address", () => {
    const mockResponse = {
      addresses: [
        {
          address: "bc1qtest123",
          publicKey: "pubkey123",
          purpose: AddressPurpose.Payment,
        },
      ],
    };

    const result = getWalletAddresses(mockResponse);

    expect(result.payment).not.toBeNull();
    expect(result.stacks).toBeNull();
  });

  it("should handle empty addresses array", () => {
    const mockResponse = {
      addresses: [],
    };

    const result = getWalletAddresses(mockResponse);

    expect(result.payment).toBeNull();
    expect(result.stacks).toBeNull();
    expect(result.musig).toBeNull();
  });

  it("should ignore ordinals addresses (not used by bridge)", () => {
    const mockResponse = {
      addresses: [
        {
          address: "bc1pordinals123",
          publicKey: "ordinalpubkey",
          purpose: AddressPurpose.Ordinals,
        },
        {
          address: "bc1qpayment456",
          publicKey: "paymentpubkey",
          purpose: AddressPurpose.Payment,
        },
      ],
    };

    const result = getWalletAddresses(mockResponse);

    // Should only have payment, not ordinals
    expect(result.payment?.address).toBe("bc1qpayment456");
    expect(result.stacks).toBeNull();
  });
});
