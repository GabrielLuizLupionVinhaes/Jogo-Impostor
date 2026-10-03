// Interface do Jogo do Impostor: telas, eventos e animações.
// As regras ficam em game.js; aqui só mostramos a tela certa e reagimos aos toques.

import { PACKS, THEMES } from './words.js';
import {
  MIN_PLAYERS,
  MAX_PLAYERS,
  MAX_NAME_LENGTH,
  maxImpostors,
  recommendedImpostors,
  clampImpostors,
  nextDefaultName,
  normalizePlayers,
  findDuplicateNames,
  sanitizeSettings,
  createRound,
} from './game.js';
import { loadJSON, saveJSON } from './storage.js';

const SETTINGS_KEY = 'impostor:settings:v1';
const USED_WORDS_KEY = 'impostor:used-words:v1';
const ALL_THEME_IDS = THEMES.map((theme) => theme.id);
const TAP_GUARD_MS = 600;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = {
  settings: sanitizeSettings(loadJSON(SETTINGS_KEY, null), ALL_THEME_IDS),
  usedWordIds: loadUsedWords(),
  screen: 'setup',
  round: null,
  current: 0, // índice do jogador que está com o celular
};

function loadUsedWords() {
  const ids = loadJSON(USED_WORDS_KEY, []);
  return Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : [];
}

function saveSettings() {
  saveJSON(SETTINGS_KEY, state.settings);
}

// ---------- Utilidades de tela ----------

let screenShownAt = 0;

function showScreen(name) {
  state.screen = name;
  for (const section of $$('[data-screen]')) section.hidden = section.dataset.screen !== name;
  document.activeElement?.blur?.();
  window.scrollTo(0, 0);
  screenShownAt = performance.now();
}

/** true logo depois de uma troca de tela: um toque duplo não pode pular etapas. */
function tooSoon() {
  return performance.now() - screenShownAt < TAP_GUARD_MS;
}

/** Texto gigante que sempre cabe: --len recebe o tamanho do maior trecho (ver style.css). */
function setBigText(element, text) {
  element.textContent = text;
  const longest = Math.max(1, ...text.split(/[\s-]+/).map((part) => part.length));
  element.style.setProperty('--len', String(longest));
}

/**
 * Abre um diálogo e chama onConfirm se a pessoa tocar no botão value="confirm".
 * Sem suporte a <dialog> (iOS < 15.4), usa window.confirm com o texto de data-fallback.
 */
function openDialog(dialog, onConfirm = () => {}) {
  if (typeof dialog.showModal !== 'function') {
    if (window.confirm(dialog.dataset.fallback)) onConfirm();
    return;
  }
  if (dialog.open) return;
  dialog.returnValue = '';
  dialog.addEventListener(
    'close',
    () => {
      if (dialog.returnValue === 'confirm') onConfirm();
    },
    { once: true },
  );
  dialog.showModal();
}

// ---------- Configuração ----------

function renderSetup() {
  renderPlayers();
  renderImpostors();
  renderThemes();
  $('#hints-toggle').checked = state.settings.hints;
  renderSetupErrors();
}

function renderPlayers() {
  const { players } = state.settings;
  $('#player-list').replaceChildren(...players.map(playerRow));
  $('#player-count').textContent = String(players.length);
  $('#add-player').disabled = players.length >= MAX_PLAYERS;
}

function playerRow(name, index) {
  const item = document.createElement('li');
  item.className = 'player-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'player-input';
  input.value = name;
  input.placeholder = `Jogador ${index + 1}`;
  input.maxLength = MAX_NAME_LENGTH;
  input.dataset.index = String(index);
  input.setAttribute('aria-label', `Nome do jogador ${index + 1}`);
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocapitalize', 'words');
  input.setAttribute('spellcheck', 'false');
  input.setAttribute('enterkeyhint', 'next');

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'icon-btn remove-player';
  remove.dataset.index = String(index);
  remove.textContent = '✕';
  remove.setAttribute('aria-label', `Remover jogador ${index + 1}`);
  remove.disabled = state.settings.players.length <= MIN_PLAYERS;

  item.append(input, remove);
  return item;
}

