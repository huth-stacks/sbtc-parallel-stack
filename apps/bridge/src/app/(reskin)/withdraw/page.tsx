/**
 * Withdraw Form V2 - Matches Deposit Pattern
 *
 * This page follows the same architecture as the deposit page:
 * - useSBTCBalance() for sBTC balance
 * - useSubmitWithdraw() for withdrawal flow
 * - walletInfoAtom for wallet connection
 * - Inline form with useState (no Formik/stepper)
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { walletInfoAtom, showConnectWalletAtom, bridgeConfigAtom } from "@/util/atoms";
import { useSBTCBalance } from "@/hooks/use-sbtc-balance";
import { useSubmitWithdraw } from "./hooks/use-submit-withdraw";
import { getWithdrawalMaxFee } from "@/actions/get-withdrawal-max-fee";
import { useEmilyLimits } from "@/hooks/use-mint-caps";
import { WithdrawHowItWorks } from "../components/withdraw-how-it-works";
import { validateBitcoinAddress } from "@/util/validate-bitcoin-address";

// BTC price fetch - uses configured mempool URL
const useBtcPrice = () => {
  const { PUBLIC_MEMPOOL_URL, WALLET_NETWORK } = useAtomValue(bridgeConfigAtom);

  const { data: price } = useQuery({
    queryKey: ["btc-price", PUBLIC_MEMPOOL_URL],
    queryFn: async () => {
      try {
        // Skip price fetch for devnet (no real prices)
        if (WALLET_NETWORK === "sbtcDevenv") {
          return 96000; // Mock price for devnet
        }
        const baseUrl = PUBLIC_MEMPOOL_URL || "https://mempool.space";
        const res = await fetch(`${baseUrl}/api/v1/prices`);
        const data = await res.json();
        return data.USD || 96000;
      } catch {
        return 96000;
      }
    },
    staleTime: 60000,
  });
  return price || 96000;
};

const formatUsd = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const elideAddress = (address: string, chars: number = 6) => {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
};

export default function WithdrawPage() {
  const router = useRouter();

  // Wallet state
  const walletInfo = useAtomValue(walletInfoAtom);
  const setShowConnectWallet = useSetAtom(showConnectWalletAtom);
  const config = useAtomValue(bridgeConfigAtom);

  // Production hooks
  const submitWithdraw = useSubmitWithdraw();
  const btcPrice = useBtcPrice();

  // sBTC balance
  const { data: sbtcBalanceSats, isLoading: balanceLoading } = useSBTCBalance({
    address: walletInfo?.addresses?.stacks?.address,
  });

  // Withdrawal fee
  const { data: maxFee } = useQuery({
    queryKey: ["maxFee"],
    queryFn: getWithdrawalMaxFee,
  });

  // Emily limits
  const { data: emilyLimits } = useEmilyLimits();

  // Form state
  const [amount, setAmount] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [touched, setTouched] = useState({ amount: false, address: false });
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default BTC address from wallet
  useEffect(() => {
    if (walletInfo?.addresses?.payment?.address && !btcAddress) {
      setBtcAddress(walletInfo.addresses.payment.address);
    }
  }, [walletInfo, btcAddress]);

  // Calculated values
  const sbtcAvailable = sbtcBalanceSats ? Number(sbtcBalanceSats) / 1e8 : 0;
  const amountNum = parseFloat(amount || "0");
  const usdEquivalent = amountNum * btcPrice;
  const withdrawFee = maxFee ? maxFee / 1e8 : 0;
  const receiveAmount = amount ? Math.max(0, amountNum - withdrawFee) : 0;

  // Limits
  const minWithdrawBtc = (config.WITHDRAW_MIN_AMOUNT_SATS || 546) / 1e8;
  const maxWithdrawBtc = emilyLimits?.perWithdrawalCap
    ? emilyLimits.perWithdrawalCap / 1e8
    : Infinity;

  // Address validation
  const isValidBtcAddress = btcAddress
    ? validateBitcoinAddress(btcAddress, config.WALLET_NETWORK || "mainnet")
    : false;

  // Amount validation
  const amountError =
    touched.amount && amount
      ? amountNum > sbtcAvailable
        ? "Insufficient balance"
        : amountNum < minWithdrawBtc
        ? `Minimum withdrawal is ${minWithdrawBtc.toFixed(6)} sBTC`
        : amountNum > maxWithdrawBtc
        ? `Maximum withdrawal is ${maxWithdrawBtc.toFixed(4)} sBTC`
        : null
      : null;

  const addressError =
    touched.address && btcAddress && !isValidBtcAddress
      ? "Invalid Bitcoin address"
      : null;

  const handleSubmit = async () => {
    if (!walletInfo?.selectedWallet) {
      setShowConnectWallet(true);
      return;
    }

    if (!amount || amountError || !btcAddress || addressError) return;

    setIsSubmitting(true);
    try {
      const txId = await submitWithdraw({
        address: btcAddress,
        amount: amount,
      });

      if (txId) {
        router.push(`/withdraw/${txId}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConnected = !!walletInfo?.selectedWallet;

  const formContent = (
    <div className="flex flex-col items-center min-h-[80vh] py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
          Withdraw sBTC
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Bridge sBTC back to BTC on Bitcoin
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex justify-center gap-8 items-start">
        {/* Main Content */}
        <div className="flex flex-col items-center">
          {/* Main Card */}
          <div className="w-full max-w-[480px] bg-surface-fourth border border-explorer-border-secondary rounded-2xl shadow-sm p-6 space-y-5">

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-text-tertiary ml-1">You send</label>
              <div
                className={`
                  relative rounded-xl border-2 bg-surface-tertiary/50 dark:bg-surface-tertiary/30 p-4
                  transition-all overflow-hidden
                  ${amountError
                    ? "border-feedback-red-500"
                    : "border-explorer-border-primary focus-within:border-stacks-400 focus-within:ring-2 focus-within:ring-stacks-400/20"
                  }
                `}
              >
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      if (val === "" || /^\d*\.?\d*$/.test(val)) {
                        setAmount(val);
                      }
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
                    className="
                      flex-1 min-w-0 bg-transparent text-5xl font-bold text-text-primary
                      outline-none placeholder:text-text-tertiary/40
                    "
                  />
                  <div className="flex-shrink-0 flex items-center gap-2 bg-stacks-100 dark:bg-stacks-500 py-2 px-4 rounded-full border border-stacks-200 dark:border-stacks-600">
                    <span className="font-semibold text-stacks-700 dark:text-black">sBTC</span>
                  </div>
                </div>
              </div>

              {/* Balance Helper */}
              <div className="flex justify-between items-center text-xs px-1">
                <span className="text-text-tertiary">
                  {balanceLoading ? (
                    "Loading balance..."
                  ) : (
                    <>
                      Balance: {sbtcAvailable.toFixed(8)} sBTC
                      {amount && <span className="text-text-secondary ml-2">~{formatUsd(usdEquivalent)}</span>}
                    </>
                  )}
                </span>
                <button
                  onClick={() => setAmount(Math.max(0, sbtcAvailable).toFixed(8))}
                  className="text-stacks-500 hover:text-stacks-600 font-medium hover:underline"
                  disabled={balanceLoading}
                >
                  Max
                </button>
              </div>

              {/* Error Message */}
              {amountError && (
                <p className="text-xs text-feedback-red-500 px-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {amountError}
                </p>
              )}
            </div>

            {/* Receive Address */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-text-tertiary ml-1">Receive at</label>
                {!showAddressEdit && (
                  <button
                    onClick={() => setShowAddressEdit(true)}
                    className="text-xs text-stacks-500 hover:text-stacks-600"
                  >
                    Edit
                  </button>
                )}
              </div>

              {showAddressEdit ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={btcAddress}
                      onChange={(e) => setBtcAddress(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                      placeholder="Enter Bitcoin address"
                      className="flex-1 px-3 py-2 text-sm bg-surface-tertiary border border-explorer-border-primary rounded-lg text-text-primary focus:outline-none focus:border-stacks-400"
                    />
                    <button
                      onClick={() => setShowAddressEdit(false)}
                      className="px-3 py-2 text-sm bg-stacks-100 dark:bg-stacks-700/30 text-stacks-600 dark:text-stacks-400 rounded-lg hover:bg-stacks-200 dark:hover:bg-stacks-700/50"
                    >
                      Done
                    </button>
                  </div>
                  {addressError && (
                    <p className="text-xs text-feedback-red-500 px-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {addressError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-surface-secondary/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-bitcoin-100 dark:bg-bitcoin-700/30 flex items-center justify-center">
                    <span className="text-bitcoin-600 dark:text-bitcoin-400 text-[10px] font-bold">BTC</span>
                  </div>
                  <span className="text-sm text-text-primary font-medium">
                    {isConnected ? elideAddress(btcAddress, 10) : "Connect wallet to set address"}
                  </span>
                  {isConnected && <span className="text-xs text-text-tertiary">(Connected wallet)</span>}
                </div>
              )}
            </div>

            {/* Fee Breakdown */}
            <div className="bg-surface-secondary/30 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-text-secondary">You receive</span>
                <span className="text-lg font-semibold text-text-primary">
                  {amount ? `${receiveAmount.toFixed(8)} BTC` : "—"}
                </span>
              </div>

              <button
                onClick={() => setShowFeeDetails(!showFeeDetails)}
                className="w-full flex justify-between items-center text-xs text-text-tertiary hover:text-text-secondary pt-2 border-t border-explorer-border-secondary/50"
              >
                <span>Fee breakdown & timing</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showFeeDetails ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showFeeDetails && (
                <div className="space-y-2 text-xs text-text-tertiary animate-in fade-in duration-200">
                  <div className="flex justify-between">
                    <span>Withdrawal fee</span>
                    <span className="text-text-secondary">~{withdrawFee.toFixed(6)} sBTC (~{formatUsd(withdrawFee * btcPrice)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bridge fee</span>
                    <span className="text-text-secondary">0% (free)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated time</span>
                    <span className="text-text-secondary">~60 mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min withdrawal</span>
                    <span className="text-text-secondary">{minWithdrawBtc.toFixed(6)} sBTC</span>
                  </div>
                  {maxWithdrawBtc !== Infinity && (
                    <div className="flex justify-between">
                      <span>Max withdrawal</span>
                      <span className="text-text-secondary">{maxWithdrawBtc.toFixed(4)} sBTC</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={isConnected ? handleSubmit : () => setShowConnectWallet(true)}
              disabled={isConnected && (!amount || !!amountError || !btcAddress || !!addressError || isSubmitting)}
              className="
                w-full h-14 rounded-xl font-semibold text-base
                bg-sand-800 dark:bg-sand-100
                text-sand-50 dark:text-sand-900
                hover:bg-sand-900 dark:hover:bg-sand-200
                disabled:bg-sand-300 disabled:dark:bg-sand-600
                disabled:text-sand-400 disabled:dark:text-sand-400
                disabled:cursor-not-allowed
                transition-colors shadow-sm
              "
            >
              {isSubmitting
                ? "Processing..."
                : !isConnected
                ? "Connect Wallet"
                : !amount
                ? "Enter amount"
                : amountError
                ? "Fix errors"
                : !btcAddress
                ? "Enter address"
                : addressError
                ? "Fix address"
                : "Withdraw sBTC"}
            </button>
          </div>

          {/* Help Links */}
          <div className="mt-8 text-center space-y-3 max-w-[480px]">
            <p className="text-sm text-text-secondary">
              Questions about withdrawals?{" "}
              <a href="https://docs.stacks.co/concepts/sbtc" target="_blank" rel="noopener noreferrer" className="text-stacks-500 hover:text-stacks-600 underline underline-offset-2">
                Read the guide
              </a>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-text-tertiary">
              <a href="https://docs.stacks.co/concepts/sbtc" target="_blank" rel="noopener noreferrer" className="hover:text-text-secondary transition-colors">
                FAQ
              </a>
              <span>·</span>
              <a href="https://discord.gg/stacks" target="_blank" rel="noopener noreferrer" className="hover:text-text-secondary transition-colors">
                Get help
              </a>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block">
          <WithdrawHowItWorks />
        </div>
      </div>
    </div>
  );

  return formContent;
}
