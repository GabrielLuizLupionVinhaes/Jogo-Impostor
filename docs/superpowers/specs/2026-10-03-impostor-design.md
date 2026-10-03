# Jogo do Impostor — Especificação do protótipo (v1)

- **Data:** 2026-10-03
- **Status:** design aprovado no brainstorming
- **Plataforma:** site estático (GitHub Pages), feito primeiro para celular
- **Etapa atual:** desenvolver e testar **localmente**. O deploy no GitHub Pages é uma etapa posterior.

## 1. Objetivo

Protótipo web do "Jogo do Impostor" para jogar presencialmente com **um único celular passado de mão em mão**. O app configura a partida, mostra a cada jogador, em segredo, a palavra ou o aviso de que ele é o impostor (com uma dica), sorteia quem começa e, no fim, revela o impostor.

## 2. Como o jogo funciona (referência)

1. Todos recebem a mesma **palavra secreta**, exceto o(s) **impostor(es)**, que só sabem que são impostores e recebem uma **palavra-dica** relacionada.
2. A partir de um jogador sorteado, cada um diz **uma palavra** relacionada à palavra secreta, em sentido horário (1 ou 2 voltas).
3. O grupo discute e vota em quem acha que é o impostor. Discussão e votação acontecem **ao vivo, fora do app**.
4. O app revela o impostor e a palavra. Os jogadores vencem se acertaram. O impostor vence se escapou ou se adivinhou a palavra (regra da casa).

## 3. Escopo

**Dentro do protótipo**

- Tela de configuração: jogadores, número de impostores, temas e dica para o impostor.
- Revelação individual passando o celular.
- Sorteio animado de quem começa.
- Revelação final e nova rodada.
- Configurações salvas no aparelho.
- Banco com 11 temas.
- Testes automáticos das regras e do banco de palavras.
- Servidor local para testar no PC e no celular.

**Fora do protótipo (futuro)**

- Deploy no GitHub Pages (próxima etapa).
- Votação dentro do app, placar e cronômetro.
- Temas personalizados.
- PWA/offline e manter a tela acesa.
- Sons e vibração.

## 4. Telas e fluxo

```
Configuração → Passe o celular (jogador i) → Revelação (jogador i) → … → Quem começa → Resultado
     ↑                                                                                  │
     └───────────────────────────── Nova rodada / Configurações ←───────────────────────┘
```

Todas as telas ficam numa única página (`index.html`). Só uma tela aparece por vez.

### 4.1 Configuração (tela inicial)

- **Jogadores**
  - Lista de campos de nome (máx. 20 caracteres), cada um com botão de remover (×).
  - Botão **"+ Adicionar jogador"**. Um novo jogador recebe o nome padrão `Jogador N`; se esse nome já existir, N é incrementado até ficar único.
  - Limites: mínimo **3** jogadores (o × fica desativado) e máximo **20** (o adicionar fica desativado).
  - A ordem da lista é a ordem em que o celular passa. Não há reordenação no protótipo.
- **Impostores:** contador com − e + e o texto "Recomendado: X".
  - Mínimo 1; máximo `floor((jogadores − 1) / 2)`, para que os impostores sejam sempre minoria.
  - Recomendado: 3–6 jogadores → 1; 7–12 → 2; 13–20 → 3.
  - Se o máximo cair abaixo do valor escolhido (porque um jogador foi removido), o valor é ajustado para o máximo. Fora isso, o valor escolhido é mantido.
- **Temas**
  - Botões de marcar, agrupados por pacote: Clássicos, Cultura pop e Esportes.
  - Um botão **"Todos"** marca tudo. Se tudo já estiver marcado, ele desmarca tudo.
- **Dica para o impostor:** interruptor (padrão: ligado). Texto de apoio: "O impostor recebe uma palavra relacionada para ajudar a disfarçar."
- **Validação** (mensagens visíveis na tela; o botão Começar fica desativado enquanto houver erro):
  - nenhum tema marcado → "Escolha pelo menos 1 tema";
  - nomes repetidos (comparados sem diferenciar maiúsculas e acentos, após remover espaços) → "Nomes repetidos: Ana".
- **Botões:** **Começar** (principal) e **Como jogar**, que abre uma janela com as regras resumidas.
- **Nomes vazios:** ao começar, um nome vazio vira `Jogador {posição}`. A verificação de repetidos é feita sobre os nomes já ajustados.
- **Primeira abertura (sem nada salvo):** 4 jogadores (`Jogador 1` a `Jogador 4`), 1 impostor, todos os temas marcados e dica ligada.

### 4.2 Passe o celular

- Barra superior com o progresso (`1 / 6`) e um **X** para sair da rodada.
- Texto "Passe o celular para", o **nome** em destaque e a orientação: "Só você pode ver! Toque em Revelar quando estiver com o celular."
- Botão **Revelar**.

