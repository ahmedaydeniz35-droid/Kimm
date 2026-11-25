import { Check } from 'lucide-react';
import { GAME_STEPS } from '../types/game';

interface FourColumnBarProps {
  activeStepIndex: number;
}

export function FourColumnBar({ activeStepIndex }: FourColumnBarProps) {
  return (
    <div
      className="grid grid-cols-4 gap-1.5 rounded-2xl bg-white p-1.5 border border-slate-200/80"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={GAME_STEPS.length}
      aria-valuenow={Math.min(activeStepIndex, GAME_STEPS.length)}
      aria-label="Oyun aşamaları"
    >
      {GAME_STEPS.map((step) => {
        const isActive = step.index === activeStepIndex;
        const isDone = step.index < activeStepIndex;

        return (
          <div
            key={step.key}
            className={`flex items-center justify-center gap-1 rounded-[11px] px-2 py-2.5 text-center text-xs font-bold transition-colors duration-200 ${
              isActive
                ? 'bg-[#4338CA] text-white'
                : isDone
                  ? 'bg-[#DCFCE7] text-[#166534]'
                  : 'bg-[#F6F7FB] text-[#64748B]'
            }`}
          >
            {isDone && (
              <Check
                className="h-3.5 w-3.5 shrink-0 stroke-[2.5]"
                aria-hidden="true"
              />
            )}
            <span className="truncate whitespace-nowrap">{step.shortLabel}</span>
          </div>
        );
      })}
    </div>
  );
}
