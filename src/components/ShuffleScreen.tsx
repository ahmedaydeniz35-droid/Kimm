import { Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import { FourColumnBar } from './FourColumnBar';

interface ShuffleScreenProps {
  finishedStepIndex: number;
  finishedStepTitle: string;
}

export function ShuffleScreen({
  finishedStepIndex,
  finishedStepTitle,
}: ShuffleScreenProps) {
  const cleanTitle = finishedStepTitle.replace(/\?$/, '');

  return (
    <div className="flex flex-col justify-between gap-6">
      <FourColumnBar activeStepIndex={finishedStepIndex + 1} />

      <div
        className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white px-6 py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <motion.div
          animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EEF2FF]"
        >
          <Shuffle className="h-11 w-11 text-[#4338CA]" aria-hidden="true" />
        </motion.div>

        <h2 className="mt-6 font-display text-2xl font-extrabold text-[#0F172A] text-balance">
          &ldquo;{cleanTitle}&rdquo; Karıştırılıyor
        </h2>
        <p className="mt-2 max-w-sm text-sm sm:text-base text-[#64748B]">
          Yazılanlar gizli kalıyor, sıradaki aşama hazırlanıyor...
        </p>
      </div>
    </div>
  );
}
