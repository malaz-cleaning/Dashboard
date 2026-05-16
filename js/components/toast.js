const toastRoot = document.getElementById('toast-root');

export function showToast(type, message) {
  if (!toastRoot) return;
  const toast = document.createElement('div');
  const typeClass = type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info';
  toast.className = `toast ${typeClass}`;
  toast.textContent = message;
  toastRoot.appendChild(toast);

  // simple show/hide using CSS animations defined in styles.css
  toast.classList.add('fade-in');
  setTimeout(() => {
    toast.classList.add('slide-out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3200);
}
