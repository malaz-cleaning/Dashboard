export function renderSidebar(root) {
  if (!root) return;
  root.innerHTML = `
    <div class="brand-block">
      <div class="brand-logo">M</div>
      <div>
        <p class="brand-name">ملاذ</p>
        <p class="brand-subtitle">لوحة تحكم</p>
      </div>
    </div>
    <nav class="sidebar-nav">
      <a class="nav-link" href="index.html">Dashboard</a>
      <a class="nav-link" href="orders.html">Orders</a>
      <a class="nav-link" href="clients.html">Clients</a>
      <a class="nav-link" href="chalets.html">Chalets</a>
      <a class="nav-link" href="analytics.html">Analytics</a>
    </nav>
  `;
}
