import { renderNavbar } from './components/navbar.js';
import { auth, initAuthState } from './auth.js';

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
  }
});

renderNavbar(navbarRoot);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);
  return page === '' ? 'index.html' : page;
}


