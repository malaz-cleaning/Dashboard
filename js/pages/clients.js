import { api } from '../api.js';
import { showToast } from '../components/toast.js';
import { auth } from '../auth.js';
import { showClientModal } from '../utils/reusableModals.js';

const pageRoot = document.getElementById('page-content');

async function openClientModal(onClientAdded) {
  await showClientModal(onClientAdded);
}

function renderClientRows(filtered, orders, chalets) {
  if (!filtered.length) {
    return `
      <tr class="hidden md:table-row">
        <td colspan="8" class="px-6 py-12 text-center text-slate-400">لا يوجد عملاء مطابقين.</td>
      </tr>
      <div class="md:hidden p-8 text-center text-slate-400">لا يوجد عملاء مطابقين.</div>
    `;
  }

  const rows = filtered
    .map((client) => {
      const clientOrders = orders.filter((order) => order.client_id === client.client_id);
      const clientChalets = chalets.filter((item) => item.client_id === client.client_id);
      return `
        <tr class="hidden md:table-row hover:bg-slate-700/40">
          <td class="px-6 py-4 text-slate-200">${client.client_id}</td>
          <td class="px-6 py-4 text-slate-200">${client.name}</td>
          <td class="px-6 py-4 text-slate-200">${client.phone}</td>
          <td class="px-6 py-4 text-slate-200">${client.type}</td>
          <td class="px-6 py-4 text-slate-200">${clientChalets.length}</td>
          <td class="px-6 py-4 text-slate-200">${clientOrders.length}</td>
          <td class="px-6 py-4 text-slate-200">${client.created_at}</td>
          <td class="px-6 py-4">
            <button class="btn btn-secondary w-full" data-action="delete" data-id="${client.client_id}">حذف</button>
          </td>
        </tr>
      `;
    })
    .join('');

  const cards = filtered
    .map((client) => {
      const clientOrders = orders.filter((order) => order.client_id === client.client_id);
      const clientChalets = chalets.filter((item) => item.client_id === client.client_id);
      return `
        <div class="md:hidden bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4 gap-4">
            <div>
              <p class="text-xs text-slate-400">رقم العميل</p>
              <p class="font-semibold text-slate-50">${client.client_id}</p>
            </div>
            <button class="btn btn-secondary" data-action="delete" data-id="${client.client_id}">حذف</button>
          </div>
          <div class="space-y-3 text-sm text-slate-300">
            <div class="flex justify-between">
              <span>الاسم</span>
              <span class="text-slate-100">${client.name}</span>
            </div>
            <div class="flex justify-between">
              <span>الهاتف</span>
              <span class="text-slate-100">${client.phone}</span>
            </div>
            <div class="flex justify-between">
              <span>النوع</span>
              <span class="text-slate-100">${client.type}</span>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-3 text-xs text-slate-400">
              <div class="rounded-2xl bg-slate-900/70 p-3">
                <p>الشاليهات</p>
                <p class="font-semibold text-slate-100">${clientChalets.length}</p>
              </div>
              <div class="rounded-2xl bg-slate-900/70 p-3">
                <p>الطلبات</p>
                <p class="font-semibold text-slate-100">${clientOrders.length}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  return rows + cards;
}

export async function renderClients() {
  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }
  if (!pageRoot) return;
  const [clients, orders, chalets] = await Promise.all([api.getClients(), api.getOrders(), api.getChalets()]);

  pageRoot.innerHTML = `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-50">العملاء</h1>
          <p class="text-slate-400 mt-2">إدارة العملاء وأنواعهم بكل وضوح.</p>
        </div>
        <button class="btn btn-primary px-6 py-3" id="open-client-modal">إضافة عميل جديد</button>
      </div>

      <div class="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm mb-6">
        <div class="grid gap-4 lg:grid-cols-2">
          <div>
            <label class="form-label" for="client-search">بحث</label>
            <input id="client-search" type="search" class="form-input" placeholder="ابحث باسم العميل أو رقم الهاتف" />
          </div>
          <div>
            <label class="form-label" for="client-type-filter">النوع</label>
            <select id="client-type-filter" class="form-select">
              <option value="">كل الأنواع</option>
              <option value="owner">owner</option>
              <option value="broker">broker</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="hidden md:table min-w-full text-sm text-left">
            <thead class="bg-slate-900 border-b border-slate-700">
              <tr>
                <th class="px-6 py-3 text-slate-400">رقم العميل</th>
                <th class="px-6 py-3 text-slate-400">الاسم</th>
                <th class="px-6 py-3 text-slate-400">الهاتف</th>
                <th class="px-6 py-3 text-slate-400">النوع</th>
                <th class="px-6 py-3 text-slate-400">الشاليهات</th>
                <th class="px-6 py-3 text-slate-400">الطلبات</th>
                <th class="px-6 py-3 text-slate-400">تاريخ الإضافة</th>
                <th class="px-6 py-3 text-slate-400">إجراءات</th>
              </tr>
            </thead>
            <tbody id="clients-table-body" class="bg-slate-800"></tbody>
          </table>
          <div id="clients-mobile-body" class="md:hidden p-4 space-y-4"></div>
        </div>
      </div>
    </div>
  `;

  const searchInput = pageRoot.querySelector('#client-search');
  const typeSelect = pageRoot.querySelector('#client-type-filter');
  const tableBody = pageRoot.querySelector('#clients-table-body');
  const mobileBody = pageRoot.querySelector('#clients-mobile-body');

  function updateTable() {
    const search = searchInput.value.trim().toLowerCase();
    const type = typeSelect.value;
    const filtered = clients.filter((client) => {
      const text = `${client.name} ${client.phone} ${client.type}`.toLowerCase();
      const matchesSearch = !search || text.includes(search);
      const matchesType = !type || client.type === type;
      return matchesSearch && matchesType;
    });

    const content = renderClientRows(filtered, orders, chalets);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    tableBody.innerHTML = Array.from(tempDiv.querySelectorAll('tr')).map((row) => row.outerHTML).join('');
    mobileBody.innerHTML = Array.from(tempDiv.querySelectorAll('div[class*="md:hidden"]')).map((card) => card.outerHTML).join('');
  }

  document.getElementById('open-client-modal')?.addEventListener('click', () => openClientModal(renderClients));
  pageRoot.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action="delete"]');
    if (!button) return;
    const clientId = button.dataset.id;
    await api.deleteClient(clientId);
    showToast('success', 'تم حذف العميل بنجاح');
    renderClients();
  });

  searchInput?.addEventListener('input', updateTable);
  typeSelect?.addEventListener('change', updateTable);

  updateTable();
}

if (window.location.pathname.includes('clients.html')) {
  document.addEventListener('DOMContentLoaded', renderClients);
}
