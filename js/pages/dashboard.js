import { api } from '../api.js';
import { renderModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

const pageRoot = document.getElementById('page-content');
const modalRoot = document.getElementById('modal-root');

function renderStatsCard(label, value) {
  return `
    <div class="card p-6">
      <p class="text-slate-400">${label}</p>
      <p class="text-3xl font-semibold text-slate-50 mt-3">${value}</p>
    </div>
  `;
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
  return `<span class="badge ${status}">${getStatusLabel(status)}</span>`;
}

function renderRecentOrders(orders, clients, chalets) {
  if (!orders.length) {
    return `
      <div class="card p-6 text-center text-slate-400">
        لا يوجد طلبات حتى الآن.
      </div>
    `;
  }

  const rows = orders
    .slice(-4)
    .reverse()
    .map((order) => {
      const client = clients.find((item) => item.client_id === order.client_id) || {};
      const chalet = chalets.find((item) => item.chalet_id === order.chalet_id) || {};
      return `
        <tr class="hover:bg-slate-800/60">
          <td class="px-5 py-4 text-slate-200">${order.order_id}</td>
          <td class="px-5 py-4 text-slate-200">${client.name || 'غير محدد'}</td>
          <td class="px-5 py-4 text-slate-200">${chalet.chalet_name || 'غير محدد'}</td>
          <td class="px-5 py-4">${statusBadge(order.status)}</td>
          <td class="px-5 py-4 text-slate-200">EGP ${order.price}</td>
          <td class="px-5 py-4 text-slate-200">${order.created_at}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="card overflow-hidden">
      <div class="p-6 border-b border-slate-700">
        <h2 class="text-xl font-semibold text-slate-50">آخر الطلبات</h2>
      </div>
      <div class="table-wrapper">
        <table class="min-w-full text-sm text-left md:text-base">
          <thead class="bg-slate-900">
            <tr>
              <th class="px-5 py-4 text-slate-400">رقم الطلب</th>
              <th class="px-5 py-4 text-slate-400">العميل</th>
              <th class="px-5 py-4 text-slate-400">الشاليه</th>
              <th class="px-5 py-4 text-slate-400">الحالة</th>
              <th class="px-5 py-4 text-slate-400">السعر</th>
              <th class="px-5 py-4 text-slate-400">التاريخ</th>
            </tr>
          </thead>
          <tbody class="bg-slate-800">${rows}</tbody>
        </table>
      </div>
    </div>
  `;
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
  return `
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
      ${renderStatsCard('عدد العملاء', clients.length)}
      ${renderStatsCard('عدد الشاليهات', chalets.length)}
      ${renderStatsCard('عدد الطلبات', orders.length)}
      ${renderStatsCard('الإيراد الكلي', `EGP ${totalRevenue.toLocaleString('ar-EG')}`)}
    </div>
  `;
}

function renderQuickActions() {
  return `
    <div class="card p-6 mb-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button class="btn btn-primary w-full" id="add-order-button">إضافة طلب جديد</button>
        <button class="btn btn-secondary w-full" data-href="clients.html">إدارة العملاء</button>
        <button class="btn btn-secondary w-full" data-href="chalets.html">إدارة الشاليهات</button>
        <button class="btn btn-secondary w-full" data-href="analytics.html">عرض التحليلات</button>
      </div>
    </div>
  `;
}

function initCharts(orders) {
  const statusData = buildChartData(orders);
  const pieCanvas = document.getElementById('dashboard-status-chart');
  const lineCanvas = document.getElementById('dashboard-revenue-chart');

  if (pieCanvas) {
    new Chart(pieCanvas, {
      type: 'doughnut',
      data: {
        labels: statusData.map((item) => item.label),
        datasets: [{ data: statusData.map((item) => item.value), backgroundColor: ['#f59e0b', '#3b82f6', '#0ea5e9', '#10b981', '#ef4444'] }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } }, layout: { padding: 12 } },
    });
  }

  if (lineCanvas) {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    const revenueByMonth = months.map((_, index) => orders.filter((order) => new Date(order.created_at).getMonth() === index).reduce((sum, order) => sum + Number(order.price || 0), 0));

    new Chart(lineCanvas, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{ label: 'الإيراد الشهري', data: revenueByMonth, borderColor: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.16)', fill: true, tension: 0.35 }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#cbd5e1' } }, y: { ticks: { color: '#cbd5e1' } } } },
    });
  }
}

