// src/components/ui/Button.jsx

import React from "react";
import { twMerge } from "tailwind-merge"; // optional but helps avoid class conflicts

const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-300 text-gray-800 bg-white hover:bg-gray-100",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  link: "text-blue-600 underline-offset-4 hover:underline",
};

const sizeVariants = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-2",
};

export function Button({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = buttonVariants[variant] || buttonVariants.default;
  const sizeClasses = sizeVariants[size] || sizeVariants.default;

  return (
    <button
      className={twMerge(
        `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`
      )}
      {...props}
    >
      {children}
    </button>
  );
}
