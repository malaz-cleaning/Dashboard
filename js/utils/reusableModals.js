/**
 * Reusable modal functions for clients, chalets, and orders
 */

import { api } from '../api.js';
import { showToast } from '../components/toast.js';
import { renderModal } from '../components/modal.js';
import { createClientForm, createChaletForm, createOrderForm } from './formTemplates.js';
import { validators, validateForm, hasErrors, getFirstError } from './validators.js';
import { getFormValues, clearFormInputs } from './formBuilder.js';
import { auth } from '../auth.js';

export async function showClientModal(onClientSaved = null, existing = null) {
  const modalRoot = document.getElementById('modal-root');
  const content = createClientForm(existing || {});

  renderModal(modalRoot, existing ? 'تعديل عميل' : 'إضافة عميل جديد', content);

  const saveButton = modalRoot.querySelector('#save-client-button');

  saveButton?.addEventListener('click', async () => {
    const formData = getFormValues(modalRoot, {
      name: 'client-name',
      phone: 'client-phone',
      type: 'client-type',
    });

    const rules = {
      name: (value) => validators.notEmpty(value, 'الاسم'),
      phone: (value) => validators.phone(value, 'الهاتف'),
      type: (value) => validators.notEmpty(value, 'النوع'),
    };

    const errors = validateForm(formData, rules);

    if (hasErrors(errors)) {
      showToast('error', getFirstError(errors));
      return;
    }

    try {
      if (existing && existing.client_id) {
        const updated = await api.updateClient(existing.client_id, formData);
        showToast('success', 'تم تعديل بيانات العميل');
        modalRoot.innerHTML = '';
        if (onClientSaved) onClientSaved(updated);
      } else {
        const newClient = await api.addClient(formData);
        showToast('success', 'تم إضافة العميل بنجاح');
        clearFormInputs(modalRoot, { name: 'client-name', phone: 'client-phone', type: 'client-type' });
        modalRoot.innerHTML = '';
        if (onClientSaved) onClientSaved(newClient);
      }
    } catch (error) {
      showToast('error', 'حدث خطأ أثناء حفظ بيانات العميل');
    }
  });
}

export async function showChaletModal(clients = [], onChaletSaved = null, existing = null) {
  const modalRoot = document.getElementById('modal-root');
  const content = createChaletForm(clients, existing || {});

  renderModal(modalRoot, existing ? 'تعديل شاليه' : 'إضافة شاليه جديد', content);

  const clientSelect = modalRoot.querySelector('#chalet-client');
  const chaletNameInput = modalRoot.querySelector('#chalet-name');
  const addClientBtn = modalRoot.querySelector('#add-new-client-btn');
  const saveButton = modalRoot.querySelector('#save-chalet-button');

  // Handle add client button
  addClientBtn?.addEventListener('click', async () => {
    await showClientModal(async (newClient) => {
      // Update client select with new client
      const currentClientId = clientSelect.value;
      clientSelect.innerHTML += `<option value="${newClient.client_id}">${newClient.name}</option>`;
      clientSelect.value = newClient.client_id;
    });
  });

  saveButton?.addEventListener('click', async () => {
    const formData = getFormValues(modalRoot, {
      chalet_name: 'chalet-name',
      location: 'chalet-location',
      client_id: 'chalet-client',
      details: 'chalet-details',
    });

    const rules = {
      chalet_name: (value) => validators.notEmpty(value, 'اسم الشاليه'),
      location: (value) => validators.notEmpty(value, 'الموقع'),
      client_id: (value) => validators.notEmpty(value, 'العميل'),
    };

    const errors = validateForm(formData, rules);

    if (hasErrors(errors)) {
      showToast('error', getFirstError(errors));
      return;
    }

    try {
      if (existing && existing.chalet_id) {
        const updated = await api.updateChalet(existing.chalet_id, formData);
        showToast('success', 'تم تعديل الشاليه');
        modalRoot.innerHTML = '';
        if (onChaletSaved) onChaletSaved(updated);
      } else {
        const newChalet = await api.addChalet(formData);
        showToast('success', 'تم إضافة الشاليه بنجاح');
        clearFormInputs(modalRoot, {
          chalet_name: 'chalet-name',
          location: 'chalet-location',
          client_id: 'chalet-client',
          details: 'chalet-details',
        });
        modalRoot.innerHTML = '';
        if (onChaletSaved) onChaletSaved(newChalet);
      }
    } catch (error) {
      showToast('error', 'خطأ في حفظ الشاليه');
    }
  });
}

