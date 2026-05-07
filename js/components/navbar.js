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

export function renderNavbar(root) {
  if (!root) return;

  const currentPage = getCurrentPage();
  const pageTitles = {
    'index.html': 'لوحة التحكم',
    'orders.html': 'إدارة الطلبات',
    'clients.html': 'إدارة العملاء',
    'chalets.html': 'إدارة الشاليهات',
    'analytics.html': 'التحليلات'
  };

  const pageTitle = pageTitles[currentPage] || 'ملاذ كلينينج';

  root.innerHTML = `
    <div class="sticky top-0 z-40 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
      <div class="flex items-center justify-between h-16 px-4 sm:px-6">
        <!-- Mobile menu button -->
        <button class="sidebar-toggle lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-50 hover:bg-slate-700 transition-colors duration-200" id="sidebar-toggle" aria-label="Toggle menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <!-- Page title -->
        <div class="flex-1 lg:flex-none">
          <h1 class="text-lg font-semibold text-slate-50 truncate">${pageTitle}</h1>
        </div>

        <!-- Desktop actions -->
        <div class="hidden lg:flex items-center gap-3">
          <button class="btn-ghost px-3 py-2 text-sm" id="download-backup-xlsx" title="تحميل Excel">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Excel
          </button>
          <div class="w-px h-6 bg-slate-600"></div>
          <button class="btn-ghost px-3 py-2 text-sm text-red-400 hover:text-red-300" id="logout-button">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            خروج
          </button>
        </div>

        <!-- Mobile actions menu -->
        <div class="lg:hidden relative">
          <button class="p-2 rounded-lg text-slate-400 hover:text-slate-50 hover:bg-slate-700 transition-colors duration-200" id="mobile-menu-button" aria-label="More actions">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </button>

          <!-- Mobile dropdown menu -->
          <div class="hidden absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-lg border border-slate-700 shadow-lg py-1 z-50" id="mobile-menu">
              <button class="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-slate-50 flex items-center gap-2" id="mobile-download-xlsx">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تحميل Excel
            </button>
            <div class="border-t border-slate-700 my-1"></div>
            <button class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2" id="mobile-logout">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Event listeners
  document.getElementById('logout-button')?.addEventListener('click', () => {
    auth.logout();
  });
  document.getElementById('mobile-logout')?.addEventListener('click', () => {
    auth.logout();
  });

  document.getElementById('download-backup-xlsx')?.addEventListener('click', downloadExcelBackup);
  document.getElementById('mobile-download-xlsx')?.addEventListener('click', downloadExcelBackup);

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  mobileMenuButton?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenuButton?.contains(e.target) && !mobileMenu?.contains(e.target)) {
      mobileMenu?.classList.add('hidden');
    }
  });
}

function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);
  return page === '' ? 'index.html' : page;
}