function renderImpostors() {
  const playerCount = state.settings.players.length;
  const { impostors } = state.settings;
  $('#impostors-value').textContent = String(impostors);
  $('#impostors-minus').disabled = impostors <= 1;
  $('#impostors-plus').disabled = impostors >= maxImpostors(playerCount);
  $('#impostors-hint').textContent = `Recomendado para ${playerCount} jogadores: ${recommendedImpostors(playerCount)}`;
}

function buildThemeChips() {
  $('#theme-groups').replaceChildren(
    ...PACKS.map((pack) => {
      const group = document.createElement('div');
      group.className = 'theme-group';
      const title = document.createElement('h3');
      title.className = 'theme-group-title';
      title.textContent = pack.name;
      const chips = document.createElement('div');
      chips.className = 'chips';
      for (const theme of pack.themes) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.dataset.themeId = theme.id;
        chip.textContent = theme.name;
        chips.append(chip);
      }
      group.append(title, chips);
      return group;
    }),
  );
}

function renderThemes() {
  if (!$('#theme-groups').hasChildNodes()) buildThemeChips();
  const selected = new Set(state.settings.themeIds);
  for (const chip of $$('.chip')) chip.setAttribute('aria-pressed', String(selected.has(chip.dataset.themeId)));
  $('#toggle-all-themes').textContent = selected.size === ALL_THEME_IDS.length ? 'Limpar' : 'Todos';
}

function setupErrors() {
  const errors = [];
  if (state.settings.themeIds.length === 0) errors.push('Escolha pelo menos 1 tema.');
  const duplicates = findDuplicateNames(normalizePlayers(state.settings.players));
  if (duplicates.length > 0) errors.push(`Nomes repetidos: ${duplicates.join(', ')}.`);
  return errors;
}

function renderSetupErrors() {
  const errors = setupErrors();
  $('#setup-error').textContent = errors.join(' ');
  $('#setup-error').hidden = errors.length === 0;
  $('#start-game').disabled = errors.length > 0;
}

function changeImpostors(delta) {
  const { settings } = state;
  settings.impostors = clampImpostors(settings.impostors + delta, settings.players.length);
  saveSettings();
  renderImpostors();
}

/** Com o teclado aberto (a área visível encolhe), esconde o rodapé para não cobrir os nomes. */
function updateTyping() {
  const typing =
    document.activeElement?.classList.contains('player-input') &&
    window.visualViewport !== undefined &&
    window.visualViewport.height < window.innerHeight - 120;
  $('[data-screen="setup"]').classList.toggle('is-typing', Boolean(typing));
}

$('#player-list').addEventListener('input', (event) => {
  const input = event.target.closest('.player-input');
  if (!input) return;
  state.settings.players[Number(input.dataset.index)] = input.value;
  saveSettings();
  renderSetupErrors();
});

$('#player-list').addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || !event.target.classList.contains('player-input')) return;
  event.preventDefault();
  const inputs = $$('.player-input');
  const next = inputs[inputs.indexOf(event.target) + 1];
  if (next) next.focus();
  else event.target.blur();
});

$('#player-list').addEventListener('click', (event) => {
  const button = event.target.closest('.remove-player');
  if (!button || button.disabled) return;
  const { settings } = state;
  settings.players.splice(Number(button.dataset.index), 1);
  settings.impostors = clampImpostors(settings.impostors, settings.players.length);
  saveSettings();
  renderSetup();
});

$('#add-player').addEventListener('click', () => {
  const { settings } = state;
  if (settings.players.length >= MAX_PLAYERS) return;
  settings.players.push(nextDefaultName(settings.players));
  saveSettings();
  renderSetup();
  const inputs = $$('.player-input');
  inputs[inputs.length - 1].focus();
  inputs[inputs.length - 1].select();
});

