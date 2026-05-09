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

export async function renderAnalytics() {
  if (!pageRoot) return;
  const [clients, chalets, orders] = await Promise.all([api.getClients(), api.getChalets(), api.getOrders()]);

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.price || 0), 0);
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

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

  pageRoot.innerHTML = `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-50">التحليلات</h1>
          <p class="text-slate-400 mt-2">لوحة تحليلات بسيطة بأرقام واضحة بدون رسوم بيانية.</p>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        ${renderKpiCard('عدد العملاء', clients.length)}
        ${renderKpiCard('عدد الشاليهات', chalets.length)}
        ${renderKpiCard('عدد الطلبات', orders.length)}
        ${renderKpiCard('الإيراد الكلي', formatCurrency(totalRevenue))}
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-slate-50 mb-4">حالات الطلبات</h2>
          <div class="space-y-3">
            ${['pending', 'in_progress', 'done_unpaid', 'done_paid', 'cancelled']
              .map((status) => `
                <div class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                  <span class="text-slate-300">${getStatusLabel(status)}</span>
                  <span class="text-slate-50 font-semibold">${statusCounts[status] || 0}</span>
                </div>
              `)
              .join('')}
          </div>
        </div>

        <div class="grid gap-4">
          <div class="card p-6 h-full">
            <h2 class="text-xl font-semibold text-slate-50 mb-4">أفضل العملاء</h2>
            <div class="space-y-3">
              ${clientOrderCounts.length
                ? clientOrderCounts.map((item) => `
                    <div class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                      <span class="text-slate-300 truncate">${item.name}</span>
                      <span class="text-slate-50 font-semibold">${item.value}</span>
                    </div>
                  `).join('')
                : '<p class="text-slate-400">لا توجد بيانات عملاء بعد.</p>'}
            </div>
          </div>
          <div class="card p-6 h-full">
            <h2 class="text-xl font-semibold text-slate-50 mb-4">أفضل الشاليهات</h2>
            <div class="space-y-3">
              ${chaletOrderCounts.length
                ? chaletOrderCounts.map((item) => `
                    <div class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                      <span class="text-slate-300 truncate">${item.name}</span>
                      <span class="text-slate-50 font-semibold">${item.value}</span>
                    </div>
                  `).join('')
                : '<p class="text-slate-400">لا توجد بيانات شاليهات بعد.</p>'}
            </div>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <h2 class="text-xl font-semibold text-slate-50 mb-4">الإيراد خلال الأشهر</h2>
        <div class="space-y-3">
          ${monthLabels
            .map((month, index) => `
              <div class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                <span class="text-slate-300">${month}</span>
                <span class="text-slate-50 font-semibold">${formatCurrency(monthData[index])}</span>
              </div>
            `)
            .join('')}
        </div>
      </div>
    </div>
  `;
}

renderAnalytics();
