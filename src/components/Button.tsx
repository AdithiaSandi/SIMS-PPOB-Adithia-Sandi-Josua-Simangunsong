import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border border-blue-600",
  secondary:
    "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 border border-gray-300",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600",
  ghost:
    "bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 border border-gray-300",
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
