import { useEffect, useState } from 'react';
import { HelpCircle, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import {
  AnswersMap,
  GAME_STEPS,
  Player,
  ScreenState,
  SentenceResult,
} from './types/game';
import { buildSentences, createEmptyAnswers } from './utils/shuffler';
import { soundFx } from './utils/sound';
import { LobbyScreen } from './components/LobbyScreen';
import { PlayScreen } from './components/PlayScreen';
import { ShuffleScreen } from './components/ShuffleScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { RoundSidebar } from './components/RoundSidebar';

function createPlayerId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('LOBBY');
  const [players, setPlayers] = useState<Player[]>(() => [
    { id: createPlayerId(), name: '1. Kişi' },
    { id: createPlayerId(), name: '2. Kişi' },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isHiddenLocked, setIsHiddenLocked] = useState(false);

  const [answers, setAnswers] = useState<AnswersMap>(createEmptyAnswers);
  const [results, setResults] = useState<SentenceResult[]>([]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [rulesOpen, setRulesOpen] = useState(false);

  // Handle the 850ms hidden-lock transition before advancing player or entering shuffle
  useEffect(() => {
    if (screen !== 'PLAYING' || !isHiddenLocked) return;

    const timer = window.setTimeout(() => {
      setIsHiddenLocked(false);
      setInputText('');

      if (currentPlayerIndex + 1 < players.length) {
        setCurrentPlayerIndex((prev) => prev + 1);
      } else {
        soundFx.shuffle(soundEnabled);
        setScreen('SHUFFLING');
      }
    }, 850);

    return () => window.clearTimeout(timer);
  }, [screen, isHiddenLocked, currentPlayerIndex, players.length, soundEnabled]);

  // Handle the 1400ms shuffle screen before advancing step or revealing results
  useEffect(() => {
    if (screen !== 'SHUFFLING') return;

    const timer = window.setTimeout(() => {
      if (currentStepIndex + 1 < GAME_STEPS.length) {
        setCurrentStepIndex((prev) => prev + 1);
        setCurrentPlayerIndex(0);
        setScreen('PLAYING');
      } else {
        const built = buildSentences(players, answers);
        setResults(built);
        soundFx.reveal(soundEnabled);
        setScreen('RESULTS');
      }
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [screen, currentStepIndex, players, answers, soundEnabled]);

  const handleAddPlayer = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    soundFx.tap(soundEnabled);
    setPlayers((prev) => [...prev, { id: createPlayerId(), name: trimmed }]);
  };

  const handleRenamePlayer = (id: string, name: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 2) return;
    soundFx.tap(soundEnabled);
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStartGame = () => {
    const sanitizedPlayers = players.map((p, idx) => ({
      ...p,
      name: p.name.trim() || `${idx + 1}. Kişi`,
    }));

    soundFx.tap(soundEnabled);
    setPlayers(sanitizedPlayers);
    setAnswers(createEmptyAnswers());
    setCurrentStepIndex(0);
    setCurrentPlayerIndex(0);
    setInputText('');
    setIsHiddenLocked(false);
    setResults([]);
    setScreen('PLAYING');
  };

  const handleConfirmTick = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isHiddenLocked) return;

    const activeStep = GAME_STEPS[currentStepIndex];
    const activePlayer = players[currentPlayerIndex];
    if (!activeStep || !activePlayer) return;

    soundFx.lock(soundEnabled);
    setAnswers((prev) => ({
      ...prev,
      [activeStep.key]: {
        ...prev[activeStep.key],
        [activePlayer.id]: trimmed,
      },
    }));
    setIsHiddenLocked(true);
  };

  const handleReshuffle = () => {
    soundFx.shuffle(soundEnabled);
    setResults(buildSentences(players, answers));
  };

  const handlePlayAgain = () => {
    soundFx.tap(soundEnabled);
    setIsHiddenLocked(false);
    setInputText('');
    setScreen('LOBBY');
  };

  const activeStep = GAME_STEPS[currentStepIndex] ?? GAME_STEPS[0];
  const activePlayer = players[currentPlayerIndex] ?? players[0];

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#0F172A] flex flex-col">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={handlePlayAgain}
            className="font-display text-base sm:text-lg font-extrabold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] rounded-md"
          >
            Kim, Kiminle, Nerede?
          </button>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {screen !== 'LOBBY' && (
              <button
                type="button"
                onClick={handlePlayAgain}
                aria-label="Lobiye dön"
                className="flex h-11 items-center gap-1.5 rounded-xl px-3 text-xs sm:text-sm font-semibold text-[#64748B] transition-colors hover:bg-slate-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Lobi</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              aria-label="Nasıl oynanır"
              className="flex h-11 items-center gap-1.5 rounded-xl px-3 text-xs sm:text-sm font-semibold text-[#64748B] transition-colors hover:bg-slate-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] whitespace-nowrap shrink-0"
            >
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Kurallar</span>
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-label={soundEnabled ? 'Sesi kapat' : 'Sesi aç'}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[#64748B] transition-colors hover:bg-slate-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA]"
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5" aria-hidden="true" />
              ) : (
                <VolumeX className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <section className="lg:col-span-7" aria-label="Oyun alanı">
            {screen === 'LOBBY' && (
              <LobbyScreen
                players={players}
                onAddPlayer={handleAddPlayer}
                onRenamePlayer={handleRenamePlayer}
                onRemovePlayer={handleRemovePlayer}
                onStartGame={handleStartGame}
              />
            )}

            {screen === 'PLAYING' && activePlayer && (
              <PlayScreen
                step={activeStep}
                player={activePlayer}
                playerIndex={currentPlayerIndex}
                totalPlayers={players.length}
                inputText={inputText}
                isHiddenLocked={isHiddenLocked}
                onInputChange={setInputText}
                onConfirmTick={handleConfirmTick}
              />
            )}

            {screen === 'SHUFFLING' && (
              <ShuffleScreen
                finishedStepIndex={activeStep.index}
                finishedStepTitle={activeStep.title}
              />
            )}

            {screen === 'RESULTS' && (
              <ResultsScreen
                results={results}
                onReshuffle={handleReshuffle}
                onPlayAgain={handlePlayAgain}
              />
            )}
          </section>

          <div className="hidden lg:block lg:col-span-5">
            <RoundSidebar
              screen={screen}
              players={players}
              currentStepIndex={currentStepIndex}
              currentPlayerIndex={currentPlayerIndex}
            />
          </div>
        </div>
      </main>

      {rulesOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rules-modal-title"
          onClick={() => setRulesOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id="rules-modal-title"
                className="font-display text-xl font-extrabold text-[#0F172A]"
              >
                Nasıl Oynanır?
              </h2>
              <button
                type="button"
                onClick={() => setRulesOpen(false)}
                aria-label="Kapat"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[#64748B]">
              <li>
                <span className="font-bold text-[#0F172A]">1. Oyuncuları Ekle:</span>{' '}
                En az 2 kişi ekle ve oyunu başlat.
              </li>
              <li>
                <span className="font-bold text-[#0F172A]">2. Gizlice Yaz ve Dolaştır:</span>{' '}
                Sırayla Kim, Kiminle, Nerede ve Ne Yapıyor sorularını cevapla. Her onaydan sonra cevap gizlenir.
              </li>
              <li>
                <span className="font-bold text-[#0F172A]">3. Karıştır ve Oku:</span>{' '}
                Kimseye kendi yazdığı gelmeyecek şekilde tüm parçalar karışır ve komik cümleler ortaya çıkar.
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setRulesOpen(false)}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[#4338CA] text-sm font-bold text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA]"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
