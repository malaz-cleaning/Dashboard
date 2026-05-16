/**
 * Reusable form templates for clients, chalets, and orders
 */

import { createTextInput, createPhoneInput, createNumberInput, createSelect, createSelectWithAdd, createTextarea, createFormGrid, createFormActions, createForm, createDateInput } from './formBuilder.js';

export const CLIENT_TYPES = [
  { value: 'owner', label: 'owner' },
  { value: 'broker', label: 'broker' },
];

export function createClientFormFields(existingData = {}) {
  return [
    createTextInput('client-name', 'الاسم', 'اسم العميل', existingData.name || ''),
    createPhoneInput('client-phone', 'الهاتف', 'رقم الهاتف', existingData.phone || ''),
    createSelect('client-type', 'النوع', CLIENT_TYPES, existingData.type || 'owner'),
  ];
}

export function getChaletFormFields(clients = [], existingData = {}) {
  const clientOptions = clients.map((c) => ({ value: c.client_id, label: c.name }));
  
  return [
    createTextInput('chalet-name', 'الشاليه', 'اسم الشاليه', existingData.chalet_name || ''),
    createTextInput('chalet-location', 'الموقع', 'الموقع الجغرافي', existingData.location || ''),
    createSelectWithAdd('chalet-client', 'العميل', clientOptions, existingData.client_id || '', 'add-new-client-btn', '+ عميل'),
    createTextarea('chalet-details', 'التفاصيل', 'تفاصيل الشاليه', 4, existingData.details || ''),
  ];
}

export function getOrderFormFields(clients = [], chalets = [], existingData = {}) {
  const clientOptions = clients.map((c) => ({ value: c.client_id, label: c.name }));
  const selectedClientId = existingData.client_id || clients[0]?.client_id || '';
  const chaletOptions = chalets
    .filter((c) => c.client_id === selectedClientId)
    .map((c) => ({ value: c.chalet_id, label: c.chalet_name }));

  const statusOptions = [
    { value: 'pending', label: 'معلقة' },
    { value: 'in_progress', label: 'قيد التنفيذ' },
    { value: 'done_unpaid', label: 'تمت ولم يُدفع' },
    { value: 'done_paid', label: 'تمت ودُفع' },
    { value: 'cancelled', label: 'ملغاة' },
  ];

  return [
    createSelectWithAdd('order-client', 'العميل', clientOptions, selectedClientId, 'add-client-btn', '+ عميل'),
    createSelectWithAdd('order-chalet', 'الشاليه', chaletOptions, existingData.chalet_id || '', 'add-chalet-btn', '+ شاليه'),
    createFormGrid(
      'grid-cols-1 md:grid-cols-2',
      createSelect('order-status', 'الحالة', statusOptions, existingData.status || 'pending') +
        createNumberInput('order-price', 'السعر', 'مثلاً 420', existingData.price || '')
    ),
    createFormGrid('grid-cols-1 md:grid-cols-2',
      createDateInput('order-scheduled', 'تاريخ التنفيذ', existingData.scheduled_at || '') +
        createNumberInput('order-deposit', 'الديبوزيت', 'مثلاً 100', existingData.deposit || '')
    ),
    createTextarea('order-notes', 'الملاحظات', 'تفاصيل إضافية', 3, existingData.notes || ''),
  ];
}

export function createClientForm(existingData = {}) {
  const fields = createClientFormFields(existingData);
  const actions = [{ id: 'save-client-button', label: 'حفظ العميل' }];
  return createForm(fields, actions);
}

export function createChaletForm(clients = [], existingData = {}) {
  const fields = getChaletFormFields(clients, existingData);
  const actions = [{ id: 'save-chalet-button', label: 'حفظ الشاليه' }];
  return createForm(fields, actions);
}

export function createOrderForm(clients = [], chalets = [], existingData = {}) {
  const fields = getOrderFormFields(clients, chalets, existingData);
  const actions = [{ id: 'save-order-button', label: 'حفظ الطلب' }];
  return createForm(fields, actions);
}
