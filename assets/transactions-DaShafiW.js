import{a as _}from"./auth-CC3zXfFT.js";/* empty css               */import"./main-CZdBdtSK.js";import"./common-B6Mb1_rC.js";import{a as p}from"./sidebar-84I8JWhY.js";import{s as C}from"./toast-ZwFb22xq.js";import{c as w}from"./reusableModals-f8FhhYVB.js";const y=document.getElementById("page-content");function x(s){return"EGP "+Number(s||0).toLocaleString("ar-EG")}function B(s,l,r){if(!s.length)return`
      <div class="py-16 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-slate-400 font-medium">لا توجد معاملات حتى الآن</p>
      </div>
    `;const i=s.filter(t=>t.type==="income").reduce((t,e)=>t+Number(e.amount||0),0),o=s.filter(t=>t.type==="expense").reduce((t,e)=>t+Number(e.amount||0),0),b=i-o,v=s.map(t=>{const e=l.find(c=>c.order_id===t.order_id),a=e?r.find(c=>c.chalet_id===e.chalet_id):null,m=e?`${e.order_id} - ${(a==null?void 0:a.chalet_name)||e.chalet_id||"غير محدد"}`:t.order_id?`طلب محذوف (${t.order_id})`:"-",d=t.type==="expense"?"bg-red-500/5 hover:bg-red-500/10":"bg-emerald-500/5 hover:bg-emerald-500/10",u=t.type==="expense"?'<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>':'<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 7H12z" clip-rule="evenodd"/></svg>',f=t.type==="expense"?"text-red-400":"text-emerald-400";return`
        <tr class="${d} transition-colors border-b border-slate-700/20">
          <td class="px-6 py-4 text-slate-200 font-mono text-right" style="width: 80px;">${t.transaction_id}</td>
          <td class="px-6 py-4 text-right" style="width: 100px;">
            <div class="flex items-center gap-2 justify-start">
              <span class="${f}">${u}</span>
              <span class="text-slate-200 font-medium">${t.type==="expense"?"مصروف":"ايراد"}</span>
            </div>
          </td>
          <td class="px-6 py-4 text-slate-200 font-semibold text-right" style="width: 120px;">${x(t.amount)}</td>
          <td class="px-6 py-4 text-slate-200 text-right" style="width: 120px;">${t.date}</td>
          <td class="px-6 py-4 text-slate-200 text-right truncate max-w-[180px]" style="width: 180px;" title="${m}">${m}</td>
          <td class="px-6 py-4 text-slate-300 text-right" style="width: 120px;">${t.created_by||"-"}</td>
          <td class="px-6 py-4 text-slate-300 text-right max-w-xs truncate" title="${t.details||"-"}">${t.details||"-"}</td>
          <td class="px-6 py-4 text-center whitespace-nowrap" style="width: 160px;">
            <div class="flex items-center justify-center gap-2">
              <button class="btn btn-ghost px-3 py-1.5 text-xs text-blue-300 border border-blue-500/20 hover:bg-blue-600/20 hover:text-blue-100 transition-all duration-200" data-action="edit-tx" data-id="${t.transaction_id}">تعديل</button>
              <button class="btn btn-secondary px-3 py-1.5 text-xs text-red-300 border border-red-500/20 hover:bg-red-600/20 hover:text-red-100 transition-all duration-200" data-action="delete-tx" data-id="${t.transaction_id}">حذف</button>
            </div>
          </td>
        </tr>
      `}).join(""),n=s.map(t=>{const e=l.find(g=>g.order_id===t.order_id),a=e?r.find(g=>g.chalet_id===e.chalet_id):null,m=e?`${e.order_id} - ${(a==null?void 0:a.chalet_name)||e.chalet_id||"غير محدد"}`:t.order_id?`طلب محذوف (${t.order_id})`:"-",d=t.type==="expense",u=d?"bg-gradient-to-br from-red-900/30 to-red-900/10":"bg-gradient-to-br from-emerald-900/30 to-emerald-900/10",f=d?"border-red-500/30":"border-emerald-500/30",c=d?"bg-red-500/20 text-red-300 border border-red-500/40":"bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",$=d?"text-red-300":"text-emerald-300";return`
        <div class="${u} border ${f} rounded-3xl p-5 shadow-lg backdrop-blur-sm">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <p class="text-slate-400 text-xs uppercase tracking-wide">رقم المعاملة</p>
              <p class="text-slate-100 font-mono text-sm font-semibold">${t.transaction_id}</p>
            </div>
            <span class="rounded-full px-3 py-1 text-xs font-bold ${c}">${d?"مصروف":"ايراد"}</span>
          </div>
          
          <div class="mb-4 p-3 bg-slate-900/50 rounded-xl">
            <p class="text-slate-400 text-xs mb-1">المبلغ</p>
            <p class="text-2xl font-bold ${$}">${x(t.amount)}</p>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <p class="text-slate-400 text-xs">التاريخ</p>
              <p class="text-slate-200 font-medium">${t.date}</p>
            </div>
            <div>
              <p class="text-slate-400 text-xs">بواسطة</p>
              <p class="text-slate-200 font-medium">${t.created_by||"-"}</p>
            </div>
          </div>

          <div class="mb-4">
            <p class="text-slate-400 text-xs mb-1">طلب مرتبط</p>
            <p class="text-slate-200 text-sm bg-slate-900/50 rounded-lg p-2">${m}</p>
          </div>

          ${t.details?`
            <div class="mb-4">
              <p class="text-slate-400 text-xs mb-1">التفاصيل</p>
              <p class="text-slate-300 text-sm bg-slate-900/50 rounded-lg p-2">${t.details}</p>
            </div>
          `:""}

          <div class="flex gap-2">
            <button class="flex-1 btn btn-secondary py-2" data-action="edit-tx" data-id="${t.transaction_id}">تعديل</button>
            <button class="flex-1 btn btn-primary py-2" data-action="delete-tx" data-id="${t.transaction_id}">حذف</button>
          </div>
        </div>
      `}).join("");return`
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-50">المعاملات المالية</h1>
          <p class="text-slate-400 mt-2 text-sm">إدارة شاملة للإيرادات والمصروفات</p>
        </div>
        <button id="add-transaction" class="btn btn-primary px-6 py-3">+ إضافة معاملة</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card-padded bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm">المعاملات</p>
              <p class="text-3xl font-bold text-slate-50 mt-2">${s.length}</p>
            </div>
            <div class="text-slate-500">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
          </div>
        </div>

        <div class="card-padded bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-emerald-300 text-sm">الإيرادات</p>
              <p class="text-3xl font-bold text-emerald-400 mt-2">${x(i)}</p>
            </div>
            <div class="text-emerald-500">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 7H12z" clip-rule="evenodd"/></svg>
            </div>
          </div>
        </div>

        <div class="card-padded bg-red-950/20 border border-red-500/30 hover:border-red-500/50 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-300 text-sm">المصروفات</p>
              <p class="text-3xl font-bold text-red-400 mt-2">${x(o)}</p>
            </div>
            <div class="text-red-500">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>
            </div>
          </div>
        </div>

        <div class="card-padded bg-blue-950/20 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-300 text-sm">الصافي</p>
              <p class="text-3xl font-bold text-blue-400 mt-2">${x(b)}</p>
            </div>
            <div class="text-blue-500">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div class="responsive-mobile-cards space-y-4">
        ${n}
      </div>

      <div class="responsive-table-wrapper card-padded overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table min-w-full text-sm">
            <thead class="bg-slate-900/80 border-b border-slate-700">
              <tr>
                <th class="px-6 py-4 text-right text-slate-300 font-semibold" style="width: 80px;">المعرف</th>
                <th class="px-6 py-4 text-right text-slate-300 font-semibold" style="width: 100px;">النوع</th>
                <th class="px-6 py-4 text-right text-slate-300 font-semibold" style="width: 120px;">المبلغ</th>
                <th class="px-6 py-4 text-right text-slate-300 font-semibold" style="width: 120px;">التاريخ</th>
                <th class="px-6 py-4 text-right text-slate-300 font-semibold" style="width: 180px;">طلب مرتبط</th>
                <th class="px-6 py-4 text-right text-slate-300 font-semibold" style="width: 120px;">بواسطة</th>
                <th class="px-6 py-4 text-right text-slate-300 font-semibold">التفاصيل</th>
                <th class="px-6 py-4 text-center text-slate-300 font-semibold" style="width: 160px;">إجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/30">${v}</tbody>
          </table>
        </div>
      </div>
    </div>
  `}async function h(){var i;if(!_.isAuthenticated()){window.location.href="login.html";return}if(!y)return;const[s,l,r]=await Promise.all([p.getTransactions(),p.getOrders(),p.getChalets()]);y.innerHTML=`
    <div class="p-6 max-w-[1200px] mx-auto px-4">
      ${B(s,l,r)}
    </div>
  `,(i=document.getElementById("add-transaction"))==null||i.addEventListener("click",async()=>{await w(l,r,h)}),y.addEventListener("click",async o=>{const b=o.target.closest('button[data-action="edit-tx"]'),v=o.target.closest('button[data-action="delete-tx"]');if(b){const n=b.dataset.id,t=(await p.getTransactions()).find(e=>e.transaction_id===n);await w(l,r,h,t);return}if(v){const n=v.dataset.id;await p.deleteTransaction(n),C("success","تم حذف المعاملة"),h()}})}window.location.pathname.includes("transactions.html")&&document.addEventListener("DOMContentLoaded",h);
