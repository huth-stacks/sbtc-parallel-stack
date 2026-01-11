"use client";

import { WithdrawClient } from "./withdraw-client";
import { WithdrawTimeline } from "./components/withdraw-stepper";
import { withdrawStepper } from "./components/stepper";

const { Scoped } = withdrawStepper;

export default function Page() {
  return (
    <Scoped>
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

        {/* Two-column layout - matches deposit */}
        <div className="flex justify-center gap-8 items-start">
          <WithdrawClient />
          <div className="hidden lg:block">
            <WithdrawTimeline />
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-8 text-center space-y-3 max-w-[480px]">
          <p className="text-sm text-text-secondary">
            Questions about withdrawals?{" "}
            <a
              href="https://docs.stacks.co/concepts/sbtc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stacks-500 hover:text-stacks-600 underline underline-offset-2"
            >
              Read the guide
            </a>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-text-tertiary">
            <a
              href="https://docs.stacks.co/concepts/sbtc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-secondary transition-colors"
            >
              FAQ
            </a>
            <span>·</span>
            <a
              href="https://discord.gg/stacks"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-secondary transition-colors"
            >
              Get help
            </a>
          </div>
        </div>
      </div>
    </Scoped>
  );
}
