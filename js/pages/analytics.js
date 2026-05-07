import { api } from '../api.js';

const pageRoot = document.getElementById('page-content');

function formatCurrency(value) {
  return `EGP ${value.toLocaleString('ar-EG')}`;
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
    <div class="card p-6">
      <p class="text-slate-400">${label}</p>
      <p class="text-3xl font-bold text-slate-50 mt-3">${value}</p>
    </div>
  `;
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
        datasets: [{ data: statusLabels.map((status) => statusCounts[status] || 0), backgroundColor: ['#f59e0b', '#3b82f6', '#38bdf8', '#34d399', '#ef4444'] }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } },
    });
  }

  if (clientsCanvas) {
    new Chart(clientsCanvas, {
      type: 'bar',
      data: {
        labels: clientOrderCounts.map((item) => item.name),
        datasets: [{ label: 'عدد الطلبات', data: clientOrderCounts.map((item) => item.value), backgroundColor: '#60a5fa' }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#cbd5e1' } }, y: { ticks: { color: '#cbd5e1' } } } },
    });
  }

  if (chaletsCanvas) {
    new Chart(chaletsCanvas, {
      type: 'bar',
      data: {
        labels: chaletOrderCounts.map((item) => item.name),
        datasets: [{ label: 'عدد الطلبات', data: chaletOrderCounts.map((item) => item.value), backgroundColor: '#34d399' }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#cbd5e1' } }, y: { ticks: { color: '#cbd5e1' } } } },
    });
  }

  if (monthsCanvas) {
    new Chart(monthsCanvas, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{ label: 'الإيراد الشهري', data: monthData, borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.16)', fill: true, tension: 0.35 }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#cbd5e1' } }, y: { ticks: { color: '#cbd5e1' } } } },
    });
  }
}

export async function renderAnalytics() {
  if (!pageRoot) return;
  const [clients, chalets, orders] = await Promise.all([api.getClients(), api.getChalets(), api.getOrders()]);

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.price || 0), 0);

  pageRoot.innerHTML = `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-50">التحليلات</h1>
        <p class="text-slate-400 mt-2">لوحة تحليلات بأرقام سريعة ورسوم بيانية واضحة.</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        ${renderKpiCard('عدد العملاء', clients.length)}
        ${renderKpiCard('عدد الشاليهات', chalets.length)}
        ${renderKpiCard('عدد الطلبات', orders.length)}
        ${renderKpiCard('الإيراد الكلي', formatCurrency(totalRevenue))}
      </div>

      <div class="grid gap-4 xl:grid-cols-2 mb-6">
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-slate-50 mb-4">حالات الطلبات</h2>
          <div class="h-[320px]"><canvas id="analytics-status-chart"></canvas></div>
        </div>
        <div class="grid gap-4">
          <div class="card p-6 h-full">
            <h2 class="text-xl font-semibold text-slate-50 mb-4">أفضل العملاء</h2>
            <div class="h-[260px]"><canvas id="analytics-clients-chart"></canvas></div>
          </div>
          <div class="card p-6 h-full">
            <h2 class="text-xl font-semibold text-slate-50 mb-4">أفضل الشاليهات</h2>
            <div class="h-[260px]"><canvas id="analytics-chalets-chart"></canvas></div>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <h2 class="text-xl font-semibold text-slate-50 mb-4">الإيراد خلال الأشهر</h2>
        <div class="h-[320px]"><canvas id="analytics-months-chart"></canvas></div>
      </div>
    </div>
  `;

  initAnalyticsCharts(orders, clients, chalets);
}

renderAnalytics();