export async function showOrderModal(clients = [], chalets = [], onOrderSaved = null, existing = null) {
  const modalRoot = document.getElementById('modal-root');
  const content = createOrderForm(clients, chalets, existing || {});

  renderModal(modalRoot, existing ? 'تعديل طلب' : 'إضافة طلب جديد', content);

  const clientSelect = modalRoot.querySelector('#order-client');
  const chaletSelect = modalRoot.querySelector('#order-chalet');
  const addClientBtn = modalRoot.querySelector('#add-client-btn');
  const addChaletBtn = modalRoot.querySelector('#add-chalet-btn');
  const saveButton = modalRoot.querySelector('#save-order-button');

  // Update chalets when client changes
  function updateChalets() {
    const currentClientId = clientSelect.value;
    const filtered = chalets.filter((item) => item.client_id === currentClientId);
    chaletSelect.innerHTML = filtered.length
      ? filtered.map((item) => `<option value="${item.chalet_id}">${item.chalet_name}</option>`).join('')
      : '<option value="">لا يوجد شاليهات</option>';
  }

  clientSelect?.addEventListener('change', updateChalets);

  // If editing, set initial values and refresh chalets
  if (existing) {
    clientSelect.value = existing.client_id || clientSelect.value;
    updateChalets();
    chaletSelect.value = existing.chalet_id || chaletSelect.value;
    modalRoot.querySelector('#order-status').value = existing.status || modalRoot.querySelector('#order-status').value;
    modalRoot.querySelector('#order-price').value = existing.price || modalRoot.querySelector('#order-price').value;
    modalRoot.querySelector('#order-notes').value = existing.notes || modalRoot.querySelector('#order-notes').value;
    if (modalRoot.querySelector('#order-scheduled')) modalRoot.querySelector('#order-scheduled').value = existing.scheduled_at || '';
    if (modalRoot.querySelector('#order-deposit')) modalRoot.querySelector('#order-deposit').value = existing.deposit || 0;
  }

  // Handle add client button
  addClientBtn?.addEventListener('click', async () => {
    await showClientModal(async (newClient) => {
      clients.push(newClient);
      const currentClientId = clientSelect.value;
      clientSelect.innerHTML += `<option value="${newClient.client_id}">${newClient.name}</option>`;
      clientSelect.value = newClient.client_id;
      updateChalets();
    });
  });

  // Handle add chalet button
  addChaletBtn?.addEventListener('click', async () => {
    await showChaletModal(clients, async (newChalet) => {
      chalets.push(newChalet);
      const currentClientId = clientSelect.value;
      if (newChalet.client_id === currentClientId) {
        chaletSelect.innerHTML += `<option value="${newChalet.chalet_id}">${newChalet.chalet_name}</option>`;
      }
    });
  });

  saveButton?.addEventListener('click', async () => {
    const formData = getFormValues(modalRoot, {
      client_id: 'order-client',
      chalet_id: 'order-chalet',
      status: 'order-status',
      price: 'order-price',
      notes: 'order-notes',
      scheduled_at: 'order-scheduled',
      deposit: 'order-deposit',
    });

    formData.deposit = Number(formData.deposit || 0);

    const rules = {
      client_id: (value) => validators.notEmpty(value, 'العميل'),
      chalet_id: (value) => validators.notEmpty(value, 'الشاليه'),
      price: (value) => validators.number(value, 'السعر'),
      status: (value) => validators.notEmpty(value, 'الحالة'),
    };

    const errors = validateForm(formData, rules);

    if (hasErrors(errors)) {
      showToast('error', getFirstError(errors));
      return;
    }

    try {
      if (existing && existing.order_id) {
        // Update order (do not override created_at)
        const payload = {
          client_id: formData.client_id,
          chalet_id: formData.chalet_id,
          status: formData.status,
          price: Number(formData.price),
          notes: formData.notes,
          scheduled_at: formData.scheduled_at || '',
          deposit: Number(formData.deposit || 0),
        };
        await api.updateOrder(existing.order_id, payload);
        showToast('success', 'تم تحديث الطلب');
        modalRoot.innerHTML = '';
        if (onOrderSaved) onOrderSaved();
      } else {
        formData.created_at = new Date().toISOString().split('T')[0];
        formData.created_by = auth.getUserName();
        await api.addOrder({
          ...formData,
          price: Number(formData.price),
        });
        showToast('success', 'تم إضافة الطلب بنجاح');
        clearFormInputs(modalRoot, {
          client_id: 'order-client',
          chalet_id: 'order-chalet',
          status: 'order-status',
          price: 'order-price',
          notes: 'order-notes',
        });
        modalRoot.innerHTML = '';
        if (onOrderSaved) onOrderSaved();
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'خطأ في حفظ الطلب');
    }
  });
}

