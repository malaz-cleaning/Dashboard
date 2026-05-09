/**
 * Reusable modal functions for clients, chalets, and orders
 */

import { api } from '../api.js';
import { showToast } from '../components/toast.js';
import { renderModal } from '../components/modal.js';
import { createClientForm, createChaletForm, createOrderForm } from './formTemplates.js';
import { validators, validateForm, hasErrors, getFirstError } from './validators.js';
import { getFormValues, clearFormInputs } from './formBuilder.js';

export async function showClientModal(onClientAdded = null) {
  const modalRoot = document.getElementById('modal-root');
  const content = createClientForm();

  renderModal(modalRoot, 'إضافة عميل جديد', content);

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
      const newClient = await api.addClient(formData);
      showToast('success', 'تم إضافة العميل بنجاح');
      clearFormInputs(modalRoot, { name: 'client-name', phone: 'client-phone', type: 'client-type' });
      modalRoot.innerHTML = '';

      if (onClientAdded) {
        onClientAdded(newClient);
      }
    } catch (error) {
      showToast('error', 'خطأ في إضافة العميل');
    }
  });
}

export async function showChaletModal(clients = [], onChaletAdded = null) {
  const modalRoot = document.getElementById('modal-root');
  const content = createChaletForm(clients);

  renderModal(modalRoot, 'إضافة شاليه جديد', content);

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
      const newChalet = await api.addChalet(formData);
      showToast('success', 'تم إضافة الشاليه بنجاح');
      clearFormInputs(modalRoot, {
        chalet_name: 'chalet-name',
        location: 'chalet-location',
        client_id: 'chalet-client',
        details: 'chalet-details',
      });
      modalRoot.innerHTML = '';

      if (onChaletAdded) {
        onChaletAdded(newChalet);
      }
    } catch (error) {
      showToast('error', 'خطأ في إضافة الشاليه');
    }
  });
}

export async function showOrderModal(clients = [], chalets = [], onOrderAdded = null) {
  const modalRoot = document.getElementById('modal-root');
  const content = createOrderForm(clients, chalets);

  renderModal(modalRoot, 'إضافة طلب جديد', content);

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
    });

    formData.created_at = new Date().toISOString().split('T')[0];

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

      if (onOrderAdded) {
        onOrderAdded();
      }
    } catch (error) {
      showToast('error', 'خطأ في إضافة الطلب');
    }
  });
}
