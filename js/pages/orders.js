import { api } from '../api.js';
import { showToast } from '../components/toast.js';
import { renderModal } from '../components/modal.js';

const pageRoot = document.getElementById('page-content');

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

function renderOrderRows(orders, clients, chalets) {
  if (!orders.length) {
    return `<tr><td colspan="8" class="empty-state">لا يوجد طلبات مطابقة.</td></tr>`;
  }

  return orders
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
          <td>${order.notes || '-'}</td>
          <td>${order.created_at}</td>
          <td>${order.completed_at || '-'}</td>
          <td>
            <button class="button-secondary" data-action="delete" data-id="${order.order_id}">حذف</button>
          </td>
        </tr>
      `;
    })
    .join('');
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

function openOrderModal(clients, chalets, refresh) {
  const content = `
    <div class="form-row">
      <label>
        العميل
        <select id="order-client-select" class="select-field">
          <option value="">اختر عميل</option>
          ${clients.map((client) => `<option value="${client.client_id}">${client.name}</option>`).join('')}
        </select>
      </label>
      <label>
        الشاليه
        <select id="order-chalet-select" class="select-field">
          <option value="">اختر شاليه</option>
        </select>
      </label>
    </div>
    <div class="form-row">
      <label>
        الحالة
        <select id="order-status-select" class="select-field">
          <option value="pending">معلقة</option>
          <option value="in_progress">قيد التنفيذ</option>
          <option value="done_unpaid">تمت ولم يُدفع</option>
          <option value="done_paid">تمت ودُفع</option>
          <option value="cancelled">ملغاة</option>
        </select>
      </label>
      <label>
        السعر
        <input id="order-price" type="number" class="input-field" placeholder="السعر" />
      </label>
    </div>
    <div class="form-row">
      <label>
        ملاحظات
        <textarea id="order-notes" rows="3" class="textarea-field" placeholder="ملاحظات إضافية"></textarea>
      </label>
    </div>
    <div class="form-actions">
      <button class="button-primary" id="save-order-button">حفظ الطلب</button>
    </div>
  `;

  renderModal(document.getElementById('modal-root'), 'إضافة طلب جديد', content);
  
  const clientSelect = document.getElementById('order-client-select');
  const chaletSelect = document.getElementById('order-chalet-select');
  const saveButton = document.getElementById('save-order-button');

  clientSelect?.addEventListener('change', (e) => {
    const clientId = e.target.value;
    const clientChalets = clientId ? chalets.filter((c) => c.client_id === clientId) : [];
    chaletSelect.innerHTML = `
      <option value="">اختر شاليه</option>
      ${clientChalets.map((c) => `<option value="${c.chalet_id}">${c.chalet_name}</option>`).join('')}
    `;
  });

  saveButton?.addEventListener('click', async () => {
    const client_id = clientSelect?.value.trim();
    const chalet_id = chaletSelect?.value.trim();
    const status = document.getElementById('order-status-select')?.value;
    const price = document.getElementById('order-price')?.value.trim();
    const notes = document.getElementById('order-notes')?.value.trim();
    const created_at = new Date().toISOString().split('T')[0];

    if (!client_id || !chalet_id || !price) {
      window.alert('الرجاء تعبئة جميع الحقول الإلزامية.');
      return;
    }

    await api.addOrder({ client_id, chalet_id, status, price: Number(price), notes, created_at });
    showToast('success', 'تم إضافة الطلب بنجاح');
    refresh();
    document.getElementById('modal-root').innerHTML = '';
  });
}

export async function renderOrders() {
  if (!pageRoot) return;
  const [orders, clients, chalets] = await Promise.all([api.getOrders(), api.getClients(), api.getChalets()]);

  pageRoot.innerHTML = `
    <section class="dashboard-panel">
      <div class="title-group">
        <div>
          <h1 class="page-title">Orders</h1>
          <p>عرض وإدارة جميع الطلبات.</p>
        </div>
      </div>
      <div class="card">
        <div class="form-row columns-2">
          <label>
            بحث
            <input id="order-search" type="search" class="input-field" placeholder="ابحث برقم الطلب أو العميل" />
          </label>
          <label>
            حالة الطلب
            <select id="order-status-filter" class="select-field">
              <option value="">كل الحالات</option>
              <option value="pending">معلقة</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="done_unpaid">تمت ولم يُدفع</option>
              <option value="done_paid">تمت ودُفع</option>
              <option value="cancelled">ملغاة</option>
            </select>
          </label>
        </div>
        <div class="form-row columns-2">
          <label>
            عميل
            <select id="order-client-filter" class="select-field">
              <option value="">كل العملاء</option>
              ${clients.map((client) => `<option value="${client.client_id}">${client.name}</option>`).join('')}
            </select>
          </label>
          <button class="button-primary" id="goto-dashboard-order">إضافة طلب جديد</button>
        </div>
      </div>
      <div class="card table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>العميل</th>
              <th>الشاليه</th>
              <th>الحالة</th>
              <th>السعر</th>
              <th>ملاحظات</th>
              <th>تاريخ الإنشاء</th>
              <th>تاريخ الإنجاز</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody id="orders-table-body"></tbody>
        </table>
      </div>
    </section>
  `;

  const searchInput = pageRoot.querySelector('#order-search');
  const statusSelect = pageRoot.querySelector('#order-status-filter');
  const clientSelect = pageRoot.querySelector('#order-client-filter');
  const tableBody = pageRoot.querySelector('#orders-table-body');
  const addOrderButton = pageRoot.querySelector('#goto-dashboard-order');

  function updateTable() {
    const filters = {
      search: searchInput.value.trim(),
      status: statusSelect.value,
      client: clientSelect.value,
    };
    const filtered = filterOrders(orders, clients, filters);
    tableBody.innerHTML = renderOrderRows(filtered, clients, chalets);
  }

  addOrderButton?.addEventListener('click', () => {
    openOrderModal(clients, chalets, renderOrders);
  });

  tableBody?.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const orderId = button.dataset.id;
    if (action === 'delete') {
      await api.deleteOrder(orderId);
      showToast('success', 'تم حذف الطلب بنجاح');
      renderOrders();
    }
  });

  searchInput?.addEventListener('input', updateTable);
  statusSelect?.addEventListener('change', updateTable);
  clientSelect?.addEventListener('change', updateTable);

  updateTable();
}

renderOrders();
