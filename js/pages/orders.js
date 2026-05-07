import { api } from '../api.js';
import { showToast } from '../components/toast.js';
import { renderModal } from '../components/modal.js';

const pageRoot = document.getElementById('page-content');
const modalRoot = document.getElementById('modal-root');

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
    return `<tr><td colspan="9" class="empty-state">لا يوجد طلبات مطابقة.</td></tr>`;
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
            <select class="select-field status-select" data-order-id="${order.order_id}" data-current-status="${order.status}" style="font-size: 0.9rem; padding: 8px;">
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>معلقة</option>
              <option value="in_progress" ${order.status === 'in_progress' ? 'selected' : ''}>قيد التنفيذ</option>
              <option value="done_unpaid" ${order.status === 'done_unpaid' ? 'selected' : ''}>تمت ولم يُدفع</option>
              <option value="done_paid" ${order.status === 'done_paid' ? 'selected' : ''}>تمت ودُفع</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغاة</option>
            </select>
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

async function openOrderModal(clients, chalets, refresh) {
  let currentClients = clients;
  let currentChalets = chalets;

  const selectedClientId = clients[0]?.client_id || '';
  const chaletOptions = chalets
    .filter((chalet) => chalet.client_id === selectedClientId)
    .map((chalet) => `<option value="${chalet.chalet_id}">${chalet.chalet_name}</option>`)
    .join('');

  const content = `
    <div class="form-row">
      <label>
        العميل
        <div style="display: flex; gap: 10px; align-items: flex-end;">
          <select id="order-client" class="select-field" style="flex: 1;">
            ${currentClients.map((client) => `<option value="${client.client_id}">${client.name}</option>`).join('')}
          </select>
          <button class="button-secondary" id="add-client-btn" style="padding: 14px 16px; min-height: 44px;">+ عميل</button>
        </div>
      </label>
    </div>
    <div class="form-row">
      <label>
        الشاليه
        <div style="display: flex; gap: 10px; align-items: flex-end;">
          <select id="order-chalet" class="select-field" style="flex: 1;">
            ${chaletOptions}
          </select>
          <button class="button-secondary" id="add-chalet-btn" style="padding: 14px 16px; min-height: 44px;">+ شاليه</button>
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
        <textarea id="order-notes" rows="3" class="textarea-field" placeholder="تفاصيل إضافية"></textarea>
      </label>
    </div>
    <div class="form-actions">
      <button class="button-primary" id="save-order-button">حفظ الطلب</button>
    </div>
  `;

  renderModal(modalRoot, 'إضافة طلب جديد', content);

  const clientSelect = modalRoot.querySelector('#order-client');
  const chaletSelect = modalRoot.querySelector('#order-chalet');
  const addClientBtn = modalRoot.querySelector('#add-client-btn');
  const addChaletBtn = modalRoot.querySelector('#add-chalet-btn');
  const saveButton = modalRoot.querySelector('#save-order-button');

  function refreshChalets() {
    const currentClientId = clientSelect.value;
    const filtered = currentChalets.filter((item) => item.client_id === currentClientId);
    chaletSelect.innerHTML = filtered.length
      ? filtered.map((item) => `<option value="${item.chalet_id}">${item.chalet_name}</option>`).join('')
      : '<option value="">لا يوجد شاليهات</option>';
  }

  clientSelect?.addEventListener('change', refreshChalets);

  // Add new client modal
  addClientBtn?.addEventListener('click', () => {
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
      currentClients.push(newClient);
      showToast('success', 'تم إضافة العميل بنجاح');
      
      // Re-render the order modal
      await openOrderModal(currentClients, currentChalets, refresh);
    });
  });

  // Add new chalet modal
  addChaletBtn?.addEventListener('click', () => {
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
      currentChalets.push(newChalet);
      showToast('success', 'تم إضافة الشاليه بنجاح');
      
      // Re-render the order modal
      await openOrderModal(currentClients, currentChalets, refresh);
    });
  });

  saveButton?.addEventListener('click', async () => {
    const clientId = clientSelect?.value;
    const chaletId = chaletSelect?.value;
    const status = modalRoot.querySelector('#order-status')?.value;
    const price = modalRoot.querySelector('#order-price')?.value.trim();
    const notes = modalRoot.querySelector('#order-notes')?.value.trim();
    const created_at = new Date().toISOString().split('T')[0];

    if (!clientId || !chaletId || !price) {
      showToast('error', 'الرجاء تعبئة العميل والشاليه والسعر');
      return;
    }

    await api.addOrder({ client_id: clientId, chalet_id: chaletId, status, price: Number(price), notes, created_at });
    showToast('success', 'تم إضافة الطلب بنجاح');
    modalRoot.innerHTML = '';
    refresh();
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
        <button class="button-primary" id="add-order-button">إضافة طلب جديد</button>
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
        <div class="form-row">
          <label>
            عميل
            <select id="order-client-filter" class="select-field">
              <option value="">كل العملاء</option>
              ${clients.map((client) => `<option value="${client.client_id}">${client.name}</option>`).join('')}
            </select>
          </label>
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
              <th>تغيير الحالة</th>
            </tr>
          </thead>
          <tbody id="orders-table-body"></tbody>
        </table>
      </div>
      <div class="card" style="margin-top: 20px; padding: 16px; background: rgba(148, 163, 184, 0.08); border-radius: 12px;">
        <h3 style="margin: 0 0 16px 0; font-size: 1.1rem;">الإجماليات حسب الحالة</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="padding: 12px; background: white; border-radius: 8px; border-right: 4px solid #f97316;">
            <p style="margin: 0 0 8px 0; font-size: 0.9rem; color: #666;">معلقة</p>
            <p style="margin: 0; font-size: 1.2rem; font-weight: 700;">EGP <span id="total-pending">0</span></p>
          </div>
          <div style="padding: 12px; background: white; border-radius: 8px; border-right: 4px solid #3b82f6;">
            <p style="margin: 0 0 8px 0; font-size: 0.9rem; color: #666;">قيد التنفيذ</p>
            <p style="margin: 0; font-size: 1.2rem; font-weight: 700;">EGP <span id="total-in_progress">0</span></p>
          </div>
          <div style="padding: 12px; background: white; border-radius: 8px; border-right: 4px solid #eab308;">
            <p style="margin: 0 0 8px 0; font-size: 0.9rem; color: #666;">تمت ولم يُدفع</p>
            <p style="margin: 0; font-size: 1.2rem; font-weight: 700;">EGP <span id="total-done_unpaid">0</span></p>
          </div>
          <div style="padding: 12px; background: white; border-radius: 8px; border-right: 4px solid #10b981;">
            <p style="margin: 0 0 8px 0; font-size: 0.9rem; color: #666;">تمت ودُفع</p>
            <p style="margin: 0; font-size: 1.2rem; font-weight: 700;">EGP <span id="total-done_paid">0</span></p>
          </div>
          <div style="padding: 12px; background: white; border-radius: 8px; border-right: 4px solid #ef4444;">
            <p style="margin: 0 0 8px 0; font-size: 0.9rem; color: #666;">ملغاة</p>
            <p style="margin: 0; font-size: 1.2rem; font-weight: 700;">EGP <span id="total-cancelled">0</span></p>
          </div>
          <div style="padding: 12px; background: #10b981; border-radius: 8px; border-right: 4px solid #059669;">
            <p style="margin: 0 0 8px 0; font-size: 0.9rem; color: white;">الإجمالي العام</p>
            <p style="margin: 0; font-size: 1.2rem; font-weight: 700; color: white;">EGP <span id="total-all">0</span></p>
          </div>
        </div>
      </div>
    </section>
  `;

  const searchInput = pageRoot.querySelector('#order-search');
  const statusSelect = pageRoot.querySelector('#order-status-filter');
  const clientSelect = pageRoot.querySelector('#order-client-filter');
  const tableBody = pageRoot.querySelector('#orders-table-body');
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
    tableBody.innerHTML = renderOrderRows(filtered, clients, chalets);
    
    // Calculate totals for each status
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

    totalPendingSpan.textContent = totals.pending.toLocaleString();
    totalInProgressSpan.textContent = totals.in_progress.toLocaleString();
    totalDoneUnpaidSpan.textContent = totals.done_unpaid.toLocaleString();
    totalDonePaidSpan.textContent = totals.done_paid.toLocaleString();
    totalCancelledSpan.textContent = totals.cancelled.toLocaleString();
    totalAllSpan.textContent = totals.all.toLocaleString();

    // Attach event listeners to status selects
    pageRoot.querySelectorAll('.status-select').forEach((select) => {
      select.addEventListener('change', async (e) => {
        const orderId = e.target.dataset.orderId;
        const newStatus = e.target.value;
        
        try {
          await api.updateOrder(orderId, { status: newStatus });
          showToast('success', 'تم تحديث حالة الطلب بنجاح');
          renderOrders();
        } catch (error) {
          showToast('error', 'خطأ في تحديث الطلب');
          e.target.value = e.target.dataset.currentStatus;
        }
      });
    });
  }

  addOrderButton?.addEventListener('click', () => {
    openOrderModal(clients, chalets, renderOrders);
  });

  searchInput?.addEventListener('input', updateTable);
  statusSelect?.addEventListener('change', updateTable);
  clientSelect?.addEventListener('change', updateTable);

  updateTable();
}

renderOrders();
