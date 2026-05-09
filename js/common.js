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
    const swPath = import.meta.env.BASE_URL + 'sw.js';
    navigator.serviceWorker.register(swPath)
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}


