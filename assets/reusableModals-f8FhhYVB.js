import{a as y}from"./sidebar-84I8JWhY.js";import{s as f}from"./toast-ZwFb22xq.js";import{a as A}from"./auth-CC3zXfFT.js";function _(e,r,l){if(!e)return;e.innerHTML=`
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden" style="max-width: min(90vw, 500px);">
        <div class="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 class="text-xl font-semibold text-white">${r}</h2>
          <button class="text-slate-400 hover:text-white text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded" aria-label="Close">×</button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">${l}</div>
      </div>
    </div>
  `;const t=e.querySelector(".fixed"),o=e.querySelector('button[aria-label="Close"]');function c(){e.innerHTML=""}t==null||t.addEventListener("click",s=>{s.target===t&&c()}),o==null||o.addEventListener("click",c)}function w(e,r,l="",t=""){return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <input id="${e}" type="text" class="form-input" placeholder="${l}" value="${t}" />
    </div>
  `}function G(e,r,l="",t=""){return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <input id="${e}" type="tel" class="form-input" placeholder="${l}" value="${t}" />
    </div>
  `}function C(e,r,l="",t=""){return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <input id="${e}" type="number" class="form-input" placeholder="${l}" value="${t}" />
    </div>
  `}function K(e,r,l=""){return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <input id="${e}" type="date" class="form-input" value="${l}" />
    </div>
  `}function P(e,r,l,t=""){const o=l.map(c=>{const s=c.value===t?"selected":"";return`<option value="${c.value}" ${s}>${c.label}</option>`}).join("");return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <select id="${e}" class="form-select">
        ${o}
      </select>
    </div>
  `}function S(e,r,l,t="",o="",c=""){const s=l.map(i=>{const n=i.value===t?"selected":"";return`<option value="${i.value}" ${n}>${i.label}</option>`}).join("");return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap items-end">
        <select id="${e}" class="form-select flex-1">
          ${s}
        </select>
        ${c?`<button type="button" class="btn btn-secondary px-4 py-2 whitespace-nowrap" id="${o}">${c}</button>`:""}
      </div>
    </div>
  `}function U(e,r,l="",t=3,o=""){return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <textarea id="${e}" rows="${t}" class="form-textarea" placeholder="${l}">${o}</textarea>
    </div>
  `}function R(e="grid-cols-1 md:grid-cols-2",r=""){return`<div class="grid ${e} gap-4">${r}</div>`}function V(e,r,l="primary"){return`<button type="button" class="${l==="secondary"?"btn btn-secondary":"btn btn-primary"}" id="${e}">${r}</button>`}function W(e=[]){return`<div class="flex flex-col sm:flex-row justify-end gap-3 pt-4">${e.map(l=>V(l.id,l.label,l.style)).join(" ")}</div>`}function q(e=[],r=[]){const l=e.join(""),t=W(r);return`<div class="space-y-4">${l}${t}</div>`}function E(e,r={}){const l={};for(const[t,o]of Object.entries(r)){const c=e.querySelector(`#${o}`);c&&(l[t]=c.value)}return l}function L(e,r={}){for(const l of Object.values(r)){const t=e.querySelector(`#${l}`);t&&(t.type==="number"?t.value="":t.tagName==="SELECT"?t.selectedIndex=0:t.value="")}}const Y=[{value:"owner",label:"owner"},{value:"broker",label:"broker"}];function J(e={}){return[w("client-name","الاسم","اسم العميل",e.name||""),G("client-phone","الهاتف","رقم الهاتف",e.phone||""),P("client-type","النوع",Y,e.type||"owner")]}function Q(e=[],r={}){const l=e.map(t=>({value:t.client_id,label:t.name}));return[w("chalet-name","الشاليه","اسم الشاليه",r.chalet_name||""),w("chalet-location","الموقع","الموقع الجغرافي",r.location||""),S("chalet-client","العميل",l,r.client_id||"","add-new-client-btn","+ عميل"),U("chalet-details","التفاصيل","تفاصيل الشاليه",4,r.details||"")]}function X(e=[],r=[],l={}){var i;const t=e.map(n=>({value:n.client_id,label:n.name})),o=l.client_id||((i=e[0])==null?void 0:i.client_id)||"",c=r.filter(n=>n.client_id===o).map(n=>({value:n.chalet_id,label:n.chalet_name})),s=[{value:"pending",label:"معلقة"},{value:"in_progress",label:"قيد التنفيذ"},{value:"done_unpaid",label:"تمت ولم يُدفع"},{value:"done_paid",label:"تمت ودُفع"},{value:"cancelled",label:"ملغاة"}];return[S("order-client","العميل",t,o,"add-client-btn","+ عميل"),S("order-chalet","الشاليه",c,l.chalet_id||"","add-chalet-btn","+ شاليه"),R("grid-cols-1 md:grid-cols-2",P("order-status","الحالة",s,l.status||"pending")+C("order-price","السعر","مثلاً 420",l.price||"")),R("grid-cols-1 md:grid-cols-2",K("order-scheduled","تاريخ التنفيذ",l.scheduled_at||"")+C("order-deposit","الديبوزيت","مثلاً 100",l.deposit||"")),U("order-notes","الملاحظات","تفاصيل إضافية",3,l.notes||"")]}function Z(e={}){const r=J(e);return q(r,[{id:"save-client-button",label:"حفظ العميل"}])}function B(e=[],r={}){const l=Q(e,r);return q(l,[{id:"save-chalet-button",label:"حفظ الشاليه"}])}function D(e=[],r=[],l={}){const t=X(e,r,l);return q(t,[{id:"save-order-button",label:"حفظ الطلب"}])}const b={notEmpty:(e,r)=>e!=null&&e.trim()?null:`${r} مطلوب`,phone:(e,r="الهاتف")=>e!=null&&e.trim()?/^(\+|00)?[0-9]{7,15}$/.test(e.replace(/\s/g,""))?null:`رقم ${r} غير صحيح`:`${r} مطلوب`,number:(e,r,l=!1)=>{if(e===""||e===null)return`${r} مطلوب`;const t=Number(e);return isNaN(t)?`${r} يجب أن يكون رقم`:!l&&t<=0?`${r} يجب أن يكون أكبر من 0`:null},email:(e,r="البريد الإلكتروني")=>e!=null&&e.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)?null:`${r} غير صحيح`:`${r} مطلوب`};function T(e,r){const l={};for(const[t,o]of Object.entries(e))if(r[t]){const c=r[t](o);c&&(l[t]=c)}return l}function M(e){return Object.keys(e).length>0}function H(e){const r=Object.keys(e)[0];return e[r]}async function x(e=null,r=null){const l=document.getElementById("modal-root"),t=Z(r||{});_(l,r?"تعديل عميل":"إضافة عميل جديد",t);const o=l.querySelector("#save-client-button");o==null||o.addEventListener("click",async()=>{const c=E(l,{name:"client-name",phone:"client-phone",type:"client-type"}),i=T(c,{name:n=>b.notEmpty(n,"الاسم"),phone:n=>b.phone(n,"الهاتف"),type:n=>b.notEmpty(n,"النوع")});if(M(i)){f("error",H(i));return}try{if(r&&r.client_id){const n=await y.updateClient(r.client_id,c);f("success","تم تعديل بيانات العميل"),l.innerHTML="",e&&e(n)}else{const n=await y.addClient(c);f("success","تم إضافة العميل بنجاح"),L(l,{name:"client-name",phone:"client-phone",type:"client-type"}),l.innerHTML="",e&&e(n)}}catch{f("error","حدث خطأ أثناء حفظ بيانات العميل")}})}async function g(e=[],r=null,l=null){const t=document.getElementById("modal-root"),o=B(e,l||{});_(t,l?"تعديل شاليه":"إضافة شاليه جديد",o);const c=t.querySelector("#chalet-client");t.querySelector("#chalet-name");const s=t.querySelector("#add-new-client-btn"),i=t.querySelector("#save-chalet-button");s==null||s.addEventListener("click",async()=>{await x(async n=>{const h=c.value;c.innerHTML+=`<option value="${n.client_id}">${n.name}</option>`,c.value=n.client_id})}),i==null||i.addEventListener("click",async()=>{const n=E(t,{chalet_name:"chalet-name",location:"chalet-location",client_id:"chalet-client",details:"chalet-details"}),v=T(n,{chalet_name:u=>b.notEmpty(u,"اسم الشاليه"),location:u=>b.notEmpty(u,"الموقع"),client_id:u=>b.notEmpty(u,"العميل")});if(M(v)){f("error",H(v));return}try{if(l&&l.chalet_id){const u=await y.updateChalet(l.chalet_id,n);f("success","تم تعديل الشاليه"),t.innerHTML="",r&&r(u)}else{const u=await y.addChalet(n);f("success","تم إضافة الشاليه بنجاح"),L(t,{chalet_name:"chalet-name",location:"chalet-location",client_id:"chalet-client",details:"chalet-details"}),t.innerHTML="",r&&r(u)}}catch{f("error","خطأ في حفظ الشاليه")}})}async function le(e=[],r=[],l=null,t=null){const o=document.getElementById("modal-root"),c=D(e,r,t||{});_(o,t?"تعديل طلب":"إضافة طلب جديد",c);const s=o.querySelector("#order-client"),i=o.querySelector("#order-chalet"),n=o.querySelector("#add-client-btn"),h=o.querySelector("#add-chalet-btn"),v=o.querySelector("#save-order-button");function u(){const a=s.value,d=r.filter(p=>p.client_id===a);i.innerHTML=d.length?d.map(p=>`<option value="${p.chalet_id}">${p.chalet_name}</option>`).join(""):'<option value="">لا يوجد شاليهات</option>'}s==null||s.addEventListener("change",u),t&&(s.value=t.client_id||s.value,u(),i.value=t.chalet_id||i.value,o.querySelector("#order-status").value=t.status||o.querySelector("#order-status").value,o.querySelector("#order-price").value=t.price||o.querySelector("#order-price").value,o.querySelector("#order-notes").value=t.notes||o.querySelector("#order-notes").value,o.querySelector("#order-scheduled")&&(o.querySelector("#order-scheduled").value=t.scheduled_at||""),o.querySelector("#order-deposit")&&(o.querySelector("#order-deposit").value=t.deposit||0)),n==null||n.addEventListener("click",async()=>{await x(async a=>{e.push(a);const d=s.value;s.innerHTML+=`<option value="${a.client_id}">${a.name}</option>`,s.value=a.client_id,u()})}),h==null||h.addEventListener("click",async()=>{await g(e,async a=>{r.push(a);const d=s.value;a.client_id===d&&(i.innerHTML+=`<option value="${a.chalet_id}">${a.chalet_name}</option>`)})}),v==null||v.addEventListener("click",async()=>{const a=E(o,{client_id:"order-client",chalet_id:"order-chalet",status:"order-status",price:"order-price",notes:"order-notes",scheduled_at:"order-scheduled",deposit:"order-deposit"});a.deposit=Number(a.deposit||0);const p=T(a,{client_id:m=>b.notEmpty(m,"العميل"),chalet_id:m=>b.notEmpty(m,"الشاليه"),price:m=>b.number(m,"السعر"),status:m=>b.notEmpty(m,"الحالة")});if(M(p)){f("error",H(p));return}try{if(t&&t.order_id){const m={client_id:a.client_id,chalet_id:a.chalet_id,status:a.status,price:Number(a.price),notes:a.notes,scheduled_at:a.scheduled_at||"",deposit:Number(a.deposit||0)};await y.updateOrder(t.order_id,m),f("success","تم تحديث الطلب"),o.innerHTML="",l&&l()}else a.created_at=new Date().toISOString().split("T")[0],a.created_by=A.getUserName(),await y.addOrder({...a,price:Number(a.price)}),f("success","تم إضافة الطلب بنجاح"),L(o,{client_id:"order-client",chalet_id:"order-chalet",status:"order-status",price:"order-price",notes:"order-notes"}),o.innerHTML="",l&&l()}catch(m){console.error(m),f("error","خطأ في حفظ الطلب")}})}async function oe(e=[],r=[],l=null,t=null){var u,a;const o=document.getElementById("modal-root");if(!o)return;const c=`
    <option value="expense" ${(t==null?void 0:t.type)==="expense"?"selected":""}>مصروف</option>
    <option value="income" ${(t==null?void 0:t.type)==="income"?"selected":""}>ايراد</option>
  `,s=await y.getClients(),i=new Map(r.map(d=>[d.chalet_id,d])),n=new Map(s.map(d=>[d.client_id,d.name])),h='<option value="">عام</option>'+(e.length?e.map(d=>{const p=i.get(d.chalet_id),m=(p==null?void 0:p.chalet_name)||d.chalet_id||"غير محدد",$=p&&n.get(p.client_id)||"غير محدد";return`<option value="${d.order_id}" ${(t==null?void 0:t.order_id)===d.order_id?"selected":""}>${d.order_id} - ${m} (${$})</option>`}).join(""):""),v=`
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="form-label" for="tx-type">النوع</label>
        <select id="tx-type" class="form-select">${c}</select>
      </div>
      <div>
        <label class="form-label" for="tx-amount">المبلغ</label>
        <input id="tx-amount" type="number" class="form-input" value="${(t==null?void 0:t.amount)||""}" />
      </div>
      <div>
        <label class="form-label" for="tx-date">التاريخ</label>
        <input id="tx-date" type="date" class="form-input" value="${(t==null?void 0:t.date)||new Date().toISOString().split("T")[0]}" />
      </div>
      <div>
        <label class="form-label" for="tx-order">مرتبط بطلب (اختياري)</label>
        <select id="tx-order" class="form-select">${h}</select>
      </div>
      <div class="sm:col-span-2">
        <label class="form-label" for="tx-details">التفاصيل</label>
        <textarea id="tx-details" rows="4" class="form-textarea">${(t==null?void 0:t.details)||""}</textarea>
      </div>
      <div class="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-2">
        <button class="btn btn-secondary w-full sm:w-auto" id="cancel-tx">إلغاء</button>
        <button class="btn btn-primary w-full sm:w-auto" id="save-tx">حفظ</button>
      </div>
    </div>
  `;_(o,t?"تعديل المعاملة":"إضافة معاملة جديدة",v),(u=o.querySelector("#cancel-tx"))==null||u.addEventListener("click",()=>{o.innerHTML=""}),(a=o.querySelector("#save-tx"))==null||a.addEventListener("click",async()=>{var F,j,k,O,N;const d=(F=o.querySelector("#tx-type"))==null?void 0:F.value,p=Number(((j=o.querySelector("#tx-amount"))==null?void 0:j.value)||0),m=(k=o.querySelector("#tx-date"))==null?void 0:k.value,$=((O=o.querySelector("#tx-order"))==null?void 0:O.value)||"",I=((N=o.querySelector("#tx-details"))==null?void 0:N.value)||"";if(!d||!p){f("error","الرجاء تعبئة النوع والمبلغ");return}try{t&&t.transaction_id?(await y.updateTransaction(t.transaction_id,{type:d,amount:p,date:m,order_id:$,details:I}),f("success","تم تعديل المعاملة")):(await y.addTransaction({type:d,amount:p,date:m,order_id:$,details:I,created_by:A.getUserName()}),f("success","تم إضافة المعاملة")),o.innerHTML="",l&&l()}catch(z){console.error("Transaction save error",z),f("error","حدث خطأ أثناء حفظ المعاملة")}})}export{g as a,x as b,oe as c,_ as r,le as s};
