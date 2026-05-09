import { auth } from '../auth.js';
import { api } from '../api.js';
import { showToast } from './toast.js';

function formatStatusLabel(status) {
  const map = {
    pending: 'معلقة',
    in_progress: 'قيد التنفيذ',
    done_unpaid: 'تمت ولم يُدفع',
    done_paid: 'تمت ودُفع',
    cancelled: 'ملغاة',
  };
  return map[status] || status;
}

async function downloadExcelBackup() {
  const button = document.getElementById('download-backup-xlsx');
  if (button) button.disabled = true;

  try {
    const response = await fetch('http://localhost:3001/api/backup/manual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.success) {
      showToast('success', 'تم إنشاء النسخة الاحتياطية وحفظها على Google Drive بنجاح ✅');
      console.log('Backup uploaded:', result.file);
    } else {
      showToast('error', result.message || 'فشل إنشاء النسخة الاحتياطية');
    }
  } catch (error) {
    console.error('Backup error:', error);
    showToast('error', 'خطأ: تأكد من أن خادم Backup يعمل على المنفذ 3001');
  } finally {
    if (button) button.disabled = false;
  }
}

function getCurrentPage() {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#orders') return 'orders.html';
  if (hash === '#clients') return 'clients.html';
  if (hash === '#chalets') return 'chalets.html';
  if (hash === '#analytics') return 'analytics.html';
  if (hash === '#settings') return 'settings.html';
  return 'index.html';
}

