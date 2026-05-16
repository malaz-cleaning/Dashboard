import{a as h}from"./auth-CC3zXfFT.js";/* empty css               */import"./main-CZdBdtSK.js";import"./common-BqO74Arb.js";import{a as r}from"./sidebar-B32eMct9.js";import{s as u}from"./toast-ZwFb22xq.js";import{c as x}from"./reusableModals-UISrxHlU.js";const p=document.getElementById("page-content");function b(e){return"EGP "+Number(e||0).toLocaleString("ar-EG")}function y(e,d,n){return e.length?`
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
          <tbody class="bg-slate-800">${e.map(t=>{const a=d.find(o=>o.order_id===t.order_id),s=a?n.find(o=>o.chalet_id===a.chalet_id):null,i=a?`${a.order_id} - ${(s==null?void 0:s.chalet_name)||a.chalet_id||"غير محدد"}`:t.order_id?`طلب محذوف (${t.order_id})`:"-";return`
        <tr class="hover:bg-slate-700/40">
          <td class="px-6 py-4 text-slate-200">${t.transaction_id}</td>
          <td class="px-6 py-4 text-slate-200">${t.type==="expense"?"مصروف":"ايراد"}</td>
          <td class="px-6 py-4 text-slate-200">${b(t.amount)}</td>
          <td class="px-6 py-4 text-slate-200">${t.date}</td>
          <td class="px-6 py-4 text-slate-200">${i}</td>
          <td class="px-6 py-4 text-slate-200">${t.created_by||"-"}</td>
          <td class="px-6 py-4 text-slate-200 max-w-xs truncate">${t.details||"-"}</td>
          <td class="px-6 py-4">
            <button class="btn btn-secondary" data-action="edit-tx" data-id="${t.transaction_id}">تعديل</button>
            <button class="btn btn-primary ml-2" data-action="delete-tx" data-id="${t.transaction_id}">حذف</button>
          </td>
        </tr>
      `}).join("")}</tbody>
        </table>
      </div>
    </div>
  `:'<div class="card-padded text-center text-slate-400">لا توجد معاملات حتى الآن.</div>'}async function c(){var l;if(!h.isAuthenticated()){window.location.href="login.html";return}if(!p)return;const[e,d,n]=await Promise.all([r.getTransactions(),r.getOrders(),r.getChalets()]);p.innerHTML=`
    <div class="p-6 max-w-[1200px] mx-auto px-4">
      ${y(e,d,n)}
    </div>
  `,(l=document.getElementById("add-transaction"))==null||l.addEventListener("click",async()=>{await x(d,n,c)}),p.addEventListener("click",async t=>{const a=t.target.closest('button[data-action="edit-tx"]'),s=t.target.closest('button[data-action="delete-tx"]');if(a){const i=a.dataset.id,o=(await r.getTransactions()).find(m=>m.transaction_id===i);await x(d,n,c,o);return}if(s){const i=s.dataset.id;await r.deleteTransaction(i),u("success","تم حذف المعاملة"),c()}})}window.location.pathname.includes("transactions.html")&&document.addEventListener("DOMContentLoaded",c);
