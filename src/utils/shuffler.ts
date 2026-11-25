import { AnswersMap, Player, SentenceResult } from '../types/game';

/**
 * Generates a derangement of items so no element remains at its original index
 * when there are at least 2 players. Falls back to a cyclic shift if 50 random
 * shuffles do not yield a complete derangement.
 */
function derange(items: string[]): string[] {
  if (items.length <= 1) return items;

  const indices = items.map((_, i) => i);
  let attempts = 0;

  do {
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    attempts++;
  } while (indices.some((val, idx) => val === idx) && attempts < 50);

  if (indices.some((val, idx) => val === idx)) {
    return [...items.slice(1), items[0]];
  }

  return indices.map((idx) => items[idx]);
}

export function buildSentences(
  players: Player[],
  answers: AnswersMap
): SentenceResult[] {
  if (players.length === 0) return [];

  const kimList = players.map((p) => answers.KIM[p.id] ?? '');
  const kiminleList = derange(players.map((p) => answers.KIMINLE[p.id] ?? ''));
  const neredeList = derange(players.map((p) => answers.NEREDE[p.id] ?? ''));
  const neYapiyorList = derange(
    players.map((p) => answers.NE_YAPIYOR[p.id] ?? '')
  );

  return players.map((player, i) => {
    const kim = kimList[i];
    const kiminle = kiminleList[i];
    const nerede = neredeList[i];
    const neYapiyor = neYapiyorList[i];

    return {
      readerName: player.name,
      kim,
      kiminle,
      nerede,
      neYapiyor,
      fullText: `${kim}, ${kiminle} birlikte ${nerede} ${neYapiyor}!`,
    };
  });
}

export function createEmptyAnswers(): AnswersMap {
  return {
    KIM: {},
    KIMINLE: {},
    NEREDE: {},
    NE_YAPIYOR: {},
  };
}
