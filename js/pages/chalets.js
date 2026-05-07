import { api } from '../api.js';
import { renderModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

const pageRoot = document.getElementById('page-content');

function openClientModal(onClientAdded) {
  const content = `
    <div class="form-row">
      <label>
        الاسم
        <input id="client-name" type="text" class="input-field" placeholder="اسم العميل" />
      </label>
      <label>
        الهاتف
        <input id="client-phone" type="tel" class="input-field" placeholder="رقم الهاتف" />
      </label>
    </div>
    <div class="form-row">
      <label>
        النوع
        <select id="client-type" class="select-field">
          <option value="owner">Owner</option>
          <option value="broker">Broker</option>
        </select>
      </label>
    </div>
    <div class="form-actions">
      <button class="button-primary" id="save-client-button">حفظ العميل</button>
    </div>
  `;

  renderModal(document.getElementById('modal-root'), 'إضافة عميل جديد', content);
  const saveButton = document.getElementById('save-client-button');
  saveButton?.addEventListener('click', async () => {
    const name = document.getElementById('client-name')?.value.trim();
    const phone = document.getElementById('client-phone')?.value.trim();
    const type = document.getElementById('client-type')?.value;
    if (!name || !phone) {
      window.alert('الرجاء تعبئة الاسم والهاتف.');
      return;
    }
    await api.addClient({ name, phone, type });
    document.getElementById('modal-root').innerHTML = '';
    if (onClientAdded) onClientAdded();
    showToast('success', 'تم إضافة العميل بنجاح');
  });
}

function openChaletModal(clients, refresh) {
  const content = `
    <div class="form-row">
      <label>
        الشاليه
        <input id="chalet-name" type="text" class="input-field" placeholder="اسم الشاليه" />
      </label>
      <label>
        الموقع
        <input id="chalet-location" type="text" class="input-field" placeholder="الموقع" />
      </label>
    </div>
    <div class="form-row">
      <label>
        العميل
        <div style="display: flex; gap: 10px; align-items: flex-end;">
          <select id="chalet-client" class="select-field" style="flex: 1;">
            ${clients.map((client) => `<option value="${client.client_id}">${client.name}</option>`).join('')}
          </select>
          <button class="button-secondary" id="add-new-client-btn" style="padding: 14px 16px; min-height: 44px;">+ عميل</button>
        </div>
      </label>
      <label>
        التفاصيل
        <textarea id="chalet-details" rows="4" class="textarea-field" placeholder="تفاصيل الشاليه"></textarea>
      </label>
    </div>
    <div class="form-actions">
      <button class="button-primary" id="save-chalet-button">حفظ الشاليه</button>
    </div>
  `;

  renderModal(document.getElementById('modal-root'), 'إضافة شاليه جديد', content);

  const addClientBtn = document.getElementById('add-new-client-btn');
  addClientBtn?.addEventListener('click', () => {
    openClientModal(async () => {
      const updatedClients = await api.getClients();
      const selectField = document.getElementById('chalet-client');
      if (selectField) {
        selectField.innerHTML = updatedClients
          .map((client) => `<option value="${client.client_id}">${client.name}</option>`)
          .join('');
        selectField.value = updatedClients[updatedClients.length - 1]?.client_id;
      }
    });
  });

  const saveButton = document.getElementById('save-chalet-button');
  saveButton?.addEventListener('click', async () => {
    const chalet_name = document.getElementById('chalet-name')?.value.trim();
    const location = document.getElementById('chalet-location')?.value.trim();
    const details = document.getElementById('chalet-details')?.value.trim();
    const client_id = document.getElementById('chalet-client')?.value;
    if (!chalet_name || !location || !client_id) {
      window.alert('الرجاء تعبئة اسم الشاليه والموقع واختيار العميل.');
      return;
    }
    await api.addChalet({ client_id, chalet_name, location, details });
    refresh();
    document.getElementById('modal-root').innerHTML = '';
    showToast('success', 'تم إضافة الشاليه بنجاح');
  });
}

export async function renderChalets() {
  if (!pageRoot) return;
  const [chalets, clients, orders] = await Promise.all([api.getChalets(), api.getClients(), api.getOrders()]);

  const rows = chalets
    .map((chalet) => {
      const client = clients.find((item) => item.client_id === chalet.client_id) || {};
      const chaletOrders = orders.filter((order) => order.chalet_id === chalet.chalet_id);
      return `
        <tr>
          <td>${chalet.chalet_id}</td>
          <td>${chalet.chalet_code}</td>
          <td>${chalet.chalet_name}</td>
          <td>${client.name || 'غير محدد'}</td>
          <td>${chalet.location || '-'}</td>
          <td>${chalet.details || '-'}</td>
          <td>${chaletOrders.length}</td>
          <td>${chalet.created_at}</td>
          <td>
            <button class="button-secondary" data-action="delete" data-id="${chalet.chalet_id}">حذف</button>
          </td>
        </tr>
      `;
    })
    .join('');

  pageRoot.innerHTML = `
    <section class="dashboard-panel">
      <div class="title-group">
        <div>
          <h1 class="page-title">Chalets</h1>
          <p>إدارة الشاليهات وربطها بالعملاء.</p>
        </div>
        <button class="button-primary" id="open-chalet-modal">إضافة شاليه جديد</button>
      </div>
      <div class="card">
        <div class="form-row columns-2">
          <label>
            بحث
            <input id="chalet-search" type="search" class="input-field" placeholder="ابحث باسم الشاليه أو العميل" />
          </label>
          <label>
            عميل
            <select id="chalet-client-filter" class="select-field">
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
              <th>رقم الشاليه</th>
              <th>الكود</th>
              <th>الاسم</th>
              <th>العميل</th>
              <th>الموقع</th>
              <th>التفاصيل</th>
              <th>أوامر</th>
              <th>تاريخ الإضافة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody id="chalets-table-body">${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  const searchInput = pageRoot.querySelector('#chalet-search');
  const clientSelect = pageRoot.querySelector('#chalet-client-filter');
  const tableBody = pageRoot.querySelector('#chalets-table-body');

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

    tableBody.innerHTML = filtered
      .map((chalet) => {
        const client = clients.find((item) => item.client_id === chalet.client_id) || {};
        const chaletOrders = orders.filter((order) => order.chalet_id === chalet.chalet_id);
        return `
          <tr>
            <td>${chalet.chalet_id}</td>
            <td>${chalet.chalet_code}</td>
            <td>${chalet.chalet_name}</td>
            <td>${client.name || 'غير محدد'}</td>
            <td>${chalet.location || '-'}</td>
            <td>${chalet.details || '-'}</td>
            <td>${chaletOrders.length}</td>
            <td>${chalet.created_at}</td>
            <td>
              <button class="button-secondary" data-action="delete" data-id="${chalet.chalet_id}">حذف</button>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  document.getElementById('open-chalet-modal')?.addEventListener('click', () => openChaletModal(clients, renderChalets));
  pageRoot.querySelector('#chalets-table-body')?.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const chaletId = button.dataset.id;
    await api.deleteChalet(chaletId);
    showToast('success', 'تم حذف الشاليه بنجاح');
    renderChalets();
  });
  searchInput?.addEventListener('input', updateTable);
  clientSelect?.addEventListener('change', updateTable);
}

renderChalets();
