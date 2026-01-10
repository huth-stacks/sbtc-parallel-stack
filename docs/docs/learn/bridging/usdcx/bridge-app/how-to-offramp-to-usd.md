# How to Offramp USDCx to USD

This guide walks you through converting USDCx on Stacks to USD in your bank account. The process involves bridging USDCx to Ethereum, then transferring to an exchange for fiat conversion.

{% hint style="info" %}
**Total time:** 1-6 business days depending on your exchange's withdrawal processing.
{% endhint %}

## Prerequisites

Before you begin, ensure you have:

- **USDCx balance** in your Stacks wallet (Xverse or Leather)
- **Small amount of STX** for the burn transaction (~0.001 STX)
- **Ethereum wallet** (MetaMask recommended) for receiving USDC
- **Verified exchange account** that supports USDC (Coinbase, Kraken, etc.)
- **Small amount of ETH** for gas fees on Ethereum (if transferring to exchange)

---

## The Complete Flow

```
USDCx (Stacks) → USDC (Ethereum) → Exchange → USD (Bank)
```

**Fees at each step:**
| Step | Fee Type | Typical Cost |
|------|----------|--------------|
| 1. Bridge USDCx → USDC | STX network fee | ~0.001 STX |
| 2. Send USDC to exchange | ETH gas fee | $1-10 (varies) |
| 3. Convert USDC → USD | Exchange fee | Usually 0% |
| 4. Withdraw to bank | Bank transfer fee | $0-25 |

---

## Step 1: Bridge USDCx to Ethereum USDC

{% stepper %}
{% step %}
**Go to the USDCx Bridge**

