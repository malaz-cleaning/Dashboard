import { api } from '../api.js';
import { renderModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

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
        <div style="display: flex; gap: 10px; align-items: flex-end;">
          <select id="order-client" class="select-field" style="flex: 1;">${clientOptions}</select>
          <button class="button-secondary" id="add-client-button" style="padding: 14px 16px; min-height: 44px;">+ عميل</button>
        </div>
      </label>
    </div>
    <div class="form-row">
      <label>
        الشاليه
        <div style="display: flex; gap: 10px; align-items: flex-end;">
          <select id="order-chalet" class="select-field" style="flex: 1;">${chaletOptions}</select>
          <button class="button-secondary" id="add-chalet-button" style="padding: 14px 16px; min-height: 44px;">+ شاليه</button>
        </div>
      </label>
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

  // Add new client modal
  addClientButton?.addEventListener('click', () => {
    const clientModalContent = `
      <div class="form-row">
        <label>
          الاسم
          <input id="new-client-name" type="text" class="input-field" placeholder="اسم العميل" />
        </label>
        <label>
          الهاتف
          <input id="new-client-phone" type="tel" class="input-field" placeholder="رقم الهاتف" />
        </label>
      </div>
      <div class="form-row">
        <label>
          النوع
          <select id="new-client-type" class="select-field">
            <option value="owner">Owner</option>
            <option value="broker">Broker</option>
          </select>
        </label>
      </div>
      <div class="form-actions">
        <button class="button-primary" id="save-new-client-button">حفظ العميل</button>
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

      const newClient = await api.addClient({ name, phone, type });
      showToast('success', 'تم إضافة العميل بنجاح');
      
      // Re-render the order modal with updated clients
      await renderAddOrderModal();
    });
  });

  // Add new chalet modal
  addChaletButton?.addEventListener('click', () => {
    const currentClients = clients;
    const chaletModalContent = `
      <div class="form-row">
        <label>
          الشاليه
          <input id="new-chalet-name" type="text" class="input-field" placeholder="اسم الشاليه" />
        </label>
        <label>
          الموقع
          <input id="new-chalet-location" type="text" class="input-field" placeholder="الموقع" />
        </label>
      </div>
      <div class="form-row">
        <label>
          العميل
          <select id="new-chalet-client" class="select-field">
            ${currentClients.map((client) => `<option value="${client.client_id}">${client.name}</option>`).join('')}
          </select>
        </label>
        <label>
          التفاصيل
          <textarea id="new-chalet-details" rows="3" class="textarea-field" placeholder="تفاصيل الشاليه"></textarea>
        </label>
      </div>
      <div class="form-actions">
        <button class="button-primary" id="save-new-chalet-button">حفظ الشاليه</button>
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

      const newChalet = await api.addChalet({ client_id: clientId, chalet_name: name, location, details });
      showToast('success', 'تم إضافة الشاليه بنجاح');
      
      // Re-render the order modal with updated chalets
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
