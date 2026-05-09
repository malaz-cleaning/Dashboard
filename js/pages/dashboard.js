import { api } from '../api.js';
import { renderModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

const pageRoot = document.getElementById('page-content');
const modalRoot = document.getElementById('modal-root');

function renderStatsCard(label, value, icon, color) {
  const iconHtml = icon ? `<div class="w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3">
    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      ${icon}
    </svg>
  </div>` : '';

  return `<div class="card-padded relative overflow-hidden group hover:scale-105 transition-all duration-300">
    <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${color.replace('from-', 'from-').replace('to-', 'to-')} opacity-10 rounded-full blur-xl"></div>
    ${iconHtml}
    <p class="text-slate-400 text-sm font-medium mb-1">${label}</p>
    <p class="text-2xl font-bold text-slate-50">${value}</p>
    <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${color} opacity-20 group-hover:opacity-40 transition-opacity"></div>
  </div>`;
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
    pending: {
      label: getStatusLabel(status),
      color: 'bg-accent-amber/20 text-accent-amber border-accent-amber/30',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    },
    in_progress: {
      label: getStatusLabel(status),
      color: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>'
    },
    done_unpaid: {
      label: getStatusLabel(status),
      color: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    },
    done_paid: {
      label: getStatusLabel(status),
      color: 'bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    },
    cancelled: {
      label: getStatusLabel(status),
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}">
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      ${config.icon}
    </svg>
    ${config.label}
  </span>`;
}

function formatCurrency(amount) {
  return 'EGP ' + Number(amount || 0).toLocaleString('ar-EG');
}

function renderRecentOrders(orders, clients, chalets) {
  if (!orders.length) {
    return `<div class="card-padded text-center">
      <div class="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-2xl flex items-center justify-center">
        <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <p class="text-slate-400 text-lg">لا يوجد طلبات حتى الآن</p>
      <p class="text-slate-500 text-sm mt-1">ابدأ بإضافة طلب جديد لترى آخر النشاطات هنا</p>
    </div>`;
  }

  const rows = orders
    .slice(-4)
    .reverse()
    .map((order) => {
      const client = clients.find((item) => item.client_id === order.client_id) || {};
      const chalet = chalets.find((item) => item.chalet_id === order.chalet_id) || {};
      return `<tr class="hover:bg-slate-800/40 transition-colors">
        <td class="px-4 py-4 text-slate-200 font-medium">#${order.order_id}</td>
        <td class="px-4 py-4 text-slate-200">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
              <span class="text-accent-cyan text-sm font-semibold">${(client.name || 'غير محدد').charAt(0)}</span>
            </div>
            <span class="text-sm">${client.name || 'غير محدد'}</span>
          </div>
        </td>
        <td class="px-4 py-4 text-slate-200">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-accent-purple/20 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <span class="text-sm">${chalet.chalet_name || 'غير محدد'}</span>
          </div>
        </td>
        <td class="px-4 py-4">${statusBadge(order.status)}</td>
        <td class="px-4 py-4 text-slate-200 font-semibold text-accent-emerald">${formatCurrency(order.price)}</td>
        <td class="px-4 py-4 text-slate-400 text-sm">${order.created_at}</td>
      </tr>`;
    })
    .join('');

  return `<div class="card-padded overflow-hidden">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-slate-50 flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-accent-amber to-accent-amber/80 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        آخر الطلبات
      </h2>
      <a href="orders.html" class="text-accent-cyan hover:text-accent-cyan/80 text-sm font-medium flex items-center gap-1 transition-colors">
        عرض الكل
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-700/50">
            <th class="px-4 py-3 text-right text-slate-400 font-medium text-sm">رقم الطلب</th>
            <th class="px-4 py-3 text-right text-slate-400 font-medium text-sm">العميل</th>
            <th class="px-4 py-3 text-right text-slate-400 font-medium text-sm">الشاليه</th>
            <th class="px-4 py-3 text-right text-slate-400 font-medium text-sm">الحالة</th>
            <th class="px-4 py-3 text-right text-slate-400 font-medium text-sm">السعر</th>
            <th class="px-4 py-3 text-right text-slate-400 font-medium text-sm">التاريخ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/30">${rows}</tbody>
      </table>
    </div>
  </div>`;
}

function buildChartData(orders) {
  const statusCounts = orders.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  const statusLabels = ['pending', 'in_progress', 'done_unpaid', 'done_paid', 'cancelled'];
  return statusLabels.map((key) => ({ label: getStatusLabel(key), value: statusCounts[key] || 0 }));
}

function renderDashboardCards(clients, chalets, orders) {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.price || 0), 0);
  return `<div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-6 sm:mb-8">
    ${renderStatsCard('عدد العملاء', clients.length,
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>',
      'from-accent-cyan to-accent-cyan/80')}
    ${renderStatsCard('عدد الشاليهات', chalets.length,
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>',
      'from-accent-purple to-accent-purple/80')}
    ${renderStatsCard('عدد الطلبات', orders.length,
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
      'from-accent-amber to-accent-amber/80')}
    ${renderStatsCard('الإيراد الكلي', 'EGP ' + totalRevenue.toLocaleString('ar-EG'),
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>',
      'from-accent-emerald to-accent-emerald/80')}
  </div>`;
}

function renderQuickActions() {
  return `<div class="card-padded mb-6 sm:mb-8">
    <h3 class="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
      الإجراءات السريعة
    </h3>
    <div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <button class="btn-primary w-full py-4 flex items-center justify-center gap-3 group" id="add-order-button">
        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        إضافة طلب جديد
      </button>
      <button class="btn-ghost w-full py-4 flex items-center justify-center gap-3 hover:bg-accent-cyan/10 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all" data-href="clients.html">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
        </svg>
        إدارة العملاء
      </button>
      <button class="btn-ghost w-full py-4 flex items-center justify-center gap-3 hover:bg-accent-purple/10 hover:text-accent-purple hover:border-accent-purple/50 transition-all" data-href="chalets.html">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        إدارة الشاليهات
      </button>
      <button class="btn-ghost w-full py-4 flex items-center justify-center gap-3 hover:bg-accent-emerald/10 hover:text-accent-emerald hover:border-accent-emerald/50 transition-all" data-href="analytics.html">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        عرض التحليلات
      </button>
    </div>
  </div>`;
}


async function renderAddOrderModal() {
  const clients = await api.getClients();
  const chalets = await api.getChalets();
  const selectedClientId = clients[0]?.client_id || '';

  const clientOptions = clients
    .map((client) => '<option value="' + client.client_id + '">' + client.name + ' (' + client.type + ')</option>')
    .join('');

  const chaletOptions = chalets
    .filter((chalet) => chalet.client_id === selectedClientId)
    .map((chalet) => '<option value="' + chalet.chalet_id + '">' + chalet.chalet_name + '</option>')
    .join('');

  const content = '<div class="space-y-4">' +
    '<div>' +
      '<label class="form-label" for="order-client">العميل</label>' +
      '<div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">' +
        '<select id="order-client" class="form-select flex-1">' + clientOptions + '</select>' +
        '<button class="btn btn-secondary px-3 py-2 sm:px-4 w-full sm:w-auto" id="add-client-button">+ عميل</button>' +
      '</div>' +
    '</div>' +
    '<div>' +
      '<label class="form-label" for="order-chalet">الشاليه</label>' +
      '<div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">' +
        '<select id="order-chalet" class="form-select flex-1">' + chaletOptions + '</select>' +
        '<button class="btn btn-secondary px-3 py-2 sm:px-4 w-full sm:w-auto" id="add-chalet-button">+ شاليه</button>' +
      '</div>' +
    '</div>' +
    '<div class="grid gap-4 grid-cols-1 md:grid-cols-2">' +
      '<div>' +
        '<label class="form-label" for="order-status">الحالة</label>' +
        '<select id="order-status" class="form-select">' +
          '<option value="pending">معلقة</option>' +
          '<option value="in_progress">قيد التنفيذ</option>' +
          '<option value="done_unpaid">تمت ولم يُدفع</option>' +
          '<option value="done_paid">تمت ودُفع</option>' +
          '<option value="cancelled">ملغاة</option>' +
        '</select>' +
      '</div>' +
      '<div>' +
        '<label class="form-label" for="order-price">السعر</label>' +
        '<input id="order-price" type="number" class="form-input" placeholder="مثلاً 420" />' +
      '</div>' +
    '</div>' +
    '<div>' +
      '<label class="form-label" for="order-notes">الملاحظات</label>' +
      '<textarea id="order-notes" rows="4" class="form-textarea" placeholder="تفاصيل إضافية"></textarea>' +
    '</div>' +
    '<div class="grid gap-4 grid-cols-1 md:grid-cols-2 items-start md:items-end">' +
      '<div>' +
        '<label class="form-label" for="order-date">تاريخ الطلب</label>' +
        '<input id="order-date" type="date" class="form-input" value="' + new Date().toISOString().split('T')[0] + '" />' +
      '</div>' +
      '<div class="flex justify-start md:justify-end">' +
        '<button class="btn btn-primary w-full md:w-auto" id="save-order-button">حفظ الطلب</button>' +
      '</div>' +
    '</div>' +
  '</div>';

  renderModal(modalRoot, 'إضافة طلب جديد', content);

  const clientSelect = modalRoot.querySelector('#order-client');
  const chaletSelect = modalRoot.querySelector('#order-chalet');
  const addClientButton = modalRoot.querySelector('#add-client-button');
  const addChaletButton = modalRoot.querySelector('#add-chalet-button');
  const saveOrderButton = modalRoot.querySelector('#save-order-button');
  const statusSelect = modalRoot.querySelector('#order-status');
  const priceInput = modalRoot.querySelector('#order-price');
  const notesInput = modalRoot.querySelector('#order-notes');
  const dateInput = modalRoot.querySelector('#order-date');

  function refreshChalets() {
    const currentClientId = clientSelect.value;
    const filtered = chalets.filter((item) => item.client_id === currentClientId);
    chaletSelect.innerHTML = filtered.length
      ? filtered.map((item) => '<option value="' + item.chalet_id + '">' + item.chalet_name + '</option>').join('')
      : '<option value="">لا يوجد شاليهات</option>';
  }

  clientSelect?.addEventListener('change', refreshChalets);

  addClientButton?.addEventListener('click', () => {
    const clientModalContent = `
      <div class="space-y-4">
        <div>
          <label class="form-label" for="new-client-name">الاسم</label>
          <input id="new-client-name" type="text" class="form-input" placeholder="اسم العميل" />
        </div>
        <div>
          <label class="form-label" for="new-client-phone">الهاتف</label>
          <input id="new-client-phone" type="tel" class="form-input" placeholder="رقم الهاتف" />
        </div>
        <div>
          <label class="form-label" for="new-client-type">النوع</label>
          <select id="new-client-type" class="form-select">
            <option value="owner">مالك مباشر</option>
            <option value="broker">سمسار</option>
          </select>
        </div>
      <div class="flex flex-col sm:flex-row gap-3 justify-end">
        <button class="btn btn-primary w-full sm:w-auto" id="save-new-client-button">حفظ العميل</button>
      </div>
    </div>`;
    renderModal(modalRoot, 'إضافة عميل جديد', clientModalContent);
  });

  addChaletButton?.addEventListener('click', () => {
    const chaletModalContent = '<div class="space-y-4">' +
      '<div class="grid gap-4 grid-cols-1 md:grid-cols-2">' +
        '<div>' +
          '<label class="form-label" for="new-chalet-name">الشاليه</label>' +
          '<input id="new-chalet-name" type="text" class="form-input" placeholder="اسم الشاليه" />' +
        '</div>' +
        '<div>' +
          '<label class="form-label" for="new-chalet-location">الموقع</label>' +
          '<input id="new-chalet-location" type="text" class="form-input" placeholder="الموقع" />' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<label class="form-label" for="new-chalet-client">العميل</label>' +
        '<select id="new-chalet-client" class="form-select">' +
          clients.map((client) => '<option value="' + client.client_id + '">' + client.name + '</option>').join('') +
        '</select>' +
      '</div>' +
      '<div>' +
        '<label class="form-label" for="new-chalet-details">التفاصيل</label>' +
        '<textarea id="new-chalet-details" rows="4" class="form-textarea" placeholder="تفاصيل الشاليه"></textarea>' +
      '</div>' +
      '<div class="flex flex-col sm:flex-row gap-3 justify-end">' +
        '<button class="btn btn-primary w-full sm:w-auto" id="save-new-chalet-button">حفظ الشاليه</button>' +
      '</div>' +
    '</div>';

    renderModal(modalRoot, 'إضافة شاليه جديد', chaletModalContent);

    const saveNewChaletButton = modalRoot.querySelector('#save-new-chalet-button');
    saveNewChaletButton?.addEventListener('click', async () => {
      const name = modalRoot.querySelector('#new-chalet-name')?.value.trim();
      const location = modalRoot.querySelector('#new-chalet-location')?.value.trim();
      const details = modalRoot.querySelector('#new-chalet-details')?.value.trim();
      const clientId = modalRoot.querySelector('#new-chalet-client')?.value;

      if (!name || !location || !clientId) {
        showToast('error', 'الرجاء تعبئة جميع الحقول');
        return;
      }

      await api.addChalet({ client_id: clientId, chalet_name: name, location, details });
      showToast('success', 'تم إضافة الشاليه بنجاح');
      await renderAddOrderModal();
    });
  });

  saveOrderButton?.addEventListener('click', async () => {
    if (!clientSelect.value || !chaletSelect.value || !priceInput.value) {
      showToast('error', 'الرجاء تعبئة العميل والشاليه والسعر');
      return;
    }

    await api.addOrder({
      client_id: clientSelect.value,
      chalet_id: chaletSelect.value,
      status: statusSelect.value,
      price: priceInput.value,
      notes: notesInput.value,
      created_at: dateInput.value,
    });
    showToast('success', 'تم إضافة الطلب بنجاح');
    modalRoot.innerHTML = '';
    renderDashboard();
  });
}

function renderStatusSummary(statusData) {
  return '<div class="card p-4 sm:p-6 h-full">' +
    '<h2 class="text-xl font-semibold text-slate-50 mb-4">حالات الطلبات</h2>' +
    statusData.map((item) =>
      '<div class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 mb-3">' +
        '<span class="text-slate-300">' + item.label + '</span>' +
        '<span class="text-slate-50 font-semibold">' + item.value + '</span>' +
      '</div>'
    ).join('') +
  '</div>';
}

function renderRevenueSummary(revenueByMonth, bestMonth) {
  const totalRevenue = revenueByMonth.reduce((sum, value) => sum + value, 0);
  const averageRevenue = Math.round(totalRevenue / revenueByMonth.length);

  return '<div class="card p-4 sm:p-6 h-full">' +
    '<h2 class="text-xl font-semibold text-slate-50 mb-4">الإيراد الشهري</h2>' +
    '<div class="space-y-3">' +
      '<div class="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 flex items-center justify-between">' +
        '<span class="text-slate-300">إجمالي الإيراد</span>' +
        '<span class="text-slate-50 font-semibold">' + formatCurrency(totalRevenue) + '</span>' +
      '</div>' +
      '<div class="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 flex items-center justify-between">' +
        '<span class="text-slate-300">متوسط الإيراد الشهري</span>' +
        '<span class="text-slate-50 font-semibold">' + formatCurrency(averageRevenue) + '</span>' +
      '</div>' +
      '<div class="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 flex items-center justify-between">' +
        '<span class="text-slate-300">أفضل شهر</span>' +
        '<span class="text-slate-50 font-semibold">' + bestMonth + '</span>' +
      '</div>' +
    '</div>' +
  '</div>';
}

export async function renderDashboard() {
  if (!pageRoot) return;
  try {
    const clients = await api.getClients();
    const chalets = await api.getChalets();
    const orders = await api.getOrders();
    const statusData = buildChartData(orders);
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    const revenueByMonth = months.map((_, index) => orders
      .filter((order) => new Date(order.created_at).getMonth() === index)
      .reduce((sum, order) => sum + Number(order.price || 0), 0)
    );
    const bestMonthIndex = revenueByMonth.indexOf(Math.max(...revenueByMonth));
    const bestMonth = months[bestMonthIndex] || 'غير متوفر';

    pageRoot.innerHTML = '<div class="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">' +
      '<div>' +
        '<h1 class="text-2xl sm:text-3xl font-bold text-slate-50">لوحة القيادة</h1>' +
        '<p class="text-slate-400 mt-2 text-sm sm:text-base">ملخص سريع لإدارة الطلبات والعملاء.</p>' +
      '</div>' +
      renderQuickActions() +
      renderDashboardCards(clients, chalets, orders) +
      '<div class="grid gap-3 sm:gap-4 grid-cols-1 xl:grid-cols-2">' +
        renderStatusSummary(statusData) +
        renderRevenueSummary(revenueByMonth, bestMonth) +
      '</div>' +
      renderRecentOrders(orders, clients, chalets) +
    '</div>';
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    pageRoot.innerHTML = '<div class="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">' +
      '<div>' +
        '<h1 class="text-2xl sm:text-3xl font-bold text-slate-50">خطأ في تحميل البيانات</h1>' +
        '<p class="text-slate-400 mt-2 text-sm sm:text-base">حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>' +
        '<button class="btn btn-primary mt-4" onclick="location.reload()">إعادة تحميل</button>' +
      '</div>' +
    '</div>';
  }

  document.getElementById('add-order-button')?.addEventListener('click', () => {
    renderAddOrderModal();
  });

  document.querySelectorAll('[data-href]').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = button.getAttribute('data-href');
    });
  });

  if (window.openOrderModal) {
    renderAddOrderModal();
    window.openOrderModal = false;
  }
}

renderDashboard();
