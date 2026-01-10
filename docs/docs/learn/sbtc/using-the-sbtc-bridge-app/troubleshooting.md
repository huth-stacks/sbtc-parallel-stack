# Troubleshooting

This guide helps you resolve common issues when using the sBTC Bridge. Use the quick reference table below to find your issue, or scroll down for detailed explanations.

{% hint style="info" %}
For quick answers to common questions, also check the [sBTC FAQ](../sbtc-faq.md).
{% endhint %}

## Quick Reference: Common Errors

| Error Message | Likely Cause | Quick Fix |
|---------------|--------------|-----------|
| `Errors.Invalid_Transaction` | Using Nested SegWit wallet | Switch to Native SegWit in wallet settings |
| Insufficient funds | Protected UTXOs or pending transactions | Check spendable balance, unprotect UTXOs |
| Transaction pending (hours) | Network congestion or low fee | Wait or use RBF to increase fee |
| sBTC not in wallet | Display not enabled | Enable sBTC token in wallet settings |
| Amount below minimum | Deposit too small | Minimum deposit is 0.001 BTC |

---

## Balance vs Spendable: Why Can't I Spend My BTC?

One of the most common issues users encounter is seeing a BTC balance in their wallet but being unable to spend it. This typically happens due to **protected UTXOs**.

### What Are Protected UTXOs?

UTXOs (Unspent Transaction Outputs) are individual "coins" that make up your total balance. Wallets like Xverse and Leather may mark certain UTXOs as "protected" to:

- Prevent accidental spending of Ordinals or inscriptions
- Reserve funds for pending transactions
- Protect rare sats or special outputs

### How to Identify Protected UTXOs

{% stepper %}
{% step %}
**Check your wallet's UTXO view**

In Xverse, go to Settings > Advanced > View UTXOs to see which outputs are protected.
{% endstep %}

{% step %}
**Compare total vs spendable balance**

If your spendable balance is less than your total balance, some UTXOs are protected.
{% endstep %}
{% endstepper %}

### How to Unprotect UTXOs

{% stepper %}
{% step %}
**In Xverse**

1. Open Settings
2. Go to Advanced > Manage UTXOs
3. Find the protected UTXO
4. Toggle protection off

{% hint style="warning" %}
Only unprotect UTXOs if you're certain they don't contain valuable inscriptions or Ordinals.
{% endhint %}
{% endstep %}

{% step %}
**In Leather**

1. Go to Activity tab
2. Find the transaction containing the protected UTXO
3. Click on it and select "Unprotect"
{% endstep %}
{% endstepper %}

---

## Invalid_Transaction Error

If you receive an `Errors.Invalid_Transaction` error when using Xverse, you're likely using a **Nested SegWit** wallet instead of **Native SegWit**.

### Why This Happens

The sBTC Bridge requires Native SegWit addresses (starting with `bc1q...` or `bc1p...`) for PSBT (Partially Signed Bitcoin Transaction) compatibility. Nested SegWit addresses (starting with `3...`) use a different signing format.

### How to Fix

{% stepper %}
{% step %}
**In Xverse**

1. Open Xverse wallet
2. Go to Settings
3. Select "Address Type"
4. Choose "Native SegWit" (bc1...)
5. Reconnect to the sBTC Bridge
{% endstep %}

{% step %}
**In Leather**

Leather uses Native SegWit by default. If you're seeing this error with Leather:
1. Ensure you're using the latest version
2. Clear browser cache and reconnect
{% endstep %}
{% endstepper %}

---

## Transaction Stuck in Pending

Bitcoin transactions can take time to confirm, especially during network congestion.

### Expected Times

| Status | Typical Duration |
|--------|------------------|
| Pending (in mempool) | 10 min - 2 hours |
| Minting (after BTC confirms) | 10-30 minutes |
| Completed | Total: 1-3 hours |

### If Your Transaction Is Taking Too Long

{% stepper %}
{% step %}
**Check the mempool**

Visit [mempool.space](https://mempool.space) and search for your transaction ID to see its status and position in the queue.
{% endstep %}

{% step %}
**Consider the fee you selected**

Low-fee transactions may take longer during high-congestion periods. If your wallet supports Replace-By-Fee (RBF), you can increase the fee.
{% endstep %}

{% step %}
**Wait for confirmation**

Most transactions confirm within 1-3 hours. If your transaction has been pending for more than 24 hours, contact support.
{% endstep %}
{% endstepper %}

---

## sBTC Not Appearing in Wallet

After your deposit completes, you should see sBTC in your wallet. If you don't:

{% stepper %}
{% step %}
**Enable sBTC token display**

In Xverse or Leather, go to "Manage Tokens" and enable sBTC to display in your wallet.
{% endstep %}

{% step %}
**Check the correct address**

Verify that your sBTC was sent to the Stacks address you specified during deposit. You can check on the [Stacks Explorer](https://explorer.hiro.so/).
{% endstep %}

{% step %}
**Allow time for wallet sync**

Wallets may take up to 20 minutes to display new tokens after the transaction confirms.
{% endstep %}
{% endstepper %}

---

## Network Mismatch Errors

If you see errors about network mismatches, ensure:

1. **Your wallet is connected to the correct network** (Mainnet for real transactions, Testnet for testing)
2. **The bridge is set to the correct network** - verify the URL is `sbtc.stacks.co` for mainnet
3. **You're not mixing testnet and mainnet addresses**

---

## Reclaiming Failed Deposits

If your sBTC mint fails, you can reclaim your BTC:

1. Visit `https://sbtc.stacks.co/<TX_ID>/reclaim` (replace `<TX_ID>` with your Bitcoin transaction ID)
2. Check the "Lock Time" field - you must wait this many blocks before reclaiming
3. Click "Reclaim" and sign the transaction

{% hint style="info" %}
This initiates a Bitcoin transaction that returns your BTC to you. There's no additional fee beyond the Bitcoin network fee.
{% endhint %}

---

## Getting Help

If you've tried the solutions above and still have issues:

### Self-Service Resources
- [sBTC FAQ](../sbtc-faq.md) - Quick answers to common questions
- [sBTC Bridge Status](https://sbtc.stacks.co) - Check for any ongoing issues

### Community Support
- **Discord**: Join the [Stacks Discord](https://discord.gg/stacks) and visit the #sbtc-support channel
- **Forum**: Post on the [Stacks Forum](https://forum.stacks.org) for community help

### Direct Support
- **Email**: [sbtc-support@stackslabs.com](mailto:sbtc-support@stackslabs.com)

### Filing Issues
For bugs or technical issues:
- **GitHub**: [stacks-network/sbtc](https://github.com/stacks-network/sbtc/issues)

{% hint style="warning" %}
Never share your seed phrase or private keys with anyone, including support staff. Legitimate support will never ask for this information.
{% endhint %}
