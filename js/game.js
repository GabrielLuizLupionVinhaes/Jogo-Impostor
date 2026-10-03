// Regras puras do Jogo do Impostor: limites, nomes, configurações e sorteios.
// Nada aqui acessa a tela ou o armazenamento, então tudo é testável com `node --test`.

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 20;
export const MAX_NAME_LENGTH = 20;
export const DEFAULT_PLAYER_COUNT = 4;

/** Impostores precisam ser minoria: no máximo floor((n - 1) / 2), e pelo menos 1. */
export function maxImpostors(playerCount) {
  return Math.max(1, Math.floor((playerCount - 1) / 2));
}

/** 3–6 jogadores → 1; 7–12 → 2; 13 ou mais → 3 (sem passar do máximo). */
export function recommendedImpostors(playerCount) {
  const recommended = playerCount <= 6 ? 1 : playerCount <= 12 ? 2 : 3;
  return Math.min(recommended, maxImpostors(playerCount));
}

export function clampImpostors(count, playerCount) {
  return Math.min(Math.max(count, 1), maxImpostors(playerCount));
}

/** Texto para comparação: sem acentos, minúsculo e sem espaços nas pontas. */
export function normalizeText(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function defaultName(position) {
  return `Jogador ${position}`;
}

/** Próximo "Jogador N" que ainda não existe na lista. */
export function nextDefaultName(names) {
  const taken = new Set(names.map(normalizeText));
  let position = names.length + 1;
  while (taken.has(normalizeText(defaultName(position)))) position += 1;
  return defaultName(position);
}

/** Nomes prontos para a rodada: sem espaços nas pontas, até 20 caracteres, vazio → "Jogador {posição}". */
export function normalizePlayers(names) {
  return names.map((name, index) => {
    const clean = String(name ?? '').trim().slice(0, MAX_NAME_LENGTH).trim();
    return clean || defaultName(index + 1);
  });
}

/** Nomes repetidos (sem diferenciar maiúsculas e acentos), cada um uma vez, na grafia da primeira ocorrência. */
export function findDuplicateNames(names) {
  const firstSeen = new Map();
  const duplicates = [];
  for (const name of names) {
    const key = normalizeText(name);
    if (!key) continue;
    if (!firstSeen.has(key)) {
      firstSeen.set(key, String(name).trim());
    } else if (!duplicates.includes(firstSeen.get(key))) {
      duplicates.push(firstSeen.get(key));
    }
  }
  return duplicates;
}

export function defaultSettings(allThemeIds) {
  return {
    players: Array.from({ length: DEFAULT_PLAYER_COUNT }, (_, index) => defaultName(index + 1)),
    impostors: 1,
    themeIds: [...allThemeIds],
    hints: true,
  };
}

/** Corrige configurações salvas (inválidas, antigas ou de outra versão). */
export function sanitizeSettings(raw, allThemeIds) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return defaultSettings(allThemeIds);

  const players = Array.isArray(raw.players)
    ? raw.players.filter((name) => typeof name === 'string').map((name) => name.slice(0, MAX_NAME_LENGTH))
    : defaultSettings(allThemeIds).players;
  players.splice(MAX_PLAYERS);
  while (players.length < MIN_PLAYERS) players.push(nextDefaultName(players));

  const savedThemes = Array.isArray(raw.themeIds) ? raw.themeIds : [];
  let themeIds = allThemeIds.filter((id) => savedThemes.includes(id));
  if (themeIds.length === 0) themeIds = [...allThemeIds];

  const impostors = Number.isInteger(raw.impostors)
    ? clampImpostors(raw.impostors, players.length)
    : recommendedImpostors(players.length);

  return {
    players,
    impostors,
    themeIds,
    hints: typeof raw.hints === 'boolean' ? raw.hints : true,
  };
}

/** Inteiro aleatório em [0, max). */
function randomInt(max, rng) {
  return Math.min(max - 1, Math.floor(rng() * max));
}

/** Cópia embaralhada (Fisher–Yates); não altera a lista original. */
export function shuffle(items, rng = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1, rng);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function wordId(themeId, word) {
  return `${themeId}/${word}`;
}

/**
 * Sorteia um tema entre os marcados e uma palavra ainda não usada desse tema.
 * Quando o tema se esgota, só as palavras dele voltam a ficar disponíveis.
 */
export function pickWord(themes, selectedThemeIds, usedWordIds, rng = Math.random) {
  const selected = themes.filter((theme) => selectedThemeIds.includes(theme.id));
  if (selected.length === 0) throw new Error('Nenhum tema selecionado');

  const theme = selected[randomInt(selected.length, rng)];
  const themeWordIds = new Set(theme.words.map((entry) => wordId(theme.id, entry.word)));
  const used = new Set(usedWordIds);
  let available = theme.words.filter((entry) => !used.has(wordId(theme.id, entry.word)));
  let nextUsed = [...usedWordIds];
  if (available.length === 0) {
    nextUsed = nextUsed.filter((id) => !themeWordIds.has(id));
    available = theme.words;
  }

  const entry = available[randomInt(available.length, rng)];
  const id = wordId(theme.id, entry.word);
  nextUsed.push(id);
  return { theme, entry, wordId: id, usedWordIds: nextUsed };
}

/** Monta uma rodada: palavra, impostores (com dicas diferentes) e quem começa. */
export function createRound(
  { players, impostorCount, themes, selectedThemeIds, hintsEnabled, usedWordIds },
  rng = Math.random,
) {
  const names = normalizePlayers(players);
  if (names.length < MIN_PLAYERS) throw new Error(`São necessários pelo menos ${MIN_PLAYERS} jogadores`);

  const { theme, entry, usedWordIds: nextUsed } = pickWord(themes, selectedThemeIds, usedWordIds, rng);
  const count = clampImpostors(impostorCount, names.length);
  const impostorOrder = shuffle(names.map((_, index) => index), rng).slice(0, count);

  const hints = {};
  if (hintsEnabled) {
    const shuffledHints = shuffle(entry.hints, rng);
    impostorOrder.forEach((playerIndex, i) => {
      hints[playerIndex] = shuffledHints[i % shuffledHints.length];
    });
  }

  return {
    round: {
      players: names,
      themeId: theme.id,
      themeName: theme.name,
      word: entry.word,
      impostors: [...impostorOrder].sort((a, b) => a - b),
      hints,
      starter: randomInt(names.length, rng),
    },
    usedWordIds: nextUsed,
  };
}
