import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  X,
  Menu,
  Calculator as CalculatorIcon,
  StickyNote,
  Star,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { OptionCard } from "../components/quiz/OptionCard";
import { QuizTimer } from "../components/quiz/QuizTimer";
import { QuestionPalette } from "../components/quiz/QuestionPalette";
import { Calculator } from "../components/tools/Calculator";
import { Notepad } from "../components/tools/Notepad";
import { useQuizStore } from "../store/quizStore";
import { getQuestionById } from "../utils/questions";
import { useQuizPersistence } from "../hooks/useQuizPersistence";
import { useQuizKeyboard } from "../hooks/useQuizKeyboard";
import { isBookmarked, toggleBookmark } from "../storage/bookmarkRepo";
import { cn } from "../utils/cn";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export default function Quiz() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const session = useQuizStore((s) => s.session);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const goTo = useQuizStore((s) => s.goTo);
  const next = useQuizStore((s) => s.next);
  const prev = useQuizStore((s) => s.prev);
  const selectOption = useQuizStore((s) => s.selectOption);
  const clearAnswer = useQuizStore((s) => s.clearAnswer);
  const toggleMark = useQuizStore((s) => s.toggleMark);
  const finalize = useQuizStore((s) => s.finalize);
  const endSession = useQuizStore((s) => s.endSession);

  const [elapsed, setElapsed] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useQuizPersistence();
  useQuizKeyboard();

  useEffect(() => {
    if (!session || session.id !== sessionId) {
      navigate("/practice", { replace: true });
    }
  }, [session, sessionId, navigate]);

  useEffect(() => {
    if (!session) return;
    const started = session.startedAt;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - started) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [session]);

  const question = useMemo(() => {
    if (!session) return null;
    const qid = session.questionIds[currentIndex];
    return qid ? getQuestionById(qid) ?? null : null;
  }, [session, currentIndex]);

  useEffect(() => {
    if (!question) return;
    isBookmarked(question.id).then(setBookmarked);
  }, [question]);

  if (!session || !question) return null;

  const record = session.answers[question.id];
  const selected = record?.selectedIndex ?? null;
  const isMarked = record?.status === "marked";
  const isLast = currentIndex === session.questionIds.length - 1;

  const handleSubmit = () => {
    const result = finalize();
    if (result) navigate(`/result/${result.id}`);
  };

  const handleExit = () => {
    if (confirm("Exit without submitting? Progress will be lost.")) {
      endSession();
      navigate("/practice");
    }
  };

  const handleBookmark = async () => {
    const next = await toggleBookmark(question.id);
    setBookmarked(next);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Topbar */}
      <header className="h-16 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleExit}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Exit"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {session.section === "mixed" ? "Full Mock" : session.section}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {session.mode} mode
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <QuizTimer seconds={elapsed} />

          <button
            onClick={() => {
              setShowCalc((v) => !v);
              setShowNote(false);
            }}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              showCalc
                ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
            title="Calculator"
            aria-label="Calculator"
          >
            <CalculatorIcon className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              setShowNote((v) => !v);
              setShowCalc(false);
            }}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              showNote
                ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
            title="Notepad"
            aria-label="Notepad"
          >
            <StickyNote className="h-4 w-4" />
          </button>

          <button
            onClick={() => setPaletteOpen(true)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open palette"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-10">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  Q {currentIndex + 1}
                  <span className="text-slate-400 dark:text-slate-500 font-normal">
                    {" "}
                    / {session.questionIds.length}
                  </span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {question.topic}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleBookmark}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-medium transition-colors",
                    bookmarked
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                  title={bookmarked ? "Remove bookmark" : "Bookmark this question"}
                >
                  <Star
                    className={cn("h-3.5 w-3.5", bookmarked && "fill-amber-500")}
                  />
                  {bookmarked ? "Saved" : "Save"}
                </button>

                <button
                  onClick={() => toggleMark(question.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-medium transition-colors",
                    isMarked
                      ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Flag className="h-3.5 w-3.5" />
                  {isMarked ? "Marked" : "Mark"}
                </button>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-6">
              <p className="text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                {question.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt, i) => (
                <OptionCard
                  key={i}
                  label={OPTION_LABELS[i] ?? String(i + 1)}
                  text={opt}
                  selected={selected === i}
                  onClick={() => selectOption(question.id, i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Palette — desktop */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Questions
            </h3>
          </div>
          <div className="p-5">
            <QuestionPalette
              total={session.questionIds.length}
              current={currentIndex}
              answers={session.answers}
              questionIds={session.questionIds}
              onJump={goTo}
            />
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="h-16 shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearAnswer(question.id)}
            disabled={!record}
          >
            Clear
          </Button>

          {/* Keyboard hints */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 pl-2">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                A–D
              </kbd>{" "}
              select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                ← →
              </kbd>{" "}
              nav
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                M
              </kbd>{" "}
              mark
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                C
              </kbd>{" "}
              clear
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isLast && (
            <Button size="sm" onClick={next}>
              Save & Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          {isLast && (
            <Button size="sm" variant="danger" onClick={handleSubmit}>
              Submit Test
            </Button>
          )}
        </div>
      </footer>

      {/* Palette drawer — mobile */}
      {paletteOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Questions
              </h3>
              <button
                onClick={() => setPaletteOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <QuestionPalette
              total={session.questionIds.length}
              current={currentIndex}
              answers={session.answers}
              questionIds={session.questionIds}
              onJump={(i) => {
                goTo(i);
                setPaletteOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Floating tools */}
      {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
      {showNote && <Notepad onClose={() => setShowNote(false)} />}
    </div>
  );
}