import { describe, it, expect } from "vitest";
import {
  decodeBitcoinAddress,
  encodeBitcoinAddress,
} from "@/util/decode-bitcoin-address";
import * as bitcoin from "bitcoinjs-lib";
import { VALID_MAINNET, VALID_TESTNET } from "../fixtures/addresses";

/**
 * Bitcoin Address Encoding/Decoding Tests
 *
 * CRITICAL: These tests verify cryptographic address operations.
 * Wrong encoding/decoding = funds sent to wrong address = permanent loss.
 */

describe("decodeBitcoinAddress", () => {
  describe("mainnet addresses", () => {
    it("should decode P2WPKH (bc1q) address correctly", () => {
      const result = decodeBitcoinAddress(VALID_MAINNET.p2wpkh);

      expect(result.type).toBe("0x04"); // P2WPKH type
      expect(result.hash).toBeInstanceOf(Uint8Array);
      expect(result.hash.length).toBe(20); // P2WPKH hash is 20 bytes
    });

    it("should decode P2WSH (bc1q, longer) address correctly", () => {
      const result = decodeBitcoinAddress(VALID_MAINNET.p2wsh);

      expect(result.type).toBe("0x05"); // P2WSH type
      expect(result.hash).toBeInstanceOf(Uint8Array);
      expect(result.hash.length).toBe(32); // P2WSH hash is 32 bytes
    });

    it("should decode Taproot (bc1p) address correctly", () => {
      const result = decodeBitcoinAddress(VALID_MAINNET.p2tr);

      expect(result.type).toBe("0x06"); // P2TR type
      expect(result.hash).toBeInstanceOf(Uint8Array);
      expect(result.hash.length).toBe(32); // Taproot is 32 bytes
    });

    it("should decode legacy P2PKH (1...) address correctly", () => {
      const result = decodeBitcoinAddress(VALID_MAINNET.p2pkh);

      expect(result.type).toBe("0x00"); // P2PKH type
      expect(result.hash).toBeInstanceOf(Uint8Array);
      expect(result.hash.length).toBe(20); // P2PKH hash is 20 bytes
    });

    it("should decode P2SH (3...) address correctly", () => {
      const result = decodeBitcoinAddress(VALID_MAINNET.p2sh);

      expect(result.type).toBe("0x01"); // P2SH type
      expect(result.hash).toBeInstanceOf(Uint8Array);
      expect(result.hash.length).toBe(20); // P2SH hash is 20 bytes
    });
  });

  describe("type mapping", () => {
    /**
     * Verify the type codes match the expected values used by sBTC
     */

    it("should use correct type codes", () => {
      // These codes must match what sBTC expects
      expect(decodeBitcoinAddress(VALID_MAINNET.p2pkh).type).toBe("0x00");
      expect(decodeBitcoinAddress(VALID_MAINNET.p2sh).type).toBe("0x01");
      expect(decodeBitcoinAddress(VALID_MAINNET.p2wpkh).type).toBe("0x04");
      expect(decodeBitcoinAddress(VALID_MAINNET.p2wsh).type).toBe("0x05");
      expect(decodeBitcoinAddress(VALID_MAINNET.p2tr).type).toBe("0x06");
    });
  });

  describe("error handling", () => {
    it("should throw on invalid address", () => {
      expect(() => decodeBitcoinAddress("invalid")).toThrow();
    });

    it("should throw on empty string", () => {
      expect(() => decodeBitcoinAddress("")).toThrow();
    });
  });
});

