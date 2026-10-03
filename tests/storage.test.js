import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadJSON, saveJSON } from '../js/storage.js';

function installStorage(storage) {
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true, writable: true });
}

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
  };
}

test('saveJSON e loadJSON fazem ida e volta', () => {
  installStorage(memoryStorage());
  saveJSON('chave', { a: 1, lista: ['x'] });
  assert.deepEqual(loadJSON('chave', null), { a: 1, lista: ['x'] });
});

test('loadJSON devolve o padrão quando a chave não existe', () => {
  installStorage(memoryStorage());
  assert.equal(loadJSON('nada', 'padrão'), 'padrão');
});

test('loadJSON devolve o padrão quando o JSON é inválido', () => {
  const storage = memoryStorage();
  storage.setItem('chave', '{quebrado');
  installStorage(storage);
  assert.deepEqual(loadJSON('chave', []), []);
});

test('nada quebra quando o armazenamento lança erro', () => {
  installStorage({
    getItem() {
      throw new Error('bloqueado');
    },
    setItem() {
      throw new Error('cota cheia');
    },
  });
  assert.equal(loadJSON('chave', 'padrão'), 'padrão');
  assert.doesNotThrow(() => saveJSON('chave', 1));
});

test('nada quebra sem localStorage', () => {
  installStorage(undefined);
  assert.equal(loadJSON('chave', 'padrão'), 'padrão');
  assert.doesNotThrow(() => saveJSON('chave', 1));
});
