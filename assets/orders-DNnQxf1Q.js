import{a as E}from"./sidebar-84I8JWhY.js";import{s as C}from"./toast-ZwFb22xq.js";import{a as M}from"./auth-CC3zXfFT.js";import{s as T,r as B}from"./reusableModals-f8FhhYVB.js";const d=document.getElementById("page-content"),$=document.getElementById("modal-root");$||console.error("Modal root not found");function G(a){const s={pending:{label:"معلقة",color:"bg-yellow-100 text-yellow-800 border-yellow-200"},in_progress:{label:"قيد التنفيذ",color:"bg-blue-100 text-blue-800 border-blue-200"},done_unpaid:{label:"تمت ولم يُدفع",color:"bg-orange-100 text-orange-800 border-orange-200"},done_paid:{label:"تمت ودُفع",color:"bg-green-100 text-green-800 border-green-200"},cancelled:{label:"ملغاة",color:"bg-red-100 text-red-800 border-red-200"}}[a]||{label:a,color:"bg-gray-100 text-gray-800 border-gray-200"};return`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.color}">${s.label}</span>`}function g(a){return`EGP ${Number(a||0).toLocaleString("ar-EG")}`}function D(a,l,s,o=[]){if(!a.length)return{tableRows:`
        <tr>
          <td colspan="14" class="px-6 py-12 text-center text-slate-500">لا يوجد طلبات مطابقة.</td>
        </tr>
      `,mobileCards:`
        <div class="bg-slate-800 rounded-3xl border border-slate-700 p-8 text-center text-slate-400">لا يوجد طلبات مطابقة.</div>
      `};const c=a.map(e=>{const v=l.find(t=>t.client_id===e.client_id)||{},h=s.find(t=>t.chalet_id===e.chalet_id)||{},x=e.completed_at||(["done_paid","done_unpaid","cancelled"].includes(e.status)?new Date().toISOString().split("T")[0]:"-"),y=o.filter(t=>!t.is_deleted&&t.order_id===e.order_id&&t.type==="expense").reduce((t,m)=>t+Number(m.amount||0),0),w=o.filter(t=>!t.is_deleted&&t.order_id===e.order_id&&t.type==="income").reduce((t,m)=>t+Number(m.amount||0),0),S=(w>0?w:Number(e.deposit||0))-y;return`
        <tr class="hover:bg-slate-700/60">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${e.order_id}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-100">${v.name||"غير محدد"}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-100">${h.chalet_name||"غير محدد"}</td>
          <td class="px-6 py-4 whitespace-nowrap">${G(e.status)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${g(e.price)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${g(e.deposit)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${g(y)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">${g(S)}</td>
          <td class="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">${e.notes||"-"}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${e.scheduled_at||"-"}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${e.created_at}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${x}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select class="block w-full px-3 py-2 border border-slate-600 bg-slate-900 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" data-order-id="${e.order_id}" data-current-status="${e.status}">
              <option value="pending" ${e.status==="pending"?"selected":""}>معلقة</option>
              <option value="in_progress" ${e.status==="in_progress"?"selected":""}>قيد التنفيذ</option>
              <option value="done_unpaid" ${e.status==="done_unpaid"?"selected":""}>تمت ولم يُدفع</option>
              <option value="done_paid" ${e.status==="done_paid"?"selected":""}>تمت ودُفع</option>
              <option value="cancelled" ${e.status==="cancelled"?"selected":""}>ملغاة</option>
            </select>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex gap-2">
              <button type="button" class="inline-flex items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 px-3 py-2 text-sm transition hover:bg-amber-500/20 hover:text-amber-100" data-action="edit-order" data-order-id="${e.order_id}">تعديل</button>
              <button type="button" class="inline-flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 px-3 py-2 text-sm transition hover:bg-red-500/20 hover:text-red-100" data-action="delete-order" data-order-id="${e.order_id}">حذف</button>
            </div>
          </td>
        </tr>
      `}).join(""),p=a.map(e=>{const v=l.find(t=>t.client_id===e.client_id)||{},h=s.find(t=>t.chalet_id===e.chalet_id)||{},x=e.completed_at||(["done_paid","done_unpaid","cancelled"].includes(e.status)?new Date().toISOString().split("T")[0]:"-"),y=o.filter(t=>!t.is_deleted&&t.order_id===e.order_id&&t.type==="expense").reduce((t,m)=>t+Number(m.amount||0),0),w=o.filter(t=>!t.is_deleted&&t.order_id===e.order_id&&t.type==="income").reduce((t,m)=>t+Number(m.amount||0),0),S=(w>0?w:Number(e.deposit||0))-y;return`
        <div class="md:hidden bg-slate-800 rounded-3xl border border-slate-700 p-4 mb-4">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="text-lg font-semibold text-slate-50">طلب #${e.order_id}</h3>
              <p class="text-sm text-slate-400">${v.name||"غير محدد"} - ${h.chalet_name||"غير محدد"}</p>
            </div>
            ${G(e.status)}
          </div>
            <div class="space-y-2 mb-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">السعر:</span>
              <span class="text-lg font-semibold text-slate-50">${g(e.price)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">الدفعة:</span>
              <span class="text-sm text-slate-50">${g(e.deposit)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">المصروفات:</span>
              <span class="text-sm text-slate-50">${g(y)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">صافي الربح:</span>
              <span class="text-sm text-slate-50">${g(S)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">تاريخ الإنشاء:</span>
              <span class="text-sm text-slate-50">${e.created_at}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">تاريخ التنفيذ:</span>
              <span class="text-sm text-slate-50">${e.scheduled_at||"-"}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">تاريخ الإنجاز:</span>
              <span class="text-sm text-slate-50">${x}</span>
            </div>
            ${e.notes?`<div class="pt-2 border-t border-slate-700"><p class="text-sm text-slate-400">${e.notes}</p></div>`:""}
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">تغيير الحالة</label>
            <select class="block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" data-order-id="${e.order_id}" data-current-status="${e.status}">
              <option value="pending" ${e.status==="pending"?"selected":""}>معلقة</option>
              <option value="in_progress" ${e.status==="in_progress"?"selected":""}>قيد التنفيذ</option>
              <option value="done_unpaid" ${e.status==="done_unpaid"?"selected":""}>تمت ولم يُدفع</option>
              <option value="done_paid" ${e.status==="done_paid"?"selected":""}>تمت ودُفع</option>
              <option value="cancelled" ${e.status==="cancelled"?"selected":""}>ملغاة</option>
            </select>
          </div>
          <div class="mt-4 flex gap-2">
            <button type="button" class="flex-1 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 px-4 py-3 text-sm font-medium transition hover:bg-amber-500/20 hover:text-amber-100" data-action="edit-order" data-order-id="${e.order_id}">تعديل</button>
            <button type="button" class="flex-1 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 px-4 py-3 text-sm font-medium transition hover:bg-red-500/20 hover:text-red-100" data-action="delete-order" data-order-id="${e.order_id}">حذف</button>
          </div>
        </div>
      `}).join("");return{tableRows:c,mobileCards:p}}async function R(a,l){return $?new Promise(s=>{const o=`
      <div class="space-y-4">
        <p class="text-slate-200">هل تريد حذف الطلب <span class="font-semibold text-white">#${a}</span> نهائيًا؟</p>
        <div class="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button class="btn btn-secondary w-full sm:w-auto" id="cancel-delete-button">إلغاء</button>
          <button class="btn btn-primary w-full sm:w-auto bg-red-500 text-white hover:bg-red-600" id="confirm-delete-button">حذف</button>
        </div>
      </div>
    `;B($,"تأكيد حذف الطلب",o);const c=$.querySelector("#cancel-delete-button"),p=$.querySelector("#confirm-delete-button");c==null||c.addEventListener("click",()=>{$.innerHTML="",s(!1)}),p==null||p.addEventListener("click",async()=>{try{await E.deleteOrder(a),C("success","تم حذف الطلب بنجاح"),$.innerHTML="",l(),s(!0)}catch(e){console.error("Error deleting order:",e),C("error","حدث خطأ أثناء حذف الطلب"),s(!1)}})}):(console.error("Modal root not available for delete confirmation"),!1)}function H(a,l,s){return a.filter(o=>{const c=l.find(x=>x.client_id===o.client_id)||{},p=`${o.order_id} ${o.notes||""} ${o.status} ${c.name}`.toLowerCase(),e=s.search?p.includes(s.search.toLowerCase()):!0,v=s.status?o.status===s.status:!0,h=s.client?o.client_id===s.client:!0;return e&&v&&h})}async function A(a,l,s){await T(a,l,s)}async function L(){if(!M.isAuthenticated()){window.location.href="login.html";return}if(!d)return;const[a,l,s]=await Promise.all([E.getOrders(),E.getClients(),E.getChalets()]),o=await E.getTransactions();a.length,l.length,s.length,a.reduce((i,n)=>i+Number(n.price||0),0),o.filter(i=>!i.is_deleted).reduce((i,n)=>i+(n.type==="income"?Number(n.amount||0):-Number(n.amount||0)),0),d.innerHTML=`
    <div class="p-6 max-w-[1200px] mx-auto px-4 space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-50">الطلبات</h1>
          <p class="text-slate-400 mt-2">عرض وإدارة جميع الطلبات من Dashboard.</p>
        </div>
        <button class="btn btn-primary px-6 py-3" id="add-order-button">إضافة طلب جديد</button>
      </div>

      <div class="bg-slate-900 rounded-3xl border border-slate-700 p-6">
        <h3 class="text-xl font-semibold text-slate-50 mb-6">إجماليات الطلبات والأرباح</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <!-- معلقة -->
          <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 hover:border-yellow-500/50 transition-all duration-300">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
              <p class="text-xs font-semibold text-yellow-400">معلقة</p>
            </div>
            <p class="text-xl font-bold text-slate-50">EGP <span id="total-pending">0</span></p>
          </div>
          <!-- تمت ولم يدفع -->
          <div class="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 hover:border-orange-500/50 transition-all duration-300">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
              <p class="text-xs font-semibold text-orange-400">تمت ولم يُدفع</p>
            </div>
            <p class="text-xl font-bold text-slate-50">EGP <span id="total-done_unpaid">0</span></p>
          </div>
          <!-- تمت ودفع -->
          <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 hover:border-emerald-500/50 transition-all duration-300">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
              <p class="text-xs font-semibold text-emerald-400">تمت ودُفع</p>
            </div>
            <p class="text-xl font-bold text-slate-50">EGP <span id="total-done_paid">0</span></p>
          </div>
          <!-- الإجمالي العام -->
          <div class="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 hover:border-blue-500/50 transition-all duration-300">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              <p class="text-xs font-semibold text-blue-400">الإجمالي العام</p>
            </div>
            <p class="text-xl font-bold text-slate-50">EGP <span id="total-all">0</span></p>
          </div>
          <!-- المصروفات -->
          <div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 hover:border-red-500/50 transition-all duration-300">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              <p class="text-xs font-semibold text-red-400">المصروفات</p>
            </div>
            <p class="text-xl font-bold text-slate-50">EGP <span id="total-expenses">0</span></p>
          </div>
          <!-- صافي الربح -->
          <div class="bg-gradient-to-br from-emerald-500/20 to-teal-500/5 border border-emerald-500/40 rounded-2xl p-4 hover:border-emerald-500/60 transition-all duration-300 shadow-md shadow-emerald-500/5">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
              <p class="text-xs font-semibold text-emerald-300">صافي الربح</p>
            </div>
            <p class="text-xl font-bold text-emerald-400">EGP <span id="total-net-profit">0</span></p>
          </div>
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
              ${l.map(i=>`<option value="${i.client_id}">${i.name}</option>`).join("")}
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
    </div>
  `;const c=d.querySelector("#order-search"),p=d.querySelector("#order-status-filter"),e=d.querySelector("#order-client-filter"),v=d.querySelector("#orders-table-body"),h=d.querySelector("#orders-mobile-body"),x=d.querySelector("#add-order-button"),y=d.querySelector("#total-pending"),w=d.querySelector("#total-done_unpaid"),I=d.querySelector("#total-done_paid"),S=d.querySelector("#total-all"),t=d.querySelector("#total-expenses"),m=d.querySelector("#total-net-profit");function k(){const i={search:c.value.trim(),status:p.value,client:e.value},n=H(a,l,i),{tableRows:_,mobileCards:b}=D(n,l,s,o);v.innerHTML=_,h.innerHTML=b;const r={pending:0,done_unpaid:0,done_paid:0,all:0,expenses:0,netProfit:0};n.forEach(f=>{const P=Number(f.price||0);f.status==="pending"?r.pending+=P:f.status==="done_unpaid"?r.done_unpaid+=P:f.status==="done_paid"&&(r.done_paid+=P),r.all+=P;const j=o.filter(u=>!u.is_deleted&&u.order_id===f.order_id&&u.type==="expense").reduce((u,N)=>u+Number(N.amount||0),0),q=o.filter(u=>!u.is_deleted&&u.order_id===f.order_id&&u.type==="income").reduce((u,N)=>u+Number(N.amount||0),0),O=(q>0?q:Number(f.deposit||0))-j;r.expenses+=j,r.netProfit+=O}),y.textContent=r.pending.toLocaleString("ar-EG"),w.textContent=r.done_unpaid.toLocaleString("ar-EG"),I.textContent=r.done_paid.toLocaleString("ar-EG"),S.textContent=r.all.toLocaleString("ar-EG"),t.textContent=r.expenses.toLocaleString("ar-EG"),m.textContent=r.netProfit.toLocaleString("ar-EG")}x==null||x.addEventListener("click",()=>{A(l,s,L)}),d.dataset.ordersEventsBound=d.dataset.ordersEventsBound||"",d.dataset.ordersEventsBound||(document.addEventListener("click",async i=>{const n=i.target.closest('button[data-action="delete-order"]');if(n){const b=n.dataset.orderId;b&&await R(b,L);return}const _=i.target.closest('button[data-action="edit-order"]');if(_){const b=_.dataset.orderId;if(!b)return;const r=a.find(f=>f.order_id===b);if(!r)return;await T(l,s,L,r);return}}),document.addEventListener("change",async i=>{const n=i.target.closest("select[data-order-id]");if(!n)return;const _=n.dataset.orderId,b=n.value;if(_)try{await E.updateOrder(_,{status:b}),C("success","تم تحديث حالة الطلب بنجاح"),L()}catch{C("error","خطأ في تحديث الطلب"),n.value=n.dataset.currentStatus}}),d.dataset.ordersEventsBound="true"),c==null||c.addEventListener("input",k),p==null||p.addEventListener("change",k),e==null||e.addEventListener("change",k),k()}window.location.pathname.includes("orders.html")&&document.addEventListener("DOMContentLoaded",L);export{L as r};
