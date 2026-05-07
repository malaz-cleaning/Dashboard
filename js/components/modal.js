export function renderModal(root, title, contentHtml) {
  if (!root) return;
  root.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 class="text-xl font-semibold text-white">${title}</h2>
          <button class="text-slate-400 hover:text-white text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded" aria-label="Close">×</button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">${contentHtml}</div>
      </div>
    </div>
  `;

  const backdrop = root.querySelector('.fixed');
  const closeButton = root.querySelector('button[aria-label="Close"]');

  function close() {
    root.innerHTML = '';
  }

  backdrop?.addEventListener('click', (event) => {
    if (event.target === backdrop) close();
  });
  closeButton?.addEventListener('click', close);
}
