/**
 * Withdraw How It Works Sidebar
 *
 * Static educational component showing withdraw steps and FAQ.
 * Matches the deposit HowItWorksSidebar pattern.
 */
"use client";

import {
  NoFeesCallout,
  FaqSection,
  DiscordHelpLink,
} from "./sidebar-shared";

const WITHDRAW_FAQ = [
  {
    question: "What's the minimum withdrawal?",
    answer:
      "You need to withdraw at least 546 sats (the Bitcoin dust limit) to ensure your transaction is processed by the network.",
  },
  {
    question: "Why does it take ~60 minutes?",
    answer:
      "Withdrawals require processing by the sBTC signers and Bitcoin network confirmations. This ensures your funds are secure.",
  },
  {
    question: "What if my withdrawal fails?",
    answer:
      "Your sBTC remains safe. If a withdrawal fails, you can try again or contact support on Discord for help.",
  },
];

export function WithdrawHowItWorks() {
  return (
    <div className="w-64 flex-shrink-0 space-y-6">
      {/* How it works */}
      <div className="bg-surface-fourth border border-explorer-border-secondary rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          How it works
        </h3>

        <div className="space-y-4">
          <Step
            number={1}
            title="Enter amount"
            description="Choose how much sBTC to withdraw"
          />
          <Step
            number={2}
            title="Confirm transaction"
            description="Approve in your Stacks wallet"
          />
          <Step
            number={3}
            title="Wait ~60 minutes"
            description="Signers process your request"
          />
          <Step
            number={4}
            title="Receive BTC"
            description="Sent to your Bitcoin address"
          />
        </div>
      </div>

      {/* Sponsored callout */}
      <div className="bg-surface-fourth border border-explorer-border-secondary rounded-xl p-4">
        <NoFeesCallout />
      </div>

      {/* FAQ */}
      <div className="bg-surface-fourth border border-explorer-border-secondary rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Common questions
        </h3>
        <FaqSection items={WITHDRAW_FAQ} />
      </div>

      {/* Help link */}
      <div className="text-center">
        <DiscordHelpLink />
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-sand-100 dark:bg-sand-800 flex items-center justify-center flex-shrink-0 border border-sand-200 dark:border-sand-700">
        <span className="text-xs font-semibold text-sand-700 dark:text-sand-200">
          {number}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-tertiary mt-0.5">{description}</p>
      </div>
    </div>
  );
}
