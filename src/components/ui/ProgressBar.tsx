import { cn } from "../../utils/cn";

interface ProgressBarProps {
  value: number;        // 0 - 100
  className?: string;
  tone?: "brand" | "success" | "danger" | "warning";
}

const tones = {
  brand: "bg-indigo-600",
  success: "bg-green-600",
  danger: "bg-red-600",
  warning: "bg-amber-500",
};

export function ProgressBar({ value, className, tone = "brand" }: ProgressBarProps) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full h-2 bg-slate-100 rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", tones[tone])}
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}