### 4.3 Revelação

- **Jogador comum:** "Tema: Comidas", "Sua palavra é" e a **PALAVRA** gigante, em verde-água.
- **Impostor:** "Você é o" e **IMPOSTOR** gigante, em vermelho, seguido de "Tema: Comidas". Com a dica ligada, aparece também "Sua dica: **Queijo**" e o texto "Use a dica para se disfarçar".
- Botão **Esconder e passar**, ou **Esconder e continuar** para o último jogador. Ele leva à tela 4.2 do próximo jogador ou, depois do último, à tela 4.4.

### 4.4 Quem começa

- Título "Todos já viram!".
- Animação de sorteio: os nomes se alternam cada vez mais devagar, por cerca de 2,5 s, e param em **"{Nome} começa!"**. Com `prefers-reduced-motion`, o resultado aparece direto.
- Lembrete das regras:
  - "Cada um fala 1 palavra sobre a palavra secreta, em sentido horário."
  - "Deem 1 ou 2 voltas, depois discutam e votem em quem é o impostor."
- Botão **Revelar impostor**, que abre uma confirmação: "Todos já votaram? Isso mostra quem era o impostor e a palavra." [Cancelar] [Revelar].

### 4.5 Resultado

- "O impostor era" (ou "Os impostores eram") e os nomes, em vermelho.
- "A palavra era" e a **PALAVRA**, em verde-água, seguida de "Tema: X".
- Com a dica ligada, mostra a dica de cada impostor (ex.: "Carla — Queijo").
- Botões:
  - **Nova rodada**: mesmos jogadores e opções; nova palavra, novos impostores e novo sorteio; recomeça do primeiro jogador da lista.
  - **Configurações**: volta à tela 4.1.

### 4.6 Sair da rodada

- O **X** (telas 4.2 a 4.5) abre a confirmação "Sair da rodada? A rodada atual será perdida." [Continuar jogando] [Sair]. Sair volta para a configuração.
- O **botão voltar do sistema/navegador** durante a rodada abre a mesma confirmação, em vez de sair do site. Na tela de configuração, o voltar se comporta normalmente.
- Recarregar a página no meio da rodada volta para a configuração. O estado da rodada não é salvo.

## 5. Regras de sorteio (lógica)

- **Palavra:** sorteia um tema, com chance igual entre os temas marcados, e depois uma palavra desse tema que ainda não foi usada. Quando todas as palavras de um tema já foram usadas, só as palavras daquele tema voltam a ficar disponíveis. O registro de palavras usadas fica salvo no aparelho.
- **Impostores:** `k` jogadores distintos, sorteados com chance igual (Fisher–Yates). Um impostor **não sabe** quem são os outros.
- **Dicas:**
  - Com a dica ligada, as dicas da palavra (3 no banco) são embaralhadas e o impostor `i` (na ordem do sorteio) recebe `dicas[i % dicas.length]`.
  - Com até 3 impostores, que é o recomendado para até 20 jogadores, as dicas são sempre diferentes.
  - Com a dica desligada, ninguém recebe dica.
- **Tema:** é mostrado para **todos**, comuns e impostores.
- **Quem começa:** sorteado com chance igual entre **todos** os jogadores, inclusive impostores. É definido ao criar a rodada e só é exibido na tela 4.4.
- **Aleatoriedade:** as funções de sorteio recebem um gerador `rng` opcional (padrão `Math.random`), para permitir testes determinísticos com semente.

## 6. Arquitetura

HTML + CSS + JavaScript puro com **ES modules**, sem build e sem dependências.

```
index.html            página única com todas as telas (<section data-screen="…">)
favicon.svg           ícone
css/style.css         estilos mobile-first
js/words.js           banco de palavras (dados)
js/game.js            regras puras: limites, validação, configurações, sorteios (sem DOM)
js/storage.js         leitura/escrita no localStorage, protegida contra falhas
js/app.js             estado das telas, renderização, eventos, animação, proteção do voltar
tests/game.test.js    testes das regras
tests/words.test.js   validação do banco de palavras
scripts/serve.mjs     servidor estático local (só módulos nativos do Node)
package.json          "type": "module"; scripts start/test; zero dependências
.nojekyll             o GitHub Pages serve os arquivos como estão
README.md             como rodar, testar, jogar no celular e publicar
```

### 6.1 Interfaces

**`js/words.js`**
```js
export const PACKS = [
  { id: 'classicos', name: 'Clássicos', themes: [
    { id: 'comidas', name: 'Comidas', words: [
      { word: 'Pizza', hints: ['Queijo', 'Forno', 'Fatia'] },
      // …
    ] },
  ] },
];
export const THEMES; // lista plana de todos os temas (derivada de PACKS)
```
- Pacotes e temas:
  - `classicos`: `comidas` (Comidas), `animais` (Animais), `objetos` (Objetos), `lugares` (Lugares), `profissoes` (Profissões).
  - `cultura-pop`: `filmes-series` (Filmes e Séries), `personagens` (Personagens), `famosos` (Famosos), `marcas` (Marcas).
  - `esportes`: `esportes` (Esportes), `futebol` (Futebol).
