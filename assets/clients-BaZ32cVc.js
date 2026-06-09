import{a as y,g as $,r as C}from"./sidebar-DBMzq2PB.js";import{a as E,s as w}from"./toast-DJo7gZdP.js";const c=document.getElementById("page-content"),x=document.getElementById("modal-root");async function M(a){await $(a)}function j(a,f,v){if(!a.length)return{rows:`
        <tr class="table-row">
          <td colspan="8" class="px-6 py-12 text-center text-slate-400">لا يوجد عملاء مطابقين.</td>
        </tr>
      `,cards:`
        <div class="md:hidden p-8 text-center text-slate-400">لا يوجد عملاء مطابقين.</div>
      `};const r=a.map(t=>{const u=f.filter(s=>s.client_id===t.client_id),i=v.filter(s=>s.client_id===t.client_id);return`
        <tr class="hover:bg-slate-700/40">
          <td class="px-6 py-4 text-slate-200">${t.client_id}</td>
          <td class="px-6 py-4 text-slate-200">${t.name}</td>
          <td class="px-6 py-4 text-slate-200">${t.phone}</td>
          <td class="px-6 py-4 text-slate-200">${t.type}</td>
          <td class="px-6 py-4 text-slate-200">${i.length}</td>
          <td class="px-6 py-4 text-slate-200">${u.length}</td>
          <td class="px-6 py-4 text-slate-200">${t.created_at}</td>
          <td class="px-6 py-4">
            <div class="flex gap-2">
              <button class="btn btn-ghost px-3 py-2" data-action="edit" data-id="${t.client_id}">تعديل</button>
              <button class="btn btn-secondary px-3 py-2" data-action="delete" data-id="${t.client_id}">حذف</button>
            </div>
          </td>
        </tr>
      `}).join(""),p=a.map(t=>{const u=f.filter(s=>s.client_id===t.client_id),i=v.filter(s=>s.client_id===t.client_id);return`
        <div class="md:hidden bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4 gap-4">
            <div>
              <p class="text-xs text-slate-400">رقم العميل</p>
              <p class="font-semibold text-slate-50">${t.client_id}</p>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-ghost" data-action="edit" data-id="${t.client_id}">تعديل</button>
              <button class="btn btn-secondary" data-action="delete" data-id="${t.client_id}">حذف</button>
            </div>
          </div>
          <div class="space-y-3 text-sm text-slate-300">
            <div class="flex justify-between">
              <span>الاسم</span>
              <span class="text-slate-100">${t.name}</span>
            </div>
            <div class="flex justify-between">
              <span>الهاتف</span>
              <span class="text-slate-100">${t.phone}</span>
            </div>
            <div class="flex justify-between">
              <span>النوع</span>
              <span class="text-slate-100">${t.type}</span>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-3 text-xs text-slate-400">
              <div class="rounded-2xl bg-slate-900/70 p-3">
                <p>الشاليهات</p>
                <p class="font-semibold text-slate-100">${i.length}</p>
              </div>
              <div class="rounded-2xl bg-slate-900/70 p-3">
                <p>الطلبات</p>
                <p class="font-semibold text-slate-100">${u.length}</p>
              </div>
            </div>
          </div>
        </div>
      `}).join("");return{rows:r,cards:p}}async function m(){var g;if(!E.isAuthenticated()){window.location.href="login.html";return}if(!c)return;const[a,f,v]=await Promise.all([y.getClients(),y.getOrders(),y.getChalets()]);c.innerHTML=`
    <div class="p-6 max-w-[1200px] mx-auto px-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-50">العملاء</h1>
          <p class="text-slate-400 mt-2">إدارة العملاء وأنواعهم بكل وضوح.</p>
        </div>
        <button class="btn btn-primary px-6 py-3" id="open-client-modal">إضافة عميل جديد</button>
      </div>

      <div class="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm mb-6">
        <div class="grid gap-4 lg:grid-cols-2">
          <div>
            <label class="form-label" for="client-search">بحث</label>
            <input id="client-search" type="search" class="form-input" placeholder="ابحث باسم العميل أو رقم الهاتف" />
          </div>
          <div>
            <label class="form-label" for="client-type-filter">النوع</label>
            <select id="client-type-filter" class="form-select">
              <option value="">كل الأنواع</option>
              <option value="owner">owner</option>
              <option value="broker">broker</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="responsive-table hidden min-w-full table-auto text-sm text-left">
            <thead class="bg-slate-900 border-b border-slate-700">
              <tr>
                <th class="px-6 py-3 text-slate-400">رقم العميل</th>
                <th class="px-6 py-3 text-slate-400">الاسم</th>
                <th class="px-6 py-3 text-slate-400">الهاتف</th>
                <th class="px-6 py-3 text-slate-400">النوع</th>
                <th class="px-6 py-3 text-slate-400">الشاليهات</th>
                <th class="px-6 py-3 text-slate-400">الطلبات</th>
                <th class="px-6 py-3 text-slate-400">تاريخ الإضافة</th>
                <th class="px-6 py-3 text-slate-400">إجراءات</th>
              </tr>
            </thead>
            <tbody id="clients-table-body" class="bg-slate-800"></tbody>
          </table>
          <div id="clients-mobile-body" class="responsive-mobile-cards p-4 space-y-4"></div>
        </div>
      </div>
    </div>
  `;const r=c.querySelector("#client-search"),p=c.querySelector("#client-type-filter"),t=c.querySelector("#clients-table-body"),u=c.querySelector("#clients-mobile-body");function i(){const o=r.value.trim().toLowerCase(),l=p.value,n=a.filter(e=>{const h=`${e.name} ${e.phone} ${e.type}`.toLowerCase(),_=!o||h.includes(o),L=!l||e.type===l;return _&&L}),{rows:b,cards:d}=j(n,f,v);t.innerHTML=b,u.innerHTML=d}async function s(o,l){return x?new Promise(n=>{const b=`
        <div class="space-y-4">
          <p class="text-slate-200">هل تريد حذف العميل <span class="font-semibold text-white">#${o}</span> نهائيًا؟</p>
          <div class="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button class="btn btn-secondary w-full sm:w-auto" id="cancel-delete-client">إلغاء</button>
            <button class="btn btn-primary w-full sm:w-auto bg-red-500 text-white hover:bg-red-600" id="confirm-delete-client">حذف</button>
          </div>
        </div>
      `;C(x,"تأكيد حذف العميل",b);const d=x.querySelector("#cancel-delete-client"),e=x.querySelector("#confirm-delete-client");d==null||d.addEventListener("click",()=>{x.innerHTML="",n(!1)}),e==null||e.addEventListener("click",async()=>{try{await y.deleteClient(o),w("success","تم حذف العميل بنجاح"),x.innerHTML="",l(),n(!0)}catch(h){console.error("Error deleting client:",h),w("error","حدث خطأ أثناء حذف العميل"),n(!1)}})}):(console.error("Modal root not available for delete confirmation"),!1)}(g=document.getElementById("open-client-modal"))==null||g.addEventListener("click",()=>M(m)),c.addEventListener("click",async o=>{const l=o.target.closest("button[data-action]");if(!l)return;const n=l.dataset.action,b=l.dataset.id;if(n==="delete"){await s(b,m);return}if(n==="edit"){const d=a.find(e=>e.client_id===b);if(!d)return;await $(m,d);return}}),r==null||r.addEventListener("input",i),p==null||p.addEventListener("change",i),i()}window.location.pathname.includes("clients.html")&&document.addEventListener("DOMContentLoaded",m);export{m as r};
