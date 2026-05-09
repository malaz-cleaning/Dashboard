import { initRouter } from './router.js';
import { renderSidebar } from './components/sidebar.js';
import { renderNavbar } from './components/navbar.js';
import { initAuthState } from './auth.js';

const sidebarRoot = document.getElementById('sidebar');
const navbarRoot = document.getElementById('navbar');

initAuthState().then(() => {
  renderSidebar(sidebarRoot);
  renderNavbar(navbarRoot);
  initRouter();
  registerServiceWorker();
});

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const swPath = import.meta.env.BASE_URL + 'sw.js';
    const registration = await navigator.serviceWorker.register(swPath);

    let refreshing = false;

    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          newWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  } catch (error) {
    console.warn('Service Worker registration failed:', error);
  }
}

const sidebarToggle = document.getElementById('sidebar-toggle');
sidebarToggle?.addEventListener('click', () => {
  window.toggleSidebar?.(true);
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
