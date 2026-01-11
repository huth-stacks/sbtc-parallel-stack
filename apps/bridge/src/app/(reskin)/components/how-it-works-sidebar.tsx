/**
 * How It Works Sidebar
 *
 * Static educational component showing deposit steps and FAQ.
 */
"use client";

import {
  NoFeesCallout,
  FaqSection,
  DiscordHelpLink,
} from "./sidebar-shared";

const DEPOSIT_FAQ = [
  {
    question: "What if my deposit fails?",
    answer:
      "If your deposit doesn't complete, you can reclaim your BTC. This option appears after 24 hours of no progress.",
  },
  {
    question: "Why 60 minutes?",
    answer:
      "We wait for 6 Bitcoin block confirmations (~60 min) to ensure your transaction is secure and irreversible.",
  },
  {
    question: "Can I cancel?",
    answer:
      "Once broadcast, Bitcoin transactions cannot be cancelled. If something goes wrong, use the reclaim process.",
  },
];

export function HowItWorksSidebar() {
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
            description="Choose how much BTC to deposit"
          />
          <Step
            number={2}
            title="Confirm transaction"
            description="Approve in your Bitcoin wallet"
          />
          <Step
            number={3}
            title="Wait ~60 minutes"
            description="6 Bitcoin confirmations needed"
          />
          <Step
            number={4}
            title="Receive sBTC"
            description="Automatically sent to your Stacks address"
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
        <FaqSection items={DEPOSIT_FAQ} />
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
