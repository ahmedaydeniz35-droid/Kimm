import { FormEvent, useState } from 'react';
import { Play, UserPlus, X } from 'lucide-react';
import { Player } from '../types/game';
import { FourColumnBar } from './FourColumnBar';

interface LobbyScreenProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRenamePlayer: (id: string, name: string) => void;
  onRemovePlayer: (id: string) => void;
  onStartGame: () => void;
}

export function LobbyScreen({
  players,
  onAddPlayer,
  onRenamePlayer,
  onRemovePlayer,
  onStartGame,
}: LobbyScreenProps) {
  const [newName, setNewName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddPlayer(newName);
    setNewName('');
  };

  return (
    <div className="flex flex-col justify-between gap-6">
      <div>
        <div className="mb-4">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] text-balance">
            Kim, Kiminle, Nerede?
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#64748B]">
            Kişileri ekle, telefonu sırayla dolaştır.
          </p>
        </div>

        <FourColumnBar activeStepIndex={0} />

        <form onSubmit={handleSubmit} className="mt-5 flex items-center gap-2.5">
          <label htmlFor="player-name-input" className="sr-only">
            Oyuncu adı
          </label>
          <input
            id="player-name-input"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="İsim yaz..."
            maxLength={32}
            className="h-13 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-base text-[#0F172A] placeholder:text-[#64748B] focus:border-[#4338CA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA]/30 transition-colors"
          />
          <button
            type="submit"
            disabled={!newName.trim()}
            aria-label="Oyuncu ekle"
            className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#4338CA] text-white transition-all duration-150 hover:bg-[#3730A3] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] focus-visible:ring-offset-2"
          >
            <UserPlus className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>

        <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between gap-3 px-4 py-2.5"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] font-mono text-xs font-bold tabular-nums text-[#4338CA]">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={player.name}
                  aria-label={`${index + 1}. oyuncu adı`}
                  maxLength={32}
                  onChange={(e) => onRenamePlayer(player.id, e.target.value)}
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-base font-semibold text-[#0F172A] focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#4338CA]/30"
                />
              </div>

              {players.length > 2 && (
                <button
                  type="button"
                  onClick={() => onRemovePlayer(player.id)}
                  aria-label={`${player.name} oyuncusunu kaldır`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#DC2626] transition-colors hover:bg-red-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onStartGame}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#4338CA] px-6 text-base font-bold text-white transition-all duration-150 hover:bg-[#3730A3] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
      >
        <Play className="h-5 w-5 fill-current" aria-hidden="true" />
        <span>Oyuna Başla ({players.length} Kişi)</span>
      </button>
    </div>
  );
}
