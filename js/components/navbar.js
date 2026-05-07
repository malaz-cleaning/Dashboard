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
  const navItems = [
    { href: 'index.html', label: 'لوحة التحكم' },
    { href: 'orders.html', label: 'الطلبات' },
    { href: 'clients.html', label: 'العملاء' },
    { href: 'chalets.html', label: 'الشاليهات' },
    { href: 'analytics.html', label: 'التحليلات' },
  ];

  const navLinks = navItems.map((item) => `
    <a href="${item.href}" class="navbar-link rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-slate-50 transition duration-200 ${item.href === currentPage ? 'bg-slate-700 text-slate-50' : ''}">${item.label}</a>
  `).join('');

  root.innerHTML = `
    <div class="sticky top-0 z-40 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
      <div class="flex flex-col gap-3 px-4 sm:px-6 py-3">
        <div class="flex items-center justify-between gap-3">
          <button class="sidebar-toggle lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-50 hover:bg-slate-700 transition-colors duration-200" id="sidebar-toggle" aria-label="Toggle menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <div class="flex-1 min-w-0">
            <h1 class="text-lg font-semibold text-slate-50 truncate">${pageTitle}</h1>
          </div>

          <div class="flex items-center gap-2">
            <button class="btn-ghost px-3 py-2 text-sm" id="download-backup-xlsx" title="تحميل Excel">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Excel
            </button>
            <button class="btn-ghost px-3 py-2 text-sm text-red-400 hover:text-red-300" id="logout-button">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              خروج
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar py-1">
          ${navLinks}
        </div>
      </div>
    </div>
  `;

  document.getElementById('logout-button')?.addEventListener('click', () => {
    auth.logout();
  });

  document.getElementById('download-backup-xlsx')?.addEventListener('click', downloadExcelBackup);
}

function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);
  return page === '' ? 'index.html' : page;
}
