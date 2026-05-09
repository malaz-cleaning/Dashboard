/**
 * Validation utilities for forms
 */

export const validators = {
  notEmpty: (value, fieldName) => {
    if (!value?.trim()) {
      return `${fieldName} مطلوب`;
    }
    return null;
  },

  phone: (value, fieldName = 'الهاتف') => {
    if (!value?.trim()) {
      return `${fieldName} مطلوب`;
    }
    const phoneRegex = /^(\+|00)?[0-9]{7,15}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return `رقم ${fieldName} غير صحيح`;
    }
    return null;
  },

  number: (value, fieldName, allowZero = false) => {
    if (value === '' || value === null) {
      return `${fieldName} مطلوب`;
    }
    const num = Number(value);
    if (isNaN(num)) {
      return `${fieldName} يجب أن يكون رقم`;
    }
    if (!allowZero && num <= 0) {
      return `${fieldName} يجب أن يكون أكبر من 0`;
    }
    return null;
  },

  email: (value, fieldName = 'البريد الإلكتروني') => {
    if (!value?.trim()) {
      return `${fieldName} مطلوب`;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return `${fieldName} غير صحيح`;
    }
    return null;
  },
};

export function validateForm(formData, rules) {
  const errors = {};
  
  for (const [field, value] of Object.entries(formData)) {
    if (rules[field]) {
      const error = rules[field](value);
      if (error) {
        errors[field] = error;
      }
    }
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

export function getFirstError(errors) {
  const firstKey = Object.keys(errors)[0];
  return errors[firstKey];
}
