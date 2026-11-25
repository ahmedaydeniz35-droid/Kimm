import { useEffect, useRef } from 'react';
import { Check, EyeOff } from 'lucide-react';
import { GameStep, Player } from '../types/game';
import { FourColumnBar } from './FourColumnBar';

interface PlayScreenProps {
  step: GameStep;
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  inputText: string;
  isHiddenLocked: boolean;
  onInputChange: (val: string) => void;
  onConfirmTick: () => void;
}

export function PlayScreen({
  step,
  player,
  playerIndex,
  totalPlayers,
  inputText,
  isHiddenLocked,
  onInputChange,
  onConfirmTick,
}: PlayScreenProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isHiddenLocked) {
      textareaRef.current?.focus();
    }
  }, [step.index, player.id, isHiddenLocked]);

  const canSubmit = inputText.trim().length > 0 && !isHiddenLocked;

  return (
    <div className="flex flex-col justify-between gap-6">
      <div>
        <FourColumnBar activeStepIndex={step.index} />

        <div className="mt-5 flex items-baseline justify-between gap-4">
          <p className="font-display text-lg sm:text-xl font-bold text-[#4338CA] truncate">
            Sıra: {player.name}
          </p>
          <span className="font-mono text-sm font-bold tabular-nums text-[#64748B] whitespace-nowrap shrink-0">
            {playerIndex + 1} / {totalPlayers}
          </span>
        </div>

        <div className="mt-3.5 rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
              {step.title}
            </h2>
            <span className="text-xs font-medium text-[#64748B] whitespace-nowrap">
              Gizli giriş
            </span>
          </div>

          <div className="mt-4">
            {isHiddenLocked ? (
              <div
                className="flex h-36 w-full flex-col items-center justify-center rounded-2xl bg-[#0F172A] px-4 text-center"
                role="status"
                aria-live="polite"
              >
                <EyeOff
                  className="h-8 w-8 text-[#16A34A]"
                  aria-hidden="true"
                />
                <p className="mt-2.5 text-base font-bold text-white">
                  Gizlendi ve Karışmaya Girdi
                </p>
              </div>
            ) : (
              <div>
                <label htmlFor="step-answer-input" className="sr-only">
                  {step.title} cevabın
                </label>
                <textarea
                  ref={textareaRef}
                  id="step-answer-input"
                  value={inputText}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (canSubmit) {
                        onConfirmTick();
                      }
                    }
                  }}
                  placeholder={step.hint}
                  rows={4}
                  className="h-36 w-full resize-none rounded-2xl border border-slate-200 bg-[#F6F7FB]/50 p-4 text-base sm:text-lg text-[#0F172A] placeholder:text-[#64748B] focus:border-[#4338CA] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA]/30 transition-colors"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirmTick}
        disabled={!canSubmit}
        className="flex h-15 w-full items-center justify-center gap-2 rounded-2xl bg-[#16A34A] px-6 text-base sm:text-lg font-bold text-white transition-all duration-150 hover:bg-[#15803D] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
      >
        <Check className="h-6 w-6 stroke-[2.5]" aria-hidden="true" />
        <span>Okey — Gizle ve Devam Et</span>
      </button>
    </div>
  );
}
