import{a as h}from"./sidebar-B32eMct9.js";import{s as u}from"./toast-ZwFb22xq.js";import{a as R}from"./auth-CC3zXfFT.js";function $(e,r,l){if(!e)return;e.innerHTML=`
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden" style="max-width: min(90vw, 500px);">
        <div class="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 class="text-xl font-semibold text-white">${r}</h2>
          <button class="text-slate-400 hover:text-white text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded" aria-label="Close">×</button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">${l}</div>
      </div>
    </div>
  `;const t=e.querySelector(".fixed"),o=e.querySelector('button[aria-label="Close"]');function a(){e.innerHTML=""}t==null||t.addEventListener("click",d=>{d.target===t&&a()}),o==null||o.addEventListener("click",a)}function _(e,r,l="",t=""){return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <input id="${e}" type="text" class="form-input" placeholder="${l}" value="${t}" />
    </div>
  `}function z(e,r,l="",t=""){return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <input id="${e}" type="tel" class="form-input" placeholder="${l}" value="${t}" />
    </div>
  `}function O(e,r,l="",t=""){return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <input id="${e}" type="number" class="form-input" placeholder="${l}" value="${t}" />
    </div>
  `}function G(e,r,l=""){return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <input id="${e}" type="date" class="form-input" value="${l}" />
    </div>
  `}function C(e,r,l,t=""){const o=l.map(a=>{const d=a.value===t?"selected":"";return`<option value="${a.value}" ${d}>${a.label}</option>`}).join("");return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <select id="${e}" class="form-select">
        ${o}
      </select>
    </div>
  `}function w(e,r,l,t="",o="",a=""){const d=l.map(i=>{const n=i.value===t?"selected":"";return`<option value="${i.value}" ${n}>${i.label}</option>`}).join("");return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap items-end">
        <select id="${e}" class="form-select flex-1">
          ${d}
        </select>
        ${a?`<button type="button" class="btn btn-secondary px-4 py-2 whitespace-nowrap" id="${o}">${a}</button>`:""}
      </div>
    </div>
  `}function A(e,r,l="",t=3,o=""){return`
    <div>
      <label class="form-label" for="${e}">${r}</label>
      <textarea id="${e}" rows="${t}" class="form-textarea" placeholder="${l}">${o}</textarea>
    </div>
  `}function N(e="grid-cols-1 md:grid-cols-2",r=""){return`<div class="grid ${e} gap-4">${r}</div>`}function K(e,r,l="primary"){return`<button type="button" class="${l==="secondary"?"btn btn-secondary":"btn btn-primary"}" id="${e}">${r}</button>`}function V(e=[]){return`<div class="flex flex-col sm:flex-row justify-end gap-3 pt-4">${e.map(l=>K(l.id,l.label,l.style)).join(" ")}</div>`}function S(e=[],r=[]){const l=e.join(""),t=V(r);return`<div class="space-y-4">${l}${t}</div>`}function q(e,r={}){const l={};for(const[t,o]of Object.entries(r)){const a=e.querySelector(`#${o}`);a&&(l[t]=a.value)}return l}function E(e,r={}){for(const l of Object.values(r)){const t=e.querySelector(`#${l}`);t&&(t.type==="number"?t.value="":t.tagName==="SELECT"?t.selectedIndex=0:t.value="")}}const W=[{value:"owner",label:"owner"},{value:"broker",label:"broker"}];function Y(e={}){return[_("client-name","الاسم","اسم العميل",e.name||""),z("client-phone","الهاتف","رقم الهاتف",e.phone||""),C("client-type","النوع",W,e.type||"owner")]}function J(e=[],r={}){const l=e.map(t=>({value:t.client_id,label:t.name}));return[_("chalet-name","الشاليه","اسم الشاليه",r.chalet_name||""),_("chalet-location","الموقع","الموقع الجغرافي",r.location||""),w("chalet-client","العميل",l,r.client_id||"","add-new-client-btn","+ عميل"),A("chalet-details","التفاصيل","تفاصيل الشاليه",4,r.details||"")]}function Q(e=[],r=[],l={}){var i;const t=e.map(n=>({value:n.client_id,label:n.name})),o=l.client_id||((i=e[0])==null?void 0:i.client_id)||"",a=r.filter(n=>n.client_id===o).map(n=>({value:n.chalet_id,label:n.chalet_name})),d=[{value:"pending",label:"معلقة"},{value:"in_progress",label:"قيد التنفيذ"},{value:"done_unpaid",label:"تمت ولم يُدفع"},{value:"done_paid",label:"تمت ودُفع"},{value:"cancelled",label:"ملغاة"}];return[w("order-client","العميل",t,o,"add-client-btn","+ عميل"),w("order-chalet","الشاليه",a,l.chalet_id||"","add-chalet-btn","+ شاليه"),N("grid-cols-1 md:grid-cols-2",C("order-status","الحالة",d,l.status||"pending")+O("order-price","السعر","مثلاً 420",l.price||"")),N("grid-cols-1 md:grid-cols-2",G("order-scheduled","تاريخ التنفيذ",l.scheduled_at||"")+O("order-deposit","الديبوزيت","مثلاً 100",l.deposit||"")),A("order-notes","الملاحظات","تفاصيل إضافية",3,l.notes||"")]}function X(e={}){const r=Y(e);return S(r,[{id:"save-client-button",label:"حفظ العميل"}])}function Z(e=[],r={}){const l=J(e,r);return S(l,[{id:"save-chalet-button",label:"حفظ الشاليه"}])}function x(e=[],r=[],l={}){const t=Q(e,r,l);return S(t,[{id:"save-order-button",label:"حفظ الطلب"}])}const f={notEmpty:(e,r)=>e!=null&&e.trim()?null:`${r} مطلوب`,phone:(e,r="الهاتف")=>e!=null&&e.trim()?/^(\+|00)?[0-9]{7,15}$/.test(e.replace(/\s/g,""))?null:`رقم ${r} غير صحيح`:`${r} مطلوب`,number:(e,r,l=!1)=>{if(e===""||e===null)return`${r} مطلوب`;const t=Number(e);return isNaN(t)?`${r} يجب أن يكون رقم`:!l&&t<=0?`${r} يجب أن يكون أكبر من 0`:null},email:(e,r="البريد الإلكتروني")=>e!=null&&e.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)?null:`${r} غير صحيح`:`${r} مطلوب`};function L(e,r){const l={};for(const[t,o]of Object.entries(e))if(r[t]){const a=r[t](o);a&&(l[t]=a)}return l}function T(e){return Object.keys(e).length>0}function M(e){const r=Object.keys(e)[0];return e[r]}async function P(e=null,r=null){const l=document.getElementById("modal-root"),t=X(r||{});$(l,r?"تعديل عميل":"إضافة عميل جديد",t);const o=l.querySelector("#save-client-button");o==null||o.addEventListener("click",async()=>{const a=q(l,{name:"client-name",phone:"client-phone",type:"client-type"}),i=L(a,{name:n=>f.notEmpty(n,"الاسم"),phone:n=>f.phone(n,"الهاتف"),type:n=>f.notEmpty(n,"النوع")});if(T(i)){u("error",M(i));return}try{if(r&&r.client_id){const n=await h.updateClient(r.client_id,a);u("success","تم تعديل بيانات العميل"),l.innerHTML="",e&&e(n)}else{const n=await h.addClient(a);u("success","تم إضافة العميل بنجاح"),E(l,{name:"client-name",phone:"client-phone",type:"client-type"}),l.innerHTML="",e&&e(n)}}catch{u("error","حدث خطأ أثناء حفظ بيانات العميل")}})}async function B(e=[],r=null,l=null){const t=document.getElementById("modal-root"),o=Z(e,l||{});$(t,l?"تعديل شاليه":"إضافة شاليه جديد",o);const a=t.querySelector("#chalet-client");t.querySelector("#chalet-name");const d=t.querySelector("#add-new-client-btn"),i=t.querySelector("#save-chalet-button");d==null||d.addEventListener("click",async()=>{await P(async n=>{const v=a.value;a.innerHTML+=`<option value="${n.client_id}">${n.name}</option>`,a.value=n.client_id})}),i==null||i.addEventListener("click",async()=>{const n=q(t,{chalet_name:"chalet-name",location:"chalet-location",client_id:"chalet-client",details:"chalet-details"}),b=L(n,{chalet_name:s=>f.notEmpty(s,"اسم الشاليه"),location:s=>f.notEmpty(s,"الموقع"),client_id:s=>f.notEmpty(s,"العميل")});if(T(b)){u("error",M(b));return}try{if(l&&l.chalet_id){const s=await h.updateChalet(l.chalet_id,n);u("success","تم تعديل الشاليه"),t.innerHTML="",r&&r(s)}else{const s=await h.addChalet(n);u("success","تم إضافة الشاليه بنجاح"),E(t,{chalet_name:"chalet-name",location:"chalet-location",client_id:"chalet-client",details:"chalet-details"}),t.innerHTML="",r&&r(s)}}catch{u("error","خطأ في حفظ الشاليه")}})}async function te(e=[],r=[],l=null,t=null){const o=document.getElementById("modal-root"),a=x(e,r,t||{});$(o,t?"تعديل طلب":"إضافة طلب جديد",a);const d=o.querySelector("#order-client"),i=o.querySelector("#order-chalet"),n=o.querySelector("#add-client-btn"),v=o.querySelector("#add-chalet-btn"),b=o.querySelector("#save-order-button");function s(){const c=d.value,y=r.filter(m=>m.client_id===c);i.innerHTML=y.length?y.map(m=>`<option value="${m.chalet_id}">${m.chalet_name}</option>`).join(""):'<option value="">لا يوجد شاليهات</option>'}d==null||d.addEventListener("change",s),t&&(d.value=t.client_id||d.value,s(),i.value=t.chalet_id||i.value,o.querySelector("#order-status").value=t.status||o.querySelector("#order-status").value,o.querySelector("#order-price").value=t.price||o.querySelector("#order-price").value,o.querySelector("#order-notes").value=t.notes||o.querySelector("#order-notes").value,o.querySelector("#order-scheduled")&&(o.querySelector("#order-scheduled").value=t.scheduled_at||""),o.querySelector("#order-deposit")&&(o.querySelector("#order-deposit").value=t.deposit||0)),n==null||n.addEventListener("click",async()=>{await P(async c=>{e.push(c);const y=d.value;d.innerHTML+=`<option value="${c.client_id}">${c.name}</option>`,d.value=c.client_id,s()})}),v==null||v.addEventListener("click",async()=>{await B(e,async c=>{r.push(c);const y=d.value;c.client_id===y&&(i.innerHTML+=`<option value="${c.chalet_id}">${c.chalet_name}</option>`)})}),b==null||b.addEventListener("click",async()=>{const c=q(o,{client_id:"order-client",chalet_id:"order-chalet",status:"order-status",price:"order-price",notes:"order-notes",scheduled_at:"order-scheduled",deposit:"order-deposit"});c.deposit=Number(c.deposit||0);const m=L(c,{client_id:p=>f.notEmpty(p,"العميل"),chalet_id:p=>f.notEmpty(p,"الشاليه"),price:p=>f.number(p,"السعر"),status:p=>f.notEmpty(p,"الحالة")});if(T(m)){u("error",M(m));return}try{if(t&&t.order_id){const p={client_id:c.client_id,chalet_id:c.chalet_id,status:c.status,price:Number(c.price),notes:c.notes,scheduled_at:c.scheduled_at||"",deposit:Number(c.deposit||0)};await h.updateOrder(t.order_id,p),u("success","تم تحديث الطلب"),o.innerHTML="",l&&l()}else c.created_at=new Date().toISOString().split("T")[0],c.created_by=R.getUserName(),await h.addOrder({...c,price:Number(c.price)}),u("success","تم إضافة الطلب بنجاح"),E(o,{client_id:"order-client",chalet_id:"order-chalet",status:"order-status",price:"order-price",notes:"order-notes"}),o.innerHTML="",l&&l()}catch(p){console.error(p),u("error","خطأ في حفظ الطلب")}})}async function re(e=[],r=[],l=null,t=null){var v,b;const o=document.getElementById("modal-root");if(!o)return;const a=`
    <option value="expense" ${(t==null?void 0:t.type)==="expense"?"selected":""}>مصروف</option>
    <option value="income" ${(t==null?void 0:t.type)==="income"?"selected":""}>ايراد</option>
  `,d=new Map(r.map(s=>[s.chalet_id,s.chalet_name])),i='<option value="">عام</option>'+(e.length?e.map(s=>{const c=d.get(s.chalet_id)||s.chalet_id||"غير محدد";return`<option value="${s.order_id}" ${(t==null?void 0:t.order_id)===s.order_id?"selected":""}>${s.order_id} - ${c}</option>`}).join(""):""),n=`
    <div class="space-y-4">
      <div>
        <label class="form-label" for="tx-type">النوع</label>
        <select id="tx-type" class="form-select">${a}</select>
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
        <select id="tx-order" class="form-select">${i}</select>
      </div>
      <div>
        <label class="form-label" for="tx-details">التفاصيل</label>
        <textarea id="tx-details" rows="3" class="form-textarea">${(t==null?void 0:t.details)||""}</textarea>
      </div>
      <div class="flex justify-end gap-3">
        <button class="btn btn-secondary" id="cancel-tx">إلغاء</button>
        <button class="btn btn-primary" id="save-tx">حفظ</button>
      </div>
    </div>
  `;$(o,t?"تعديل المعاملة":"إضافة معاملة جديدة",n),(v=o.querySelector("#cancel-tx"))==null||v.addEventListener("click",()=>{o.innerHTML=""}),(b=o.querySelector("#save-tx"))==null||b.addEventListener("click",async()=>{var H,I,F,j,k;const s=(H=o.querySelector("#tx-type"))==null?void 0:H.value,c=Number(((I=o.querySelector("#tx-amount"))==null?void 0:I.value)||0),y=(F=o.querySelector("#tx-date"))==null?void 0:F.value,m=((j=o.querySelector("#tx-order"))==null?void 0:j.value)||"",p=((k=o.querySelector("#tx-details"))==null?void 0:k.value)||"";if(!s||!c){u("error","الرجاء تعبئة النوع والمبلغ");return}try{t&&t.transaction_id?(await h.updateTransaction(t.transaction_id,{type:s,amount:c,date:y,order_id:m,details:p}),u("success","تم تعديل المعاملة")):(await h.addTransaction({type:s,amount:c,date:y,order_id:m,details:p,created_by:R.getUserName()}),u("success","تم إضافة المعاملة")),o.innerHTML="",l&&l()}catch(U){console.error("Transaction save error",U),u("error","حدث خطأ أثناء حفظ المعاملة")}})}export{B as a,P as b,re as c,$ as r,te as s};
