import { auth } from '../auth.js';

export function renderSidebar(root) {
  if (!root) return;

  // Check if we're on mobile
  const isMobile = window.innerWidth < 1024;

  root.classList.add('sidebar');
  root.classList.toggle('collapsed', isMobile);

  root.innerHTML = `
      <!-- Brand Block -->
      <div class="flex items-center gap-4 p-6 border-b border-slate-700/50">
        <div class="relative">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            م
          </div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-emerald rounded-full border-2 border-slate-800"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-slate-50 font-bold text-lg truncate">ملاذ كلينينج</p>
          <p class="text-slate-400 text-sm">نظام إدارة الطلبات</p>
        </div>
        ${isMobile ? `
          <button class="sidebar-close lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 transition-colors duration-200" id="sidebar-close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        ` : ''}
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <a class="sidebar-link ${window.location.pathname.includes('index') || window.location.pathname === '/' ? 'sidebar-link-active' : ''}" href="index.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
            </svg>
          </div>
          <span class="sidebar-link-text">Dash board</span>
          ${window.location.pathname.includes('index') || window.location.pathname === '/' ? `
            <div class="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
          ` : ''}
        </a>

        <a class="sidebar-link ${window.location.pathname.includes('orders') ? 'sidebar-link-active' : ''}" href="orders.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-emerald/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <span class="sidebar-link-text">إدارة الطلبات</span>
          ${window.location.pathname.includes('orders') ? `
            <div class="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></div>
          ` : ''}
        </a>

        <a class="sidebar-link ${window.location.pathname.includes('clients') ? 'sidebar-link-active' : ''}" href="clients.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-amber/20 to-accent-pink/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
          </div>
          <span class="sidebar-link-text">إدارة العملاء</span>
          ${window.location.pathname.includes('clients') ? `
            <div class="w-2 h-2 bg-accent-amber rounded-full animate-pulse"></div>
          ` : ''}
        </a>

        <a class="sidebar-link ${window.location.pathname.includes('chalets') ? 'sidebar-link-active' : ''}" href="chalets.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <span class="sidebar-link-text">إدارة الشاليهات</span>
          ${window.location.pathname.includes('chalets') ? `
            <div class="w-2 h-2 bg-accent-purple rounded-full animate-pulse"></div>
          ` : ''}
        </a>

        <a class="sidebar-link ${window.location.pathname.includes('analytics') ? 'sidebar-link-active' : ''}" href="analytics.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-emerald/20 to-accent-cyan/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <span class="sidebar-link-text">التحليلات</span>
          ${window.location.pathname.includes('analytics') ? `
            <div class="w-2 h-2 bg-accent-emerald rounded-full animate-pulse"></div>
          ` : ''}
        </a>
      </nav>

      <!-- User Info & Logout -->
      <div class="p-4 border-t border-slate-700/50">
        <div class="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 mb-3">
          <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg flex items-center justify-center text-white font-semibold text-sm">
            ${auth.getToken() ? 'م' : '?'}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-slate-50 font-medium text-sm truncate">المدير</p>
            <p class="text-slate-400 text-xs">متصل</p>
          </div>
        </div>

        <button id="sidebar-logout" class="sidebar-logout-button text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full">
          <div class="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </div>
          <span class="sidebar-link-text">تسجيل الخروج</span>
        </button>
      </div>
    ${isMobile ? `
      <div class="sidebar-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden opacity-0 pointer-events-none transition-opacity duration-300" id="sidebar-overlay"></div>
    ` : ''}
  `;

  const logoutButton = root.querySelector('#sidebar-logout');
  logoutButton?.addEventListener('click', () => {
    auth.logout();
  });

  // Mobile sidebar functionality
  if (isMobile) {
    const sidebar = root;
    const overlay = root.querySelector('#sidebar-overlay');
    const closeButton = root.querySelector('#sidebar-close');
    const shell = document.querySelector('.app-shell');

    const toggleSidebar = (open) => {
      if (open) {
        sidebar?.classList.remove('collapsed');
        sidebar?.classList.add('open');
        shell?.classList.add('sidebar-open');
        overlay?.classList.remove('opacity-0', 'pointer-events-none');
        overlay?.classList.add('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = 'hidden';
      } else {
        sidebar?.classList.add('collapsed');
        sidebar?.classList.remove('open');
        shell?.classList.remove('sidebar-open');
        overlay?.classList.remove('opacity-100', 'pointer-events-auto');
        overlay?.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
      }
    };

    // Close sidebar when clicking overlay
    overlay?.addEventListener('click', () => toggleSidebar(false));

    // Close button
    closeButton?.addEventListener('click', () => toggleSidebar(false));

    // Make sidebar available globally for navbar toggle
    window.toggleSidebar = toggleSidebar;
  }
}
