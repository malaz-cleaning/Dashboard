export function renderNavbar(root) {
  if (!root) return;

  root.innerHTML = `
    <div class="navbar-inner">
      <div class="flex items-center gap-3">
        <button id="sidebar-toggle" class="nav-menu-toggle" type="button" aria-label="فتح القائمة الجانبية">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <p class="navbar-title">ملاذ كلينينج</p>
          <p class="text-slate-400 text-sm hidden sm:block">نظام إدارة الطلبات</p>
        </div>
      </div>
    </div>
  `;

  const toggleButton = root.querySelector('#sidebar-toggle');
  toggleButton?.addEventListener('click', () => {
    window.toggleSidebar?.(true);
  });
}