- **25 palavras por tema** (275 no total) e **exatamente 3 dicas por palavra**.
- O identificador de uma palavra é `"{themeId}/{word}"`.
- **Qualidade das dicas:**
  - têm relação com a palavra, mas não a entregam;
  - não contêm a palavra nem são variações dela (para "Pizza", não vale "Pizzaria");
  - não são o nome do tema;
  - de preferência uma palavra só, no máximo duas;
  - ideal: dicas que serviriam para outras palavras do mesmo tema ("Queijo" serve para pizza, lasanha, sanduíche…).
- Palavras são únicas no banco inteiro (comparação sem diferenciar maiúsculas e acentos). Dicas podem se repetir entre palavras diferentes.

**`js/game.js`** (funções puras, sem DOM)
```js
export const MIN_PLAYERS = 3, MAX_PLAYERS = 20, MAX_NAME_LENGTH = 20;
export function maxImpostors(playerCount)           // max(1, floor((n-1)/2))
export function recommendedImpostors(playerCount)   // ≤6→1, ≤12→2, senão 3 (limitado pelo máximo)
export function clampImpostors(count, playerCount)  // limita a [1, maxImpostors(n)]
export function nextDefaultName(names)              // "Jogador N" único
export function normalizePlayers(names)             // trim + vazio → "Jogador {posição}"
export function findDuplicateNames(names)           // nomes repetidos (sem diferenciar maiúsculas/acentos)
export function defaultSettings(allThemeIds)
export function sanitizeSettings(raw, allThemeIds)  // corrige dados salvos inválidos ou antigos
export function pickWord(themes, selectedThemeIds, usedWordIds, rng)
  // → { theme, entry, wordId, usedWordIds }   (não altera os parâmetros recebidos)
export function createRound({ players, impostorCount, themes, selectedThemeIds, hintsEnabled, usedWordIds }, rng)
  // → { round, usedWordIds }
  // round = { players: string[], themeId, themeName, word,
  //           impostors: number[], hints: { [índiceDoJogador]: string }, starter: number }
```
- `sanitizeSettings`:
  - descarta temas que não existem e, se não sobrar nenhum, marca todos;
  - completa ou corta a lista para ficar entre 3 e 20 jogadores e limita cada nome a 20 caracteres;
  - limita o número de impostores ao máximo permitido;
  - trata `hints` não booleano como `true`;
  - com entrada inválida ou ausente, usa `defaultSettings`.

**`js/storage.js`**
```js
export function loadJSON(key, fallback)  // try/catch; JSON inválido → fallback
export function saveJSON(key, value)     // try/catch; falha é ignorada (modo privado/cota)
```
- Chaves: `impostor:settings:v1` → `{ players, impostors, themeIds, hints }`, e `impostor:used-words:v1` → `string[]`.

**`js/app.js`**
- Guarda o estado (`settings`, `round`, `screen`, `currentPlayer`) e mostra a tela atual (atributo `hidden` nas seções).
- Salva as configurações a cada alteração e o registro de palavras usadas a cada rodada criada.
- Diálogos (Como jogar, Revelar impostor, Sair) usam o elemento nativo `<dialog>`.
- A proteção do voltar usa `history.pushState` ao entrar na rodada e trata o `popstate`.

### 6.2 Compatibilidade com o GitHub Pages

- Somente arquivos estáticos e **caminhos relativos** (`css/style.css`, `js/app.js`), porque o site vai ficar em `https://<usuário>.github.io/<repositório>/`.
- Nomes de arquivos e pastas em **minúsculas**, porque o Pages diferencia maiúsculas e minúsculas e o Windows não.
- `.nojekyll` na raiz.
- Nenhum recurso externo (fontes do sistema), então nada depende de CDN.
- ES modules exigem servidor HTTP e não funcionam abrindo o arquivo com dois cliques. Localmente usamos `npm start`; o Pages já é um servidor HTTP.

## 7. Visual e responsividade

- **Tema escuro "mistério":**
  - fundo quase preto arroxeado e superfícies um pouco mais claras;
  - primária roxa nos botões; vermelho para impostor; verde-água para a palavra;
  - contraste mínimo AA.
- **Mobile-first:**
  - coluna única com `max-width: 480px`, centralizada no PC;
  - `min-height: 100dvh`;
  - margens com `env(safe-area-inset-*)` (entalhe do iPhone);
  - ação principal fixa na parte de baixo da tela, perto do polegar.
