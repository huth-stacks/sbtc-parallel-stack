"use client";

import { useSetAtom } from "jotai";
import { showConnectWalletAtom } from "@/util/atoms";
import { ReactNode } from "react";

interface ConnectWalletPromptProps {
  description: string;
  children?: ReactNode;
}

export function ConnectWalletPrompt({
  description,
  children,
}: ConnectWalletPromptProps) {
  const setShowConnectWallet = useSetAtom(showConnectWalletAtom);

  // If no children provided, render simple centered prompt
  if (!children) {
    return (
      <div className="flex flex-col items-center py-16 text-center space-y-4 max-w-md mx-auto">
        <LockIcon />
        <p className="text-lg text-text-secondary">{description}</p>
        <ConnectButton onClick={() => setShowConnectWallet(true)} />
      </div>
    );
  }

  // With children, render blurred background with overlay
  return (
    <div className="relative min-h-[60vh]">
      {/* Blurred background content */}
      <div className="blur-[6px] opacity-60 pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Overlay with CTA */}
      <div className="absolute inset-0 flex items-center justify-center bg-surface-tertiary/70 dark:bg-surface-tertiary/80">
        <div className="flex flex-col items-center text-center space-y-4 max-w-md p-8 rounded-2xl bg-surface-fourth/90 dark:bg-surface-fourth/90 backdrop-blur-sm shadow-lg border border-explorer-border-secondary">
          <LockIcon />
          <p className="text-lg text-text-secondary">{description}</p>
          <ConnectButton onClick={() => setShowConnectWallet(true)} />
        </div>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
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
  );
}

function ConnectButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl bg-stacks-500 text-white font-semibold hover:bg-stacks-600 transition-colors"
    >
      Get Started
    </button>
  );
}
