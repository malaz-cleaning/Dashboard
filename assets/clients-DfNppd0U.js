import{a as h}from"./sidebar-84I8JWhY.js";import{s as $}from"./toast-ZwFb22xq.js";import{a as _}from"./auth-CC3zXfFT.js";import{b as m}from"./reusableModals-f8FhhYVB.js";const l=document.getElementById("page-content");async function C(s){await m(s)}function L(s,r,p){if(!s.length)return{rows:`
        <tr class="table-row">
          <td colspan="8" class="px-6 py-12 text-center text-slate-400">لا يوجد عملاء مطابقين.</td>
        </tr>
      `,cards:`
        <div class="md:hidden p-8 text-center text-slate-400">لا يوجد عملاء مطابقين.</div>
      `};const n=s.map(t=>{const c=r.filter(e=>e.client_id===t.client_id),a=p.filter(e=>e.client_id===t.client_id);return`
        <tr class="hover:bg-slate-700/40">
          <td class="px-6 py-4 text-slate-200">${t.client_id}</td>
          <td class="px-6 py-4 text-slate-200">${t.name}</td>
          <td class="px-6 py-4 text-slate-200">${t.phone}</td>
          <td class="px-6 py-4 text-slate-200">${t.type}</td>
          <td class="px-6 py-4 text-slate-200">${a.length}</td>
          <td class="px-6 py-4 text-slate-200">${c.length}</td>
          <td class="px-6 py-4 text-slate-200">${t.created_at}</td>
          <td class="px-6 py-4">
            <div class="flex gap-2">
              <button class="btn btn-ghost px-3 py-2" data-action="edit" data-id="${t.client_id}">تعديل</button>
              <button class="btn btn-secondary px-3 py-2" data-action="delete" data-id="${t.client_id}">حذف</button>
            </div>
          </td>
        </tr>
      `}).join(""),d=s.map(t=>{const c=r.filter(e=>e.client_id===t.client_id),a=p.filter(e=>e.client_id===t.client_id);return`
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
                <p class="font-semibold text-slate-100">${a.length}</p>
              </div>
              <div class="rounded-2xl bg-slate-900/70 p-3">
                <p>الطلبات</p>
                <p class="font-semibold text-slate-100">${c.length}</p>
              </div>
            </div>
          </div>
        </div>
      `}).join("");return{rows:n,cards:d}}async function y(){var e;if(!_.isAuthenticated()){window.location.href="login.html";return}if(!l)return;const[s,r,p]=await Promise.all([h.getClients(),h.getOrders(),h.getChalets()]);l.innerHTML=`
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
  `;const n=l.querySelector("#client-search"),d=l.querySelector("#client-type-filter"),t=l.querySelector("#clients-table-body"),c=l.querySelector("#clients-mobile-body");function a(){const x=n.value.trim().toLowerCase(),i=d.value,b=s.filter(o=>{const f=`${o.name} ${o.phone} ${o.type}`.toLowerCase(),g=!x||f.includes(x),w=!i||o.type===i;return g&&w}),{rows:u,cards:v}=L(b,r,p);t.innerHTML=u,c.innerHTML=v}(e=document.getElementById("open-client-modal"))==null||e.addEventListener("click",()=>C(y)),l.addEventListener("click",async x=>{const i=x.target.closest("button[data-action]");if(!i)return;const b=i.dataset.action,u=i.dataset.id;if(b==="delete"){await h.deleteClient(u),$("success","تم حذف العميل بنجاح"),y();return}if(b==="edit"){const v=s.find(o=>o.client_id===u);if(!v)return;await m(y,v);return}}),n==null||n.addEventListener("input",a),d==null||d.addEventListener("change",a),a()}window.location.pathname.includes("clients.html")&&document.addEventListener("DOMContentLoaded",y);export{y as r};
