import { api } from '../api.js';
import { renderModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

const pageRoot = document.getElementById('page-content');

function openClientModal() {
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
    renderClients();
    document.getElementById('modal-root').innerHTML = '';
  });
}

export async function renderClients() {
  if (!pageRoot) return;
  const [clients, orders, chalets] = await Promise.all([api.getClients(), api.getOrders(), api.getChalets()]);

  const rows = clients
    .map((client) => {
      const clientOrders = orders.filter((order) => order.client_id === client.client_id);
      const clientChalets = chalets.filter((item) => item.client_id === client.client_id);
      return `
        <tr>
          <td>${client.client_id}</td>
          <td>${client.name}</td>
          <td>${client.phone}</td>
          <td>${client.type}</td>
          <td>${clientChalets.length}</td>
          <td>${clientOrders.length}</td>
          <td>${client.created_at}</td>
          <td>
            <button class="button-secondary" data-action="delete" data-id="${client.client_id}">حذف</button>
          </td>
        </tr>
      `;
    })
    .join('');

  pageRoot.innerHTML = `
    <section class="dashboard-panel">
      <div class="title-group">
        <div>
          <h1 class="page-title">Clients</h1>
          <p>إدارة العملاء وأنواعهم.</p>
        </div>
        <button class="button-primary" id="open-client-modal">إضافة عميل جديد</button>
      </div>
      <div class="card">
        <div class="form-row columns-2">
          <label>
            بحث
            <input id="client-search" type="search" class="input-field" placeholder="ابحث باسم العميل أو رقم الهاتف" />
          </label>
          <label>
            النوع
            <select id="client-type-filter" class="select-field">
              <option value="">كل الأنواع</option>
              <option value="owner">Owner</option>
              <option value="broker">Broker</option>
            </select>
          </label>
        </div>
      </div>
      <div class="card table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>رقم العميل</th>
              <th>الاسم</th>
              <th>الهاتف</th>
              <th>النوع</th>
              <th>عدد الشاليهات</th>
              <th>عدد الطلبات</th>
              <th>تاريخ الإضافة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody id="clients-table-body">${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  const searchInput = pageRoot.querySelector('#client-search');
  const typeSelect = pageRoot.querySelector('#client-type-filter');
  const tableBody = pageRoot.querySelector('#clients-table-body');

  function updateTable() {
    const search = searchInput.value.trim().toLowerCase();
    const type = typeSelect.value;
    const filtered = clients.filter((client) => {
      const text = `${client.name} ${client.phone} ${client.type}`.toLowerCase();
      const matchesSearch = !search || text.includes(search);
      const matchesType = !type || client.type === type;
      return matchesSearch && matchesType;
    });

    tableBody.innerHTML = filtered
      .map((client) => {
        const clientOrders = orders.filter((order) => order.client_id === client.client_id);
        const clientChalets = chalets.filter((item) => item.client_id === client.client_id);
        return `
          <tr>
            <td>${client.client_id}</td>
            <td>${client.name}</td>
            <td>${client.phone}</td>
            <td>${client.type}</td>
            <td>${clientChalets.length}</td>
            <td>${clientOrders.length}</td>
            <td>${client.created_at}</td>
            <td>
              <button class="button-secondary" data-action="delete" data-id="${client.client_id}">حذف</button>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  document.getElementById('open-client-modal')?.addEventListener('click', openClientModal);
  pageRoot.querySelector('#clients-table-body')?.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const clientId = button.dataset.id;
    await api.deleteClient(clientId);
    showToast('success', 'تم حذف العميل بنجاح');
    renderClients();
  });
  searchInput?.addEventListener('input', updateTable);
  typeSelect?.addEventListener('change', updateTable);
}

renderClients();