Navigate to [bridge.stacks.co](https://bridge.stacks.co) - the official USDCx bridge powered by Circle xReserve.
{% endstep %}

{% step %}
**Connect your Stacks wallet**

Click "Connect Wallet" and select Xverse or Leather. Approve the connection request.
{% endstep %}

{% step %}
**Select withdrawal (Stacks → Ethereum)**

Choose the withdrawal direction:
- **From**: Stacks (USDCx)
- **To**: Ethereum (USDC)
{% endstep %}

{% step %}
**Enter the amount**

Enter how much USDCx you want to bridge.

{% hint style="info" %}
**Minimum amount:** 10 USDC/USDCx for bridge transactions.
{% endhint %}
{% endstep %}

{% step %}
**Enter your Ethereum address**

Paste your Ethereum wallet address (from MetaMask or another Ethereum wallet). This is where you'll receive the USDC.

{% hint style="danger" %}
**Triple-check your Ethereum address.** USDC sent to the wrong address cannot be recovered.
{% endhint %}
{% endstep %}

{% step %}
**Review and confirm**

Review the transaction details:
- Amount being bridged
- Destination Ethereum address
- Any fees

Click "Confirm" and approve the transaction in your Stacks wallet.
{% endstep %}

{% step %}
**Wait for processing**

The bridge process involves:
1. Burning your USDCx on Stacks
2. Circle's xReserve attestation
3. USDC release on Ethereum

**Expected time: 10-30 minutes**

You can monitor the transaction status on the bridge interface.
{% endstep %}
{% endstepper %}

---

## Step 2: Send USDC to Your Exchange

Once you have USDC in your Ethereum wallet, send it to your exchange.

{% stepper %}
{% step %}
**Get your exchange's USDC deposit address**

In Coinbase (or your exchange):
1. Go to Assets/Portfolio
2. Find USDC
3. Click "Receive" or "Deposit"
4. Copy the Ethereum USDC address

{% hint style="warning" %}
Make sure you're copying the **Ethereum** USDC address, not Solana or another network.
{% endhint %}
{% endstep %}

{% step %}
**Send USDC from your Ethereum wallet**

In MetaMask or your Ethereum wallet:
1. Go to your USDC balance
2. Click "Send"
3. Paste the exchange's deposit address
4. Enter the amount
5. Confirm the transaction

You'll pay an ETH gas fee for this transaction.
{% endstep %}

{% step %}
**Wait for confirmation**

Ethereum transfers typically confirm in 5-15 minutes. Most exchanges require 10-30 confirmations, taking 15-30 minutes total.
{% endstep %}
{% endstepper %}

---

## Step 3: Convert USDC to USD

Once USDC arrives in your exchange account:

{% stepper %}
{% step %}
**Verify USDC arrived**

Check your exchange's USDC balance. It should match what you sent minus any fees.
{% endstep %}

{% step %}
**Convert USDC to USD**

**On Coinbase:**
1. Go to your USDC balance
2. Click "Convert" or "Trade"
3. Select USDC → USD
4. Enter amount
5. Confirm conversion

{% hint style="info" %}
Coinbase typically charges 0% fee for USDC to USD conversion.
{% endhint %}
{% endstep %}

{% step %}
**Verify USD balance**

Your USD balance should now reflect the converted amount.
{% endstep %}
{% endstepper %}

---

## Step 4: Withdraw to Your Bank

{% stepper %}
{% step %}
**Go to Withdraw**

In your exchange, navigate to "Withdraw" or "Cash Out".
{% endstep %}

{% step %}
**Select your bank account**

Choose your linked bank account. If you haven't added one, follow the exchange's verification process.
{% endstep %}

{% step %}
**Enter withdrawal amount**

Enter how much USD to withdraw.
{% endstep %}

{% step %}
**Choose transfer method**

- **ACH Transfer** (US): Free or low fee, 1-5 business days
- **Wire Transfer**: Higher fee (~$25), same or next day
- **Instant Transfer** (if available): Small fee, instant

{% endstep %}

{% step %}
**Confirm withdrawal**

Review and confirm. Complete any required 2FA verification.
{% endstep %}
{% endstepper %}

---

## Timeline Summary

| Step | Duration |
|------|----------|
| Bridge USDCx → USDC | 10-30 minutes |
| Send USDC to exchange | 15-30 minutes |
| Convert USDC → USD | Instant |
| Withdraw to bank (ACH) | 1-5 business days |
| **Total** | **1-6 business days** |

---

## Fee Breakdown Example

Here's an example for withdrawing $1,000 USDCx:

| Step | Fee | Remaining |
|------|-----|-----------|
| Start: 1,000 USDCx | - | $1,000.00 |
| Bridge to Ethereum | ~$0.002 (STX) | $1,000.00 |
| Send to Coinbase | ~$5 (ETH gas) | $995.00 |
| Convert USDC → USD | $0 | $995.00 |
| ACH withdrawal | $0 | **$995.00** |

{% hint style="info" %}
Actual fees vary based on network congestion and your exchange's fee schedule.
{% endhint %}

---

## Alternative: Direct to Exchange (If Available)

Some exchanges may support direct USDCx deposits in the future. Check if your exchange supports Stacks network deposits, which would skip the Ethereum bridging step.

---

## Troubleshooting

### Bridge transaction stuck

If your bridge transaction is taking longer than 1 hour:
1. Check [bridge.stacks.co](https://bridge.stacks.co) for your transaction status
2. Verify the transaction confirmed on [Stacks Explorer](https://explorer.hiro.so)
3. Contact support if stuck for more than 2 hours

### USDC not appearing in exchange

1. Verify you sent to the correct Ethereum address
2. Check [Etherscan](https://etherscan.io) for transaction confirmation
3. Wait for the required number of confirmations
4. Contact exchange support with your transaction hash

### Can't convert USDC to USD

1. Ensure your exchange account is fully verified
2. Check for any account holds or restrictions
3. Verify USDC is available for trading in your region

---

## Related Resources

- [USDCx Operations](../operations.md) - Technical details on bridging
- [USDCx FAQ](../faq.md) - Common questions
- [sBTC Bridge Guide](../../../sbtc/using-the-sbtc-bridge-app/) - If you need to convert sBTC first
