/**
 * Deposit Form V2 - Wired to Production
 *
 * This page is now connected to real production hooks:
 * - useMintCaps() for deposit limits
 * - useSendDeposit() for deposit flow
 * - walletInfoAtom for wallet connection
 * - getBtcBalance() for wallet balance
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { walletInfoAtom, showConnectWalletAtom, bridgeConfigAtom } from "@/util/atoms";
import useMintCaps from "@/hooks/use-mint-caps";
import { useSendDeposit } from "@/app/(reskin)/hooks/use-send-deposit";
import getBtcBalance from "@/actions/get-btc-balance";
import { HowItWorksSidebar } from "./components/how-it-works-sidebar";
import Decimal from "decimal.js";

// BTC price fetch - uses configured mempool URL, falls back to mempool.space for mainnet
const useBtcPrice = () => {
  const { PUBLIC_MEMPOOL_URL, WALLET_NETWORK } = useAtomValue(bridgeConfigAtom);

  const { data: price } = useQuery({
    queryKey: ["btc-price", PUBLIC_MEMPOOL_URL],
    queryFn: async () => {
      try {
        // Use configured mempool for mainnet, skip price fetch for devnet (no real prices)
        if (WALLET_NETWORK === "sbtcDevenv") {
          return 96000; // Mock price for devnet
        }
        const baseUrl = PUBLIC_MEMPOOL_URL || "https://mempool.space";
        const res = await fetch(`${baseUrl}/api/v1/prices`);
        const data = await res.json();
        return data.USD || 96000;
      } catch {
        return 96000; // Fallback price
      }
    },
    staleTime: 60000, // Cache for 1 minute
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

export default function DepositPage() {
  const router = useRouter();

  // Wallet state
  const walletInfo = useAtomValue(walletInfoAtom);
  const setShowConnectWallet = useSetAtom(showConnectWalletAtom);

  // Production hooks
  const { depositToAddress, isPending } = useSendDeposit();
  const { currentCap, perDepositMinimum, isLoading: capsLoading } = useMintCaps();
  const btcPrice = useBtcPrice();

  // BTC balance from Mempool API
  const { data: btcBalance, isLoading: balanceLoading } = useQuery({
    queryKey: ["btc-balance", walletInfo?.addresses?.payment?.address],
    queryFn: () => {
      // Safe guard - should never be reached due to enabled flag, but prevents runtime crash
      const address = walletInfo?.addresses?.payment?.address;
      if (!address) return Promise.resolve(0);
      return getBtcBalance(address);
    },
    enabled: !!walletInfo?.addresses?.payment?.address,
  });

  // Form state
  const [amount, setAmount] = useState("");
  const [stxAddress, setStxAddress] = useState("");
  const [touched, setTouched] = useState({ amount: false, address: false });
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [showAddressEdit, setShowAddressEdit] = useState(false);

  // Set default STX address from wallet
  useEffect(() => {
    if (walletInfo?.addresses?.stacks?.address && !stxAddress) {
      setStxAddress(walletInfo.addresses.stacks.address);
    }
  }, [walletInfo, stxAddress]);

  // Calculated values
  const btcAvailable = btcBalance ?? 0;
  const amountNum = parseFloat(amount || "0");
  const usdEquivalent = amountNum * btcPrice;
  const networkFee = 0.00008; // Approximate network fee
  const receiveAmount = amount ? Math.max(0, amountNum - networkFee) : 0;

  // Convert caps from satoshis to BTC (with sensible fallbacks)
  // Contract minimum is 0.001 BTC (100000 sats)
  const FALLBACK_MIN_SATS = 100000;
  const minDepositBtc = (perDepositMinimum || FALLBACK_MIN_SATS) / 1e8;
  const maxDepositBtc = currentCap / 1e8;

  // Validation
  const amountError =
    touched.amount && amount
      ? amountNum > btcAvailable
        ? "Insufficient balance"
        : amountNum < minDepositBtc
        ? `Minimum deposit is ${minDepositBtc.toFixed(4)} BTC`
        : amountNum > maxDepositBtc
        ? `Maximum deposit is ${maxDepositBtc.toFixed(4)} BTC`
        : null
      : null;

  const handleSubmit = async () => {
    // Check if wallet connected (walletInfoAtom defaults to non-null object)
    if (!walletInfo?.selectedWallet) {
      setShowConnectWallet(true);
      return;
    }

    if (!amount || amountNum <= 0 || amountError) return;

    // Convert BTC to satoshis for the hook
    const amountInSats = new Decimal(amount).times(1e8).toNumber();

    const result = await depositToAddress({
      stxAddress: stxAddress || walletInfo.addresses.stacks!.address,
      amount: amountInSats,
    });

    if (result) {
      // Navigate to transaction status page
      router.push(`/${result.bitcoinTxid}`);
    }
  };

  const isConnected = !!walletInfo?.selectedWallet;

  const formContent = (
    <div className="flex flex-col items-center min-h-[80vh] py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
          Deposit Bitcoin
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Bridge BTC to sBTC on Stacks
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
                  <div className="flex-shrink-0 flex items-center gap-2 bg-bitcoin-100 dark:bg-bitcoin-900/80 py-2 px-4 rounded-full border border-bitcoin-200 dark:border-bitcoin-500">
                    <span className="font-semibold text-bitcoin-700 dark:text-bitcoin-200">BTC</span>
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
                      Balance: {btcAvailable.toFixed(8)} BTC
                      {amount && <span className="text-text-secondary ml-2">~{formatUsd(usdEquivalent)}</span>}
                    </>
                  )}
                </span>
                <button
                  onClick={() => setAmount(Math.max(0, btcAvailable - networkFee).toFixed(8))}
                  className="text-stacks-500 hover:text-stacks-600 font-medium hover:underline disabled:text-text-tertiary disabled:cursor-not-allowed disabled:no-underline"
                  disabled={balanceLoading || btcAvailable <= 0}
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={stxAddress}
                    onChange={(e) => setStxAddress(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-surface-tertiary border border-explorer-border-primary rounded-lg text-text-primary focus:outline-none focus:border-stacks-400"
                  />
                  <button
                    onClick={() => setShowAddressEdit(false)}
                    className="px-3 py-2 text-sm bg-stacks-100 dark:bg-stacks-700/30 text-stacks-600 dark:text-stacks-400 rounded-lg hover:bg-stacks-200 dark:hover:bg-stacks-700/50"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-surface-secondary/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-stacks-100 dark:bg-stacks-700/30 flex items-center justify-center">
                    <span className="text-stacks-600 dark:text-stacks-400 text-[10px] font-bold">STX</span>
                  </div>
                  <span className="text-sm text-text-primary font-medium">
                    {isConnected ? elideAddress(stxAddress, 10) : "Connect wallet to set address"}
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
                  {amount ? `${receiveAmount.toFixed(8)} sBTC` : "—"}
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
                    <span>Network fee</span>
                    <span className="text-text-secondary">~{networkFee} BTC (~{formatUsd(networkFee * btcPrice)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bridge fee</span>
                    <span className="text-text-secondary">0% (free)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated time</span>
                    <span className="text-text-secondary">~60 mins</span>
                  </div>
                  {!capsLoading && (
                    <>
                      <div className="flex justify-between">
                        <span>Min deposit</span>
                        <span className="text-text-secondary">{minDepositBtc.toFixed(4)} BTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max deposit</span>
                        <span className="text-text-secondary">{maxDepositBtc.toFixed(4)} BTC</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={isConnected ? handleSubmit : () => setShowConnectWallet(true)}
              disabled={isConnected && (!amount || !!amountError || isPending)}
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
              {isPending
                ? "Processing..."
                : !isConnected
                ? "Connect Wallet"
                : !amount
                ? "Enter amount"
                : amountError
                ? "Fix errors"
                : "Deposit BTC"}
            </button>
          </div>

          {/* Help Links */}
          <div className="mt-8 text-center space-y-3 max-w-[480px]">
            <p className="text-sm text-text-secondary">
              First time bridging?{" "}
              <a href="https://docs.stacks.co/concepts/sbtc" target="_blank" rel="noopener noreferrer" className="text-stacks-500 hover:text-stacks-600 underline underline-offset-2">
                Read the guide
              </a>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-text-tertiary">
              <a href="https://docs.stacks.co/stacks-in-depth/sbtc/sbtc-bridge/ledger" target="_blank" rel="noopener noreferrer" className="hover:text-text-secondary transition-colors">
                Hardware wallet setup
              </a>
              <span>·</span>
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
          <HowItWorksSidebar />
        </div>
      </div>
    </div>
  );

  return formContent;
}
