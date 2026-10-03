// Servidor estático mínimo para testar o jogo localmente (PC e celular na mesma rede).
// Só usa módulos nativos do Node. Responde 404 quando maiúsculas e minúsculas não batem,
// como o GitHub Pages, para pegar no Windows erros que só apareceriam depois do deploy.

import { createServer } from 'node:http';
import { realpathSync } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

export function createStaticServer(rootDir) {
  const root = realpathSync.native(resolve(rootDir));
  return createServer((request, response) => {
    handle(root, request, response).catch(() => {
      if (response.headersSent) response.destroy();
      else send(response, 500, 'Erro interno');
    });
  });
}

async function handle(root, request, response) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    send(response, 400, 'Endereço inválido');
    return;
  }

  let filePath = resolve(root, `.${pathname}`);
  if (filePath !== root && !filePath.startsWith(root + sep)) {
    send(response, 403, 'Acesso negado');
    return;
  }

  try {
    if ((await stat(filePath)).isDirectory()) filePath = join(filePath, 'index.html');
    const info = await stat(filePath);
    // realpath devolve a grafia real do disco: se for diferente, as maiúsculas não batem.
    if (!info.isFile() || (await realpath(filePath)) !== filePath) throw new Error('não encontrado');
  } catch {
    send(response, 404, 'Arquivo não encontrado');
    return;
  }

  const body = await readFile(filePath);
  response.writeHead(200, {
    'Content-Type': MIME_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  response.end(request.method === 'HEAD' ? undefined : body);
}

function send(response, status, message) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(message);
}