$('#impostors-minus').addEventListener('click', () => changeImpostors(-1));
$('#impostors-plus').addEventListener('click', () => changeImpostors(1));

$('#theme-groups').addEventListener('click', (event) => {
  const chip = event.target.closest('.chip');
  if (!chip) return;
  const selected = new Set(state.settings.themeIds);
  if (selected.has(chip.dataset.themeId)) selected.delete(chip.dataset.themeId);
  else selected.add(chip.dataset.themeId);
  state.settings.themeIds = ALL_THEME_IDS.filter((id) => selected.has(id));
  saveSettings();
  renderThemes();
  renderSetupErrors();
});

$('#toggle-all-themes').addEventListener('click', () => {
  const allSelected = state.settings.themeIds.length === ALL_THEME_IDS.length;
  state.settings.themeIds = allSelected ? [] : [...ALL_THEME_IDS];
  saveSettings();
  renderThemes();
  renderSetupErrors();
});

$('#hints-toggle').addEventListener('change', (event) => {
  state.settings.hints = event.target.checked;
  saveSettings();
});

$('#open-rules').addEventListener('click', () => openDialog($('#rules-dialog')));

const setupSection = $('[data-screen="setup"]');
setupSection.addEventListener('focusin', updateTyping);
setupSection.addEventListener('focusout', () => setTimeout(updateTyping, 0));
window.visualViewport?.addEventListener('resize', updateTyping);

// ---------- Rodada ----------

let historyGuard = false; // há uma entrada extra no histórico para segurar o "voltar"
let drawTimer = 0;

function startRound() {
  const { settings } = state;
  const { round, usedWordIds } = createRound({
    players: settings.players,
    impostorCount: settings.impostors,
    themes: THEMES,
    selectedThemeIds: settings.themeIds,
    hintsEnabled: settings.hints,
    usedWordIds: state.usedWordIds,
  });
  cancelDraw();
  clearReveal();
  clearResult();
  state.round = round;
  state.usedWordIds = usedWordIds;
  state.current = 0;
  saveJSON(USED_WORDS_KEY, usedWordIds);
  for (const element of $$('[data-theme-name]')) element.textContent = round.themeName;
  showPass();
}

function showPass() {
  const { round, current } = state;
  for (const element of $$('[data-progress]')) element.textContent = `${current + 1} / ${round.players.length}`;
  setBigText($('#pass-name'), round.players[current]);
  showScreen('pass');
}

function showReveal() {
  const { round, current } = state;
  const isImpostor = round.impostors.includes(current);
  // Preenche e mostra no mesmo passo: nunca aparece o conteúdo do jogador anterior.
  if (isImpostor) {
    const hint = round.hints[current];
    $('#impostor-hint').textContent = hint ?? '';
    $('#impostor-hint-box').hidden = !hint;
  } else {
    setBigText($('#reveal-word'), round.word);
  }
  $('#reveal-crew').hidden = isImpostor;
  $('#reveal-impostor').hidden = !isImpostor;
  $('#hide-btn').textContent = current === round.players.length - 1 ? 'Esconder e continuar' : 'Esconder e passar';
  showScreen('reveal');
}

/** Apaga o segredo da tela de revelação. */
function clearReveal() {
  $('#reveal-crew').hidden = true;
  $('#reveal-impostor').hidden = true;
  $('#reveal-word').textContent = '';
  $('#impostor-hint').textContent = '';
}

function clearResult() {
  $('#result-impostors').replaceChildren();
  $('#result-word').textContent = '';
}

function hideAndPass() {
  clearReveal();
  if (state.current < state.round.players.length - 1) {
    state.current += 1;
    showPass();
  } else {
    showStarter();
  }
}

function cancelDraw() {
  clearTimeout(drawTimer);
  drawTimer = 0;
}

