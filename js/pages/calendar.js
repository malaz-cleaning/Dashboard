import { api } from '../api.js';
import { auth } from '../auth.js';

function statusBadge(status) {
  const map = {
    pending: 'معلقة',
    in_progress: 'قيد التنفيذ',
    done_unpaid: 'تمت ولم يُدفع',
    done_paid: 'تمت ودُفع',
    cancelled: 'ملغاة',
  };
  return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-slate-800 text-slate-200">${map[status] || status}</span>`;
}

const pageRoot = document.getElementById('page-content');

function formatCurrency(amount) {
  return 'EGP ' + Number(amount || 0).toLocaleString('ar-EG');
}

function formatDateKey(d) {
  if (!d) return 'غير محدد';
  try {
    return new Date(d).toISOString().split('T')[0];
  } catch (e) {
    return d;
  }
}

function renderDayGroup(dateKey, orders, clients, chalets) {
  const rows = orders.map(order => {
    const client = clients.find(c => c.client_id === order.client_id) || {};
    const chalet = chalets.find(ch => ch.chalet_id === order.chalet_id) || {};
    return `
      <div class="bg-slate-900 rounded-xl p-4 border border-slate-700 mb-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-slate-300">#${order.order_id} • ${client.name || 'غير محدد'}</div>
            <div class="text-sm text-slate-400">${chalet.chalet_name || 'غير محدد'}</div>
          </div>
          <div class="text-sm">${formatCurrency(order.price)}</div>
        </div>
        <div class="mt-2 flex items-center justify-between">
          <div>${statusBadge(order.status)}</div>
          <div class="text-sm text-slate-400">${order.scheduled_at || order.created_at || 'غير محدد'}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="mb-6">
      <h3 class="text-lg font-semibold text-slate-50 mb-3">${dateKey}</h3>
      ${rows}
    </section>
  `;
}

export async function renderCalendar() {
  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }
  if (!pageRoot) return;

  try {
    const [orders, clients, chalets] = await Promise.all([api.getOrders(), api.getClients(), api.getChalets()]);

    // sort by scheduled_at then created_at
    const sorted = orders.slice().sort((a, b) => {
      const aDate = new Date(a.scheduled_at || a.created_at || '1970-01-01').getTime();
      const bDate = new Date(b.scheduled_at || b.created_at || '1970-01-01').getTime();
      return aDate - bDate;
    });

    // group by day key
    const groups = sorted.reduce((acc, order) => {
      const key = formatDateKey(order.scheduled_at || order.created_at) || 'غير محدد';
      acc[key] = acc[key] || [];
      acc[key].push(order);
      return acc;
    }, {});

    const keys = Object.keys(groups).sort();

    pageRoot.innerHTML = `
      <div class="p-6 max-w-[900px] mx-auto px-4 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-50">التقويم</h1>
            <p class="text-slate-400 mt-2">عرض الطلبات مجمعة حسب تاريخ التنفيذ.</p>
          </div>
        </div>
        <div>
          ${keys.map(k => renderDayGroup(k, groups[k], clients, chalets)).join('')}
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Error rendering calendar:', error);
    pageRoot.innerHTML = '<div class="p-4">خطأ في تحميل التقويم</div>';
  }
}

if (window.location.pathname.includes('calendar.html')) {
  document.addEventListener('DOMContentLoaded', renderCalendar);
}
