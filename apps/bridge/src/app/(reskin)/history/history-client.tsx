"use client";

import { useAtomValue } from "jotai";
import { walletInfoAtom } from "@/util/atoms";
import { HistoryTable } from "./components/history-table";
import { ConnectWalletPrompt } from "../components/connect-wallet-prompt";

export default function HistoryClient() {
  const walletInfo = useAtomValue(walletInfoAtom);

  // Show connect prompt when no wallet connected
  if (!walletInfo?.selectedWallet) {
    return (
      <ConnectWalletPrompt description="Connect your wallet to view your transaction history." />
    );
  }

  return (
    <>
      <HistoryTable />
    </>
  );
}
