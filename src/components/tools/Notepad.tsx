import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { loadNotepad, saveNotepad, clearNotepad } from "../../storage/notepadRepo";

interface Props {
  onClose: () => void;
}

export function Notepad({ onClose }: Props) {
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadNotepad().then((v) => {
      setText(v);
      setLoaded(true);
    });
  }, []);

  // Debounced save
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => saveNotepad(text), 400);
    return () => clearTimeout(t);
  }, [text, loaded]);

  const handleClear = async () => {
    if (!confirm("Clear the notepad?")) return;
    await clearNotepad();
    setText("");
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="flex items-center justify-between px-4 h-11 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Notepad
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            className="h-7 w-7 flex items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Clear"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Scratch calculations, formulas, notes..."
        className="w-full h-48 p-3 text-sm text-slate-800 dark:text-slate-200 bg-transparent resize-none outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />

      <div className="px-3 pb-3 text-xs text-slate-400 dark:text-slate-500 text-right tabular-nums">
        {text.length} chars
      </div>
    </div>
  );
}