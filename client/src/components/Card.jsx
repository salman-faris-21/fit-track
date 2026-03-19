// src/components/ui/Card.jsx

import React from "react";
import { twMerge } from "tailwind-merge"; // optional

function cn(...classes) {
  return twMerge(classes.filter(Boolean).join(" "));
}

export function Card({ className = "", ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-white text-black flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className = "", ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

export function CardAction({ className = "", ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

export function CardFooter({ className = "", ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pt-4", className)}
      {...props}
    />
  );
}
