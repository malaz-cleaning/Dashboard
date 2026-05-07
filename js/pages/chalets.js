import { api } from '../api.js';
import { renderModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

const pageRoot = document.getElementById('page-content');

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
        <select id="chalet-client" class="select-field">
          ${clients.map((client) => `<option value="${client.client_id}">${client.name}</option>`).join('')}
        </select>
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
