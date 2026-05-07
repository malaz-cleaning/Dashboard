import { api } from '../api.js';

const pageRoot = document.getElementById('page-content');

function formatCurrency(value) {
  return `EGP ${value.toLocaleString()}`;
}

function getStatusLabel(status) {
  const map = {
    pending: 'معلقة',
    in_progress: 'قيد التنفيذ',
    done_unpaid: 'تمت ولم يُدفع',
    done_paid: 'تمت ودُفع',
    cancelled: 'ملغاة',
  };
  return map[status] || status;
}

function renderKpiCard(label, value) {
  return `
    <div class="card">
      <p class="text-slate-300">${label}</p>
      <p class="page-title">${value}</p>
    </div>
  `;
}

function makeChartDataByField(items, labelField) {
  return items
    .reduce((acc, item) => {
      const label = item[labelField] || 'غير محدد';
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
}

function initAnalyticsCharts(orders, clients, chalets) {
  const statusCanvas = document.getElementById('analytics-status-chart');
  const clientsCanvas = document.getElementById('analytics-clients-chart');
  const chaletsCanvas = document.getElementById('analytics-chalets-chart');
  const monthsCanvas = document.getElementById('analytics-months-chart');

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  const statusLabels = ['pending', 'in_progress', 'done_unpaid', 'done_paid', 'cancelled'];

  const clientOrderCounts = clients
    .map((client) => ({ name: client.name, value: orders.filter((order) => order.client_id === client.client_id).length }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const chaletOrderCounts = chalets
    .map((chalet) => ({ name: chalet.chalet_name, value: orders.filter((order) => order.chalet_id === chalet.chalet_id).length }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const monthLabels = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
  const monthData = monthLabels.map((_, index) =>
    orders.filter((order) => new Date(order.created_at).getMonth() === index).reduce((sum, order) => sum + Number(order.price || 0), 0)
  );

  if (statusCanvas) {
    new Chart(statusCanvas, {
      type: 'pie',
      data: {
        labels: statusLabels.map(getStatusLabel),
        datasets: [{ data: statusLabels.map((status) => statusCounts[status] || 0), backgroundColor: ['#f59e0b', '#3b82f6', '#0ea5e9', '#10b981', '#ef4444'] }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
    });
  }

  if (clientsCanvas) {
    new Chart(clientsCanvas, {
      type: 'bar',
      data: {
        labels: clientOrderCounts.map((item) => item.name),
        datasets: [{ label: 'عدد الطلبات', data: clientOrderCounts.map((item) => item.value), backgroundColor: '#60a5fa' }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
    });
  }

  if (chaletsCanvas) {
    new Chart(chaletsCanvas, {
      type: 'bar',
      data: {
        labels: chaletOrderCounts.map((item) => item.name),
        datasets: [{ label: 'عدد الطلبات', data: chaletOrderCounts.map((item) => item.value), backgroundColor: '#34d399' }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
    });
  }

  if (monthsCanvas) {
    new Chart(monthsCanvas, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{ label: 'الإيراد الشهري', data: monthData, borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.16)', fill: true, tension: 0.4 }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
    });
  }
}

export async function renderAnalytics() {
  if (!pageRoot) return;
  const [clients, chalets, orders] = await Promise.all([api.getClients(), api.getChalets(), api.getOrders()]);

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.price || 0), 0);
  const paidOrders = orders.filter((order) => order.status === 'done_paid').length;
  const unpaidOrders = orders.filter((order) => order.status === 'done_unpaid').length;
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;

  pageRoot.innerHTML = `
    <section class="dashboard-panel">
      <div class="title-group">
        <div>
          <h1 class="page-title">Analytics</h1>
          <p>لوحات تحكم وتحليلات كاملة للعملاء والأوامر.</p>
        </div>
      </div>
      <div class="stats-grid">
        ${renderKpiCard('عدد العملاء', clients.length)}
        ${renderKpiCard('عدد الشاليهات', chalets.length)}
        ${renderKpiCard('عدد الطلبات', orders.length)}
        ${renderKpiCard('الإيراد الكلي', formatCurrency(totalRevenue))}
      </div>
      <div class="chart-grid">
        <div class="card chart-card">
          <h2 class="page-title">حالات الطلبات</h2>
          <canvas id="analytics-status-chart" height="260"></canvas>
        </div>
        <div class="card chart-card">
          <h2 class="page-title">أفضل العملاء</h2>
          <canvas id="analytics-clients-chart" height="260"></canvas>
        </div>
        <div class="card chart-card">
          <h2 class="page-title">أفضل الشاليهات</h2>
          <canvas id="analytics-chalets-chart" height="260"></canvas>
        </div>
        <div class="card chart-card">
          <h2 class="page-title">الإيراد خلال الأشهر</h2>
          <canvas id="analytics-months-chart" height="260"></canvas>
        </div>
      </div>
    </section>
  `;

  initAnalyticsCharts(orders, clients, chalets);
}

renderAnalytics();
