import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStaticServer } from '../scripts/static-server.mjs';

let base;
let server;
let url;

before(async () => {
  base = await mkdtemp(join(tmpdir(), 'impostor-server-'));
  const root = join(base, 'site');
  await mkdir(join(root, 'js'), { recursive: true });
  await writeFile(join(root, 'index.html'), '<!doctype html><title>Início</title>');
  await writeFile(join(root, 'js', 'app.js'), 'export {};');
  await writeFile(join(root, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  await writeFile(join(base, 'segredo.txt'), 'fora da raiz');
  server = createStaticServer(root);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  url = (path) => `http://127.0.0.1:${server.address().port}${path}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await rm(base, { recursive: true, force: true });
});

test('serve o index.html na raiz, em UTF-8 e sem cache', async () => {
  const response = await fetch(url('/'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.match(await response.text(), /Início/);
});

test('serve JavaScript com o tipo exigido por ES modules (ignorando a query)', async () => {
  const response = await fetch(url('/js/app.js?v=1'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/javascript; charset=utf-8');
});

test('serve SVG', async () => {
  const response = await fetch(url('/favicon.svg'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/svg+xml');
});

test('responde 404 para arquivo inexistente e para pasta sem index', async () => {
  assert.equal((await fetch(url('/nada.js'))).status, 404);
  assert.equal((await fetch(url('/js/'))).status, 404);
});

test('responde 404 quando maiúsculas e minúsculas não batem (igual ao GitHub Pages)', async () => {
  assert.equal((await fetch(url('/INDEX.html'))).status, 404);
  assert.equal((await fetch(url('/JS/app.js'))).status, 404);
});

test('nunca entrega arquivos fora da raiz', async () => {
  for (const path of ['/..%2fsegredo.txt', '/..%5csegredo.txt', '/%2e%2e/segredo.txt']) {
    const response = await fetch(url(path));
    assert.notEqual(response.status, 200, path);
  }
});

test('responde 400 para endereço malformado e continua funcionando', async () => {
  assert.equal((await fetch(url('/%E0%A4%A'))).status, 400);
  assert.equal((await fetch(url('/'))).status, 200);
});
