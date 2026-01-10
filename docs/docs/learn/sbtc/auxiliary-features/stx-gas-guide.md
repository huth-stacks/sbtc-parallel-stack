# STX Gas Requirements

To use sBTC on the Stacks blockchain, you'll need a small amount of STX tokens to pay for transaction fees. This guide explains what you need and how to get it.

{% hint style="info" %}
**Quick Answer**: For most sBTC operations, having 1 STX in your wallet is enough to cover dozens of transactions. Individual transaction fees are typically 0.001-0.01 STX.
{% endhint %}

---

## Why Do I Need STX?

Stacks is a separate blockchain that settles to Bitcoin. While sBTC represents Bitcoin, transactions on the Stacks network (like transferring sBTC or using DeFi) require STX for gas fees.

### When You Need STX

| Action | STX Required? |
|--------|---------------|
| Depositing BTC → sBTC | No (Bitcoin network fees only) |
| Transferring sBTC | Yes |
| Using sBTC in DeFi | Yes |
| Withdrawing sBTC → BTC | Yes |

### Typical Transaction Costs

| Transaction Type | Typical STX Cost |
|------------------|------------------|
| Simple sBTC transfer | 0.001 - 0.005 STX |
| Contract interaction (DeFi) | 0.005 - 0.02 STX |
| Complex multi-step transaction | 0.01 - 0.05 STX |

{% hint style="info" %}
At current prices, 1 STX is typically enough for 50-100+ simple transfers.
{% endhint %}

---

## How to Get STX

### Option 1: Centralized Exchanges

STX is available on major exchanges:

**US Exchanges:**
- [Coinbase](https://www.coinbase.com) - Direct STX purchases
- [Kraken](https://www.kraken.com) - STX/USD and STX/BTC pairs
- [OKX](https://www.okx.com) - Multiple STX pairs

**Global Exchanges:**
- [Binance](https://www.binance.com) - High liquidity (not available in US)
- [Bybit](https://www.bybit.com) - STX perpetuals and spot
- [KuCoin](https://www.kucoin.com) - Multiple trading pairs

{% stepper %}
{% step %}
**Buy STX on an exchange**

Purchase the desired amount of STX (1-5 STX is plenty for most users).
{% endstep %}

{% step %}
**Get your Stacks address**

In Xverse or Leather, find your Stacks address (starts with `SP` on mainnet).
{% endstep %}

{% step %}
**Withdraw to your wallet**

Send STX to your Stacks address. Note: Some exchanges have minimum withdrawal amounts.
{% endstep %}
{% endstepper %}

### Option 2: Decentralized Exchanges

If you already have assets on Stacks, you can swap for STX on DEXes:

- **[ALEX](https://app.alexlab.co)** - Major Stacks DEX with STX pairs
- **[Bitflow](https://www.bitflow.finance)** - STX/sBTC and other pairs
- **[Velar](https://velar.co)** - DEX aggregator

### Option 3: Transaction Fee Sponsorship

The sBTC Bridge supports **fee sponsorship**, which allows you to pay transaction fees in sBTC instead of STX.

When enabled:
1. A sponsor pays your STX fee
2. You pay a small amount of sBTC in return
3. The transaction proceeds without requiring STX

See [Transaction Fee Sponsorship](transaction-fee-sponsorship.md) for details.

{% hint style="info" %}
Fee sponsorship is particularly useful for new users who have sBTC but haven't yet acquired STX.
{% endhint %}

---

## How Much STX Do I Need?

### Minimum Recommendations

| User Type | Recommended STX |
|-----------|-----------------|
| Casual holder (occasional transfers) | 0.5 - 1 STX |
| Active DeFi user | 2 - 5 STX |
| Heavy user / developer | 10+ STX |

### Calculating Your Needs

Estimate your transactions:
- How often will you transfer sBTC?
- Will you use DeFi protocols?
- Are you testing or developing?

**Example**: If you plan to make 10 DeFi transactions per month at ~0.02 STX each, you'd use about 0.2 STX monthly. Having 1-2 STX gives you comfortable runway.

---

## Managing STX Balance

### Checking Your Balance

Your STX balance is visible in:
- Xverse wallet (Stacks tab)
- Leather wallet (main view)
- [Stacks Explorer](https://explorer.hiro.so) (search your address)

### Running Low on STX

If you're running low:
1. **Use fee sponsorship** if available for your transaction
2. **Top up from an exchange** with a small amount
3. **Swap on a DEX** if you have other Stacks tokens

### Fee Optimization

To minimize STX usage:
- Batch multiple operations when possible
- Use sponsored transactions when available
- Time non-urgent transactions during low-congestion periods

---

## Common Questions

### Do I need STX to deposit BTC to sBTC?

**No.** Depositing BTC to get sBTC is a Bitcoin transaction. You only pay Bitcoin network fees. STX is only needed for subsequent Stacks transactions.

### Can I use sBTC to pay for fees?

**Yes, via fee sponsorship.** The sBTC Bridge supports sponsored transactions where you can pay a small amount of sBTC instead of STX. See [Transaction Fee Sponsorship](transaction-fee-sponsorship.md).

### What happens if I don't have enough STX?

Your transaction will fail with an "insufficient funds for fee" error. No STX or sBTC will be deducted - the transaction simply won't be submitted.

### Is STX the same as sBTC?

**No.** STX is the native token of the Stacks blockchain, used for:
- Transaction fees
- Stacking (earning BTC rewards)
- Governance

sBTC is a Bitcoin-backed token that represents BTC on Stacks. They serve different purposes but work together in the ecosystem.

---

## Related Resources

- [Transaction Fee Sponsorship](transaction-fee-sponsorship.md) - Pay fees in sBTC instead of STX
- [sBTC FAQ](../sbtc-faq.md) - Common questions about sBTC
- [Stacking Guide](../../../guides-and-tutorials/stack-stx/) - Earn BTC rewards by stacking STX
