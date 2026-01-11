"use client";

import { useSetAtom } from "jotai";
import { showConnectWalletAtom } from "@/util/atoms";

interface ConnectWalletPromptProps {
  description: string;
}

export function ConnectWalletPrompt({
  description,
}: ConnectWalletPromptProps) {
  const setShowConnectWallet = useSetAtom(showConnectWalletAtom);

  return (
    <div className="flex flex-col items-center py-16 text-center space-y-4 max-w-md mx-auto">
      {/* Lock icon */}
      <div className="w-16 h-16 rounded-full bg-stacks-100 dark:bg-stacks-700/30 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-stacks-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </div>

      <p className="text-lg text-text-secondary">{description}</p>

      <button
        onClick={() => setShowConnectWallet(true)}
        className="px-6 py-3 rounded-xl bg-stacks-500 text-white font-semibold hover:bg-stacks-600 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}
