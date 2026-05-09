import { api } from '../api.js';
import { auth } from '../auth.js';

const pageRoot = document.getElementById('page-content');

const STATUS_MAP = {
  pending: { label: 'معلقة', color: '#facc15' },
  in_progress: { label: 'قيد التنفيذ', color: '#38bdf8' },
  done_unpaid: { label: 'تمت ولم يُدفع', color: '#f97316' },
  done_paid: { label: 'تمت ودُفع', color: '#22c55e' },
  cancelled: { label: 'ملغاة', color: '#ef4444' },
};

function formatCurrency(value) {
  return `EGP ${Number(value || 0).toLocaleString('ar-EG')}`;
}

function buildTopList(items) {
  if (!items.length) {
    return '<p class="text-slate-400 text-sm">لا توجد بيانات حتى الآن.</p>';
  }

  return items
    .map(
      (item) => `
        <div class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 md:px-4 md:py-3 min-w-0 text-sm md:text-base">
          <span class="text-slate-300 truncate">${item.name}</span>
          <span class="text-slate-50 font-semibold ml-2 flex-shrink-0">${item.value}</span>
        </div>
      `
    )
    .join('');
}

function renderKpiCard(label, value) {
  return `
    <div class="card p-3 md:p-6 min-w-0 flex flex-col justify-between h-full">
      <p class="text-xs md:text-sm text-slate-400 line-clamp-2">${label}</p>
      <p class="text-xl md:text-3xl font-bold text-slate-50 mt-2 md:mt-4 truncate">${value}</p>
    </div>
  `;
}

function normalizeOrders(orders) {
  return orders.map((order) => ({
    ...order,
    price: Number(order.price || 0),
    created_at: order.created_at ? new Date(order.created_at) : new Date(0),
  }));
}

export async function renderAnalytics() {
  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }
  if (!pageRoot) return;

  const [clients, chalets, ordersRaw] = await Promise.all([
    api.getClients(),
    api.getChalets(),
    api.getOrders(),
  ]);

  const orders = normalizeOrders(ordersRaw);
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const clientOrderCounts = clients
    .map((client) => ({
      name: client.name,
      value: orders.filter((order) => order.client_id === client.client_id).length,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const chaletOrderCounts = chalets
    .map((chalet) => ({
      name: chalet.chalet_name,
      value: orders.filter((order) => order.chalet_id === chalet.chalet_id).length,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const monthLabels = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
  const monthData = monthLabels.map((_, index) =>
    orders
      .filter((order) => order.created_at.getMonth() === index)
      .reduce((sum, order) => sum + order.price, 0)
  );

  const statusLabels = Object.keys(STATUS_MAP);
  const statusValues = statusLabels.map((status) => statusCounts[status] || 0);
  const statusColors = statusLabels.map((status) => STATUS_MAP[status].color);

  pageRoot.innerHTML = `
    <div class="p-4 md:p-6 max-w-full mx-auto space-y-6 min-w-0">
      <!-- Header -->
      <div class="flex flex-col gap-2 md:gap-4">
        <h1 class="text-2xl md:text-4xl font-bold text-slate-50">التحليلات</h1>
        <p class="text-sm md:text-base text-slate-400 max-w-2xl">لوحة تحليلات بصرية وسريعة تظهر أداء الطلبات، الإيرادات، والعملاء.</p>
      </div>

      <!-- KPI Cards -->
      <div class="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 auto-rows-max">
        ${renderKpiCard('قيمة الطلبات', formatCurrency(totalRevenue))}
        ${renderKpiCard('عدد العملاء', clients.length)}
        ${renderKpiCard('عدد الشاليهات', chalets.length)}
        ${renderKpiCard('إجمالي الطلبات', orders.length)}
      </div>

      <!-- Charts Section -->
      <div class="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3 auto-rows-max">
        <!-- Revenue Chart - Spans 2 cols on large screens -->
        <div class="lg:col-span-2 card p-4 md:p-6 min-w-0 flex flex-col">
          <div class="flex-1 flex flex-col min-w-0">
            <div>
              <h2 class="text-lg md:text-xl font-semibold text-slate-50">اتجاه الإيرادات</h2>
              <p class="text-xs md:text-sm text-slate-400 mt-1">عرض الإيراد الشهري للأشهر الأخيرة</p>
            </div>
            <div class="mt-4 md:mt-6 flex-1 min-h-[280px] md:min-h-[350px]">
              <canvas id="revenue-chart" aria-label="Revenue chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Status Chart -->
        <div class="card p-4 md:p-6 min-w-0 flex flex-col">
          <div class="flex-1 flex flex-col min-w-0">
            <div>
              <h2 class="text-lg md:text-xl font-semibold text-slate-50">حالات الطلبات</h2>
              <p class="text-xs md:text-sm text-slate-400 mt-1">توزيع الطلبات</p>
            </div>
            <div class="mt-4 md:mt-6 flex-1 min-h-[280px] md:min-h-[350px]">
              <canvas id="status-chart" aria-label="Status distribution chart"></canvas>
            </div>
            <div class="mt-4 md:mt-6 space-y-2">
              ${statusLabels
                .map(
                  (status) => `
                    <div class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 min-w-0 text-sm">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:${STATUS_MAP[status].color}"></span>
                        <span class="text-slate-300 truncate">${STATUS_MAP[status].label}</span>
                      </div>
                      <span class="text-slate-50 font-semibold">${statusCounts[status] || 0}</span>
                    </div>
                  `
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Top Clients and Chalets Section -->
      <div class="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 auto-rows-max">
        <!-- Top Clients -->
        <div class="card p-4 md:p-6 min-w-0">
          <div>
            <h3 class="text-lg md:text-xl font-semibold text-slate-50">أفضل العملاء</h3>
            <p class="text-xs md:text-sm text-slate-400 mt-1">العملاء الأكثر طلبًا</p>
          </div>
          <div class="mt-4 md:mt-5 space-y-2 max-h-[400px] overflow-y-auto">
            ${buildTopList(clientOrderCounts)}
          </div>
        </div>

        <!-- Top Chalets -->
        <div class="card p-4 md:p-6 min-w-0">
          <div>
            <h3 class="text-lg md:text-xl font-semibold text-slate-50">أفضل الشاليهات</h3>
            <p class="text-xs md:text-sm text-slate-400 mt-1">الشاليهات الأكثر حجزًا</p>
          </div>
          <div class="mt-4 md:mt-5 space-y-2 max-h-[400px] overflow-y-auto">
            ${buildTopList(chaletOrderCounts)}
          </div>
        </div>
      </div>
    </div>
  `;

  const revenueCtx = document.getElementById('revenue-chart');
  const statusCtx = document.getElementById('status-chart');

  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: 'الإيراد',
            data: monthData,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.18)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#22c55e',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => `${formatCurrency(context.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#cbd5e1', font: { size: 11 } },
            grid: { color: 'rgba(148,163,184,0.15)' },
          },
          y: {
            ticks: { color: '#cbd5e1', font: { size: 11 } },
            grid: { color: 'rgba(148,163,184,0.15)' },
          },
        },
      },
    });
  }

  if (statusCtx) {
    new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: statusLabels.map((status) => STATUS_MAP[status].label),
        datasets: [
          {
            data: statusValues,
            backgroundColor: statusColors,
            borderColor: '#1e293b',
            borderWidth: 2,
            hoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { 
              color: '#cbd5e1',
              font: { size: 11 },
              padding: 10,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 10,
          },
        },
      },
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderAnalytics().catch((error) => {
    console.error('Failed to render analytics page:', error);
  });
});