export async function showTransactionModal(orders = [], chalets = [], onSaved = null, existing = null) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const typeOptions = `
    <option value="expense" ${existing?.type === 'expense' ? 'selected' : ''}>مصروف</option>
    <option value="income" ${existing?.type === 'income' ? 'selected' : ''}>ايراد</option>
  `;

  const chaletMap = new Map(chalets.map((chalet) => [chalet.chalet_id, chalet.chalet_name]));
  const orderOptions = `<option value="">عام</option>` + (orders.length ? orders.map((o) => {
      const chaletLabel = chaletMap.get(o.chalet_id) || o.chalet_id || 'غير محدد';
      return `<option value="${o.order_id}" ${existing?.order_id === o.order_id ? 'selected' : ''}>${o.order_id} - ${chaletLabel}</option>`;
    }).join('') : '');

  const content = `
    <div class="space-y-4">
      <div>
        <label class="form-label" for="tx-type">النوع</label>
        <select id="tx-type" class="form-select">${typeOptions}</select>
      </div>
      <div>
        <label class="form-label" for="tx-amount">المبلغ</label>
        <input id="tx-amount" type="number" class="form-input" value="${existing?.amount || ''}" />
      </div>
      <div>
        <label class="form-label" for="tx-date">التاريخ</label>
        <input id="tx-date" type="date" class="form-input" value="${existing?.date || new Date().toISOString().split('T')[0]}" />
      </div>
      <div>
        <label class="form-label" for="tx-order">مرتبط بطلب (اختياري)</label>
        <select id="tx-order" class="form-select">${orderOptions}</select>
      </div>
      <div>
        <label class="form-label" for="tx-details">التفاصيل</label>
        <textarea id="tx-details" rows="3" class="form-textarea">${existing?.details || ''}</textarea>
      </div>
      <div class="flex justify-end gap-3">
        <button class="btn btn-secondary" id="cancel-tx">إلغاء</button>
        <button class="btn btn-primary" id="save-tx">حفظ</button>
      </div>
    </div>
  `;

  renderModal(modalRoot, existing ? 'تعديل المعاملة' : 'إضافة معاملة جديدة', content);

  modalRoot.querySelector('#cancel-tx')?.addEventListener('click', () => { modalRoot.innerHTML = ''; });
  modalRoot.querySelector('#save-tx')?.addEventListener('click', async () => {
    const type = modalRoot.querySelector('#tx-type')?.value;
    const amount = Number(modalRoot.querySelector('#tx-amount')?.value || 0);
    const date = modalRoot.querySelector('#tx-date')?.value;
    const order_id = modalRoot.querySelector('#tx-order')?.value || '';
    const details = modalRoot.querySelector('#tx-details')?.value || '';

    if (!type || !amount) {
      showToast('error', 'الرجاء تعبئة النوع والمبلغ');
      return;
    }

    try {
      if (existing && existing.transaction_id) {
        await api.updateTransaction(existing.transaction_id, { type, amount, date, order_id, details });
        showToast('success', 'تم تعديل المعاملة');
      } else {
        await api.addTransaction({ type, amount, date, order_id, details, created_by: auth.getUserName() });
        showToast('success', 'تم إضافة المعاملة');
      }
      modalRoot.innerHTML = '';
      if (onSaved) onSaved();
    } catch (err) {
      console.error('Transaction save error', err);
      showToast('error', 'حدث خطأ أثناء حفظ المعاملة');
    }
  });
}
