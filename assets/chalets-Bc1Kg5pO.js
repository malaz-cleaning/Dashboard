import{a as v}from"./sidebar-84I8JWhY.js";import{s as C}from"./toast-ZwFb22xq.js";import{a as L}from"./auth-CC3zXfFT.js";import{a as f}from"./reusableModals-f8FhhYVB.js";const i=document.getElementById("page-content");async function j(a,e){await f(a,e)}function E(a,e,x){if(!a.length)return{rows:`
        <tr class="table-row">
          <td colspan="9" class="px-6 py-12 text-center text-slate-400">لا يوجد شاليهات مطابقة.</td>
        </tr>
      `,cards:`
        <div class="md:hidden p-8 text-center text-slate-400">لا يوجد شاليهات مطابقة.</div>
      `};const c=a.map(t=>{const p=e.find(s=>s.client_id===t.client_id)||{},l=x.filter(s=>s.chalet_id===t.chalet_id);return`
        <tr class="hover:bg-slate-700/40">
          <td class="px-6 py-4 text-slate-200">${t.chalet_id}</td>
          <td class="px-6 py-4 text-slate-200">${t.chalet_code}</td>
          <td class="px-6 py-4 text-slate-200">${t.chalet_name}</td>
          <td class="px-6 py-4 text-slate-200">${p.name||"غير محدد"}</td>
          <td class="px-6 py-4 text-slate-200">${t.location||"-"}</td>
          <td class="px-6 py-4 text-slate-200 max-w-[220px] truncate">${t.details||"-"}</td>
          <td class="px-6 py-4 text-slate-200">${l.length}</td>
          <td class="px-6 py-4 text-slate-200">${t.created_at}</td>
          <td class="px-6 py-4">
            <div class="flex gap-2">
              <button class="btn btn-ghost px-3 py-2" data-action="edit" data-id="${t.chalet_id}">تعديل</button>
              <button class="btn btn-secondary px-3 py-2" data-action="delete" data-id="${t.chalet_id}">حذف</button>
            </div>
          </td>
        </tr>
      `}).join(""),o=a.map(t=>{const p=e.find(s=>s.client_id===t.client_id)||{},l=x.filter(s=>s.chalet_id===t.chalet_id);return`
        <div class="md:hidden bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-sm">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <p class="text-xs text-slate-400">رقم الشاليه</p>
              <p class="text-lg font-semibold text-slate-50">${t.chalet_id}</p>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-ghost" data-action="edit" data-id="${t.chalet_id}">تعديل</button>
              <button class="btn btn-secondary" data-action="delete" data-id="${t.chalet_id}">حذف</button>
            </div>
          </div>
          <div class="space-y-3 text-sm text-slate-300">
            <div class="flex justify-between">
              <span>الاسم</span>
              <span class="text-slate-100">${t.chalet_name}</span>
            </div>
            <div class="flex justify-between">
              <span>الكود</span>
              <span class="text-slate-100">${t.chalet_code}</span>
            </div>
            <div class="flex justify-between">
              <span>العميل</span>
              <span class="text-slate-100">${p.name||"غير محدد"}</span>
            </div>
            <div class="flex justify-between">
              <span>الموقع</span>
              <span class="text-slate-100">${t.location||"-"}</span>
            </div>
            <div class="flex justify-between">
              <span>الطلبات</span>
              <span class="text-slate-100">${l.length}</span>
            </div>
            <div class="pt-3 text-xs text-slate-400 border-t border-slate-700">
              ${t.details||"-"}
            </div>
          </div>
        </div>
      `}).join("");return{rows:c,cards:o}}async function m(){var s;if(!L.isAuthenticated()){window.location.href="login.html";return}if(!i)return;const[a,e,x]=await Promise.all([v.getChalets(),v.getClients(),v.getOrders()]);i.innerHTML=`
    <div class="p-6 max-w-[1200px] mx-auto px-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-50">الشاليهات</h1>
          <p class="text-slate-400 mt-2">إدارة الشاليهات وربطها بالعملاء بسهولة.</p>
        </div>
        <button class="btn btn-primary px-6 py-3" id="open-chalet-modal">إضافة شاليه جديد</button>
      </div>

      <div class="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm mb-6">
        <div class="grid gap-4 lg:grid-cols-2">
          <div>
            <label class="form-label" for="chalet-search">بحث</label>
            <input id="chalet-search" type="search" class="form-input" placeholder="ابحث باسم الشاليه أو العميل" />
          </div>
          <div>
            <label class="form-label" for="chalet-client-filter">عميل</label>
            <select id="chalet-client-filter" class="form-select">
              <option value="">كل العملاء</option>
              ${e.map(d=>`<option value="${d.client_id}">${d.name}</option>`).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="responsive-table hidden min-w-full table-auto text-sm text-left">
            <thead class="bg-slate-900 border-b border-slate-700">
              <tr>
                <th class="px-6 py-3 text-slate-400">رقم الشاليه</th>
                <th class="px-6 py-3 text-slate-400">الكود</th>
                <th class="px-6 py-3 text-slate-400">الاسم</th>
                <th class="px-6 py-3 text-slate-400">العميل</th>
                <th class="px-6 py-3 text-slate-400">الموقع</th>
                <th class="px-6 py-3 text-slate-400">التفاصيل</th>
                <th class="px-6 py-3 text-slate-400">الطلبات</th>
                <th class="px-6 py-3 text-slate-400">تاريخ الإضافة</th>
                <th class="px-6 py-3 text-slate-400">إجراءات</th>
              </tr>
            </thead>
            <tbody id="chalets-table-body" class="bg-slate-800"></tbody>
          </table>
          <div id="chalets-mobile-body" class="responsive-mobile-cards p-4 space-y-4"></div>
        </div>
      </div>
    </div>
  `;const c=i.querySelector("#chalet-search"),o=i.querySelector("#chalet-client-filter"),t=i.querySelector("#chalets-table-body"),p=i.querySelector("#chalets-mobile-body");function l(){const d=c.value.trim().toLowerCase(),r=o.value,b=a.filter(n=>{const y=e.find(_=>_.client_id===n.client_id)||{},g=`${n.chalet_name} ${y.name} ${n.location} ${n.details}`.toLowerCase(),w=!d||g.includes(d),$=!r||n.client_id===r;return w&&$}),{rows:h,cards:u}=E(b,e,x);t.innerHTML=h,p.innerHTML=u}(s=document.getElementById("open-chalet-modal"))==null||s.addEventListener("click",()=>j(e,m)),i.addEventListener("click",async d=>{const r=d.target.closest("button[data-action]");if(!r)return;const b=r.dataset.action,h=r.dataset.id;if(b==="delete"){await v.deleteChalet(h),C("success","تم حذف الشاليه بنجاح"),m();return}if(b==="edit"){const u=a.find(n=>n.chalet_id===h);if(!u)return;await f(e,m,u);return}}),c==null||c.addEventListener("input",l),o==null||o.addEventListener("change",l),l()}window.location.pathname.includes("chalets.html")&&document.addEventListener("DOMContentLoaded",m);export{m as r};
