export function renderModal(root, title, contentHtml) {
  if (!root) return;
  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          <button class="modal-close" aria-label="Close">×</button>
        </div>
        <div class="modal-body">${contentHtml}</div>
      </div>
    </div>
  `;

  const backdrop = root.querySelector('.modal-backdrop');
  const closeButton = root.querySelector('.modal-close');

  function close() {
    root.innerHTML = '';
  }

  backdrop?.addEventListener('click', (event) => {
    if (event.target === backdrop) close();
  });
  closeButton?.addEventListener('click', close);
}
