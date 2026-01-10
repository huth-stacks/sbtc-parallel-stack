# Sending BTC from Exchanges

This guide walks you through sending BTC from a centralized exchange (like Coinbase) to your wallet and then to the sBTC Bridge.

{% hint style="warning" %}
You cannot send BTC directly from an exchange to the sBTC Bridge. You must first send it to a self-custody wallet like Xverse or Leather.
{% endhint %}

## Prerequisites

- Verified account on a cryptocurrency exchange (Coinbase, Binance, Kraken, etc.)
- BTC balance on the exchange
- [Xverse](https://www.xverse.app/) or [Leather](https://leather.io/) wallet installed

**Time to complete:**
- Exchange withdrawal: 30-60 minutes
- sBTC minting: ~1 hour (3 Bitcoin blocks)

---

## Step-by-Step: Coinbase to sBTC

This example uses Coinbase, but the process is similar for other exchanges.

{% stepper %}
{% step %}
**Get your wallet receive address**

1. Open your Xverse or Leather wallet
2. Click "Receive" or find your Bitcoin address
3. Copy your **Native SegWit** address (starts with `bc1q...` or `bc1p...`)

{% hint style="danger" %}
Make sure your address starts with `bc1`. Addresses starting with `3` (Nested SegWit) or `1` (Legacy) will not work with the sBTC Bridge.
{% endhint %}
{% endstep %}

{% step %}
**Go to Coinbase withdrawal**

1. Log into [Coinbase](https://www.coinbase.com)
2. Navigate to your BTC balance
3. Click "Send" or "Withdraw"
{% endstep %}

{% step %}
**Enter withdrawal details**

1. Paste your wallet address in the "To" field
2. Enter the amount you want to send
3. Select the Bitcoin network (not Lightning)

{% hint style="info" %}
Consider adding a small buffer to account for fees. For example, if you want to deposit 0.01 BTC, withdraw 0.011 BTC to cover network fees.
{% endhint %}
{% endstep %}

{% step %}
**Verify the address**

Double-check that:
- The address matches your wallet exactly
- The address starts with `bc1`
- You're sending on the Bitcoin network

{% hint style="warning" %}
Bitcoin transactions cannot be reversed. Always verify the address before confirming.
{% endhint %}
{% endstep %}

{% step %}
**Confirm and complete 2FA**

1. Review the transaction details
2. Complete any required two-factor authentication
3. Confirm the withdrawal

Note the withdrawal fee charged by Coinbase.
{% endstep %}

{% step %}
**Wait for the transfer**

Exchange withdrawals typically take 30-60 minutes, depending on:
- Exchange processing time
- Bitcoin network confirmation requirements
- Network congestion

You can track the transaction on [mempool.space](https://mempool.space) once it's broadcast.
{% endstep %}

{% step %}
**Verify receipt in your wallet**

Once confirmed, you should see the BTC in your Xverse or Leather wallet. You can now proceed to the sBTC Bridge.
{% endstep %}

{% step %}
**Use the sBTC Bridge**

Follow the [standard bridge guide](how-to-use-the-sbtc-bridge.md) to convert your BTC to sBTC.
{% endstep %}
{% endstepper %}

---

## Understanding the Fees

When converting BTC from an exchange to sBTC, you'll encounter several fees:

| Fee Type | Who Sets It | Typical Amount |
|----------|-------------|----------------|
| Exchange withdrawal | Exchange | Varies (often 0.0001-0.0005 BTC) |
| Bitcoin network fee (deposit) | You (in bridge) | Varies with network congestion |
| Consolidation fee | sBTC Protocol | Max 80,000 sats (~0.0008 BTC) |

### Exchange Withdrawal Fees

Different exchanges charge different withdrawal fees:

- **Coinbase**: Variable, shown at time of withdrawal
- **Binance**: Network fee + small fixed fee
- **Kraken**: Fixed fee per withdrawal
- **Gemini**: 10 free withdrawals per month

### Bitcoin Network Fee

When you initiate a deposit through the sBTC Bridge, you choose the network fee:

- **Low**: Cheaper but slower (may take hours)
- **Medium**: Balanced cost and speed
- **High**: Faster confirmation, recommended for time-sensitive deposits

### Consolidation Fee

The sBTC protocol charges up to 80,000 sats (0.0008 BTC) to consolidate your deposit into the signer UTXO. This is:

- Automatically deducted from your minted sBTC
- A Bitcoin network fee, not a protocol fee
- Variable based on actual transaction size

{% hint style="info" %}
**Example**: You withdraw 0.01 BTC from Coinbase (fee: 0.0002 BTC). You receive 0.0098 BTC in your wallet. You deposit to sBTC Bridge with medium fee (0.0001 BTC) plus consolidation (0.0008 BTC max). You receive approximately 0.0089 sBTC.
{% endhint %}

---

## Address Format Compatibility

### Supported Formats

| Format | Example | Works? |
|--------|---------|--------|
| Native SegWit (P2WPKH) | bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh | Yes |
| Taproot (P2TR) | bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr | Yes |
| Nested SegWit (P2SH) | 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy | No |
| Legacy (P2PKH) | 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2 | No |

### If Your Exchange Only Shows Legacy Addresses

Some older exchange integrations may default to legacy addresses. To get a Native SegWit address:

1. Check if there's an "Address Type" setting
2. Look for options like "Bech32" or "Native SegWit"
3. Contact exchange support if no option exists

---

## Other Exchanges

While this guide uses Coinbase as an example, you can send BTC from any exchange:

### Binance
1. Go to Wallet > Fiat and Spot
2. Find BTC and click "Withdraw"
3. Select "BTC" network
4. Enter your Native SegWit address

### Kraken
1. Go to Funding > Withdraw
2. Select Bitcoin
3. Add your wallet address
4. Complete withdrawal

### Gemini
1. Go to Transfer > Withdraw
2. Select Bitcoin
3. Enter your wallet address
4. Confirm withdrawal

---

## Troubleshooting

### Withdrawal Taking Too Long

Exchange withdrawals can be delayed due to:
- Manual security reviews (especially for new addresses)
- High withdrawal volume
- Account verification requirements

If your withdrawal has been pending for more than 24 hours, contact your exchange's support.

### BTC Received but Can't Deposit

If you receive BTC but can't deposit to the sBTC Bridge:

1. **Check your address type**: Ensure you're using Native SegWit
2. **Check for protected UTXOs**: See the [troubleshooting guide](troubleshooting.md)
3. **Wait for full confirmation**: Some wallets require multiple confirmations

### Wrong Network

If you accidentally sent on the Lightning Network or another chain:
- Contact your exchange immediately
- Do not send additional transactions
- Note that recovery may not be possible

---

## Tips for Success

1. **Start small**: Test with a small amount first
2. **Double-check addresses**: Always verify before sending
3. **Account for fees**: Add a buffer for network fees
4. **Use Native SegWit**: Ensure your wallet is set up correctly
5. **Be patient**: The entire process from exchange to sBTC takes 1.5-2 hours minimum
