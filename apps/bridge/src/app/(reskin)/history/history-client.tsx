"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { walletInfoAtom, showConnectWalletAtom } from "@/util/atoms";
import { HistoryTable } from "./components/history-table";

export default function HistoryClient() {
  const walletInfo = useAtomValue(walletInfoAtom);
  const setShowConnectWallet = useSetAtom(showConnectWalletAtom);
  const isConnected = !!walletInfo?.selectedWallet;

  // Show empty state with connect prompt when not connected
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 max-w-md mx-auto">
        {/* Wallet Icon */}
        <div className="w-16 h-16 rounded-full bg-surface-tertiary flex items-center justify-center">
          <svg
            className="w-8 h-8 text-text-tertiary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-text-primary">
            Connect your wallet
          </h2>
          <p className="text-text-secondary text-sm">
            View your past deposits and withdrawals
          </p>
        </div>

        {/* Connect Button */}
        <button
          onClick={() => setShowConnectWallet(true)}
          className="
            px-6 py-3 rounded-xl font-semibold text-base
            bg-sand-800 dark:bg-sand-100
            text-sand-50 dark:text-sand-900
            hover:bg-sand-900 dark:hover:bg-sand-200
            transition-colors shadow-sm
          "
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return <HistoryTable />;
}