describe("encodeBitcoinAddress", () => {
  /**
   * Round-trip tests: decode then encode should return original address
   */

  describe("mainnet round-trips", () => {
    it("should round-trip P2PKH address", () => {
      const original = VALID_MAINNET.p2pkh;
      const decoded = decodeBitcoinAddress(original);

      // Convert Uint8Array to hex string
      const hashHex = Buffer.from(decoded.hash).toString("hex");

      const encoded = encodeBitcoinAddress(
        hashHex,
        decoded.type,
        bitcoin.networks.bitcoin
      );

      expect(encoded).toBe(original);
    });

    it("should round-trip P2SH address", () => {
      const original = VALID_MAINNET.p2sh;
      const decoded = decodeBitcoinAddress(original);
      const hashHex = Buffer.from(decoded.hash).toString("hex");

      const encoded = encodeBitcoinAddress(
        hashHex,
        decoded.type,
        bitcoin.networks.bitcoin
      );

      expect(encoded).toBe(original);
    });

    it("should round-trip P2WPKH address", () => {
      const original = VALID_MAINNET.p2wpkh;
      const decoded = decodeBitcoinAddress(original);
      const hashHex = Buffer.from(decoded.hash).toString("hex");

      const encoded = encodeBitcoinAddress(
        hashHex,
        decoded.type,
        bitcoin.networks.bitcoin
      );

      expect(encoded).toBe(original);
    });

    it("should round-trip P2WSH address", () => {
      const original = VALID_MAINNET.p2wsh;
      const decoded = decodeBitcoinAddress(original);
      const hashHex = Buffer.from(decoded.hash).toString("hex");

      const encoded = encodeBitcoinAddress(
        hashHex,
        decoded.type,
        bitcoin.networks.bitcoin
      );

      expect(encoded).toBe(original);
    });

    it("should round-trip Taproot address", () => {
      const original = VALID_MAINNET.p2tr;
      const decoded = decodeBitcoinAddress(original);
      const hashHex = Buffer.from(decoded.hash).toString("hex");

      const encoded = encodeBitcoinAddress(
        hashHex,
        decoded.type,
        bitcoin.networks.bitcoin
      );

      expect(encoded).toBe(original);
    });
  });

  describe("version handling", () => {
    /**
     * Test that the correct encoding is used for each version type
     */

    it("should encode P2PKH (version 0x00) as base58 with pubKeyHash", () => {
      // Known test vector for P2PKH
      const hash = "0014" + "a".repeat(36); // Dummy hash
      const result = encodeBitcoinAddress(
        "a".repeat(40),
        "0x00",
        bitcoin.networks.bitcoin
      );

      // Should start with '1' for mainnet P2PKH
      expect(result.startsWith("1")).toBe(true);
    });

    it("should encode P2SH (version 0x01) as base58 with scriptHash", () => {
      const result = encodeBitcoinAddress(
        "b".repeat(40),
        "0x01",
        bitcoin.networks.bitcoin
      );

      // Should start with '3' for mainnet P2SH
      expect(result.startsWith("3")).toBe(true);
    });

    it("should encode P2WPKH (version 0x04) as bech32 witness v0", () => {
      const result = encodeBitcoinAddress(
        "c".repeat(40),
        "0x04",
        bitcoin.networks.bitcoin
      );

      // Should start with 'bc1q' for mainnet P2WPKH
      expect(result.startsWith("bc1q")).toBe(true);
    });

    it("should encode P2TR (version 0x06) as bech32m witness v1", () => {
      // Taproot needs 32 bytes (64 hex chars)
      const result = encodeBitcoinAddress(
        "d".repeat(64),
        "0x06",
        bitcoin.networks.bitcoin
      );

      // Should start with 'bc1p' for mainnet Taproot
      expect(result.startsWith("bc1p")).toBe(true);
    });
  });

  describe("testnet encoding", () => {
    it("should encode P2WPKH for testnet with tb1q prefix", () => {
      const result = encodeBitcoinAddress(
        "e".repeat(40),
        "0x04",
        bitcoin.networks.testnet
      );

      expect(result.startsWith("tb1q")).toBe(true);
    });

    it("should encode Taproot for testnet with tb1p prefix", () => {
      const result = encodeBitcoinAddress(
        "f".repeat(64),
        "0x06",
        bitcoin.networks.testnet
      );

      expect(result.startsWith("tb1p")).toBe(true);
    });
  });
});

describe("Hash length requirements", () => {
  /**
   * Different address types have specific hash length requirements
   */

  it("P2PKH and P2SH require 20-byte hashes", () => {
    const decoded = decodeBitcoinAddress(VALID_MAINNET.p2pkh);
    expect(decoded.hash.length).toBe(20);

    const decodedSh = decodeBitcoinAddress(VALID_MAINNET.p2sh);
    expect(decodedSh.hash.length).toBe(20);
  });

  it("P2WPKH requires 20-byte hash", () => {
    const decoded = decodeBitcoinAddress(VALID_MAINNET.p2wpkh);
    expect(decoded.hash.length).toBe(20);
  });

  it("P2WSH requires 32-byte hash", () => {
    const decoded = decodeBitcoinAddress(VALID_MAINNET.p2wsh);
    expect(decoded.hash.length).toBe(32);
  });

  it("P2TR requires 32-byte hash", () => {
    const decoded = decodeBitcoinAddress(VALID_MAINNET.p2tr);
    expect(decoded.hash.length).toBe(32);
  });
});