/** Sorteio animado de quem começa (o resultado já veio pronto em round.starter). */
function showStarter() {
  const { round } = state;
  const nameElement = $('#starter-name');
  const revealButton = $('#open-reveal-confirm');
  $('#starter-label').hidden = true;
  $('#starter-announcement').textContent = '';
  nameElement.classList.remove('is-final');
  revealButton.disabled = true;
  showScreen('starter');

  const finish = () => {
    if (state.round !== round) return;
    drawTimer = 0;
    const name = round.players[round.starter];
    setBigText(nameElement, name);
    nameElement.classList.remove('is-drawing');
    nameElement.classList.add('is-final');
    $('#starter-label').hidden = false;
    $('#starter-announcement').textContent = `${name} começa!`;
    revealButton.disabled = false;
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    drawTimer = setTimeout(finish, 50); // um instante depois, para o leitor de tela anunciar
    return;
  }

  nameElement.classList.add('is-drawing');
  let index = Math.floor(Math.random() * round.players.length);
  let delay = 60;
  let elapsed = 0;
  const step = () => {
    if (state.round !== round) return; // saíram ou começaram outra rodada
    if (elapsed >= 2400) {
      finish();
      return;
    }
    index = (index + 1) % round.players.length;
    setBigText(nameElement, round.players[index]);
    elapsed += delay;
    delay = Math.min(delay * 1.15, 380);
    drawTimer = setTimeout(step, delay);
  };
  step();
}

function showResult() {
  cancelDraw();
  const { round } = state;
  $('#result-impostor-label').textContent = round.impostors.length > 1 ? 'Os impostores eram' : 'O impostor era';
  $('#result-impostors').replaceChildren(
    ...round.impostors.map((index) => {
      const item = document.createElement('li');
      const name = document.createElement('strong');
      name.textContent = round.players[index];
      item.append(name);
      if (round.hints[index]) {
        const hint = document.createElement('span');
        hint.className = 'impostor-hint';
        hint.textContent = `dica: ${round.hints[index]}`;
        item.append(hint);
      }
      return item;
    }),
  );
  setBigText($('#result-word'), round.word);
  showScreen('result');
}

function enterRound() {
  if (!historyGuard) {
    history.pushState({ impostorRound: true }, ''); // sempre dentro de um toque (ativação do usuário)
    historyGuard = true;
  }
  startRound();
}

function leaveRound() {
  cancelDraw();
  clearReveal();
  clearResult();
  state.round = null;
  renderSetup();
  showScreen('setup'); // troca a tela antes do history.back(): o popstate dele é ignorado
  if (historyGuard) {
    historyGuard = false;
    history.back();
  }
}

function confirmExit() {
  openDialog($('#exit-dialog'), leaveRound);
}

// "Voltar" do celular/navegador durante a rodada: pergunta antes de sair.
window.addEventListener('popstate', () => {
  if (state.screen === 'setup' || !historyGuard) return;
  historyGuard = false;
  if (state.screen === 'result') {
    leaveRound(); // rodada já terminou: nada a perder
    return;
  }
  history.pushState({ impostorRound: true }, '');
  historyGuard = true;
  confirmExit();
});

// Celular bloqueado ou troca de app com a palavra aberta: esconde e volta para "Passe o celular".
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && state.screen === 'reveal') {
    clearReveal();
    showPass();
  }
});

$('#start-game').addEventListener('click', () => {
  if (tooSoon() || setupErrors().length > 0) return;
  enterRound();
});

$('#reveal-btn').addEventListener('click', () => {
  if (!tooSoon()) showReveal();
});

$('#hide-btn').addEventListener('click', () => {
  if (!tooSoon()) hideAndPass();
});

$('#open-reveal-confirm').addEventListener('click', () => {
  if (!tooSoon()) openDialog($('#reveal-dialog'), showResult);
});

$('#new-round').addEventListener('click', () => {
  if (!tooSoon()) startRound();
});

$('#back-to-setup').addEventListener('click', leaveRound);

for (const button of $$('[data-exit]')) button.addEventListener('click', confirmExit);

// ---------- Início ----------
renderSetup();
showScreen('setup');
