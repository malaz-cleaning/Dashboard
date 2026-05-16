import { api } from '../api.js';
import { auth } from '../auth.js';
import { showToast } from '../components/toast.js';
import { showTransactionModal } from '../utils/reusableModals.js';

const pageRoot = document.getElementById('page-content');

function formatCurrency(amount) {
  return 'EGP ' + Number(amount || 0).toLocaleString('ar-EG');
}

function renderRows(transactions, orders, chalets) {
  if (!transactions.length) {
    return `<div class="card-padded text-center text-slate-400">لا توجد معاملات حتى الآن.</div>`;
  }

  const rows = transactions
    .map(tx => {
      const order = orders.find((o) => o.order_id === tx.order_id);
      const chalet = order ? chalets.find((c) => c.chalet_id === order.chalet_id) : null;
      const orderLabel = order
        ? `${order.order_id} - ${chalet?.chalet_name || order.chalet_id || 'غير محدد'}`
        : tx.order_id ? `طلب محذوف (${tx.order_id})` : '-';
      return `
        <tr class="hover:bg-slate-700/40">
          <td class="px-6 py-4 text-slate-200">${tx.transaction_id}</td>
          <td class="px-6 py-4 text-slate-200">${tx.type === 'expense' ? 'مصروف' : 'ايراد'}</td>
          <td class="px-6 py-4 text-slate-200">${formatCurrency(tx.amount)}</td>
          <td class="px-6 py-4 text-slate-200">${tx.date}</td>
          <td class="px-6 py-4 text-slate-200">${orderLabel}</td>
          <td class="px-6 py-4 text-slate-200">${tx.created_by || '-'}</td>
          <td class="px-6 py-4 text-slate-200 max-w-xs truncate">${tx.details || '-'}</td>
          <td class="px-6 py-4">
            <button class="btn btn-secondary" data-action="edit-tx" data-id="${tx.transaction_id}">تعديل</button>
            <button class="btn btn-primary ml-2" data-action="delete-tx" data-id="${tx.transaction_id}">حذف</button>
          </td>
        </tr>
      `;
    }).join('');

  return `
    <div class="card-padded">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-slate-50">المعاملات المالية</h2>
        <div class="flex gap-3">
          <button id="add-transaction" class="btn btn-primary">إضافة معاملة</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-900 border-b border-slate-700">
            <tr>
              <th class="px-6 py-3 text-slate-400">المعرف</th>
              <th class="px-6 py-3 text-slate-400">النوع</th>
              <th class="px-6 py-3 text-slate-400">المبلغ</th>
              <th class="px-6 py-3 text-slate-400">التاريخ</th>
              <th class="px-6 py-3 text-slate-400">طلب مرتبط</th>
              <th class="px-6 py-3 text-slate-400">بواسطة</th>
              <th class="px-6 py-3 text-slate-400">التفاصيل</th>
              <th class="px-6 py-3 text-slate-400">إجراءات</th>
            </tr>
          </thead>
          <tbody class="bg-slate-800">${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

export async function renderTransactions() {
  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }
  if (!pageRoot) return;

  const [transactions, orders, chalets] = await Promise.all([api.getTransactions(), api.getOrders(), api.getChalets()]);
  pageRoot.innerHTML = `
    <div class="p-6 max-w-[1200px] mx-auto px-4">
      ${renderRows(transactions, orders, chalets)}
    </div>
  `;

  document.getElementById('add-transaction')?.addEventListener('click', async () => {
    await showTransactionModal(orders, chalets, renderTransactions);
  });

  pageRoot.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('button[data-action="edit-tx"]');
    const delBtn = e.target.closest('button[data-action="delete-tx"]');
    if (editBtn) {
      const id = editBtn.dataset.id;
      const tx = (await api.getTransactions()).find(t => t.transaction_id === id);
      await showTransactionModal(orders, chalets, renderTransactions, tx);
      return;
    }
    if (delBtn) {
      const id = delBtn.dataset.id;
      await api.deleteTransaction(id);
      showToast('success', 'تم حذف المعاملة');
      renderTransactions();
    }
  });
}

if (window.location.pathname.includes('transactions.html')) {
  document.addEventListener('DOMContentLoaded', renderTransactions);
}
