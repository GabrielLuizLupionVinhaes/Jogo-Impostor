import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PACKS, THEMES, parseWordList } from '../js/words.js';
import { normalizeText } from '../js/game.js';

const MAX_TOKEN_LENGTH = 12;

test('parseWordList lê "Palavra: dica, dica, dica" e ignora linhas vazias', () => {
  const list = parseWordList(`
    Pizza: Queijo, Forno, Fatia

    Pão de queijo:  Mineiro ,Café, Polvilho
  `);
  assert.deepEqual(list, [
    { word: 'Pizza', hints: ['Queijo', 'Forno', 'Fatia'] },
    { word: 'Pão de queijo', hints: ['Mineiro', 'Café', 'Polvilho'] },
  ]);
});

test('os pacotes têm os temas combinados, na ordem', () => {
  assert.deepEqual(
    PACKS.map((pack) => [pack.id, pack.name, pack.themes.map((theme) => theme.id)]),
    [
      ['classicos', 'Clássicos', ['comidas', 'animais', 'objetos', 'lugares', 'profissoes']],
      ['cultura-pop', 'Cultura pop', ['filmes-series', 'personagens', 'famosos', 'marcas']],
      ['esportes', 'Esportes', ['esportes', 'futebol']],
    ],
  );
  assert.deepEqual(
    THEMES.map((theme) => theme.id),
    PACKS.flatMap((pack) => pack.themes.map((theme) => theme.id)),
  );
});

test('cada tema tem nome e pelo menos 25 palavras', () => {
  for (const theme of THEMES) {
    assert.ok(theme.name.trim().length > 0, `${theme.id} sem nome`);
    assert.ok(theme.words.length >= 25, `${theme.id} tem ${theme.words.length} palavras`);
  }
});

test('cada palavra tem exatamente 3 dicas, sem textos vazios nem repetidos', () => {
  for (const theme of THEMES) {
    for (const { word, hints } of theme.words) {
      assert.ok(word.length > 0, `${theme.id}: palavra vazia`);
      assert.equal(hints.length, 3, `${word}: ${hints.length} dicas`);
      for (const hint of hints) assert.ok(hint.length > 0, `${word}: dica vazia`);
      assert.equal(new Set(hints.map(normalizeText)).size, 3, `${word}: dicas repetidas`);
    }
  }
});

test('as palavras são únicas no banco inteiro', () => {
  const seen = new Map();
  for (const theme of THEMES) {
    for (const { word } of theme.words) {
      const key = normalizeText(word);
      assert.ok(!seen.has(key), `"${word}" aparece em ${seen.get(key)} e em ${theme.id}`);
      seen.set(key, theme.id);
    }
  }
});

test('nenhuma dica entrega a palavra', () => {
  for (const theme of THEMES) {
    for (const { word, hints } of theme.words) {
      const normalizedWord = normalizeText(word);
      for (const hint of hints) {
        const normalizedHint = normalizeText(hint);
        assert.ok(!normalizedHint.includes(normalizedWord), `${word}: a dica "${hint}" contém a palavra`);
        assert.ok(
          normalizedHint.length < 4 || !normalizedWord.includes(normalizedHint),
          `${word}: a palavra contém a dica "${hint}"`,
        );
        assert.notEqual(normalizedHint, normalizeText(theme.name), `${word}: a dica é o nome do tema`);
      }
    }
  }
});

test('toda palavra tem ao menos 1 dica que também serve para outra palavra do mesmo tema', () => {
  // Uma dica exclusiva entrega a palavra; dicas compartilhadas mantêm o impostor na dúvida.
  for (const theme of THEMES) {
    const uses = new Map();
    for (const { hints } of theme.words) {
      for (const hint of hints) uses.set(normalizeText(hint), (uses.get(normalizeText(hint)) ?? 0) + 1);
    }
    for (const { word, hints } of theme.words) {
      const shared = hints.filter((hint) => uses.get(normalizeText(hint)) > 1);
      assert.ok(shared.length >= 1, `${theme.id}/${word}: nenhuma dica é compartilhada (${hints.join(', ')})`);
    }
  }
});

test(`nenhum trecho de palavra passa de ${MAX_TOKEN_LENGTH} caracteres (cabe na tela)`, () => {
  for (const theme of THEMES) {
    for (const { word } of theme.words) {
      for (const part of word.split(/[\s-]+/)) {
        assert.ok(part.length <= MAX_TOKEN_LENGTH, `${word}: "${part}" tem ${part.length} caracteres`);
      }
    }
  }
});
