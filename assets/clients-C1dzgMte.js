import{a as v}from"./sidebar-B32eMct9.js";import{s as $}from"./toast-ZwFb22xq.js";import{a as _}from"./auth-CC3zXfFT.js";import{b as y}from"./reusableModals-ZKNp4-6F.js";const n=document.getElementById("page-content");async function L(a){await y(a)}function C(a,p,x){if(!a.length)return`
      <tr class="table-row">
        <td colspan="8" class="px-6 py-12 text-center text-slate-400">لا يوجد عملاء مطابقين.</td>
      </tr>
      <div class="md:hidden p-8 text-center text-slate-400">لا يوجد عملاء مطابقين.</div>
    `;const d=a.map(t=>{const r=p.filter(e=>e.client_id===t.client_id),l=x.filter(e=>e.client_id===t.client_id);return`
        <tr class="hover:bg-slate-700/40">
          <td class="px-6 py-4 text-slate-200">${t.client_id}</td>
          <td class="px-6 py-4 text-slate-200">${t.name}</td>
          <td class="px-6 py-4 text-slate-200">${t.phone}</td>
          <td class="px-6 py-4 text-slate-200">${t.type}</td>
          <td class="px-6 py-4 text-slate-200">${l.length}</td>
          <td class="px-6 py-4 text-slate-200">${r.length}</td>
          <td class="px-6 py-4 text-slate-200">${t.created_at}</td>
          <td class="px-6 py-4">
            <div class="flex gap-2">
              <button class="btn btn-ghost px-3 py-2" data-action="edit" data-id="${t.client_id}">تعديل</button>
              <button class="btn btn-secondary px-3 py-2" data-action="delete" data-id="${t.client_id}">حذف</button>
            </div>
          </td>
        </tr>
      `}).join(""),i=a.map(t=>{const r=p.filter(e=>e.client_id===t.client_id),l=x.filter(e=>e.client_id===t.client_id);return`
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
                <p class="font-semibold text-slate-100">${l.length}</p>
              </div>
              <div class="rounded-2xl bg-slate-900/70 p-3">
                <p>الطلبات</p>
                <p class="font-semibold text-slate-100">${r.length}</p>
              </div>
            </div>
          </div>
        </div>
      `}).join("");return d+i}async function h(){var e;if(!_.isAuthenticated()){window.location.href="login.html";return}if(!n)return;const[a,p,x]=await Promise.all([v.getClients(),v.getOrders(),v.getChalets()]);n.innerHTML=`
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
          <table class="hidden md:table min-w-full table-auto text-sm text-left">
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
          <div id="clients-mobile-body" class="md:hidden p-4 space-y-4"></div>
        </div>
      </div>
    </div>
  `;const d=n.querySelector("#client-search"),i=n.querySelector("#client-type-filter"),t=n.querySelector("#clients-table-body"),r=n.querySelector("#clients-mobile-body");function l(){const b=d.value.trim().toLowerCase(),o=i.value,u=a.filter(s=>{const f=`${s.name} ${s.phone} ${s.type}`.toLowerCase(),g=!b||f.includes(b),w=!o||s.type===o;return g&&w}),m=C(u,p,x),c=document.createElement("div");c.innerHTML=m,t.innerHTML=Array.from(c.querySelectorAll("tr")).map(s=>s.outerHTML).join(""),r.innerHTML=Array.from(c.querySelectorAll('div[class*="md:hidden"]')).map(s=>s.outerHTML).join("")}(e=document.getElementById("open-client-modal"))==null||e.addEventListener("click",()=>L(h)),n.addEventListener("click",async b=>{const o=b.target.closest("button[data-action]");if(!o)return;const u=o.dataset.action,m=o.dataset.id;if(u==="delete"){await v.deleteClient(m),$("success","تم حذف العميل بنجاح"),h();return}if(u==="edit"){const c=a.find(s=>s.client_id===m);if(!c)return;await y(h,c);return}}),d==null||d.addEventListener("input",l),i==null||i.addEventListener("change",l),l()}window.location.pathname.includes("clients.html")&&document.addEventListener("DOMContentLoaded",h);export{h as r};
