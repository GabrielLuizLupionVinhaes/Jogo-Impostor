# Impostor

Jogo de festa para jogar com os amigos usando **um celular só**. Todo mundo recebe a mesma palavra secreta, menos o **impostor**, que só recebe uma dica. Cada um fala uma palavra, e o grupo tenta descobrir quem está blefando.

## Como jogar

1. Escolha os jogadores, os temas e quantos impostores.
2. Passe o celular: cada um toca em **Revelar** e vê a palavra em segredo.
3. O app sorteia quem começa. Cada um fala **1 palavra** ligada à palavra secreta, em sentido horário.
4. Depois de 1 ou 2 voltas, discutam e votem. Toque em **Revelar impostor** para ver se acertaram.

## Rodar no computador

Precisa do [Node.js](https://nodejs.org) 20 ou mais novo. Não há dependências para instalar.

```bash
npm start
```

Abra o endereço "No PC" que aparece no terminal: `http://localhost:8080`.

> Abrir o `index.html` com dois cliques **não funciona**: o navegador bloqueia módulos JavaScript em arquivos locais. Use sempre o `npm start` (no GitHub Pages isso não é problema).

## Jogar no celular (mesma rede Wi-Fi)

1. Rode `npm start` no computador.
2. No celular, conectado à **mesma rede Wi-Fi**, abra o endereço "No celular" que aparece no terminal (ex.: `http://192.168.0.10:8080`).
3. Se o celular não conseguir abrir, a rede do Windows provavelmente está como **Pública**. Em **Configurações → Rede e Internet → Wi-Fi → (sua rede)**, mude o **Tipo de perfil de rede** para **Privada**. Na primeira execução, permita o Node.js no Firewall do Windows.

Para usar outra porta (PowerShell): `$env:PORT=3000; npm start`

## Testes

```bash
npm test
```

Os testes cobrem as regras do jogo, o banco de palavras, o armazenamento e o servidor local.

## Editar as palavras

Os temas ficam em `js/words.js`, uma palavra por linha:

```
Pizza: Queijo, Forno, Fatia
```

Cada palavra tem **3 dicas** para o impostor. Depois de editar, rode `npm test`: ele avisa se alguma dica entrega a palavra, se há palavras repetidas ou se uma palavra é longa demais para a tela.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html`, `css/style.css` | Página única com todas as telas |
| `js/app.js` | Telas e interação |
| `js/game.js` | Regras do jogo (sorteios, limites, configurações) |
| `js/words.js` | Banco de palavras e dicas |
| `js/storage.js` | Salva as configurações no aparelho |
| `scripts/` | Servidor local (`npm start`) |
| `tests/` | Testes automáticos (`npm test`) |

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie a branch `main`.
2. Em **Settings → Pages**, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`.
3. O jogo fica em `https://<usuário>.github.io/<repositório>/`. Não precisa de build.