- **Palavra gigante:** `font-size: clamp(…)` proporcional à largura; palavras longas quebram (`overflow-wrap: anywhere`).
- **Toque:**
  - botões com no mínimo 48 px de altura;
  - `touch-action: manipulation` (sem zoom por toque duplo);
  - sem destaque azul de toque;
  - `user-select: none` nas telas de jogo;
  - campos de texto com fonte de 16 px (evita o zoom automático do iOS).
- **Meta tags:**
  - `viewport` com `viewport-fit=cover`;
  - `theme-color` escuro;
  - `lang="pt-BR"`.
- **Acessibilidade:**
  - elementos `<button>` reais;
  - `aria-pressed` nos temas;
  - `aria-live` no resultado do sorteio;
  - respeito a `prefers-reduced-motion`.
- **Tamanhos verificados:** 360×640, 390×844, 768×1024 e desktop.

## 8. Tratamento de erros e casos de borda

| Situação | Comportamento |
|---|---|
| localStorage indisponível (modo privado, cota) | O jogo funciona normalmente, só não salva nada |
| Dados salvos corrompidos ou antigos | `sanitizeSettings` corrige; sem conserto possível, usa o padrão |
| Tema salvo que não existe mais | É descartado; sem nenhum tema válido, marca todos |
| Todas as palavras de um tema usadas | As palavras daquele tema voltam a ficar disponíveis |
| Mais impostores que dicas (mais de 3) | As dicas se repetem de forma circular |
| Nome muito longo | Limite de 20 caracteres no campo; na tela, quebra de linha |
| Remover jogador abaixo do mínimo | O botão × fica desativado com 3 jogadores |
| Voltar do sistema no meio da rodada | Abre a confirmação de saída |

## 9. Testes

**Automáticos (`npm test` → `node --test`), com gerador aleatório de semente fixa:**

- `maxImpostors` e `recommendedImpostors` para n = 3, 4, 5, 6, 7, 12, 13 e 20; `clampImpostors` nos limites.
- `nextDefaultName` evita nomes existentes; `normalizePlayers` faz trim e preenche nomes vazios; `findDuplicateNames` ignora maiúsculas e acentos.
- `sanitizeSettings`: entrada nula, tipos errados, tema inexistente, jogadores fora dos limites e impostores acima do máximo.
- `pickWord`: a palavra sempre vem de um tema marcado; não repete até esgotar o tema; ao esgotar, só aquele tema é reiniciado; não altera os parâmetros recebidos.
- `createRound`:
  - número exato de impostores, sem repetição e com índices válidos;
  - dicas diferentes para até 3 impostores, todas da lista da palavra;
  - nenhuma dica com a opção desligada;
  - `starter` sempre válido;
  - a distribuição de `starter` e de impostores é razoavelmente uniforme em muitas rodadas.
- **Banco de palavras:**
  - 11 temas nos 3 pacotes, com os ids esperados;
  - pelo menos 25 palavras por tema e exatamente 3 dicas por palavra;
  - nenhum texto vazio;
  - palavras únicas no banco inteiro (sem diferenciar maiúsculas e acentos);
  - dicas sem repetição dentro de uma mesma palavra;
  - nenhuma dica contém a palavra, e a palavra não contém nenhuma dica de 4 ou mais letras (comparação sem acentos e sem diferenciar maiúsculas).

**No navegador:**

- Rodar `npm start` e verificar nos tamanhos da seção 7.
- Jogar rodadas completas com 3, 6 e 10 jogadores, com a dica ligada e desligada.
- Conferir que as configurações persistem após recarregar a página.
- Conferir a confirmação do X e do voltar.
- Teste final do usuário no celular, pela rede Wi-Fi local.

## 10. Servidor local (`scripts/serve.mjs`)

- Somente módulos nativos do Node (`http`, `fs`, `path`, `os`, `url`).
- Serve a raiz do projeto; `/` → `index.html`.
- Tipos MIME corretos (`.js` → `text/javascript`).
- Bloqueia caminhos fora da raiz e responde 404 para arquivos que não existem.
- `Cache-Control: no-store`, para nunca mostrar arquivos desatualizados durante o desenvolvimento.
- Porta `PORT` (padrão 8080), escutando em `0.0.0.0`.
- Ao iniciar, mostra os endereços para o PC (`http://localhost:8080`) e para o celular (`http://<IP-da-rede>:8080`).
- O README explica a permissão do Firewall do Windows na primeira execução.

## 11. Deploy no GitHub Pages (etapa futura, só referência)

1. Criar um repositório no GitHub e enviar a branch `main`.
2. Em Settings → Pages, escolher "Deploy from a branch", com a branch `main` e a pasta `/ (root)`.
3. O site fica em `https://<usuário>.github.io/<repositório>/`. Não precisa de build nem de workflow.
