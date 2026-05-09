import { renderDashboard } from './pages/dashboard.js';
import { renderOrders } from './pages/orders.js';
import { renderClients } from './pages/clients.js';
import { renderChalets } from './pages/chalets.js';
import { renderAnalytics } from './pages/analytics.js';
import { renderNavbar } from './components/navbar.js';

const routes = {
  '': renderDashboard,
  '#dashboard': renderDashboard,
  '#orders': renderOrders,
  '#clients': renderClients,
  '#chalets': renderChalets,
  '#analytics': renderAnalytics,
};

export function initRouter() {
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}

function renderRoute() {
  const routeKey = window.location.hash || '#dashboard';
  const renderFn = routes[routeKey] || renderDashboard;
  renderFn();

  // Update navbar to reflect current page
  const navbarRoot = document.getElementById('navbar');
  if (navbarRoot) {
    renderNavbar(navbarRoot);
  }

  updateActiveLink(routeKey);
}

function updateActiveLink(routeKey) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === routeKey);
  });
}
