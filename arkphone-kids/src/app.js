import { TRUST, cards, defaultSupplies } from './data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ── Persistent state ──────────────────────────────────────────────────────────

const state = {
  supplies: JSON.parse(localStorage.getItem('arkphone_supplies_v02') || 'null')
    || defaultSupplies.map((text, i) => ({ id: 's' + i, text, checked: false })),
  openCards: JSON.parse(localStorage.getItem('arkphone_open_cards_v02') || '{}')
};

function saveSupplies() {
  localStorage.setItem('arkphone_supplies_v02', JSON.stringify(state.supplies));
}

function saveOpenCards() {
  localStorage.setItem('arkphone_open_cards_v02', JSON.stringify(state.openCards));
}

// ── Trust chip HTML ───────────────────────────────────────────────────────────

function chipHtml(label) {
  const css = TRUST[label] || 'trust-unverified';
  const display = label.replace(/_/g, ' ');
  return `<span class="chip ${css}">${display}</span>`;
}

// ── Quick grid ────────────────────────────────────────────────────────────────

function renderQuickGrid() {
  $('#quickGrid').innerHTML = cards.map(card => `
    <button class="quick-btn" type="button" data-jump="${card.id}">
      <span class="emoji" aria-hidden="true">${card.icon}</span>
      <span class="quick-label">${card.short}</span>
    </button>
  `).join('');

  $$('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => jumpToCard(btn.dataset.jump));
  });
}

// ── Card list ─────────────────────────────────────────────────────────────────

function renderCards() {
  $('#cardList').innerHTML = cards.map(card => {
    const open = state.openCards[card.id] ? 'open' : '';
    const searchData = (card.title + ' ' + card.keywords + ' ' + card.situation).toLowerCase();
    return `
      <article class="card ${open}" id="${card.id}" data-search="${searchData}">
        <div class="card-head">
          <div class="card-title-row">
            <h3>${card.icon} ${card.title}</h3>
            <span class="readiness ${card.readiness}">${card.readinessText}</span>
          </div>
          <div class="chips">
            ${card.trustLabels.map(chipHtml).join('')}
            <span class="chip">Human review required</span>
          </div>
        </div>

        <div class="card-body">
          <div class="field">
            <div class="label">Immediate danger</div>
            <div class="danger">${card.danger}</div>
          </div>

          <div class="field">
            <div class="label">First 5 actions</div>
            <ol class="actions">${card.first5.map(x => `<li>${x}</li>`).join('')}</ol>
          </div>

          <div class="family-box" aria-hidden="${document.body.classList.contains('family') ? 'false' : 'true'}">
            <div class="label">Family mode — simpler wording</div>
            <div>${card.family}</div>
          </div>

          <button class="open-btn" type="button" data-card-id="${card.id}" aria-expanded="${open ? 'true' : 'false'}">
            ${open ? 'Hide full card ▲' : 'Open full card ▼'}
          </button>

          <div class="details" aria-hidden="${open ? 'false' : 'true'}">
            <div class="field">
              <div class="label">Situation</div>
              <div>${card.situation}</div>
            </div>
            <div class="field">
              <div class="label">What not to do</div>
              <div class="not-do">${card.notDo}</div>
            </div>
            <div class="field">
              <div class="label">Supplies needed</div>
              <div>${card.supplies}</div>
            </div>
            <div class="field">
              <div class="label">When to call emergency services</div>
              <div>${card.callEmergency}</div>
            </div>
            <div class="field">
              <div class="label">Source manifest</div>
              <ul class="source-list">${card.sources.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
          </div>
        </div>

        <div class="card-foot">
          <span>Confidence: ${card.confidence}</span>
          <span>Last reviewed: ${card.reviewed}</span>
        </div>
      </article>
    `;
  }).join('');

  $$('.open-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleCard(btn.dataset.cardId));
  });

  filterCards();
}

// ── Supply checklist ──────────────────────────────────────────────────────────