export function renderNavbar(root) {
  if (!root) return;

  const currentPage = getCurrentPage();
  const pageTitles = {
    'index.html': 'لوحة التحكم',
    'orders.html': 'إدارة الطلبات',
    'clients.html': 'إدارة العملاء',
    'chalets.html': 'إدارة الشاليهات',
    'analytics.html': 'التحليلات والإحصائيات',
    'settings.html': 'الإعدادات'
  };

  const pageTitle = pageTitles[currentPage] || 'ملاذ كلينينج';

  root.innerHTML = `
    <div class="sticky top-0 z-40 bg-gradient-to-r from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-2xl border-b border-slate-700/60 shadow-2xl">
      <div class="flex flex-col gap-4 px-6 py-5">
        <div class="flex items-center justify-between gap-4">
          <!-- Mobile Menu Toggle -->
          <button class="nav-menu-toggle lg:hidden p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-primary-500/20 hover:to-accent-purple/20 transition-all duration-300 border border-slate-700/40 hover:border-primary-500/50 group" id="nav-menu-toggle" aria-label="Toggle menu">
            <svg class="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <!-- Page Title & Logo -->
          <div class="flex-1 min-w-0 flex items-center gap-4">
            <div class="hidden sm:flex w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl items-center justify-center shadow-lg">
              <span class="text-white font-bold text-lg">م</span>
            </div>
            <div class="min-w-0">
              <h1 class="text-2xl font-bold text-white truncate">${pageTitle}</h1>
              <p class="text-slate-400 text-sm hidden md:block">نظام إدارة شامل للطلبات والعملاء</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <!-- Quick Stats -->
            <div class="hidden lg:flex items-center gap-4 px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-slate-600/40 backdrop-blur-sm">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 bg-accent-emerald rounded-full animate-pulse shadow-lg shadow-accent-emerald/50"></div>
                <span class="text-slate-200 text-sm font-medium">متصل</span>
              </div>
              <div class="w-px h-5 bg-slate-500/50"></div>
              <div class="text-slate-300 text-sm font-medium">
                ${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>

            <!-- Download Button -->
            <button class="btn-ghost px-4 py-3 text-sm border border-slate-700/50 hover:border-primary-500/60 hover:bg-primary-500/10 transition-all duration-300 rounded-xl group" id="download-backup-xlsx" title="تحميل Excel">
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="hidden xl:inline ml-2 font-medium">Excel</span>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <button class="flex items-center gap-3 p-3 rounded-2xl hover:bg-gradient-to-br hover:from-slate-700/60 hover:to-slate-600/60 transition-all duration-300 border border-slate-700/40 group" id="user-menu-toggle">
                <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-105 transition-transform duration-200">
                  م
                </div>
                <div class="hidden lg:block text-right">
                  <p class="text-white font-semibold text-sm">المدير</p>
                  <p class="text-slate-400 text-xs">مدير النظام</p>
                </div>
                <svg class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- User Dropdown -->
              <div class="nav-menu-dropdown absolute top-full left-0 mt-3 w-64 shadow-2xl" id="user-menu-dropdown">
                <div class="p-4 border-b border-slate-700/60 bg-gradient-to-r from-slate-800/90 to-slate-700/90">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      م
                    </div>
                    <div>
                      <p class="text-white font-semibold">المدير</p>
                      <p class="text-slate-400 text-sm">admin@malaz.com</p>
                    </div>
                  </div>
                </div>
                <a href="settings.html" class="navbar-link group">
                  <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  الإعدادات
                </a>
                <button class="navbar-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 group" id="logout-button">
                  <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="nav-menu-dropdown lg:hidden shadow-2xl border border-slate-700/60 bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-2xl" id="nav-menu-dropdown">
          <div class="p-4 border-b border-slate-700/60 bg-gradient-to-r from-slate-800/90 to-slate-700/90">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                م
              </div>
              <div>
                <p class="text-white font-semibold">قائمة التنقل</p>
                <p class="text-slate-400 text-sm">اختر الصفحة المطلوبة</p>
              </div>
            </div>
          </div>
          <a href="#dashboard" class="navbar-link nav-link group ${currentPage === 'index.html' ? 'bg-primary-500/20 text-primary-400 border-r-4 border-primary-400' : ''}">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg class="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium">لوحة التحكم</p>
                <p class="text-xs text-slate-400">الصفحة الرئيسية</p>
              </div>
            </div>
          </a>
          <a href="#orders" class="navbar-link nav-link group ${currentPage === 'orders.html' ? 'bg-accent-cyan/20 text-accent-cyan border-r-4 border-accent-cyan' : ''}">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg class="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium">الطلبات</p>
                <p class="text-xs text-slate-400">إدارة الطلبات</p>
              </div>
            </div>
          </a>
          <a href="#clients" class="navbar-link nav-link group ${currentPage === 'clients.html' ? 'bg-accent-amber/20 text-accent-amber border-r-4 border-accent-amber' : ''}">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-accent-amber/20 to-accent-amber/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg class="w-4 h-4 text-accent-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium">العملاء</p>
                <p class="text-xs text-slate-400">قاعدة البيانات</p>
              </div>
            </div>
          </a>
          <a href="#chalets" class="navbar-link nav-link group ${currentPage === 'chalets.html' ? 'bg-accent-purple/20 text-accent-purple border-r-4 border-accent-purple' : ''}">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-accent-purple/20 to-accent-purple/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg class="w-4 h-4 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <p class="font-medium">الشاليهات</p>
                <p class="text-xs text-slate-400">إدارة الشاليهات</p>
              </div>
            </div>
          </a>
          <a href="#analytics" class="navbar-link nav-link group ${currentPage === 'analytics.html' ? 'bg-accent-emerald/20 text-accent-emerald border-r-4 border-accent-emerald' : ''}">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-accent-emerald/20 to-accent-emerald/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg class="w-4 h-4 text-accent-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium">التحليلات</p>
                <p class="text-xs text-slate-400">التقارير والإحصائيات</p>
              </div>
            </div>
          </a>
          <a href="settings.html" class="navbar-link nav-link group ${currentPage === 'settings.html' ? 'bg-slate-500/20 text-slate-400 border-r-4 border-slate-400' : ''}">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-slate-500/20 to-slate-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium">الإعدادات</p>
                <p class="text-xs text-slate-400">تخصيص النظام</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  `;

  // Event listeners
  const navToggle = root.querySelector('#nav-menu-toggle');
  const navDropdown = root.querySelector('#nav-menu-dropdown');
  const userMenuToggle = root.querySelector('#user-menu-toggle');
  const userMenuDropdown = root.querySelector('#user-menu-dropdown');
  const logoutButton = root.querySelector('#logout-button');
  const downloadButton = root.querySelector('#download-backup-xlsx');

  // Mobile navigation toggle
  navToggle?.addEventListener('click', () => {
    navDropdown?.classList.toggle('show');
    userMenuDropdown?.classList.remove('show');
  });

  // User menu toggle
  userMenuToggle?.addEventListener('click', () => {
    userMenuDropdown?.classList.toggle('show');
    navDropdown?.classList.remove('show');
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) {
      navDropdown?.classList.remove('show');
      userMenuDropdown?.classList.remove('show');
    }
  });

  // Logout
  logoutButton?.addEventListener('click', () => {
    auth.logout();
  });

  // Download backup
  downloadButton?.addEventListener('click', downloadExcelBackup);

  // Sidebar toggle for mobile
  if (window.toggleSidebar) {
    navToggle?.addEventListener('click', () => {
      window.toggleSidebar(true);
    });
  }
}
