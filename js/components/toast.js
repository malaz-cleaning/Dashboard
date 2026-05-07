const toastRoot = document.getElementById('toast-root');

export function showToast(type, message) {
  if (!toastRoot) return;
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white font-medium transform translate-x-full transition-transform duration-300 ease-out max-w-sm ${
    type === 'success' ? 'bg-green-600' :
    type === 'error' ? 'bg-red-600' :
    type === 'warning' ? 'bg-yellow-600' :
    'bg-blue-600'
  }`;
  toast.textContent = message;
  toastRoot.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-full');
    toast.classList.add('translate-x-0');
  });

  setTimeout(() => {
    toast.classList.remove('translate-x-0');
    toast.classList.add('translate-x-full');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 3200);
}
