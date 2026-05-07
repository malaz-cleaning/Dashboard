import { api } from '../api.js';
import { renderModal } from '../components/modal.js';

const pageRoot = document.getElementById('page-content');
const modalRoot = document.getElementById('modal-root');

function renderStatsCard(label, value) {
  return `
    <div class="card">
      <p class="text-slate-300">${label}</p>
      <p class="page-title">${value}</p>
    </div>
  `;
}

function getStatusLabel(status) {
  const map = {
    pending: 'معلقة',
    in_progress: 'قيد التنفيذ',
    done_unpaid: 'تمت وتم الدفع لا',
    done_paid: 'تمت وتم الدفع',
    cancelled: 'ملغاة',
  };
  return map[status] || status;
}

function statusBadge(status) {
  return `<span class="badge ${status}">${getStatusLabel(status)}</span>`;
}

function renderRecentOrders(orders, clients, chalets) {
  if (!orders.length) {
    return `<div class="card empty-state">لا يوجد طلبات حتى الآن.</div>`;
  }

  const rows = orders
    .slice(-4)
    .reverse()
    .map((order) => {
      const client = clients.find((item) => item.client_id === order.client_id) || {};
      const chalet = chalets.find((item) => item.chalet_id === order.chalet_id) || {};
      return `
        <tr>
          <td>${order.order_id}</td>
          <td>${client.name || 'غير محدد'}</td>
          <td>${chalet.chalet_name || 'غير محدد'}</td>
          <td>${statusBadge(order.status)}</td>
          <td>EGP ${order.price}</td>
          <td>${order.created_at}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="card">
      <h2 class="page-title">آخر الطلبات</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>العميل</th>
              <th>الشاليه</th>
              <th>الحالة</th>
              <th>السعر</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
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
  const monthlyRevenue = orders.reduce((sum, order) => sum + Number(order.price || 0), 0);
  return `
    <div class="stats-grid">
      ${renderStatsCard('عدد العملاء', clients.length)}
      ${renderStatsCard('عدد الشاليهات', chalets.length)}
      ${renderStatsCard('عدد الطلبات', orders.length)}
      ${renderStatsCard('الإيراد الكلي', `EGP ${monthlyRevenue}`)}
    </div>
  `;
}

function renderQuickActions() {
  return `
    <div class="card quick-actions-grid">
      <button class="button-primary" id="add-order-button">إضافة طلب جديد</button>
      <button class="button-secondary" data-href="clients.html">إدارة العملاء</button>
      <button class="button-secondary" data-href="chalets.html">إدارة الشاليهات</button>
      <button class="button-secondary" data-href="analytics.html">عرض التحليلات</button>
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
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
    });
  }

  if (lineCanvas) {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    const revenueByMonth = months.map((month, index) => orders.filter((order) => new Date(order.created_at).getMonth() === index).reduce((sum, order) => sum + Number(order.price || 0), 0));

    new Chart(lineCanvas, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{ label: 'الإيراد الشهري', data: revenueByMonth, borderColor: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.16)', fill: true, tension: 0.35 }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
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
    <div class="form-row">
      <label>
        العميل
        <select id="order-client" class="select-field">${clientOptions}</select>
      </label>
      <button class="button-secondary" id="add-client-button">+ عميل جديد</button>
    </div>
    <div class="form-row">
      <label>
        الشاليه
        <select id="order-chalet" class="select-field">${chaletOptions}</select>
      </label>
      <button class="button-secondary" id="add-chalet-button">+ شاليه جديد</button>
    </div>
    <div class="form-row columns-2">
      <label>
        الحالة
        <select id="order-status" class="select-field">
          <option value="pending">معلقة</option>
          <option value="in_progress">قيد التنفيذ</option>
          <option value="done_unpaid">تمت ولم يُدفع</option>
          <option value="done_paid">تمت ودُفع</option>
          <option value="cancelled">ملغاة</option>
        </select>
      </label>
      <label>
        السعر
        <input id="order-price" type="number" class="input-field" placeholder="مثلاً 420" />
      </label>
    </div>
    <div class="form-row">
      <label>
        الملاحظات
        <textarea id="order-notes" rows="4" class="textarea-field" placeholder="تفاصيل إضافية"></textarea>
      </label>
    </div>
    <div class="form-row columns-2">
      <label>
        تاريخ الطلب
        <input id="order-date" type="date" class="input-field" value="${new Date().toISOString().split('T')[0]}" />
      </label>
      <div class="form-actions">
        <button class="button-primary" id="save-order-button">حفظ الطلب</button>
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

  addClientButton?.addEventListener('click', async () => {
    const name = window.prompt('اسم العميل الجديد');
    const phone = window.prompt('رقم الهاتف');
    const type = window.prompt('نوع العميل (owner أو broker)', 'owner');

    if (!name || !phone) return;
    const newClient = await api.addClient({ type: type || 'owner', name, phone });
    clientSelect.insertAdjacentHTML('beforeend', `<option value="${newClient.client_id}" selected>${newClient.name}</option>`);
    clientSelect.value = newClient.client_id;
    refreshChalets();
  });

  addChaletButton?.addEventListener('click', async () => {
    const name = window.prompt('اسم الشاليه');
    const location = window.prompt('الموقع');
    const details = window.prompt('تفاصيل الشاليه');
    const clientId = clientSelect.value;
    if (!name || !clientId) return;
    const newChalet = await api.addChalet({ client_id: clientId, chalet_name: name, location, details });
    chaletSelect.insertAdjacentHTML('beforeend', `<option value="${newChalet.chalet_id}" selected>${newChalet.chalet_name}</option>`);
    chaletSelect.value = newChalet.chalet_id;
  });

  saveOrderButton?.addEventListener('click', async () => {
    if (!clientSelect.value || !chaletSelect.value || !priceInput.value) {
      window.alert('الرجاء تعبئة العميل والشاليه والسعر.');
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
    <section class="dashboard-panel">
      <div class="title-group">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p>ملخص سريع لإدارة الطلبات والعملاء.</p>
        </div>
      </div>
      ${renderQuickActions()}
      ${renderDashboardCards(clients, chalets, orders)}
      <div class="chart-grid">
        <div class="card chart-card">
          <h2 class="page-title">حالات الطلبات</h2>
          <canvas id="dashboard-status-chart" height="260"></canvas>
        </div>
        <div class="card chart-card">
          <h2 class="page-title">الإيراد الشهري</h2>
          <canvas id="dashboard-revenue-chart" height="260"></canvas>
        </div>
      </div>
      ${renderRecentOrders(orders, clients, chalets)}
    </section>
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
