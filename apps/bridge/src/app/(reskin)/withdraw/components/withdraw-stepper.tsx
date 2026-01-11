"use client";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { withdrawStepper } from "./stepper";
import { StepContent, StepTitle } from "../../components/stepper/timeline";
import {
  NoFeesCallout,
  FaqSection,
  DiscordHelpLink,
} from "../../components/sidebar-shared";

const { useStepper, utils } = withdrawStepper;

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

const MobileStepper = () => {
  const stepper = useStepper();
  const currentStep = stepper.current;
  const index = utils.getIndex(currentStep.id);
  return (
    <div className={`px-6 w-full flex flex-col gap-3 max-w-xl`}>
      <h1 className="dark:bg-dark-reskin-border-gray py-2 px-3 rounded-lg">
        <span className="font-matter-mono">{index + 1}.</span>{" "}
        {currentStep.title}
      </h1>
      <currentStep.description />
    </div>
  );
};

export function WithdrawTimeline() {
  const stepper = useStepper();

  const isDesktop = !useIsMobile();
  let currentIndex = utils.getIndex(stepper.current.id);

  if (currentIndex > utils.getIndex("address")) {
    currentIndex -= 1;
  }

  return isDesktop ? (
    <div className="pt-6 pb-6 px-8 border rounded-2xl border-black border-opacity-20 dark:border-white dark:border-opacity-20 lg:w-96">
      {/* Timeline header and steps */}
      <h2 className="uppercase text-xl leading-normal text-timeline-active-step-text dark:text-white font-matter-mono">
        Timeline
      </h2>
      <ol className="mt-4 flex flex-col gap-3">
        {stepper.all
          .filter((step) => step.id !== "confirm")
          .map((step, index) => (
            <div className="flex flex-col gap-1" key={step.id}>
              <StepTitle
                step={step}
                index={index}
                stepper={stepper}
                currentIndex={currentIndex}
              />
              <StepContent
                step={step}
                index={index}
                currentIndex={currentIndex}
              />
            </div>
          ))}
      </ol>

      {/* No fees callout */}
      <div className="mt-6 pt-4 border-t border-explorer-border-secondary/50">
        <NoFeesCallout />
      </div>

      {/* FAQ section */}
      <div className="mt-4 pt-4 border-t border-explorer-border-secondary/50">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Common questions
        </h3>
        <FaqSection items={WITHDRAW_FAQ} />
      </div>

      {/* Discord link */}
      <div className="mt-4 pt-4 border-t border-explorer-border-secondary/50 text-center">
        <DiscordHelpLink />
      </div>
    </div>
  ) : (
    <MobileStepper />
  );
}
