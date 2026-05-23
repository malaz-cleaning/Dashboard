import{a as _}from"./sidebar-84I8JWhY.js";import{s as k}from"./toast-ZwFb22xq.js";import{a as G}from"./auth-CC3zXfFT.js";import{s as I,r as N}from"./reusableModals-BBjcAGCf.js";const d=document.getElementById("page-content"),w=document.getElementById("modal-root");w||console.error("Modal root not found");function j(a){const s={pending:{label:"معلقة",color:"bg-yellow-100 text-yellow-800 border-yellow-200"},in_progress:{label:"قيد التنفيذ",color:"bg-blue-100 text-blue-800 border-blue-200"},done_unpaid:{label:"تمت ولم يُدفع",color:"bg-orange-100 text-orange-800 border-orange-200"},done_paid:{label:"تمت ودُفع",color:"bg-green-100 text-green-800 border-green-200"},cancelled:{label:"ملغاة",color:"bg-red-100 text-red-800 border-red-200"}}[a]||{label:a,color:"bg-gray-100 text-gray-800 border-gray-200"};return`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.color}">${s.label}</span>`}function x(a){return`EGP ${Number(a||0).toLocaleString("ar-EG")}`}function O(a,r,s,l=[]){if(!a.length)return{tableRows:`
        <tr>
          <td colspan="14" class="px-6 py-12 text-center text-slate-500">لا يوجد طلبات مطابقة.</td>
        </tr>
      `,mobileCards:`
        <div class="bg-slate-800 rounded-3xl border border-slate-700 p-8 text-center text-slate-400">لا يوجد طلبات مطابقة.</div>
      `};const i=a.map(t=>{const u=r.find(e=>e.client_id===t.client_id)||{},f=s.find(e=>e.chalet_id===t.chalet_id)||{},v=t.completed_at||(["done_paid","done_unpaid","cancelled"].includes(t.status)?new Date().toISOString().split("T")[0]:"-"),m=l.filter(e=>!e.is_deleted&&e.order_id===t.order_id&&e.type==="expense").reduce((e,b)=>e+Number(b.amount||0),0),h=l.filter(e=>!e.is_deleted&&e.order_id===t.order_id&&e.type==="income").reduce((e,b)=>e+Number(b.amount||0),0),$=(h>0?h:Number(t.deposit||0))-m;return`
        <tr class="hover:bg-slate-700/60">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${t.order_id}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-100">${u.name||"غير محدد"}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-100">${f.chalet_name||"غير محدد"}</td>
          <td class="px-6 py-4 whitespace-nowrap">${j(t.status)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${x(t.price)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${x(t.deposit)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${x(m)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${x($)}</td>
          <td class="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">${t.notes||"-"}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${t.scheduled_at||"-"}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${t.created_at}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${v}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select class="block w-full px-3 py-2 border border-slate-600 bg-slate-900 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" data-order-id="${t.order_id}" data-current-status="${t.status}">
              <option value="pending" ${t.status==="pending"?"selected":""}>معلقة</option>
              <option value="in_progress" ${t.status==="in_progress"?"selected":""}>قيد التنفيذ</option>
              <option value="done_unpaid" ${t.status==="done_unpaid"?"selected":""}>تمت ولم يُدفع</option>
              <option value="done_paid" ${t.status==="done_paid"?"selected":""}>تمت ودُفع</option>
              <option value="cancelled" ${t.status==="cancelled"?"selected":""}>ملغاة</option>
            </select>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex gap-2">
              <button type="button" class="inline-flex items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 px-3 py-2 text-sm transition hover:bg-amber-500/20 hover:text-amber-100" data-action="edit-order" data-order-id="${t.order_id}">تعديل</button>
              <button type="button" class="inline-flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 px-3 py-2 text-sm transition hover:bg-red-500/20 hover:text-red-100" data-action="delete-order" data-order-id="${t.order_id}">حذف</button>
            </div>
          </td>
        </tr>
      `}).join(""),p=a.map(t=>{const u=r.find(e=>e.client_id===t.client_id)||{},f=s.find(e=>e.chalet_id===t.chalet_id)||{},v=t.completed_at||(["done_paid","done_unpaid","cancelled"].includes(t.status)?new Date().toISOString().split("T")[0]:"-"),m=l.filter(e=>!e.is_deleted&&e.order_id===t.order_id&&e.type==="expense").reduce((e,b)=>e+Number(b.amount||0),0),h=l.filter(e=>!e.is_deleted&&e.order_id===t.order_id&&e.type==="income").reduce((e,b)=>e+Number(b.amount||0),0),$=(h>0?h:Number(t.deposit||0))-m;return`
        <div class="md:hidden bg-slate-800 rounded-3xl border border-slate-700 p-4 mb-4">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="text-lg font-semibold text-slate-50">طلب #${t.order_id}</h3>
              <p class="text-sm text-slate-400">${u.name||"غير محدد"} - ${f.chalet_name||"غير محدد"}</p>
            </div>
            ${j(t.status)}
          </div>
            <div class="space-y-2 mb-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">السعر:</span>
              <span class="text-lg font-semibold text-slate-50">${x(t.price)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">الدفعة:</span>
              <span class="text-sm text-slate-50">${x(t.deposit)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">المصروفات:</span>
              <span class="text-sm text-slate-50">${x(m)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">صافي الربح:</span>
              <span class="text-sm text-slate-50">${x($)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">تاريخ الإنشاء:</span>
              <span class="text-sm text-slate-50">${t.created_at}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">تاريخ التنفيذ:</span>
              <span class="text-sm text-slate-50">${t.scheduled_at||"-"}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">تاريخ الإنجاز:</span>
              <span class="text-sm text-slate-50">${v}</span>
            </div>
            ${t.notes?`<div class="pt-2 border-t border-slate-700"><p class="text-sm text-slate-400">${t.notes}</p></div>`:""}
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">تغيير الحالة</label>
            <select class="block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" data-order-id="${t.order_id}" data-current-status="${t.status}">
              <option value="pending" ${t.status==="pending"?"selected":""}>معلقة</option>
              <option value="in_progress" ${t.status==="in_progress"?"selected":""}>قيد التنفيذ</option>
              <option value="done_unpaid" ${t.status==="done_unpaid"?"selected":""}>تمت ولم يُدفع</option>
              <option value="done_paid" ${t.status==="done_paid"?"selected":""}>تمت ودُفع</option>
              <option value="cancelled" ${t.status==="cancelled"?"selected":""}>ملغاة</option>
            </select>
          </div>
          <div class="mt-4 flex gap-2">
            <button type="button" class="flex-1 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 px-4 py-3 text-sm font-medium transition hover:bg-amber-500/20 hover:text-amber-100" data-action="edit-order" data-order-id="${t.order_id}">تعديل</button>
            <button type="button" class="flex-1 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 px-4 py-3 text-sm font-medium transition hover:bg-red-500/20 hover:text-red-100" data-action="delete-order" data-order-id="${t.order_id}">حذف</button>
          </div>
        </div>
      `}).join("");return{tableRows:i,mobileCards:p}}async function T(a,r){return w?new Promise(s=>{const l=`
      <div class="space-y-4">
        <p class="text-slate-200">هل تريد حذف الطلب <span class="font-semibold text-white">#${a}</span> نهائيًا؟</p>
        <div class="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button class="btn btn-secondary w-full sm:w-auto" id="cancel-delete-button">إلغاء</button>
          <button class="btn btn-primary w-full sm:w-auto bg-red-500 text-white hover:bg-red-600" id="confirm-delete-button">حذف</button>
        </div>
      </div>
    `;N(w,"تأكيد حذف الطلب",l);const i=w.querySelector("#cancel-delete-button"),p=w.querySelector("#confirm-delete-button");i==null||i.addEventListener("click",()=>{w.innerHTML="",s(!1)}),p==null||p.addEventListener("click",async()=>{try{await _.deleteOrder(a),k("success","تم حذف الطلب بنجاح"),w.innerHTML="",r(),s(!0)}catch(t){console.error("Error deleting order:",t),k("error","حدث خطأ أثناء حذف الطلب"),s(!1)}})}):(console.error("Modal root not available for delete confirmation"),!1)}function M(a,r,s){return a.filter(l=>{const i=r.find(v=>v.client_id===l.client_id)||{},p=`${l.order_id} ${l.notes||""} ${l.status} ${i.name}`.toLowerCase(),t=s.search?p.includes(s.search.toLowerCase()):!0,u=s.status?l.status===s.status:!0,f=s.client?l.client_id===s.client:!0;return t&&u&&f})}async function B(a,r,s){await I(a,r,s)}async function S(){if(!G.isAuthenticated()){window.location.href="login.html";return}if(!d)return;const[a,r,s]=await Promise.all([_.getOrders(),_.getClients(),_.getChalets()]),l=await _.getTransactions(),i={orders:a.length,clients:r.length,chalets:s.length,revenue:l.filter(n=>n.type==="income").reduce((n,o)=>n+Number(o.amount||0),0),totalNetProfit:l.filter(n=>!n.is_deleted).reduce((n,o)=>n+(o.type==="income"?Number(o.amount||0):-Number(o.amount||0)),0)};d.innerHTML=`
    <div class="p-6 max-w-[1200px] mx-auto px-4 space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-50">الطلبات</h1>
          <p class="text-slate-400 mt-2">عرض وإدارة جميع الطلبات من Dash board.</p>
        </div>
        <button class="btn btn-primary px-6 py-3" id="add-order-button">إضافة طلب جديد</button>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="card card-padded">
          <p class="text-sm text-slate-400">إجمالي الطلبات</p>
          <p class="mt-3 text-3xl font-semibold text-slate-50">${i.orders}</p>
        </div>
        <div class="card card-padded">
          <p class="text-sm text-slate-400">عدد العملاء</p>
          <p class="mt-3 text-3xl font-semibold text-slate-50">${i.clients}</p>
        </div>
        <div class="card card-padded">
          <p class="text-sm text-slate-400">عدد الشاليهات</p>
          <p class="mt-3 text-3xl font-semibold text-slate-50">${i.chalets}</p>
        </div>
        <div class="card card-padded">
          <p class="text-sm text-slate-400">إجمالي الإيراد</p>
          <p class="mt-3 text-3xl font-semibold text-slate-50">${x(i.revenue)}</p>
        </div>
        <div class="card card-padded">
          <p class="text-sm text-slate-400">صافي الربح الكلي</p>
          <p class="mt-3 text-3xl font-semibold text-slate-50">${x(i.totalNetProfit)}</p>
        </div>
      </div>

      <div class="bg-slate-900 rounded-3xl shadow-card border border-slate-700 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="form-label text-slate-300" for="order-search">بحث</label>
            <input id="order-search" type="search" class="form-input bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" placeholder="ابحث برقم الطلب أو العميل" />
          </div>
          <div>
            <label class="form-label text-slate-300" for="order-status-filter">حالة الطلب</label>
            <select id="order-status-filter" class="form-select bg-slate-800 border-slate-700 text-slate-100">
              <option value="">كل الحالات</option>
              <option value="pending">معلقة</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="done_unpaid">تمت ولم يُدفع</option>
              <option value="done_paid">تمت ودُفع</option>
              <option value="cancelled">ملغاة</option>
            </select>
          </div>
          <div>
            <label class="form-label" for="order-client-filter">عميل</label>
            <select id="order-client-filter" class="form-select">
              <option value="">كل العملاء</option>
              ${r.map(n=>`<option value="${n.client_id}">${n.name}</option>`).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="bg-slate-900 rounded-3xl shadow-card border border-slate-700 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="hidden md:table min-w-full table-auto divide-y divide-slate-700">
            <thead class="bg-slate-800">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">رقم الطلب</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">العميل</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">الشاليه</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">الحالة</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">السعر</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">الدفعة</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">المصروفات</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">صافي الربح</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">ملاحظات</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">تاريخ التنفيذ</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">تاريخ الإنشاء</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">تاريخ الإنجاز</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">تغيير الحالة</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">تعديل / حذف</th>
              </tr>
            </thead>
            <tbody id="orders-table-body" class="bg-slate-900 divide-y divide-slate-700"></tbody>
          </table>
        </div>
        <div id="orders-mobile-body" class="md:hidden p-4 space-y-4"></div>
      </div>

      <div class="bg-slate-900 rounded-3xl border border-slate-700 p-6">
        <h3 class="text-xl font-semibold text-slate-50 mb-6">الإجماليات حسب الحالة</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <p class="text-sm font-medium text-yellow-800">معلقة</p>
            </div>
            <p class="text-2xl font-bold text-yellow-900">EGP <span id="total-pending">0</span></p>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <p class="text-sm font-medium text-blue-800">قيد التنفيذ</p>
            </div>
            <p class="text-2xl font-bold text-blue-900">EGP <span id="total-in_progress">0</span></p>
          </div>
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
              <p class="text-sm font-medium text-orange-800">تمت ولم يُدفع</p>
            </div>
            <p class="text-2xl font-bold text-orange-900">EGP <span id="total-done_unpaid">0</span></p>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <p class="text-sm font-medium text-green-800">تمت ودُفع</p>
            </div>
            <p class="text-2xl font-bold text-green-900">EGP <span id="total-done_paid">0</span></p>
          </div>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <p class="text-sm font-medium text-red-800">ملغاة</p>
            </div>
            <p class="text-2xl font-bold text-red-900">EGP <span id="total-cancelled">0</span></p>
          </div>
          <div class="bg-green-100 border border-green-300 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-green-600 rounded-full"></div>
              <p class="text-sm font-medium text-green-900">الإجمالي العام</p>
            </div>
            <p class="text-2xl font-bold text-green-900">EGP <span id="total-all">0</span></p>
          </div>
        </div>
      </div>
    </div>
  `;const p=d.querySelector("#order-search"),t=d.querySelector("#order-status-filter"),u=d.querySelector("#order-client-filter"),f=d.querySelector("#orders-table-body"),v=d.querySelector("#orders-mobile-body"),m=d.querySelector("#add-order-button"),h=d.querySelector("#total-pending"),C=d.querySelector("#total-in_progress"),$=d.querySelector("#total-done_unpaid"),e=d.querySelector("#total-done_paid"),b=d.querySelector("#total-cancelled"),q=d.querySelector("#total-all");function L(){const n={search:p.value.trim(),status:t.value,client:u.value},o=M(a,r,n),{tableRows:y,mobileCards:g}=O(o,r,s,l);f.innerHTML=y,v.innerHTML=g;const c={pending:0,in_progress:0,done_unpaid:0,done_paid:0,cancelled:0,all:0};o.forEach(E=>{const P=Number(E.price||0);c[E.status]=(c[E.status]||0)+P,c.all+=P}),h.textContent=c.pending.toLocaleString("ar-EG"),C.textContent=c.in_progress.toLocaleString("ar-EG"),$.textContent=c.done_unpaid.toLocaleString("ar-EG"),e.textContent=c.done_paid.toLocaleString("ar-EG"),b.textContent=c.cancelled.toLocaleString("ar-EG"),q.textContent=c.all.toLocaleString("ar-EG")}m==null||m.addEventListener("click",()=>{B(r,s,S)}),d.dataset.ordersEventsBound=d.dataset.ordersEventsBound||"",d.dataset.ordersEventsBound||(document.addEventListener("click",async n=>{const o=n.target.closest('button[data-action="delete-order"]');if(o){const g=o.dataset.orderId;g&&await T(g,S);return}const y=n.target.closest('button[data-action="edit-order"]');if(y){const g=y.dataset.orderId;if(!g)return;const c=a.find(E=>E.order_id===g);if(!c)return;await I(r,s,S,c);return}}),document.addEventListener("change",async n=>{const o=n.target.closest("select[data-order-id]");if(!o)return;const y=o.dataset.orderId,g=o.value;if(y)try{await _.updateOrder(y,{status:g}),k("success","تم تحديث حالة الطلب بنجاح"),S()}catch{k("error","خطأ في تحديث الطلب"),o.value=o.dataset.currentStatus}}),d.dataset.ordersEventsBound="true"),p==null||p.addEventListener("input",L),t==null||t.addEventListener("change",L),u==null||u.addEventListener("change",L),L()}window.location.pathname.includes("orders.html")&&document.addEventListener("DOMContentLoaded",S);export{S as r};