function renderSupplies() {
  const container = $('#checkItems');
  container.innerHTML = state.supplies.map(item => `
    <label class="check ${item.checked ? 'done' : ''}">
      <input type="checkbox" ${item.checked ? 'checked' : ''} data-supply-id="${item.id}" />
      <span>${item.text}</span>
    </label>
  `).join('');

  $$('input[data-supply-id]').forEach(input => {
    input.addEventListener('change', () => toggleSupply(input.dataset.supplyId));
  });

  const checked = state.supplies.filter(x => x.checked).length;
  const total = state.supplies.length || 1;
  const pct = Math.round((checked / total) * 100);
  $('#progressFill').style.width = pct + '%';
  $('#supplyCount').textContent = `${checked}/${state.supplies.length} checked`;
}

function toggleSupply(id) {
  const item = state.supplies.find(x => x.id === id);
  if (!item) return;
  item.checked = !item.checked;
  saveSupplies();
  renderSupplies();
}

function addSupply() {
  const input = $('#customSupply');
  const text = input.value.trim();
  if (!text) return;
  state.supplies.push({ id: 'custom-' + Date.now(), text, checked: false });
  input.value = '';
  saveSupplies();
  renderSupplies();
}

// ── Card open/close ───────────────────────────────────────────────────────────

function toggleCard(id) {
  state.openCards[id] = !state.openCards[id];
  saveOpenCards();
  renderCards();
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function jumpToCard(id) {
  state.openCards[id] = true;
  saveOpenCards();
  renderCards();
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ── Search / filter ───────────────────────────────────────────────────────────

function filterCards() {
  const term = $('#searchInput').value.trim().toLowerCase();
  let visible = 0;
  $$('.card').forEach(card => {
    const show = !term || term.split(/\s+/).filter(Boolean).every(tok => card.dataset.search.includes(tok));
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  $('#visibleCount').textContent = `${visible}/${cards.length} visible`;
  $('#emptyState').classList.toggle('show', visible === 0);
}

// ── Family mode ───────────────────────────────────────────────────────────────

function setFamilyMode(on) {
  document.body.classList.toggle('family', on);
  $('#familyButton').setAttribute('aria-pressed', String(on));
  $$('.family-box').forEach(el => el.setAttribute('aria-hidden', on ? 'false' : 'true'));
  localStorage.setItem('arkphone_family_mode_v02', on ? '1' : '0');
}

// ── Network status ────────────────────────────────────────────────────────────

function updateNetworkStatus() {
  const online = navigator.onLine;
  const badge = $('#networkBadge');
  badge.classList.toggle('online', online);
  badge.classList.toggle('offline', !online);
  $('#networkText').textContent = online ? 'Network online' : 'Network offline';
}

// ── PWA install prompt ────────────────────────────────────────────────────────

let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  $('#installPrompt').classList.add('show');
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  $('#installPrompt').classList.remove('show');
});

$('#installBtn').addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  if (outcome === 'accepted') {
    deferredInstallPrompt = null;
    $('#installPrompt').classList.remove('show');
  }
});

$('#installDismiss').addEventListener('click', () => {
  $('#installPrompt').classList.remove('show');
  sessionStorage.setItem('arkphone_install_dismissed', '1');
});

// ── Event listeners ───────────────────────────────────────────────────────────

$('#searchInput').addEventListener('input', filterCards);
$('#familyButton').addEventListener('click', () => {
  setFamilyMode(!document.body.classList.contains('family'));
});
$('#addSupplyBtn').addEventListener('click', addSupply);
$('#customSupply').addEventListener('keydown', e => {
  if (e.key === 'Enter') addSupply();
});
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// ── Init ──────────────────────────────────────────────────────────────────────

renderQuickGrid();
renderCards();
renderSupplies();
setFamilyMode(localStorage.getItem('arkphone_family_mode_v02') === '1');
updateNetworkStatus();
