import { Check, Lock } from 'lucide-react';
import { GAME_STEPS, Player, ScreenState } from '../types/game';

interface RoundSidebarProps {
  screen: ScreenState;
  players: Player[];
  currentStepIndex: number;
  currentPlayerIndex: number;
}

export function RoundSidebar({
  screen,
  players,
  currentStepIndex,
  currentPlayerIndex,
}: RoundSidebarProps) {
  return (
    <aside className="rounded-3xl border border-slate-200/80 bg-white p-6">
      <h3 className="font-display text-base font-bold text-[#0F172A]">
        Oyun Akışı
      </h3>
      <p className="mt-1 text-sm text-[#64748B]">
        Her aşamada herkes kendi cevabını yazar. Cevaplar gizlenir ve kimseye kendi yazdığı denk gelmeyecek şekilde karıştırılır.
      </p>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <p className="text-xs font-semibold text-[#64748B]">Aşamalar</p>
        <ol className="mt-3 space-y-2.5">
          {GAME_STEPS.map((step) => {
            const isDone =
              screen === 'RESULTS' ||
              (screen === 'SHUFFLING' && step.index <= currentStepIndex) ||
              (screen === 'PLAYING' && step.index < currentStepIndex);
            const isActive =
              screen === 'PLAYING' && step.index === currentStepIndex;

            return (
              <li
                key={step.key}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold tabular-nums ${
                      isDone
                        ? 'bg-[#DCFCE7] text-[#166534]'
                        : isActive
                          ? 'bg-[#4338CA] text-white'
                          : 'bg-[#F6F7FB] text-[#64748B]'
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                    ) : (
                      step.index + 1
                    )}
                  </span>
                  <span
                    className={
                      isActive || isDone
                        ? 'font-semibold text-[#0F172A]'
                        : 'text-[#64748B]'
                    }
                  >
                    {step.title}
                  </span>
                </div>

                <span className="text-xs text-[#64748B]">
                  {isDone ? 'Tamam' : isActive ? 'Yazılıyor' : 'Sırada'}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[#64748B]">Oyuncular</p>
          <span className="font-mono text-xs font-semibold tabular-nums text-[#64748B]">
            {players.length} kişi
          </span>
        </div>

        <ul className="mt-3 space-y-2">
          {players.map((player, idx) => {
            const isTurn =
              screen === 'PLAYING' && idx === currentPlayerIndex;
            const hasSubmitted =
              screen === 'RESULTS' ||
              screen === 'SHUFFLING' ||
              (screen === 'PLAYING' && idx < currentPlayerIndex);

            return (
              <li
                key={player.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span
                  className={`truncate ${
                    isTurn
                      ? 'font-bold text-[#4338CA]'
                      : 'font-medium text-[#0F172A]'
                  }`}
                >
                  {idx + 1}. {player.name}
                </span>

                {screen !== 'LOBBY' && (
                  <span className="flex items-center gap-1 text-xs text-[#64748B] whitespace-nowrap shrink-0">
                    {hasSubmitted ? (
                      <>
                        <Lock className="h-3 w-3 text-[#16A34A]" aria-hidden="true" />
                        <span className="text-[#166534]">Gizli</span>
                      </>
                    ) : isTurn ? (
                      <span className="font-semibold text-[#4338CA]">
                        Sıra onda
                      </span>
                    ) : (
                      <span>Bekliyor</span>
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
