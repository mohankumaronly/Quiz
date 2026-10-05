import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

interface Props {
  onClose: () => void;
}

export function Calculator({ onClose }: Props) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const inputDigit = (d: string) => {
    if (fresh) {
      setDisplay(d);
      setFresh(false);
    } else {
      setDisplay(display === "0" ? d : display + d);
    }
  };

  const inputDot = () => {
    if (fresh) {
      setDisplay("0.");
      setFresh(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const toggleSign = () => {
    if (display === "0") return;
    setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
  };

  const percent = () => {
    const v = parseFloat(display) / 100;
    setDisplay(String(v));
    setFresh(true);
  };

  const sqrt = () => {
    const v = Math.sqrt(parseFloat(display));
    setDisplay(String(v));
    setFresh(true);
  };

  const compute = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const applyOp = (nextOp: string) => {
    const current = parseFloat(display);
    if (prev === null) {
      setPrev(current);
    } else if (op) {
      const result = compute(prev, current, op);
      setPrev(result);
      setDisplay(String(result));
    }
    setOp(nextOp);
    setFresh(true);
  };

  const equals = () => {
    if (prev === null || !op) return;
    const current = parseFloat(display);
    const result = compute(prev, current, op);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const Btn = ({
    label,
    onClick,
    variant = "default",
    wide = false,
  }: {
    label: string;
    onClick: () => void;
    variant?: "default" | "op" | "action";
    wide?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "h-11 rounded-lg text-sm font-medium transition-colors",
        wide && "col-span-2",
        variant === "default" &&
          "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700",
        variant === "op" &&
          "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900",
        variant === "action" &&
          "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed bottom-24 right-6 z-50 w-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="flex items-center justify-between px-4 h-11 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Calculator
        </span>
        <button
          onClick={onClose}
          className="h-7 w-7 flex items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-3 mb-3 text-right">
          <div className="text-xs text-slate-400 dark:text-slate-500 h-4 tabular-nums">
            {prev !== null && op ? `${prev} ${op}` : ""}
          </div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums truncate">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Btn label="AC" onClick={clear} variant="action" />
          <Btn label="±" onClick={toggleSign} variant="action" />
          <Btn label="%" onClick={percent} variant="action" />
          <Btn label="÷" onClick={() => applyOp("÷")} variant="op" />

          <Btn label="7" onClick={() => inputDigit("7")} />
          <Btn label="8" onClick={() => inputDigit("8")} />
          <Btn label="9" onClick={() => inputDigit("9")} />
          <Btn label="×" onClick={() => applyOp("×")} variant="op" />

          <Btn label="4" onClick={() => inputDigit("4")} />
          <Btn label="5" onClick={() => inputDigit("5")} />
          <Btn label="6" onClick={() => inputDigit("6")} />
          <Btn label="−" onClick={() => applyOp("-")} variant="op" />

          <Btn label="1" onClick={() => inputDigit("1")} />
          <Btn label="2" onClick={() => inputDigit("2")} />
          <Btn label="3" onClick={() => inputDigit("3")} />
          <Btn label="+" onClick={() => applyOp("+")} variant="op" />

          <Btn label="√" onClick={sqrt} variant="action" />
          <Btn label="0" onClick={() => inputDigit("0")} />
          <Btn label="." onClick={inputDot} />
          <Btn label="=" onClick={equals} variant="op" />
        </div>
      </div>
    </div>
  );
}