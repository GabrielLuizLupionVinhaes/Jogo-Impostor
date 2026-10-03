import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffle, wordId, pickWord, createRound } from '../js/game.js';
import { seededRng } from './helpers/rng.js';

const THEMES = [
  {
    id: 'frutas',
    name: 'Frutas',
    words: [
      { word: 'Banana', hints: ['Amarela', 'Macaco', 'Cacho'] },
      { word: 'Maçã', hints: ['Vermelha', 'Torta', 'Mordida'] },
      { word: 'Uva', hints: ['Vinho', 'Roxa', 'Parreira'] },
    ],
  },
  {
    id: 'cores',
    name: 'Cores',
    words: [
      { word: 'Azul', hints: ['Céu', 'Mar', 'Frio'] },
      { word: 'Verde', hints: ['Folha', 'Mato', 'Esperança'] },
    ],
  },
];

const PLAYERS = ['Ana', 'Bia', 'Caio', 'Duda', 'Edu', 'Fábio', 'Gabi'];

function makeRound(overrides = {}, seed = 7) {
  return createRound(
    {
      players: PLAYERS,
      impostorCount: 2,
      themes: THEMES,
      selectedThemeIds: ['frutas', 'cores'],
      hintsEnabled: true,
      usedWordIds: [],
      ...overrides,
    },
    seededRng(seed),
  );
}

test('shuffle devolve os mesmos itens sem alterar a lista original', () => {
  const items = [1, 2, 3, 4, 5];
  const result = shuffle(items, seededRng(1));
  assert.deepEqual([...result].sort((a, b) => a - b), items);
  assert.deepEqual(items, [1, 2, 3, 4, 5]);
});

test('wordId junta tema e palavra', () => {
  assert.equal(wordId('cores', 'Azul'), 'cores/Azul');
});

test('pickWord sempre sorteia de um tema marcado', () => {
  const rng = seededRng(1);
  let used = [];
  for (let i = 0; i < 50; i += 1) {
    const result = pickWord(THEMES, ['cores'], used, rng);
    assert.equal(result.theme.id, 'cores');
    assert.ok(result.theme.words.includes(result.entry));
    assert.equal(result.wordId, wordId('cores', result.entry.word));
    used = result.usedWordIds;
  }
});

test('pickWord não repete palavras até esgotar o tema', () => {
  const rng = seededRng(2);
  let used = [];
  const seen = [];
  for (let i = 0; i < 3; i += 1) {
    const result = pickWord(THEMES, ['frutas'], used, rng);
    seen.push(result.entry.word);
    used = result.usedWordIds;
  }
  assert.deepEqual([...seen].sort(), ['Banana', 'Maçã', 'Uva']);
});

test('pickWord reinicia só o tema esgotado', () => {
  const used = ['frutas/Banana', 'frutas/Maçã', 'frutas/Uva', 'cores/Azul'];
  const result = pickWord(THEMES, ['frutas'], used, seededRng(3));
  assert.equal(result.theme.id, 'frutas');
  assert.ok(result.usedWordIds.includes('cores/Azul'));
  assert.deepEqual(result.usedWordIds.filter((id) => id.startsWith('frutas/')), [result.wordId]);
});

test('pickWord, ao reiniciar um tema, não repete a última palavra sorteada', () => {
  const used = ['frutas/Banana', 'frutas/Uva', 'frutas/Maçã'];
  for (let seed = 1; seed <= 30; seed += 1) {
    const result = pickWord(THEMES, ['frutas'], used, seededRng(seed));
    assert.notEqual(result.entry.word, 'Maçã', `semente ${seed}`);
  }
});

test('pickWord não altera os parâmetros recebidos', () => {
  const used = ['frutas/Banana'];
  const selected = ['frutas'];
  pickWord(THEMES, selected, used, seededRng(4));
  assert.deepEqual(used, ['frutas/Banana']);
  assert.deepEqual(selected, ['frutas']);
});

test('pickWord sem tema marcado lança erro', () => {
  assert.throws(() => pickWord(THEMES, [], [], seededRng(5)), /tema/);
});

