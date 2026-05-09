import { api } from '../api.js';
import { showToast } from '../components/toast.js';
import { auth } from '../auth.js';
import { showClientModal, showChaletModal } from '../utils/reusableModals.js';

const pageRoot = document.getElementById('page-content');

async function openClientModal(onClientAdded) {
  await showClientModal(onClientAdded);
}

async function openChaletModal(clients, refresh) {
  await showChaletModal(clients, refresh);
}

function renderChaletRows(filtered, clients, orders) {
  if (!filtered.length) {
    return `
      <tr class="hidden md:table-row">
        <td colspan="9" class="px-6 py-12 text-center text-slate-400">لا يوجد شاليهات مطابقة.</td>
      </tr>
      <div class="md:hidden p-8 text-center text-slate-400">لا يوجد شاليهات مطابقة.</div>
    `;
  }

  const rows = filtered
    .map((chalet) => {
      const client = clients.find((item) => item.client_id === chalet.client_id) || {};
      const chaletOrders = orders.filter((order) => order.chalet_id === chalet.chalet_id);
      return `
        <tr class="hidden md:table-row hover:bg-slate-700/40">
          <td class="px-6 py-4 text-slate-200">${chalet.chalet_id}</td>
          <td class="px-6 py-4 text-slate-200">${chalet.chalet_code}</td>
          <td class="px-6 py-4 text-slate-200">${chalet.chalet_name}</td>
          <td class="px-6 py-4 text-slate-200">${client.name || 'غير محدد'}</td>
          <td class="px-6 py-4 text-slate-200">${chalet.location || '-'}</td>
          <td class="px-6 py-4 text-slate-200 max-w-[220px] truncate">${chalet.details || '-'}</td>
          <td class="px-6 py-4 text-slate-200">${chaletOrders.length}</td>
          <td class="px-6 py-4 text-slate-200">${chalet.created_at}</td>
          <td class="px-6 py-4">
            <button class="btn btn-secondary w-full" data-action="delete" data-id="${chalet.chalet_id}">حذف</button>
          </td>
        </tr>
      `;
    })
    .join('');

  const cards = filtered
    .map((chalet) => {
      const client = clients.find((item) => item.client_id === chalet.client_id) || {};
      const chaletOrders = orders.filter((order) => order.chalet_id === chalet.chalet_id);
      return `
        <div class="md:hidden bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-sm">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <p class="text-xs text-slate-400">رقم الشاليه</p>
              <p class="text-lg font-semibold text-slate-50">${chalet.chalet_id}</p>
            </div>
            <button class="btn btn-secondary" data-action="delete" data-id="${chalet.chalet_id}">حذف</button>
          </div>
          <div class="space-y-3 text-sm text-slate-300">
            <div class="flex justify-between">
              <span>الاسم</span>
              <span class="text-slate-100">${chalet.chalet_name}</span>
            </div>
            <div class="flex justify-between">
              <span>الكود</span>
              <span class="text-slate-100">${chalet.chalet_code}</span>
            </div>
            <div class="flex justify-between">
              <span>العميل</span>
              <span class="text-slate-100">${client.name || 'غير محدد'}</span>
            </div>
            <div class="flex justify-between">
              <span>الموقع</span>
              <span class="text-slate-100">${chalet.location || '-'}</span>
            </div>
            <div class="flex justify-between">
              <span>الطلبات</span>
              <span class="text-slate-100">${chaletOrders.length}</span>
            </div>
            <div class="pt-3 text-xs text-slate-400 border-t border-slate-700">
              ${chalet.details || '-'}
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  return rows + cards;
}

export async function renderChalets() {
  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }
  if (!pageRoot) return;
  const [chalets, clients, orders] = await Promise.all([api.getChalets(), api.getClients(), api.getOrders()]);

  pageRoot.innerHTML = `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-50">الشاليهات</h1>
          <p class="text-slate-400 mt-2">إدارة الشاليهات وربطها بالعملاء بسهولة.</p>
        </div>
        <button class="btn btn-primary px-6 py-3" id="open-chalet-modal">إضافة شاليه جديد</button>
      </div>

      <div class="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm mb-6">
        <div class="grid gap-4 lg:grid-cols-2">
          <div>
            <label class="form-label" for="chalet-search">بحث</label>
            <input id="chalet-search" type="search" class="form-input" placeholder="ابحث باسم الشاليه أو العميل" />
          </div>
          <div>
            <label class="form-label" for="chalet-client-filter">عميل</label>
            <select id="chalet-client-filter" class="form-select">
              <option value="">كل العملاء</option>
              ${clients.map((client) => `<option value="${client.client_id}">${client.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="hidden md:table min-w-full text-sm text-left">
            <thead class="bg-slate-900 border-b border-slate-700">
              <tr>
                <th class="px-6 py-3 text-slate-400">رقم الشاليه</th>
                <th class="px-6 py-3 text-slate-400">الكود</th>
                <th class="px-6 py-3 text-slate-400">الاسم</th>
                <th class="px-6 py-3 text-slate-400">العميل</th>
                <th class="px-6 py-3 text-slate-400">الموقع</th>
                <th class="px-6 py-3 text-slate-400">التفاصيل</th>
                <th class="px-6 py-3 text-slate-400">الطلبات</th>
                <th class="px-6 py-3 text-slate-400">تاريخ الإضافة</th>
                <th class="px-6 py-3 text-slate-400">إجراءات</th>
              </tr>
            </thead>
            <tbody id="chalets-table-body" class="bg-slate-800"></tbody>
          </table>
          <div id="chalets-mobile-body" class="md:hidden p-4 space-y-4"></div>
        </div>
      </div>
    </div>
  `;

  const searchInput = pageRoot.querySelector('#chalet-search');
  const clientSelect = pageRoot.querySelector('#chalet-client-filter');
  const tableBody = pageRoot.querySelector('#chalets-table-body');
  const mobileBody = pageRoot.querySelector('#chalets-mobile-body');

  function updateTable() {
    const search = searchInput.value.trim().toLowerCase();
    const clientId = clientSelect.value;

    const filtered = chalets.filter((chalet) => {
      const client = clients.find((item) => item.client_id === chalet.client_id) || {};
      const text = `${chalet.chalet_name} ${client.name} ${chalet.location} ${chalet.details}`.toLowerCase();
      const matchesSearch = !search || text.includes(search);
      const matchesClient = !clientId || chalet.client_id === clientId;
      return matchesSearch && matchesClient;
    });

    const content = renderChaletRows(filtered, clients, orders);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    tableBody.innerHTML = Array.from(tempDiv.querySelectorAll('tr')).map((row) => row.outerHTML).join('');
    mobileBody.innerHTML = Array.from(tempDiv.querySelectorAll('div[class*="md:hidden"]')).map((card) => card.outerHTML).join('');
  }

  document.getElementById('open-chalet-modal')?.addEventListener('click', () => openChaletModal(clients, renderChalets));
  pageRoot.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action="delete"]');
    if (!button) return;
    const chaletId = button.dataset.id;
    await api.deleteChalet(chaletId);
    showToast('success', 'تم حذف الشاليه بنجاح');
    renderChalets();
  });

  searchInput?.addEventListener('input', updateTable);
  clientSelect?.addEventListener('change', updateTable);

  updateTable();
}

if (window.location.pathname.includes('chalets.html')) {
  document.addEventListener('DOMContentLoaded', renderChalets);
}
