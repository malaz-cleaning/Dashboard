import { renderSidebar } from './components/sidebar.js';
import { renderNavbar } from './components/navbar.js';
import { auth } from './auth.js';

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
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated() && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
  }

  // Sidebar toggle functionality
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');

  if (sidebarToggle && sidebar) {
    const toggleSidebar = () => {
      const isMobile = window.innerWidth < 1024; // lg breakpoint

      if (isMobile) {
        // Mobile: toggle transform classes
        sidebar.classList.toggle('-translate-x-full');
      } else {
        // Desktop: toggle width classes
        const sidebarInner = sidebar.querySelector('.flex');
        if (sidebarInner) {
          sidebarInner.classList.toggle('w-16'); // collapsed
          sidebarInner.classList.toggle('w-64'); // expanded

          // Hide/show text in nav links
          const linkTexts = sidebarInner.querySelectorAll('.sidebar-link-text');
          linkTexts.forEach(text => {
            text.classList.toggle('hidden');
          });
        }
      }
    };

    sidebarToggle.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.add('-translate-x-full');
      }
    });
  }
});

renderSidebar(sidebarRoot);
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

function updateActiveLink() {
  const currentPage = getCurrentPage();
  document.querySelectorAll('.sidebar-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) {
      link.classList.remove('sidebar-link-active');
      return;
    }
    const linkPage = href.substring(href.lastIndexOf('/') + 1);
    link.classList.toggle('sidebar-link-active', linkPage === currentPage);
  });
}

updateActiveLink();