async function renderAddOrderModal() {
  const clients = await api.getClients();
  const chalets = await api.getChalets();
  const selectedClientId = clients[0]?.client_id || '';

  const clientOptions = clients
    .map((client) => `<option value="${client.client_id}">${client.name} (${client.type})</option>`)
    .join('');

  const chaletOptions = chalets
    .filter((chalet) => chalet.client_id === selectedClientId)
    .map((chalet) => `<option value="${chalet.chalet_id}">${chalet.chalet_name}</option>`)
    .join('');

  const content = `
    <div class="space-y-4">
      <div>
        <label class="form-label" for="order-client">العميل</label>
        <div class="flex gap-3 items-end">
          <select id="order-client" class="form-select flex-1">${clientOptions}</select>
          <button class="btn btn-secondary px-4 py-2" id="add-client-button">+ عميل</button>
        </div>
      </div>
      <div>
        <label class="form-label" for="order-chalet">الشاليه</label>
        <div class="flex gap-3 items-end">
          <select id="order-chalet" class="form-select flex-1">${chaletOptions}</select>
          <button class="btn btn-secondary px-4 py-2" id="add-chalet-button">+ شاليه</button>
        </div>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="form-label" for="order-status">الحالة</label>
          <select id="order-status" class="form-select">
            <option value="pending">معلقة</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="done_unpaid">تمت ولم يُدفع</option>
            <option value="done_paid">تمت ودُفع</option>
            <option value="cancelled">ملغاة</option>
          </select>
        </div>
        <div>
          <label class="form-label" for="order-price">السعر</label>
          <input id="order-price" type="number" class="form-input" placeholder="مثلاً 420" />
        </div>
      </div>
      <div>
        <label class="form-label" for="order-notes">الملاحظات</label>
        <textarea id="order-notes" rows="4" class="form-textarea" placeholder="تفاصيل إضافية"></textarea>
      </div>
      <div class="grid gap-4 md:grid-cols-2 items-end">
        <div>
          <label class="form-label" for="order-date">تاريخ الطلب</label>
          <input id="order-date" type="date" class="form-input" value="${new Date().toISOString().split('T')[0]}" />
        </div>
        <div class="flex justify-end">
          <button class="btn btn-primary" id="save-order-button">حفظ الطلب</button>
        </div>
      </div>
    </div>
  `;

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
      ? filtered.map((item) => `<option value="${item.chalet_id}">${item.chalet_name}</option>`).join('')
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
        <div class="flex justify-end">
          <button class="btn btn-primary" id="save-new-client-button">حفظ العميل</button>
        </div>
      </div>
    `;

    renderModal(modalRoot, 'إضافة عميل جديد', clientModalContent);

    const saveNewClientButton = modalRoot.querySelector('#save-new-client-button');
    saveNewClientButton?.addEventListener('click', async () => {
      const name = modalRoot.querySelector('#new-client-name')?.value.trim();
      const phone = modalRoot.querySelector('#new-client-phone')?.value.trim();
      const type = modalRoot.querySelector('#new-client-type')?.value;

      if (!name || !phone) {
        showToast('error', 'الرجاء تعبئة الاسم والهاتف');
        return;
      }

      await api.addClient({ name, phone, type });
      showToast('success', 'تم إضافة العميل بنجاح');
      await renderAddOrderModal();
    });
  });

  addChaletButton?.addEventListener('click', () => {
    const chaletModalContent = `
      <div class="space-y-4">
        <div>
          <label class="form-label" for="new-chalet-name">الشاليه</label>
          <input id="new-chalet-name" type="text" class="form-input" placeholder="اسم الشاليه" />
        </div>
        <div>
          <label class="form-label" for="new-chalet-location">الموقع</label>
          <input id="new-chalet-location" type="text" class="form-input" placeholder="الموقع" />
        </div>
        <div>
          <label class="form-label" for="new-chalet-client">العميل</label>
          <select id="new-chalet-client" class="form-select">
            ${clients.map((client) => `<option value="${client.client_id}">${client.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label" for="new-chalet-details">التفاصيل</label>
          <textarea id="new-chalet-details" rows="3" class="form-textarea" placeholder="تفاصيل الشاليه"></textarea>
        </div>
        <div class="flex justify-end">
          <button class="btn btn-primary" id="save-new-chalet-button">حفظ الشاليه</button>
        </div>
      </div>
    `;

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

export async function renderDashboard() {
  if (!pageRoot) return;
  const clients = await api.getClients();
  const chalets = await api.getChalets();
  const orders = await api.getOrders();

  pageRoot.innerHTML = `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-50">لوحة القيادة</h1>
        <p class="text-slate-400 mt-2">ملخص سريع لإدارة الطلبات والعملاء.</p>
      </div>
      ${renderQuickActions()}
      ${renderDashboardCards(clients, chalets, orders)}
      <div class="grid gap-4 xl:grid-cols-2">
        <div class="card p-6 h-full">
          <h2 class="text-xl font-semibold text-slate-50 mb-4">حالات الطلبات</h2>
          <div class="h-[320px]"><canvas id="dashboard-status-chart"></canvas></div>
        </div>
        <div class="card p-6 h-full">
          <h2 class="text-xl font-semibold text-slate-50 mb-4">الإيراد الشهري</h2>
          <div class="h-[320px]"><canvas id="dashboard-revenue-chart"></canvas></div>
        </div>
      </div>
      ${renderRecentOrders(orders, clients, chalets)}
    </div>
  `;

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

  initCharts(orders);
}

renderDashboard();
