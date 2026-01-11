"use client";

import { useAtomValue } from "jotai";
import { walletInfoAtom } from "@/util/atoms";
import { HistoryTable } from "./components/history-table";
import { ConnectWalletPrompt } from "../components/connect-wallet-prompt";

export default function HistoryClient() {
  const walletInfo = useAtomValue(walletInfoAtom);
  const isConnected = !!walletInfo?.selectedWallet;

  const tableContent = <HistoryTable />;

  // Show blurred preview with CTA when not connected
  if (!isConnected) {
    return (
      <ConnectWalletPrompt description="Connect your wallet to view your transaction history.">
        {tableContent}
      </ConnectWalletPrompt>
    );
  }

  return tableContent;
}
