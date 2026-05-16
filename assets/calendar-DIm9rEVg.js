import{a as u}from"./auth-CC3zXfFT.js";/* empty css               */import"./main-CZdBdtSK.js";import"./common-BqO74Arb.js";import{a as c}from"./sidebar-B32eMct9.js";function p(e){return`<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-slate-800 text-slate-200">${{pending:"معلقة",in_progress:"قيد التنفيذ",done_unpaid:"تمت ولم يُدفع",done_paid:"تمت ودُفع",cancelled:"ملغاة"}[e]||e}</span>`}const l=document.getElementById("page-content");function v(e){return"EGP "+Number(e||0).toLocaleString("ar-EG")}function f(e){if(!e)return"غير محدد";try{return new Date(e).toISOString().split("T")[0]}catch{return e}}function x(e,i,d,o){const r=i.map(n=>{const t=d.find(s=>s.client_id===n.client_id)||{},a=o.find(s=>s.chalet_id===n.chalet_id)||{};return`
      <div class="bg-slate-900 rounded-xl p-4 border border-slate-700 mb-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-slate-300">#${n.order_id} • ${t.name||"غير محدد"}</div>
            <div class="text-sm text-slate-400">${a.chalet_name||"غير محدد"}</div>
          </div>
          <div class="text-sm">${v(n.price)}</div>
        </div>
        <div class="mt-2 flex items-center justify-between">
          <div>${p(n.status)}</div>
          <div class="text-sm text-slate-400">${n.scheduled_at||n.created_at||"غير محدد"}</div>
        </div>
      </div>
    `}).join("");return`
    <section class="mb-6">
      <h3 class="text-lg font-semibold text-slate-50 mb-3">${e}</h3>
      ${r}
    </section>
  `}async function h(){if(!u.isAuthenticated()){window.location.href="login.html";return}if(l)try{const[e,i,d]=await Promise.all([c.getOrders(),c.getClients(),c.getChalets()]),r=e.slice().sort((t,a)=>{const s=new Date(t.scheduled_at||t.created_at||"1970-01-01").getTime(),m=new Date(a.scheduled_at||a.created_at||"1970-01-01").getTime();return s-m}).reduce((t,a)=>{const s=f(a.scheduled_at||a.created_at)||"غير محدد";return t[s]=t[s]||[],t[s].push(a),t},{}),n=Object.keys(r).sort();l.innerHTML=`
      <div class="p-6 max-w-[900px] mx-auto px-4 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-50">التقويم</h1>
            <p class="text-slate-400 mt-2">عرض الطلبات مجمعة حسب تاريخ التنفيذ.</p>
          </div>
        </div>
        <div>
          ${n.map(t=>x(t,r[t],i,d)).join("")}
        </div>
      </div>
    `}catch(e){console.error("Error rendering calendar:",e),l.innerHTML='<div class="p-4">خطأ في تحميل التقويم</div>'}}window.location.pathname.includes("calendar.html")&&document.addEventListener("DOMContentLoaded",h);
