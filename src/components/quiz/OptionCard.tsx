import { cn } from "../../utils/cn";

interface Props {
  label: string;
  text: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function OptionCard({ label, text, selected, onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        selected
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 ring-1 ring-indigo-500"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold",
          selected
            ? "bg-indigo-600 text-white"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        )}
      >
        {label}
      </span>
      <span className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
        {text}
      </span>
    </button>
  );
}