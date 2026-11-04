(function initTheme() {
  const saved = localStorage.getItem('cl-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('cl-theme', next);
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.innerHTML = isDark 
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
}

function toggleMobileMenu() {
  document.querySelector('.nav-links')?.classList.toggle('open');
}

function toast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' error' : '');
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'all 0.3s ease';
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

function fmtUSD(n, decimals = 2) {
  return '$' + Number(n).toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
function fmtCompact(n) {
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + ' трлн';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + ' млрд';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + ' млн';
  return '$' + n.toLocaleString('ru-RU');
}
function fmtPct(n) {
  const sign = n >= 0 ? '+' : '';
  return sign + n.toFixed(2) + '%';
}

function markActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

function showNotifications() {
  const notes = [
    'Цена BTC достигла $67,500 (демо)',
    'Новое P2P-предложение соответствует вашим фильтрам',
    'Ваш демо-обмен успешно завершен',
    'Совет по безопасности: включите 2FA для аккаунта'
  ];
  
  let html = '<h3 style="margin-bottom:16px">Уведомления</h3>';
  notes.forEach(n => {
    html += `<div style="padding:14px 0;border-bottom:1px solid var(--border);font-size:0.9rem;color:var(--text-2);display:flex;align-items:center;gap:12px">
      <div style="width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0"></div>
      ${n}
    </div>`;
  });
  openModal(html);
}

function openModal(contentHtml) {
  let overlay = document.querySelector('.modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal"></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('show');
    });
  }
  overlay.querySelector('.modal').innerHTML = contentHtml;
  overlay.classList.add('show');
}
function closeModal() {
  document.querySelector('.modal-overlay')?.classList.remove('show');
}

function openSearch() {
  openModal(`
    <h3>Поиск по CRYPTOLINK</h3>
    <div class="field">
      <input class="input" id="global-search" placeholder="Поиск монет, страниц, статей..." autofocus>
    </div>
    <div id="search-results" style="font-size:0.88rem;color:var(--text-2)"></div>
    <button class="btn btn-secondary btn-sm" style="margin-top:16px" onclick="closeModal()">Закрыть</button>
  `);
  const input = document.getElementById('global-search');
  const results = document.getElementById('search-results');
  const items = [
    { name: 'Bitcoin (BTC)', url: 'analytics.html' },
    { name: 'Ethereum (ETH)', url: 'analytics.html' },
    { name: 'P2P Маркет', url: 'p2p.html' },
    { name: 'Криптообменник', url: 'exchange.html' },
    { name: 'Сканер арбитража', url: 'arbitrage.html' },
    { name: 'Что такое криптовалюта?', url: 'education.html' },
    { name: 'Гид по стейблкоину USDT', url: 'education.html' },
    { name: 'Профиль и настройки', url: 'profile.html' }
  ];
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    const found = items.filter(i => i.name.toLowerCase().includes(q));
    results.innerHTML = found.length
      ? found.map(i => `<a href="${i.url}" style="display:block;padding:10px 0;border-bottom:1px solid var(--border);color:var(--green)">${i.name}</a>`).join('')
      : '<div style="padding:10px 0;color:var(--text-3)">Ничего не найдено</div>';
  });
  input.dispatchEvent(new Event('input'));
}

document.addEventListener('DOMContentLoaded', () => {
  markActiveNav();
  updateThemeIcon();
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', toggleTheme);
  document.querySelector('[data-mobile-toggle]')?.addEventListener('click', toggleMobileMenu);
  document.querySelectorAll('[data-search]').forEach(b => b.addEventListener('click', openSearch));
  document.querySelectorAll('[data-notifications]').forEach(b => b.addEventListener('click', showNotifications));
});