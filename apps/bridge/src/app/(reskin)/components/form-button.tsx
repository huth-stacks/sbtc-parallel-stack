export const FormButton = ({
  children,
  disabled,
  onClick,
  className,
  variant = "primary",
  type = "button",
  buttonRef,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  buttonRef?: React.RefObject<HTMLButtonElement>;
}) => {
  return (
    <button
      className={`font-matter-mono flex items-center justify-center h-16 rounded-lg text-black text-xl uppercase disabled:cursor-not-allowed transition-all ${
        className || ""
      } ${
        variant === "primary"
          ? "bg-orange hover:bg-orange/90 dark:bg-dark-reskin-orange dark:hover:bg-dark-reskin-orange/90 disabled:bg-darkGray disabled:dark:bg-white disabled:opacity-20"
          : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-button-secondary-text-light dark:text-gray-200 border border-button-secondary-text-light dark:border-gray-400 rounded-lg"
      }`}
      disabled={disabled}
      onClick={onClick}
      type={type}
      ref={buttonRef}
    >
      {children}
    </button>
  );
};
