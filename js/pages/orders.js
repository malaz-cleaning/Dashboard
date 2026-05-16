import { api } from '../api.js';
import { showToast } from '../components/toast.js';
import { auth } from '../auth.js';
import { renderModal } from '../components/modal.js';
import { showOrderModal } from '../utils/reusableModals.js';

const pageRoot = document.getElementById('page-content');
const modalRoot = document.getElementById('modal-root');

if (!modalRoot) {
  console.error('Modal root not found');
}

function getStatusLabel(status) {
  const map = {
    pending: 'معلقة',
    in_progress: 'قيد التنفيذ',
    done_unpaid: 'تمت ولم يُدفع',
    done_paid: 'تمت ودُفع',
    cancelled: 'ملغاة',
  };
  return map[status] || status;
}

function statusBadge(status) {
  const statusConfig = {
    pending: { label: 'معلقة', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    in_progress: { label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    done_unpaid: { label: 'تمت ولم يُدفع', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    done_paid: { label: 'تمت ودُفع', color: 'bg-green-100 text-green-800 border-green-200' },
    cancelled: { label: 'ملغاة', color: 'bg-red-100 text-red-800 border-red-200' },
  };
  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}">${config.label}</span>`;
}

function formatCurrency(value) {
  return `EGP ${Number(value || 0).toLocaleString('ar-EG')}`;
}

function renderOrderRows(orders, clients, chalets, transactions = []) {
  if (!orders.length) {
    return {
      tableRows: `
        <tr>
          <td colspan="14" class="px-6 py-12 text-center text-slate-500">لا يوجد طلبات مطابقة.</td>
        </tr>
      `,
      mobileCards: `
        <div class="bg-slate-800 rounded-3xl border border-slate-700 p-8 text-center text-slate-400">لا يوجد طلبات مطابقة.</div>
      `,
    };
  }

  const tableRows = orders
    .map((order) => {
      const client = clients.find((item) => item.client_id === order.client_id) || {};
      const chalet = chalets.find((item) => item.chalet_id === order.chalet_id) || {};
      const completedAt = order.completed_at || ((['done_paid', 'done_unpaid', 'cancelled'].includes(order.status)) ? new Date().toISOString().split('T')[0] : '-');
      const orderExpenses = transactions
        .filter((t) => !t.is_deleted && t.order_id === order.order_id && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const orderIncomeTransactions = transactions
        .filter((t) => !t.is_deleted && t.order_id === order.order_id && t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const orderIncome = orderIncomeTransactions > 0 ? orderIncomeTransactions : Number(order.deposit || 0);
      const netProfit = orderIncome - orderExpenses;

      return `
        <tr class="hover:bg-slate-700/60">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${order.order_id}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-100">${client.name || 'غير محدد'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-100">${chalet.chalet_name || 'غير محدد'}</td>
          <td class="px-6 py-4 whitespace-nowrap">${statusBadge(order.status)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${formatCurrency(order.price)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${formatCurrency(order.deposit)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${formatCurrency(orderExpenses)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${formatCurrency(netProfit)}</td>
          <td class="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">${order.notes || '-'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${order.scheduled_at || '-'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${order.created_at}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${completedAt}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select class="block w-full px-3 py-2 border border-slate-600 bg-slate-900 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" data-order-id="${order.order_id}" data-current-status="${order.status}">
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>معلقة</option>
              <option value="in_progress" ${order.status === 'in_progress' ? 'selected' : ''}>قيد التنفيذ</option>
              <option value="done_unpaid" ${order.status === 'done_unpaid' ? 'selected' : ''}>تمت ولم يُدفع</option>
              <option value="done_paid" ${order.status === 'done_paid' ? 'selected' : ''}>تمت ودُفع</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغاة</option>
            </select>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex gap-2">
              <button type="button" class="inline-flex items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 px-3 py-2 text-sm transition hover:bg-amber-500/20 hover:text-amber-100" data-action="edit-order" data-order-id="${order.order_id}">تعديل</button>
              <button type="button" class="inline-flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 px-3 py-2 text-sm transition hover:bg-red-500/20 hover:text-red-100" data-action="delete-order" data-order-id="${order.order_id}">حذف</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  const mobileCards = orders
    .map((order) => {
      const client = clients.find((item) => item.client_id === order.client_id) || {};
      const chalet = chalets.find((item) => item.chalet_id === order.chalet_id) || {};
      const completedAt = order.completed_at || ((['done_paid', 'done_unpaid', 'cancelled'].includes(order.status)) ? new Date().toISOString().split('T')[0] : '-');
      const orderExpenses = transactions
        .filter((t) => !t.is_deleted && t.order_id === order.order_id && t.type === 'expense')
        .reduce((s, t) => s + Number(t.amount || 0), 0);
      const orderIncomeTransactions = transactions
        .filter((t) => !t.is_deleted && t.order_id === order.order_id && t.type === 'income')
        .reduce((s, t) => s + Number(t.amount || 0), 0);
      const orderIncome = orderIncomeTransactions > 0 ? orderIncomeTransactions : Number(order.deposit || 0);
      const netProfit = orderIncome - orderExpenses;

      return `
        <div class="md:hidden bg-slate-800 rounded-3xl border border-slate-700 p-4 mb-4">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="text-lg font-semibold text-slate-50">طلب #${order.order_id}</h3>
              <p class="text-sm text-slate-400">${client.name || 'غير محدد'} - ${chalet.chalet_name || 'غير محدد'}</p>
            </div>
            ${statusBadge(order.status)}
          </div>
            <div class="space-y-2 mb-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">السعر:</span>
              <span class="text-lg font-semibold text-slate-50">${formatCurrency(order.price)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">الدفعة:</span>
              <span class="text-sm text-slate-50">${formatCurrency(order.deposit)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">المصروفات:</span>
              <span class="text-sm text-slate-50">${formatCurrency(orderExpenses)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">صافي الربح:</span>
              <span class="text-sm text-slate-50">${formatCurrency(netProfit)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">تاريخ الإنشاء:</span>
              <span class="text-sm text-slate-50">${order.created_at}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">تاريخ التنفيذ:</span>
              <span class="text-sm text-slate-50">${order.scheduled_at || '-'}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">تاريخ الإنجاز:</span>
              <span class="text-sm text-slate-50">${completedAt}</span>
            </div>
            ${order.notes ? `<div class="pt-2 border-t border-slate-700"><p class="text-sm text-slate-400">${order.notes}</p></div>` : ''}
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">تغيير الحالة</label>
            <select class="block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" data-order-id="${order.order_id}" data-current-status="${order.status}">
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>معلقة</option>
              <option value="in_progress" ${order.status === 'in_progress' ? 'selected' : ''}>قيد التنفيذ</option>
              <option value="done_unpaid" ${order.status === 'done_unpaid' ? 'selected' : ''}>تمت ولم يُدفع</option>
              <option value="done_paid" ${order.status === 'done_paid' ? 'selected' : ''}>تمت ودُفع</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغاة</option>
            </select>
          </div>
          <button type="button" class="mt-4 w-full rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 px-4 py-3 text-sm font-medium transition hover:bg-red-500/20 hover:text-red-100" data-action="delete-order" data-order-id="${order.order_id}">حذف الطلب</button>
        </div>
      `;
    })
    .join('');

  return { tableRows, mobileCards };
}

async function confirmDeleteOrder(orderId, refresh) {
  if (!modalRoot) {
    console.error('Modal root not available for delete confirmation');
    return false;
  }
  return new Promise((resolve) => {
    const content = `
      <div class="space-y-4">
        <p class="text-slate-200">هل تريد حذف الطلب <span class="font-semibold text-white">#${orderId}</span> نهائيًا؟</p>
        <div class="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button class="btn btn-secondary w-full sm:w-auto" id="cancel-delete-button">إلغاء</button>
          <button class="btn btn-primary w-full sm:w-auto bg-red-500 text-white hover:bg-red-600" id="confirm-delete-button">حذف</button>
        </div>
      </div>
    `;

    renderModal(modalRoot, 'تأكيد حذف الطلب', content);

    const cancelButton = modalRoot.querySelector('#cancel-delete-button');
    const confirmButton = modalRoot.querySelector('#confirm-delete-button');

    cancelButton?.addEventListener('click', () => {
      modalRoot.innerHTML = '';
      resolve(false);
    });

    confirmButton?.addEventListener('click', async () => {
      try {
        await api.deleteOrder(orderId);
        showToast('success', 'تم حذف الطلب بنجاح');
        modalRoot.innerHTML = '';
        refresh();
        resolve(true);
      } catch (error) {
        console.error('Error deleting order:', error);
        showToast('error', 'حدث خطأ أثناء حذف الطلب');
        resolve(false);
      }
    });
  });
}

function filterOrders(orders, clients, filters) {
  return orders.filter((order) => {
    const client = clients.find((item) => item.client_id === order.client_id) || {};
    const text = `${order.order_id} ${order.notes || ''} ${order.status} ${client.name}`.toLowerCase();
    const matchesSearch = filters.search ? text.includes(filters.search.toLowerCase()) : true;
    const matchesStatus = filters.status ? order.status === filters.status : true;
    const matchesClient = filters.client ? order.client_id === filters.client : true;
    return matchesSearch && matchesStatus && matchesClient;
  });
}

async function openOrderModal(clients, chalets, refresh) {
  await showOrderModal(clients, chalets, refresh);
}

export async function renderOrders() {
  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }
  if (!pageRoot) return;
  const [orders, clients, chalets] = await Promise.all([api.getOrders(), api.getClients(), api.getChalets()]);
  const transactions = await api.getTransactions();

  const totals = {
    orders: orders.length,
    clients: clients.length,
    chalets: chalets.length,
    revenue: transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0),
    totalNetProfit: transactions.filter((t) => !t.is_deleted).reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount || 0) : -Number(t.amount || 0)), 0),
  };

  pageRoot.innerHTML = `
    <div class="p-6 max-w-[1200px] mx-auto px-4 space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-50">الطلبات</h1>
          <p class="text-slate-400 mt-2">عرض وإدارة جميع الطلبات من Dash board.</p>
        </div>
        <button class="btn btn-primary px-6 py-3" id="add-order-button">إضافة طلب جديد</button>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="card card-padded">
          <p class="text-sm text-slate-400">إجمالي الطلبات</p>
          <p class="mt-3 text-3xl font-semibold text-slate-50">${totals.orders}</p>
        </div>
        <div class="card card-padded">
          <p class="text-sm text-slate-400">عدد العملاء</p>
          <p class="mt-3 text-3xl font-semibold text-slate-50">${totals.clients}</p>
        </div>
        <div class="card card-padded">
          <p class="text-sm text-slate-400">عدد الشاليهات</p>
          <p class="mt-3 text-3xl font-semibold text-slate-50">${totals.chalets}</p>
        </div>
        <div class="card card-padded">
          <p class="text-sm text-slate-400">إجمالي الإيراد</p>
          <p class="mt-3 text-3xl font-semibold text-slate-50">${formatCurrency(totals.revenue)}</p>
        </div>
        <div class="card card-padded">
          <p class="text-sm text-slate-400">صافي الربح الكلي</p>
          <p class="mt-3 text-3xl font-semibold text-slate-50">${formatCurrency(totals.totalNetProfit)}</p>
        </div>
      </div>

      <div class="bg-slate-900 rounded-3xl shadow-card border border-slate-700 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="form-label text-slate-300" for="order-search">بحث</label>
            <input id="order-search" type="search" class="form-input bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" placeholder="ابحث برقم الطلب أو العميل" />
          </div>
          <div>
            <label class="form-label text-slate-300" for="order-status-filter">حالة الطلب</label>
            <select id="order-status-filter" class="form-select bg-slate-800 border-slate-700 text-slate-100">
              <option value="">كل الحالات</option>
              <option value="pending">معلقة</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="done_unpaid">تمت ولم يُدفع</option>
              <option value="done_paid">تمت ودُفع</option>
              <option value="cancelled">ملغاة</option>
            </select>
          </div>
          <div>
            <label class="form-label" for="order-client-filter">عميل</label>
            <select id="order-client-filter" class="form-select">
              <option value="">كل العملاء</option>
              ${clients.map((client) => `<option value="${client.client_id}">${client.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="bg-slate-900 rounded-3xl shadow-card border border-slate-700 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="hidden md:table min-w-full table-auto divide-y divide-slate-700">
            <thead class="bg-slate-800">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">رقم الطلب</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">العميل</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">الشاليه</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">الحالة</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">السعر</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">الدفعة</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">المصروفات</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">صافي الربح</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">ملاحظات</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">تاريخ التنفيذ</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">تاريخ الإنشاء</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">تاريخ الإنجاز</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">تغيير الحالة</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">تعديل / حذف</th>
              </tr>
            </thead>
            <tbody id="orders-table-body" class="bg-slate-900 divide-y divide-slate-700"></tbody>
          </table>
        </div>
        <div id="orders-mobile-body" class="md:hidden p-4 space-y-4"></div>
      </div>

      <div class="bg-slate-900 rounded-3xl border border-slate-700 p-6">
        <h3 class="text-xl font-semibold text-slate-50 mb-6">الإجماليات حسب الحالة</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <p class="text-sm font-medium text-yellow-800">معلقة</p>
            </div>
            <p class="text-2xl font-bold text-yellow-900">EGP <span id="total-pending">0</span></p>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <p class="text-sm font-medium text-blue-800">قيد التنفيذ</p>
            </div>
            <p class="text-2xl font-bold text-blue-900">EGP <span id="total-in_progress">0</span></p>
          </div>
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
              <p class="text-sm font-medium text-orange-800">تمت ولم يُدفع</p>
            </div>
            <p class="text-2xl font-bold text-orange-900">EGP <span id="total-done_unpaid">0</span></p>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <p class="text-sm font-medium text-green-800">تمت ودُفع</p>
            </div>
            <p class="text-2xl font-bold text-green-900">EGP <span id="total-done_paid">0</span></p>
          </div>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <p class="text-sm font-medium text-red-800">ملغاة</p>
            </div>
            <p class="text-2xl font-bold text-red-900">EGP <span id="total-cancelled">0</span></p>
          </div>
          <div class="bg-green-100 border border-green-300 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-green-600 rounded-full"></div>
              <p class="text-sm font-medium text-green-900">الإجمالي العام</p>
            </div>
            <p class="text-2xl font-bold text-green-900">EGP <span id="total-all">0</span></p>
          </div>
        </div>
      </div>
    </div>
  `;

  const searchInput = pageRoot.querySelector('#order-search');
  const statusSelect = pageRoot.querySelector('#order-status-filter');
  const clientSelect = pageRoot.querySelector('#order-client-filter');
  const tableBody = pageRoot.querySelector('#orders-table-body');
  const mobileBody = pageRoot.querySelector('#orders-mobile-body');
  const addOrderButton = pageRoot.querySelector('#add-order-button');
  const totalPendingSpan = pageRoot.querySelector('#total-pending');
  const totalInProgressSpan = pageRoot.querySelector('#total-in_progress');
  const totalDoneUnpaidSpan = pageRoot.querySelector('#total-done_unpaid');
  const totalDonePaidSpan = pageRoot.querySelector('#total-done_paid');
  const totalCancelledSpan = pageRoot.querySelector('#total-cancelled');
  const totalAllSpan = pageRoot.querySelector('#total-all');

  function updateTable() {
    const filters = {
      search: searchInput.value.trim(),
      status: statusSelect.value,
      client: clientSelect.value,
    };
    const filtered = filterOrders(orders, clients, filters);
    const { tableRows, mobileCards } = renderOrderRows(filtered, clients, chalets, transactions);

    tableBody.innerHTML = tableRows;
    mobileBody.innerHTML = mobileCards;

    const totals = {
      pending: 0,
      in_progress: 0,
      done_unpaid: 0,
      done_paid: 0,
      cancelled: 0,
      all: 0,
    };

    filtered.forEach((order) => {
      const price = Number(order.price || 0);
      totals[order.status] = (totals[order.status] || 0) + price;
      totals.all += price;
    });

    totalPendingSpan.textContent = totals.pending.toLocaleString('ar-EG');
    totalInProgressSpan.textContent = totals.in_progress.toLocaleString('ar-EG');
    totalDoneUnpaidSpan.textContent = totals.done_unpaid.toLocaleString('ar-EG');
    totalDonePaidSpan.textContent = totals.done_paid.toLocaleString('ar-EG');
    totalCancelledSpan.textContent = totals.cancelled.toLocaleString('ar-EG');
    totalAllSpan.textContent = totals.all.toLocaleString('ar-EG');
  }

  addOrderButton?.addEventListener('click', () => {
    openOrderModal(clients, chalets, renderOrders);
  });

    pageRoot.dataset.ordersEventsBound = pageRoot.dataset.ordersEventsBound || '';
  if (!pageRoot.dataset.ordersEventsBound) {
    document.addEventListener('click', async (event) => {
      const deleteBtn = event.target.closest('button[data-action="delete-order"]');
      if (deleteBtn) {
        const orderId = deleteBtn.dataset.orderId;
        if (orderId) await confirmDeleteOrder(orderId, renderOrders);
        return;
      }

      const editBtn = event.target.closest('button[data-action="edit-order"]');
      if (editBtn) {
        const orderId = editBtn.dataset.orderId;
        if (!orderId) return;
        const existingOrder = orders.find(o => o.order_id === orderId);
        if (!existingOrder) return;
        await showOrderModal(clients, chalets, renderOrders, existingOrder);
        return;
      }
    });

    document.addEventListener('change', async (event) => {
      const select = event.target.closest('select[data-order-id]');
      if (!select) return;
      const orderId = select.dataset.orderId;
      const newStatus = select.value;
      if (!orderId) return;

      try {
        await api.updateOrder(orderId, { status: newStatus });
        showToast('success', 'تم تحديث حالة الطلب بنجاح');
        renderOrders();
      } catch (error) {
        showToast('error', 'خطأ في تحديث الطلب');
        select.value = select.dataset.currentStatus;
      }
    });
    pageRoot.dataset.ordersEventsBound = 'true';
  }

  searchInput?.addEventListener('input', updateTable);
  statusSelect?.addEventListener('change', updateTable);
  clientSelect?.addEventListener('change', updateTable);

  updateTable();
}

if (window.location.pathname.includes('orders.html')) {
  document.addEventListener('DOMContentLoaded', renderOrders);
}
