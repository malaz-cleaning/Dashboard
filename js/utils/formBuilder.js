/**
 * Form builder utilities for consistent form rendering
 */

export function createTextInput(id, label, placeholder = '', value = '') {
  return `
    <div>
      <label class="form-label" for="${id}">${label}</label>
      <input id="${id}" type="text" class="form-input" placeholder="${placeholder}" value="${value}" />
    </div>
  `;
}

export function createPhoneInput(id, label, placeholder = '', value = '') {
  return `
    <div>
      <label class="form-label" for="${id}">${label}</label>
      <input id="${id}" type="tel" class="form-input" placeholder="${placeholder}" value="${value}" />
    </div>
  `;
}

export function createNumberInput(id, label, placeholder = '', value = '') {
  return `
    <div>
      <label class="form-label" for="${id}">${label}</label>
      <input id="${id}" type="number" class="form-input" placeholder="${placeholder}" value="${value}" />
    </div>
  `;
}

export function createDateInput(id, label, value = '') {
  return `
    <div>
      <label class="form-label" for="${id}">${label}</label>
      <input id="${id}" type="date" class="form-input" value="${value}" />
    </div>
  `;
}

export function createSelect(id, label, options, selectedValue = '') {
  const optionsHtml = options
    .map((opt) => {
      const isSelected = opt.value === selectedValue ? 'selected' : '';
      return `<option value="${opt.value}" ${isSelected}>${opt.label}</option>`;
    })
    .join('');

  return `
    <div>
      <label class="form-label" for="${id}">${label}</label>
      <select id="${id}" class="form-select">
        ${optionsHtml}
      </select>
    </div>
  `;
}

export function createSelectWithAdd(id, label, options, selectedValue = '', addBtnId = '', addBtnLabel = '') {
  const optionsHtml = options
    .map((opt) => {
      const isSelected = opt.value === selectedValue ? 'selected' : '';
      return `<option value="${opt.value}" ${isSelected}>${opt.label}</option>`;
    })
    .join('');

  return `
    <div>
      <label class="form-label" for="${id}">${label}</label>
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap items-end">
        <select id="${id}" class="form-select flex-1">
          ${optionsHtml}
        </select>
        ${addBtnLabel ? `<button type="button" class="btn btn-secondary px-4 py-2 whitespace-nowrap" id="${addBtnId}">${addBtnLabel}</button>` : ''}
      </div>
    </div>
  `;
}

export function createTextarea(id, label, placeholder = '', rows = 3, value = '') {
  return `
    <div>
      <label class="form-label" for="${id}">${label}</label>
      <textarea id="${id}" rows="${rows}" class="form-textarea" placeholder="${placeholder}">${value}</textarea>
    </div>
  `;
}

export function createFormGrid(columns = 'grid-cols-1 md:grid-cols-2', content = '') {
  return `<div class="grid ${columns} gap-4">${content}</div>`;
}

export function createFormButton(id, label, style = 'primary') {
  const styleClass = style === 'secondary' ? 'btn btn-secondary' : 'btn btn-primary';
  return `<button type="button" class="${styleClass}" id="${id}">${label}</button>`;
}

export function createFormActions(buttons = []) {
  const buttonsHtml = buttons
    .map((btn) => createFormButton(btn.id, btn.label, btn.style))
    .join(' ');

  return `<div class="flex flex-col sm:flex-row justify-end gap-3 pt-4">${buttonsHtml}</div>`;
}

export function createForm(fields = [], actions = []) {
  const fieldsHtml = fields.join('');
  const actionsHtml = createFormActions(actions);
  return `<div class="space-y-4">${fieldsHtml}${actionsHtml}</div>`;
}

export function getFormValues(modalRoot, fieldIds = {}) {
  const values = {};
  
  for (const [key, id] of Object.entries(fieldIds)) {
    const element = modalRoot.querySelector(`#${id}`);
    if (element) {
      values[key] = element.value;
    }
  }

  return values;
}

export function clearFormInputs(modalRoot, fieldIds = {}) {
  for (const id of Object.values(fieldIds)) {
    const element = modalRoot.querySelector(`#${id}`);
    if (element) {
      if (element.type === 'number') {
        element.value = '';
      } else if (element.tagName === 'SELECT') {
        element.selectedIndex = 0;
      } else {
        element.value = '';
      }
    }
  }
}

export function setFormErrors(modalRoot, errors = {}) {
  for (const [fieldId, errorMessage] of Object.entries(errors)) {
    const element = modalRoot.querySelector(`#${fieldId}`);
    if (element) {
      element.classList.add('border-red-500');
      element.style.borderColor = 'rgb(239, 68, 68)';
    }
  }
}

export function clearFormErrors(modalRoot, fieldIds = {}) {
  for (const id of Object.values(fieldIds)) {
    const element = modalRoot.querySelector(`#${id}`);
    if (element) {
      element.classList.remove('border-red-500');
      element.style.borderColor = '';
    }
  }
}
