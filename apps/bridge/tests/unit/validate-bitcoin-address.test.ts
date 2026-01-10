import { describe, it, expect } from "vitest";
import { validateBitcoinAddress } from "@/util/validate-bitcoin-address";
import {
  VALID_MAINNET,
  VALID_TESTNET,
  INVALID,
} from "../fixtures/addresses";

/**
 * Bitcoin Address Validation Tests
 *
 * CRITICAL: These tests verify that address validation correctly accepts/rejects
 * addresses. Wrong validation = lost funds. This is the highest priority test suite.
 */

describe("validateBitcoinAddress", () => {
  describe("mainnet addresses", () => {
    it("should accept valid P2WPKH mainnet address (bc1q)", () => {
      expect(validateBitcoinAddress(VALID_MAINNET.p2wpkh, "mainnet")).toBe(true);
    });

    it("should accept valid P2WSH mainnet address (bc1q, longer)", () => {
      expect(validateBitcoinAddress(VALID_MAINNET.p2wsh, "mainnet")).toBe(true);
    });

    it("should accept valid Taproot mainnet address (bc1p)", () => {
      expect(validateBitcoinAddress(VALID_MAINNET.p2tr, "mainnet")).toBe(true);
    });

    it("should accept valid legacy P2PKH mainnet address (1...)", () => {
      expect(validateBitcoinAddress(VALID_MAINNET.p2pkh, "mainnet")).toBe(true);
    });

    it("should accept valid P2SH mainnet address (3...)", () => {
      expect(validateBitcoinAddress(VALID_MAINNET.p2sh, "mainnet")).toBe(true);
    });
  });

  describe("testnet/regtest addresses", () => {
    // NOTE: The validation function uses Network.regtest for bech32 addresses
    // (bcrt1 prefix), which matches the local devenv setup.

    it("should accept valid P2WPKH regtest address (bcrt1q)", () => {
      expect(validateBitcoinAddress(VALID_TESTNET.p2wpkh, "testnet")).toBe(true);
    });

    it("should accept valid Taproot regtest address (bcrt1p)", () => {
      expect(validateBitcoinAddress(VALID_TESTNET.p2tr, "testnet")).toBe(true);
    });

    it("should accept valid legacy testnet address (m...)", () => {
      expect(validateBitcoinAddress(VALID_TESTNET.p2pkh_m, "testnet")).toBe(
        true
      );
    });

    it("should accept valid legacy testnet address (n...)", () => {
      expect(validateBitcoinAddress(VALID_TESTNET.p2pkh_n, "testnet")).toBe(
        true
      );
    });

    it("should accept valid P2SH testnet address (2...)", () => {
      expect(validateBitcoinAddress(VALID_TESTNET.p2sh, "testnet")).toBe(true);
    });
  });

  describe("network mismatch (CRITICAL SAFETY)", () => {
    /**
     * These tests are CRITICAL for bridge safety.
     * Accepting a testnet address on mainnet (or vice versa) could result
     * in funds being sent to the wrong network and lost forever.
     */

    it("should REJECT testnet address on mainnet", () => {
      // This is the most important safety check
      expect(validateBitcoinAddress(VALID_TESTNET.p2wpkh, "mainnet")).toBe(
        false
      );
    });

    it("should REJECT testnet Taproot on mainnet", () => {
      expect(validateBitcoinAddress(VALID_TESTNET.p2tr, "mainnet")).toBe(false);
    });

    it("should REJECT mainnet address on testnet", () => {
      expect(validateBitcoinAddress(VALID_MAINNET.p2wpkh, "testnet")).toBe(
        false
      );
    });

    it("should REJECT mainnet Taproot on testnet", () => {
      expect(validateBitcoinAddress(VALID_MAINNET.p2tr, "testnet")).toBe(false);
    });

    it("should REJECT mainnet legacy on testnet", () => {
      expect(validateBitcoinAddress(VALID_MAINNET.p2pkh, "testnet")).toBe(
        false
      );
    });
  });

  describe("invalid addresses", () => {
    it("should reject address with wrong checksum", () => {
      expect(validateBitcoinAddress(INVALID.wrongChecksum, "mainnet")).toBe(
        false
      );
    });

    it("should reject empty string", () => {
      expect(validateBitcoinAddress(INVALID.empty, "mainnet")).toBe(false);
    });

    it("should reject malformed string", () => {
      expect(validateBitcoinAddress(INVALID.malformed, "mainnet")).toBe(false);
    });

    it("should reject address that is too short", () => {
      expect(validateBitcoinAddress(INVALID.tooShort, "mainnet")).toBe(false);
    });

    it("should reject address with invalid characters", () => {
      expect(validateBitcoinAddress(INVALID.invalidChars, "mainnet")).toBe(
        false
      );
    });

    it("should reject mixed case bech32 (not allowed)", () => {
      expect(validateBitcoinAddress(INVALID.mixedCase, "mainnet")).toBe(false);
    });

    it("should reject address with wrong prefix", () => {
      expect(validateBitcoinAddress(INVALID.wrongPrefix, "mainnet")).toBe(
        false
      );
    });
  });

  describe("edge cases", () => {
    it("should handle null-like values gracefully", () => {
      // TypeScript would normally catch this, but runtime could receive bad data
      expect(validateBitcoinAddress("" as string, "mainnet")).toBe(false);
    });

    it("should handle addresses with whitespace", () => {
      const addressWithSpace = " " + VALID_MAINNET.p2wpkh + " ";
      expect(validateBitcoinAddress(addressWithSpace, "mainnet")).toBe(false);
    });

    it("should handle very long strings", () => {
      const veryLong = "bc1q" + "a".repeat(1000);
      expect(validateBitcoinAddress(veryLong, "mainnet")).toBe(false);
    });
  });

  describe("regtest support", () => {
    // The validation function uses Network.regtest for bech32 addresses
    // and Network.testnet for base58 addresses when network != mainnet
    it("should accept regtest bech32 address when network is testnet", () => {
      expect(validateBitcoinAddress(VALID_TESTNET.p2wpkh, "testnet")).toBe(
        true
      );
    });

    it("should accept base58 testnet address when network is testnet", () => {
      expect(validateBitcoinAddress(VALID_TESTNET.p2pkh_m, "testnet")).toBe(
        true
      );
    });
  });
});
