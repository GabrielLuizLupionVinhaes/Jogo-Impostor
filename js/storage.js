// Leitura e escrita no localStorage. Falhas (modo privado, cota cheia, JSON inválido,
// armazenamento bloqueado) nunca quebram o jogo: a leitura devolve o padrão e a escrita é ignorada.

function storage() {
  const store = globalThis.localStorage;
  return store && typeof store.getItem === 'function' ? store : null;
}

export function loadJSON(key, fallback) {
  try {
    const raw = storage()?.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    storage()?.setItem(key, JSON.stringify(value));
  } catch {
    // Sem armazenamento: o jogo continua funcionando, só não lembra das escolhas.
  }
}
