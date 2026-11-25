import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  RefreshCw,
  Shuffle,
} from 'lucide-react';
import { SentenceResult } from '../types/game';
import { FourColumnBar } from './FourColumnBar';

interface ResultsScreenProps {
  results: SentenceResult[];
  onReshuffle: () => void;
  onPlayAgain: () => void;
}

export function ResultsScreen({
  results,
  onReshuffle,
  onPlayAgain,
}: ResultsScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [results]);

  useEffect(() => {
    if (showAll || results.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1 < results.length ? prev + 1 : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAll, results.length]);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(key);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === key ? null : prev));
      }, 1500);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  const activeItem = results[currentIndex];

  return (
    <div className="flex flex-col justify-between gap-6">
      <div>
        <FourColumnBar activeStepIndex={4} />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Cümleler
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReshuffle}
              title="Aynı cevapları tekrar karıştır"
              className="flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] whitespace-nowrap shrink-0"
            >
              <Shuffle className="h-4 w-4 text-[#4338CA]" aria-hidden="true" />
              <span>Karıştır</span>
            </button>

            <div className="flex items-center rounded-xl bg-slate-200/70 p-1">
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className={`h-9 rounded-lg px-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  !showAll
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Tek Tek Oku
              </button>
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className={`h-9 rounded-lg px-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  showAll
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Tüm Liste
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {!showAll && activeItem ? (
            <div>
              <div className="rounded-3xl border-[1.5px] border-[#FDE68A] bg-[#FFFBEB] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[#4338CA]">
                    Okuyan: {activeItem.readerName}{' '}
                    <span className="text-[#64748B] font-normal">·</span>{' '}
                    <span className="font-mono tabular-nums">
                      {currentIndex + 1}/{results.length}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(activeItem.fullText, `single-${currentIndex}`)
                    }
                    aria-label="Cümleyi kopyala"
                    className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-[#64748B] transition-colors hover:bg-[#FEF3C7] hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] whitespace-nowrap shrink-0"
                  >
                    {copiedId === `single-${currentIndex}` ? (
                      <>
                        <Check className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />
                        <span className="text-[#166534]">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-4 font-display text-2xl sm:text-[26px] font-extrabold leading-snug text-[#0F172A]">
                  {activeItem.fullText}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#FDE68A]/80 pt-3.5 text-xs text-[#64748B]">
                  <span>Kim: {activeItem.kim}</span>
                  <span aria-hidden="true">·</span>
                  <span>Kiminle: {activeItem.kiminle}</span>
                  <span aria-hidden="true">·</span>
                  <span>Nerede: {activeItem.nerede}</span>
                  <span aria-hidden="true">·</span>
                  <span>Ne Yapıyor: {activeItem.neYapiyor}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
                  }
                  disabled={currentIndex === 0}
                  className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm sm:text-base font-bold text-[#0F172A] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Önceki</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev + 1 < results.length ? prev + 1 : prev
                    )
                  }
                  disabled={currentIndex + 1 >= results.length}
                  className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#4338CA] px-4 text-sm sm:text-base font-bold text-white transition-colors hover:bg-[#3730A3] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] whitespace-nowrap shrink-0"
                >
                  <span>Sonraki</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {results.map((item, idx) => (
                <div
                  key={`${item.readerName}-${idx}`}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#4338CA] font-mono tabular-nums">
                      {idx + 1}. {item.readerName}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.fullText, `list-${idx}`)}
                      aria-label={`${idx + 1}. cümleyi kopyala`}
                      className="flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] whitespace-nowrap shrink-0"
                    >
                      {copiedId === `list-${idx}` ? (
                        <Check className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>
                        {copiedId === `list-${idx}` ? 'Kopyalandı' : 'Kopyala'}
                      </span>
                    </button>
                  </div>
                  <p className="mt-1.5 text-base font-semibold leading-relaxed text-[#0F172A]">
                    {item.fullText}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onPlayAgain}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F172A] px-6 text-base font-bold text-white transition-all duration-150 hover:bg-slate-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A] focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
      >
        <RefreshCw className="h-5 w-5" aria-hidden="true" />
        <span>Yeni Oyun</span>
      </button>
    </div>
  );
}
