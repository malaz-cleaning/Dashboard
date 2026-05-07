import { initRouter } from './router.js';
import { renderSidebar } from './components/sidebar.js';
import { renderNavbar } from './components/navbar.js';

const sidebarRoot = document.getElementById('sidebar');
const navbarRoot = document.getElementById('navbar');

renderSidebar(sidebarRoot);
renderNavbar(navbarRoot);
initRouter();

const sidebarToggle = document.getElementById('sidebar-toggle');
sidebarToggle?.addEventListener('click', () => {
  document.querySelector('.app-shell')?.classList.toggle('sidebar-open');
});

window.requestAddOrder = () => {
  window.openOrderModal = true;
  if (window.location.hash !== '#dashboard') {
    window.location.hash = '#dashboard';
  } else {
    document.getElementById('add-order-button')?.click();
  }
};

const mobileAddOrderButton = document.getElementById('mobile-add-order-button');
mobileAddOrderButton?.addEventListener('click', () => {
  window.requestAddOrder();
});
