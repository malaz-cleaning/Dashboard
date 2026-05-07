import { auth } from '../auth.js';

export function renderSidebar(root) {
  if (!root) return;

  // Check if we're on mobile
  const isMobile = window.innerWidth < 768;

  root.innerHTML = `
    <div class="flex flex-col h-full bg-slate-800 border-r border-slate-700">
      <!-- Brand Block -->
      <div class="flex items-center gap-3 p-6 border-b border-slate-700">
        <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          M
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-slate-50 font-semibold text-sm truncate">ملاذ</p>
          <p class="text-slate-400 text-xs">لوحة تحكم</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <a class="sidebar-link ${window.location.pathname.includes('index') || window.location.pathname === '/' ? 'sidebar-link-active' : ''}" href="index.html">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
          </svg>
          <span class="sidebar-link-text">لوحة التحكم</span>
        </a>

        <a class="sidebar-link ${window.location.pathname.includes('orders') ? 'sidebar-link-active' : ''}" href="orders.html">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="sidebar-link-text">الطلبات</span>
        </a>

        <a class="sidebar-link ${window.location.pathname.includes('clients') ? 'sidebar-link-active' : ''}" href="clients.html">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
          </svg>
          <span class="sidebar-link-text">العملاء</span>
        </a>

        <a class="sidebar-link ${window.location.pathname.includes('chalets') ? 'sidebar-link-active' : ''}" href="chalets.html">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <span class="sidebar-link-text">الشاليهات</span>
        </a>

        <a class="sidebar-link ${window.location.pathname.includes('analytics') ? 'sidebar-link-active' : ''}" href="analytics.html">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <span class="sidebar-link-text">التحليلات</span>
        </a>
      </nav>

      <!-- Logout -->
      <div class="p-4 border-t border-slate-700">
        <button id="sidebar-logout" class="sidebar-logout-button text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full text-right">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span class="sidebar-link-text">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  `;

  const logoutButton = root.querySelector('#sidebar-logout');
  logoutButton?.addEventListener('click', () => {
    auth.logout();
  });

  // Add responsive behavior
  const sidebar = root.querySelector('.flex');
  if (isMobile) {
    sidebar.classList.add('fixed', 'inset-y-0', 'left-0', 'z-50', 'transform', '-translate-x-full', 'transition-transform', 'duration-300', 'w-80');
  } else {
    sidebar.classList.add('w-64');
  }
}