test('createRound sorteia o número exato de impostores, sem repetição', () => {
  for (let seed = 1; seed <= 50; seed += 1) {
    const { round } = makeRound({ impostorCount: 3 }, seed);
    assert.equal(round.impostors.length, 3);
    assert.equal(new Set(round.impostors).size, 3);
    for (const index of round.impostors) {
      assert.ok(Number.isInteger(index) && index >= 0 && index < PLAYERS.length);
    }
    assert.deepEqual(round.impostors, [...round.impostors].sort((a, b) => a - b));
  }
});

test('createRound dá dicas diferentes, da lista da palavra, a cada impostor', () => {
  for (let seed = 1; seed <= 50; seed += 1) {
    const { round } = makeRound({ impostorCount: 3 }, seed);
    const entry = THEMES.flatMap((theme) => theme.words).find((item) => item.word === round.word);
    const hints = round.impostors.map((index) => round.hints[index]);
    assert.equal(new Set(hints).size, 3);
    for (const hint of hints) assert.ok(entry.hints.includes(hint));
    assert.deepEqual(Object.keys(round.hints).map(Number).sort((a, b) => a - b), round.impostors);
  }
});

test('createRound com a dica desligada não dá dica a ninguém', () => {
  const { round } = makeRound({ hintsEnabled: false });
  assert.deepEqual(round.hints, {});
});

test('createRound repete as dicas em ciclo quando há mais impostores que dicas', () => {
  const players = Array.from({ length: 12 }, (_, i) => `J${i + 1}`);
  const { round } = makeRound({ players, impostorCount: 5 });
  assert.equal(Object.keys(round.hints).length, 5);
  assert.equal(new Set(Object.values(round.hints)).size, 3);
});

test('createRound devolve uma rodada consistente', () => {
  const { round, usedWordIds } = makeRound();
  assert.deepEqual(round.players, PLAYERS);
  const theme = THEMES.find((item) => item.id === round.themeId);
  assert.equal(round.themeName, theme.name);
  assert.ok(theme.words.some((item) => item.word === round.word));
  assert.ok(Number.isInteger(round.starter) && round.starter >= 0 && round.starter < PLAYERS.length);
  assert.deepEqual(usedWordIds, [wordId(round.themeId, round.word)]);
});

test('createRound normaliza os nomes e limita os impostores', () => {
  const { round } = makeRound({ players: [' Ana ', '', 'Caio'], impostorCount: 5 });
  assert.deepEqual(round.players, ['Ana', 'Jogador 2', 'Caio']);
  assert.equal(round.impostors.length, 1);
});

test('createRound sempre tem pelo menos 1 impostor, mesmo com quantidade inválida', () => {
  for (const impostorCount of [undefined, NaN, 0]) {
    const { round } = makeRound({ impostorCount });
    assert.equal(round.impostors.length, 1, String(impostorCount));
  }
});

test('createRound exige pelo menos 3 jogadores', () => {
  assert.throws(() => makeRound({ players: ['Ana', 'Bia'] }), /3 jogadores/);
});

test('createRound sorteia impostor e quem começa de forma uniforme', () => {
  const rng = seededRng(99);
  const runs = 7000;
  const impostorCounts = new Array(PLAYERS.length).fill(0);
  const starterCounts = new Array(PLAYERS.length).fill(0);
  for (let i = 0; i < runs; i += 1) {
    const { round } = createRound(
      {
        players: PLAYERS,
        impostorCount: 1,
        themes: THEMES,
        selectedThemeIds: ['frutas'],
        hintsEnabled: true,
        usedWordIds: [],
      },
      rng,
    );
    impostorCounts[round.impostors[0]] += 1;
    starterCounts[round.starter] += 1;
  }
  const expected = runs / PLAYERS.length;
  for (const count of [...impostorCounts, ...starterCounts]) {
    assert.ok(Math.abs(count - expected) < expected * 0.15, `contagem ${count} longe de ${expected}`);
  }
});
