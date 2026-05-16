import{a as u}from"./sidebar-B32eMct9.js";import{s as L}from"./toast-ZwFb22xq.js";import{a as j}from"./auth-CC3zXfFT.js";import{a as f}from"./reusableModals-UISrxHlU.js";const i=document.getElementById("page-content");async function C(l,s){await f(l,s)}function M(l,s,b){if(!l.length)return`
      <tr class="table-row">
        <td colspan="9" class="px-6 py-12 text-center text-slate-400">لا يوجد شاليهات مطابقة.</td>
      </tr>
      <div class="md:hidden p-8 text-center text-slate-400">لا يوجد شاليهات مطابقة.</div>
    `;const c=l.map(t=>{const x=s.find(a=>a.client_id===t.client_id)||{},d=b.filter(a=>a.chalet_id===t.chalet_id);return`
        <tr class="hover:bg-slate-700/40">
          <td class="px-6 py-4 text-slate-200">${t.chalet_id}</td>
          <td class="px-6 py-4 text-slate-200">${t.chalet_code}</td>
          <td class="px-6 py-4 text-slate-200">${t.chalet_name}</td>
          <td class="px-6 py-4 text-slate-200">${x.name||"غير محدد"}</td>
          <td class="px-6 py-4 text-slate-200">${t.location||"-"}</td>
          <td class="px-6 py-4 text-slate-200 max-w-[220px] truncate">${t.details||"-"}</td>
          <td class="px-6 py-4 text-slate-200">${d.length}</td>
          <td class="px-6 py-4 text-slate-200">${t.created_at}</td>
          <td class="px-6 py-4">
            <div class="flex gap-2">
              <button class="btn btn-ghost px-3 py-2" data-action="edit" data-id="${t.chalet_id}">تعديل</button>
              <button class="btn btn-secondary px-3 py-2" data-action="delete" data-id="${t.chalet_id}">حذف</button>
            </div>
          </td>
        </tr>
      `}).join(""),o=l.map(t=>{const x=s.find(a=>a.client_id===t.client_id)||{},d=b.filter(a=>a.chalet_id===t.chalet_id);return`
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
              <span class="text-slate-100">${x.name||"غير محدد"}</span>
            </div>
            <div class="flex justify-between">
              <span>الموقع</span>
              <span class="text-slate-100">${t.location||"-"}</span>
            </div>
            <div class="flex justify-between">
              <span>الطلبات</span>
              <span class="text-slate-100">${d.length}</span>
            </div>
            <div class="pt-3 text-xs text-slate-400 border-t border-slate-700">
              ${t.details||"-"}
            </div>
          </div>
        </div>
      `}).join("");return c+o}async function v(){var a;if(!j.isAuthenticated()){window.location.href="login.html";return}if(!i)return;const[l,s,b]=await Promise.all([u.getChalets(),u.getClients(),u.getOrders()]);i.innerHTML=`
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
              ${s.map(n=>`<option value="${n.client_id}">${n.name}</option>`).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="hidden md:table min-w-full table-auto text-sm text-left">
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
          <div id="chalets-mobile-body" class="md:hidden p-4 space-y-4"></div>
        </div>
      </div>
    </div>
  `;const c=i.querySelector("#chalet-search"),o=i.querySelector("#chalet-client-filter"),t=i.querySelector("#chalets-table-body"),x=i.querySelector("#chalets-mobile-body");function d(){const n=c.value.trim().toLowerCase(),r=o.value,h=l.filter(e=>{const y=s.find(_=>_.client_id===e.client_id)||{},g=`${e.chalet_name} ${y.name} ${e.location} ${e.details}`.toLowerCase(),w=!n||g.includes(n),$=!r||e.client_id===r;return w&&$}),m=M(h,s,b),p=document.createElement("div");p.innerHTML=m,t.innerHTML=Array.from(p.querySelectorAll("tr")).map(e=>e.outerHTML).join(""),x.innerHTML=Array.from(p.querySelectorAll('div[class*="md:hidden"]')).map(e=>e.outerHTML).join("")}(a=document.getElementById("open-chalet-modal"))==null||a.addEventListener("click",()=>C(s,v)),i.addEventListener("click",async n=>{const r=n.target.closest("button[data-action]");if(!r)return;const h=r.dataset.action,m=r.dataset.id;if(h==="delete"){await u.deleteChalet(m),L("success","تم حذف الشاليه بنجاح"),v();return}if(h==="edit"){const p=l.find(e=>e.chalet_id===m);if(!p)return;await f(s,v,p);return}}),c==null||c.addEventListener("input",d),o==null||o.addEventListener("change",d),d()}window.location.pathname.includes("chalets.html")&&document.addEventListener("DOMContentLoaded",v);export{v as r};
