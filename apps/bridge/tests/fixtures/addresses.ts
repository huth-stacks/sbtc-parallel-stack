/**
 * Bitcoin address fixtures for testing
 *
 * These are real-format addresses for testing validation logic.
 * DO NOT use these for actual transactions!
 */

// Valid mainnet Bitcoin addresses
export const VALID_MAINNET = {
  // Native SegWit (P2WPKH) - bc1q prefix
  p2wpkh: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",

  // Native SegWit (P2WSH) - bc1q prefix, longer
  p2wsh: "bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3",

  // Taproot (P2TR) - bc1p prefix
  p2tr: "bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr",

  // Legacy P2PKH - starts with 1
  p2pkh: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",

  // P2SH-SegWit - starts with 3
  p2sh: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
};

// Valid testnet/regtest Bitcoin addresses
// NOTE: The validation function uses Network.regtest for bech32 addresses,
// which expects bcrt1 prefix (not tb1). This matches the local devenv setup.
// For base58 addresses, it uses Network.testnet (m/n/2 prefixes work).
export const VALID_TESTNET = {
  // Native SegWit regtest - bcrt1q prefix (not tb1q)
  // The validation function uses regtest for non-mainnet bech32
  p2wpkh: "bcrt1q6rhpng9evdsfnn833a4f4vej0asu6dk5srld6x",

  // Taproot regtest - bcrt1p prefix (not tb1p)
  p2tr: "bcrt1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqc8gma6",

  // Legacy testnet - starts with m or n (base58 works for both testnet/regtest)
  p2pkh_m: "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn",
  p2pkh_n: "n1wgm6kkzMcNfAtJmes8YhpvtDzdNhDY5a",

  // P2SH testnet - starts with 2 (base58 works for both testnet/regtest)
  p2sh: "2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc",
};

// Invalid addresses for negative testing
export const INVALID = {
  // Wrong checksum (modified last chars)
  wrongChecksum: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5xxx",

  // Empty string
  empty: "",

  // Random string
  malformed: "not-an-address",

  // Too short
  tooShort: "bc1q",

  // Contains invalid characters
  invalidChars: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq!@#",

  // Mixed case in bech32 (not allowed)
  mixedCase: "BC1Qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",

  // Wrong network prefix (made up)
  wrongPrefix: "xx1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
};

// Stacks addresses
export const VALID_STACKS = {
  mainnet: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  testnet: "ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQYAC0RQ",
};

export const INVALID_STACKS = {
  wrongPrefix: "XX2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  tooShort: "SP2J6ZY48GV1EZ5V",
  empty: "",
};
