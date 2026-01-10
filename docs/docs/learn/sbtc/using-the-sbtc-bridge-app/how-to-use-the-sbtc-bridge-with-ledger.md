# How to Use the sBTC Bridge with Ledger

This guide shows you how to use a Ledger hardware wallet with the sBTC Bridge through Xverse or Leather wallet.

{% hint style="info" %}
Ledger provides enhanced security by keeping your private keys offline. When you sign transactions, the keys never leave the device.
{% endhint %}

## Prerequisites

Before you begin, ensure you have:

- **Ledger device** (Nano S, Nano S Plus, Nano X, or Stax) with latest firmware
- **Ledger Live** installed and set up
- **Bitcoin app** installed on your Ledger (via Ledger Live)
- **Xverse** or **Leather** browser extension installed
- BTC balance ready for deposit

**Time to complete:** ~15 minutes for initial setup

---

## Understanding Derivation Paths

When connecting your Ledger, you'll need to select a **derivation path**. This determines which addresses your wallet generates.

| Path Type | Address Format | sBTC Compatible? |
|-----------|----------------|------------------|
| Native SegWit (BIP84) | bc1q... | Yes (Recommended) |
| Taproot (BIP86) | bc1p... | Yes |
| Nested SegWit (BIP49) | 3... | No |
| Legacy (BIP44) | 1... | No |

{% hint style="warning" %}
**Important:** The sBTC Bridge requires **Native SegWit** or **Taproot** addresses. If you use Nested SegWit or Legacy, you will receive an `Errors.Invalid_Transaction` error.
{% endhint %}

---

## Connecting Ledger to Xverse

{% stepper %}
{% step %}
**Open Xverse and go to Settings**

Click the gear icon in the top right corner of the Xverse extension.
{% endstep %}

{% step %}
**Select "Connect Hardware Wallet"**

Choose Ledger from the list of supported hardware wallets.
{% endstep %}

{% step %}
**Prepare your Ledger**

1. Connect your Ledger device via USB
2. Unlock it with your PIN
3. Open the Bitcoin app on your Ledger
{% endstep %}

{% step %}
**Select derivation path**

When prompted, select **Native SegWit** (this generates bc1q... addresses).

{% hint style="danger" %}
Do NOT select "Nested SegWit" - this will cause transaction errors with the sBTC Bridge.
{% endhint %}
{% endstep %}

{% step %}
**Verify connection**

Xverse will display your Bitcoin addresses. Verify that at least one address starts with `bc1q` or `bc1p`.
{% endstep %}
{% endstepper %}

---

## Connecting Ledger to Leather

{% stepper %}
{% step %}
**Open Leather and click "Connect Ledger"**

From the main screen, select the option to connect a hardware wallet.
{% endstep %}

{% step %}
**Prepare your Ledger**

1. Connect your Ledger device via USB
2. Unlock it with your PIN
3. Open the Bitcoin app on your Ledger
{% endstep %}

{% step %}
**Follow the prompts**

Leather will automatically detect your Ledger and import your addresses using Native SegWit by default.
{% endstep %}

{% step %}
**Verify your addresses**

Check that your Bitcoin address starts with `bc1q` or `bc1p`.
{% endstep %}
{% endstepper %}

---

## Making a Deposit with Ledger

Once connected, using the sBTC Bridge works similarly to a regular wallet, with one key difference: you'll sign transactions on your Ledger device.

{% stepper %}
{% step %}
**Navigate to the sBTC Bridge**

Go to [sbtc.stacks.co](https://sbtc.stacks.co) and connect your wallet.
{% endstep %}

{% step %}
**Enter deposit amount**

Choose how much BTC you want to convert to sBTC (minimum 0.001 BTC).
{% endstep %}

{% step %}
**Enter your Stacks address**

Specify where you want your sBTC minted.
{% endstep %}

{% step %}
**Review and confirm in your wallet**

Your browser wallet (Xverse/Leather) will show the transaction details.
{% endstep %}

{% step %}
**Sign on your Ledger**

Your Ledger device will display the transaction for review:
1. Verify the amount matches what you entered
2. Verify the destination address
3. Press both buttons to approve

{% hint style="info" %}
The Ledger display may show the raw transaction details. Take your time to verify the amount is correct.
{% endhint %}
{% endstep %}

{% step %}
**Wait for confirmation**

After signing, the transaction is broadcast to the Bitcoin network. Monitor progress in the sBTC Bridge UI.
{% endstep %}
{% endstepper %}

---

## Understanding Protected UTXOs

When using a Ledger with Xverse or Leather, you may encounter situations where your wallet shows a balance but the sBTC Bridge shows insufficient funds. This is often due to **protected UTXOs**.

### What Are Protected UTXOs?

Your Bitcoin balance is made up of individual outputs (UTXOs). Wallets may "protect" certain UTXOs to prevent accidentally spending:

- Ordinals or inscriptions
- Rare sats
- Outputs marked for specific purposes

### Checking Protected UTXOs

In Xverse:
1. Go to Settings > Advanced > View UTXOs
2. Protected UTXOs will be marked

In Leather:
1. Go to Activity tab
2. Check transaction details for protection status

### Unprotecting UTXOs for sBTC Bridge

If you need to unprotect UTXOs:

{% hint style="warning" %}
Only unprotect UTXOs if you're certain they don't contain valuable inscriptions. Once spent, inscriptions cannot be recovered.
{% endhint %}

1. Identify the protected UTXO in your wallet's UTXO viewer
2. Verify it doesn't contain any inscriptions
3. Toggle the protection off
4. Retry your sBTC deposit

---

## Troubleshooting Ledger Issues

### Transaction Not Appearing on Ledger

If your Ledger doesn't show the transaction to sign:

1. Ensure the Bitcoin app is open on your Ledger
2. Check that your Ledger is unlocked
3. Try disconnecting and reconnecting the USB cable
4. Refresh the sBTC Bridge page and try again

### "Device is Busy" Error

If you see this error:
1. Close Ledger Live if it's open
2. Ensure no other browser tabs are trying to access the Ledger
3. Reconnect your Ledger

### Timeout During Signing

If the signing times out:
1. The transaction needs to be re-initiated
2. Go back to the sBTC Bridge and start the deposit process again
3. Sign more quickly when the Ledger prompts you

### Wrong Address Type

If you connected with the wrong derivation path:
1. In your wallet, disconnect the Ledger
2. Reconnect and select "Native SegWit" when prompted
3. You may need to transfer BTC from the old addresses to the new Native SegWit addresses

---

## Security Best Practices

- **Always verify on device**: Check that the amount and addresses shown on your Ledger match what you expect
- **Keep firmware updated**: Use Ledger Live to update your device firmware regularly
- **Beware of phishing**: Only use [sbtc.stacks.co](https://sbtc.stacks.co) - verify the URL before connecting
- **Start small**: Test with a small amount first to ensure everything works correctly
