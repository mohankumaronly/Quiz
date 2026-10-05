import { type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Tone = "neutral" | "brand" | "success" | "danger" | "warning";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  neutral:
    "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  brand:
    "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300",
  success:
    "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
  danger:
    "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
  warning:
    "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}