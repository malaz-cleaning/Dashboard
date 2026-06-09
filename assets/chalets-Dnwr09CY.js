import{a as m,f as $,r as E}from"./sidebar-DBMzq2PB.js";import{a as M,s as g}from"./toast-DJo7gZdP.js";const r=document.getElementById("page-content"),h=document.getElementById("modal-root");async function T(n,s){await $(n,s)}function q(n,s,f){if(!n.length)return{rows:`
        <tr class="table-row">
          <td colspan="9" class="px-6 py-12 text-center text-slate-400">لا يوجد شاليهات مطابقة.</td>
        </tr>
      `,cards:`
        <div class="md:hidden p-8 text-center text-slate-400">لا يوجد شاليهات مطابقة.</div>
      `};const p=n.map(t=>{const u=s.find(l=>l.client_id===t.client_id)||{},o=f.filter(l=>l.chalet_id===t.chalet_id);return`
        <tr class="hover:bg-slate-700/40">
          <td class="px-6 py-4 text-slate-200">${t.chalet_id}</td>
          <td class="px-6 py-4 text-slate-200">${t.chalet_code}</td>
          <td class="px-6 py-4 text-slate-200">${t.chalet_name}</td>
          <td class="px-6 py-4 text-slate-200">${u.name||"غير محدد"}</td>
          <td class="px-6 py-4 text-slate-200">${t.location||"-"}</td>
          <td class="px-6 py-4 text-slate-200 max-w-[220px] truncate">${t.details||"-"}</td>
          <td class="px-6 py-4 text-slate-200">${o.length}</td>
          <td class="px-6 py-4 text-slate-200">${t.created_at}</td>
          <td class="px-6 py-4">
            <div class="flex gap-2">
              <button class="btn btn-ghost px-3 py-2" data-action="edit" data-id="${t.chalet_id}">تعديل</button>
              <button class="btn btn-secondary px-3 py-2" data-action="delete" data-id="${t.chalet_id}">حذف</button>
            </div>
          </td>
        </tr>
      `}).join(""),x=n.map(t=>{const u=s.find(l=>l.client_id===t.client_id)||{},o=f.filter(l=>l.chalet_id===t.chalet_id);return`
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
              <span class="text-slate-100">${u.name||"غير محدد"}</span>
            </div>
            <div class="flex justify-between">
              <span>الموقع</span>
              <span class="text-slate-100">${t.location||"-"}</span>
            </div>
            <div class="flex justify-between">
              <span>الطلبات</span>
              <span class="text-slate-100">${o.length}</span>
            </div>
            <div class="pt-3 text-xs text-slate-400 border-t border-slate-700">
              ${t.details||"-"}
            </div>
          </div>
        </div>
      `}).join("");return{rows:p,cards:x}}async function v(){var w;if(!M.isAuthenticated()){window.location.href="login.html";return}if(!r)return;const[n,s,f]=await Promise.all([m.getChalets(),m.getClients(),m.getOrders()]);r.innerHTML=`
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
              ${s.map(a=>`<option value="${a.client_id}">${a.name}</option>`).join("")}
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
  `;const p=r.querySelector("#chalet-search"),x=r.querySelector("#chalet-client-filter"),t=r.querySelector("#chalets-table-body"),u=r.querySelector("#chalets-mobile-body");function o(){const a=p.value.trim().toLowerCase(),d=x.value,i=n.filter(e=>{const y=s.find(j=>j.client_id===e.client_id)||{},_=`${e.chalet_name} ${y.name} ${e.location} ${e.details}`.toLowerCase(),L=!a||_.includes(a),C=!d||e.client_id===d;return L&&C}),{rows:b,cards:c}=q(i,s,f);t.innerHTML=b,u.innerHTML=c}async function l(a,d){return h?new Promise(i=>{const b=`
        <div class="space-y-4">
          <p class="text-slate-200">هل تريد حذف الشاليه <span class="font-semibold text-white">#${a}</span> نهائيًا؟</p>
          <div class="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button class="btn btn-secondary w-full sm:w-auto" id="cancel-delete-chalet">إلغاء</button>
            <button class="btn btn-primary w-full sm:w-auto bg-red-500 text-white hover:bg-red-600" id="confirm-delete-chalet">حذف</button>
          </div>
        </div>
      `;E(h,"تأكيد حذف الشاليه",b);const c=h.querySelector("#cancel-delete-chalet"),e=h.querySelector("#confirm-delete-chalet");c==null||c.addEventListener("click",()=>{h.innerHTML="",i(!1)}),e==null||e.addEventListener("click",async()=>{try{await m.deleteChalet(a),g("success","تم حذف الشاليه بنجاح"),h.innerHTML="",d(),i(!0)}catch(y){console.error("Error deleting chalet:",y),g("error","حدث خطأ أثناء حذف الشاليه"),i(!1)}})}):(console.error("Modal root not available for delete confirmation"),!1)}(w=document.getElementById("open-chalet-modal"))==null||w.addEventListener("click",()=>T(s,v)),r.addEventListener("click",async a=>{const d=a.target.closest("button[data-action]");if(!d)return;const i=d.dataset.action,b=d.dataset.id;if(i==="delete"){await l(b,v);return}if(i==="edit"){const c=n.find(e=>e.chalet_id===b);if(!c)return;await $(s,v,c);return}}),p==null||p.addEventListener("input",o),x==null||x.addEventListener("change",o),o()}window.location.pathname.includes("chalets.html")&&document.addEventListener("DOMContentLoaded",v);export{v as r};
