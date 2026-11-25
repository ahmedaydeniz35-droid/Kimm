export type GameStepKey = 'KIM' | 'KIMINLE' | 'NEREDE' | 'NE_YAPIYOR';

export interface GameStep {
  index: number;
  key: GameStepKey;
  title: string;
  shortLabel: string;
  hint: string;
}

export const GAME_STEPS: readonly GameStep[] = [
  {
    index: 0,
    key: 'KIM',
    title: 'Kim?',
    shortLabel: 'Kim',
    hint: 'Örn: Kırmızı şapkalı kedi, Kaptan...',
  },
  {
    index: 1,
    key: 'KIMINLE',
    title: 'Kiminle?',
    shortLabel: 'Kiminle',
    hint: 'Örn: Uzaylılarla, iki penguenle...',
  },
  {
    index: 2,
    key: 'NEREDE',
    title: 'Nerede?',
    shortLabel: 'Nerede',
    hint: "Örn: Mars'ta, okul bahçesinde...",
  },
  {
    index: 3,
    key: 'NE_YAPIYOR',
    title: 'Ne Yapıyor?',
    shortLabel: 'Ne Yapıyor',
    hint: 'Örn: Halay çekiyor, dondurma yiyor...',
  },
] as const;

export interface Player {
  id: string;
  name: string;
}

export type AnswersMap = Record<GameStepKey, Record<string, string>>;

export interface SentenceResult {
  readerName: string;
  kim: string;
  kiminle: string;
  nerede: string;
  neYapiyor: string;
  fullText: string;
}

export type ScreenState = 'LOBBY' | 'PLAYING' | 'SHUFFLING' | 'RESULTS';
