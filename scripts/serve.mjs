// `npm start`: sobe o jogo em http://localhost:8080 e mostra o endereço para abrir no celular.
import { networkInterfaces } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createStaticServer } from './static-server.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PORT) || 8080;
const server = createStaticServer(root);

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n  A porta ${port} já está em uso. Use outra: $env:PORT=8081; npm start\n`);
    process.exit(1);
  }
  throw error;
});

server.listen(port, '0.0.0.0', () => {
  console.log('\n  Impostor rodando!\n');
  console.log(`  No PC:       http://localhost:${port}`);
  for (const { name, address } of lanAddresses()) {
    console.log(`  No celular:  http://${address}:${port}   (${name})`);
  }
  console.log('\n  O celular precisa estar na mesma rede Wi-Fi. Ctrl+C para parar.\n');
});

function lanAddresses() {
  return Object.entries(networkInterfaces()).flatMap(([name, nets]) =>
    (nets ?? [])
      .filter((net) => net.family === 'IPv4' && !net.internal)
      .map((net) => ({ name, address: net.address })),
  );
}
