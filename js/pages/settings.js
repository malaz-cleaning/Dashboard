const pageRoot = document.getElementById('page-content');

export function renderSettings() {
  if (!pageRoot) return;
  pageRoot.innerHTML = `
    <section class="dashboard-panel">
      <div class="title-group">
        <div>
          <h1 class="page-title">Settings</h1>
          <p>إعدادات النظام والتخصيص العام.</p>
        </div>
      </div>
      <div class="card">
        <h2 class="page-title">خيارات العرض</h2>
        <div class="form-row">
          <label>
            التبديل للوضع الداكن
            <select id="theme-select" class="select-field">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
        </div>
      </div>
      <div class="card">
        <h2 class="page-title">إدارة الحالات</h2>
        <p>يمكنك تخصيص حالات الطلبات مستقبلاً وستظهر في لوحة التحكم والبحث.</p>
      </div>
      <div class="card">
        <h2 class="page-title">تكاملات مستقبلية</h2>
        <ul>
          <li>WhatsApp</li>
          <li>إرسال إشعارات</li>
          <li>استيراد من Excel / PDF</li>
        </ul>
      </div>
    </section>
  `;

  const themeSelect = pageRoot.querySelector('#theme-select');
  const currentTheme = localStorage.getItem('malaz-theme') || 'dark';
  themeSelect.value = currentTheme;
  document.documentElement.dataset.theme = currentTheme;

  themeSelect?.addEventListener('change', (event) => {
    const theme = event.target.value;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('malaz-theme', theme);
  });
}

renderSettings();
