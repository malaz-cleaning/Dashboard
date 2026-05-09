import { renderNavbar } from './components/navbar.js';
import { renderSidebar } from './components/sidebar.js';
import { auth, initAuthState } from './auth.js';

const sidebarRoot = document.getElementById('sidebar');
const navbarRoot = document.getElementById('navbar');

// Loading state management
export function showLoading() {
  const pageContent = document.getElementById('page-content');
  if (pageContent) {
    pageContent.innerHTML = `
      <div class="loading-state">
        <div class="skeleton-card">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text" style="width: 80%;"></div>
        </div>
        <div class="skeleton-card" style="margin-top: 20px;">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
        </div>
      </div>
    `;
  }
}

export function hideLoading() {
  // Will be replaced by page content
}

// Check authentication
document.addEventListener('DOMContentLoaded', async () => {
  await initAuthState();
  if (!auth.isAuthenticated() && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
    return;
  }

  renderSidebar(sidebarRoot);
  renderNavbar(navbarRoot);
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerServiceWorker();
  });
}

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


