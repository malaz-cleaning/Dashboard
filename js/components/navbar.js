import { auth } from '../auth.js';

export function renderNavbar(root) {
  if (!root) return;
  root.innerHTML = `
    <div class="navbar-inner">
      <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle menu">☰</button>
      <div class="navbar-title">
        <span>لوحة إدارة ملاذ</span>
      </div>
      <div class="navbar-actions">
        <button class="quick-action" id="logout-button">خروج</button>
      </div>
    </div>
  `;

  document.getElementById('logout-button')?.addEventListener('click', () => {
    auth.logout();
  });
}

function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);
  return page === '' ? 'index.html' : page;
}
