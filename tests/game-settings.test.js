import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_NAME_LENGTH,
  maxImpostors,
  recommendedImpostors,
  clampImpostors,
  normalizeText,
  nextDefaultName,
  normalizePlayers,
  findDuplicateNames,
  defaultSettings,
  sanitizeSettings,
} from '../js/game.js';

const IDS = ['frutas', 'cores'];

test('maxImpostors mantém os impostores em minoria', () => {
  const expected = { 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 12: 5, 13: 6, 20: 9 };
  for (const [players, max] of Object.entries(expected)) {
    assert.equal(maxImpostors(Number(players)), max, `${players} jogadores`);
  }
});

test('recommendedImpostors: 3–6 → 1, 7–12 → 2, 13–20 → 3', () => {
  const expected = { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 12: 2, 13: 3, 20: 3 };
  for (const [players, recommended] of Object.entries(expected)) {
    assert.equal(recommendedImpostors(Number(players)), recommended, `${players} jogadores`);
  }
});

test('clampImpostors limita entre 1 e o máximo', () => {
  assert.equal(clampImpostors(0, 6), 1);
  assert.equal(clampImpostors(-3, 6), 1);
  assert.equal(clampImpostors(2, 6), 2);
  assert.equal(clampImpostors(5, 6), 2);
  assert.equal(clampImpostors(2, 3), 1);
});

test('normalizeText ignora acentos, maiúsculas e espaços nas pontas', () => {
  assert.equal(normalizeText('  Ána Júlia '), 'ana julia');
  assert.equal(normalizeText('AÇAÍ'), 'acai');
});

test('nextDefaultName gera um "Jogador N" que ainda não existe', () => {
  assert.equal(nextDefaultName(['Jogador 1', 'Jogador 2']), 'Jogador 3');
  assert.equal(nextDefaultName(['Ana', 'Bia']), 'Jogador 3');
  assert.equal(nextDefaultName(['Jogador 3', 'jogador 4']), 'Jogador 5');
});

test('normalizePlayers tira espaços, limita o tamanho e preenche nomes vazios', () => {
  assert.deepEqual(
    normalizePlayers(['  Ana ', '', '   ', 'Um nome muito comprido demais']),
    ['Ana', 'Jogador 2', 'Jogador 3', 'Um nome muito compri'],
  );
  assert.equal('Um nome muito compri'.length, MAX_NAME_LENGTH);
});

test('findDuplicateNames ignora maiúsculas, acentos e espaços', () => {
  assert.deepEqual(findDuplicateNames(['Ana', 'Bia', 'ana ', 'Ána', 'Caio', 'BIA']), ['Ana', 'Bia']);
  assert.deepEqual(findDuplicateNames(['Ana', 'Bia', 'Caio']), []);
});

test('defaultSettings: 4 jogadores, 1 impostor, todos os temas e dica ligada', () => {
  assert.deepEqual(defaultSettings(IDS), {
    players: ['Jogador 1', 'Jogador 2', 'Jogador 3', 'Jogador 4'],
    impostors: 1,
    themeIds: ['frutas', 'cores'],
    hints: true,
  });
});

test('sanitizeSettings usa o padrão para entradas inválidas', () => {
  for (const raw of [null, undefined, 42, 'texto', []]) {
    assert.deepEqual(sanitizeSettings(raw, IDS), defaultSettings(IDS));
  }
});

test('sanitizeSettings corrige campos inválidos', () => {
  assert.deepEqual(
    sanitizeSettings(
      { players: ['Ana', 42, 'Bia'], impostors: 7, themeIds: ['cores', 'sumiu', 'cores'], hints: 'sim' },
      IDS,
    ),
    { players: ['Ana', 'Bia', 'Jogador 3'], impostors: 1, themeIds: ['cores'], hints: true },
  );
});

test('sanitizeSettings respeita os limites de jogadores e de tamanho do nome', () => {
  const players = ['x'.repeat(30), ...Array.from({ length: 24 }, (_, i) => `P${i}`)];
  const result = sanitizeSettings({ players, impostors: 2.5, themeIds: ['nada'], hints: false }, IDS);
  assert.equal(result.players.length, 20);
  assert.equal(result.players[0], 'x'.repeat(20));
  assert.equal(result.impostors, 3); // não é inteiro → recomendado para 20 jogadores
  assert.deepEqual(result.themeIds, IDS); // nenhum tema válido → todos
  assert.equal(result.hints, false);
});

test('sanitizeSettings mantém configurações válidas', () => {
  const saved = { players: ['Ana', 'Bia', 'Caio', 'Duda', 'Edu'], impostors: 2, themeIds: ['cores'], hints: false };
  assert.deepEqual(sanitizeSettings(saved, IDS), saved);
});
