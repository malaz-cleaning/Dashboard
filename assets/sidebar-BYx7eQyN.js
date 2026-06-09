import{a as x,s as y}from"./toast-DJo7gZdP.js";const Y={clients:[],chalets:[],orders:[]},Q="malaz-cleaning",X=`https://${Q}-default-rtdb.firebaseio.com`,_={clients:null,chalets:null,orders:null,transactions:null};async function w(e,t="GET",n=null){try{const a=x.getToken();let l=`${X}${e}.json`;a&&(l+=`?auth=${a}`);const s={method:t,headers:{"Content-Type":"application/json"}};n&&(s.body=JSON.stringify(n));const r=await fetch(l,s);if(!r.ok)throw r.status===401?(x.logout(),new Error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى")):new Error(`Firebase error: ${r.statusText}`);return r.json()}catch(a){throw console.error("Firebase Error:",a),a}}async function $(e){if(_[e])return _[e];try{const t=await w(`/${e}`);return t?(_[e]=Object.values(t).filter(n=>!n.is_deleted),_[e]):(_[e]=[],[])}catch(t){return console.warn(`Failed to fetch ${e} from Firebase, using local state:`,t),_[e]=Y[e]||[],_[e]}}function g(...e){e.forEach(t=>{_[t]!==void 0&&(_[t]=null)})}async function U(e){try{return await w(`/${e}`)||{}}catch(t){return console.warn(`Failed to fetch raw ${e} from Firebase:`,t),{}}}function B(e,t,n=3){const l=Object.keys(e||{}).filter(s=>typeof s=="string").reduce((s,r)=>{if(!r.startsWith(t))return s;const i=parseInt(r.slice(t.length),10);return Number.isNaN(i)?s:Math.max(s,i)},0);return`${t}${String(l+1).padStart(n,"0")}`}const S={async getClients(){return $("clients")},async getChalets(){return $("chalets")},async getOrders(){return $("orders")},async addClient({type:e,name:t,phone:n}){const a=await $("clients"),l=`CL${String(a.length+1).padStart(3,"0")}`,s={client_id:l,type:e,name:t,phone:n,created_at:new Date().toISOString().split("T")[0],is_deleted:!1};return await w(`/clients/${l}`,"PUT",s),g("clients"),s},async addChalet({client_id:e,chalet_name:t,location:n,details:a}){const l=await $("chalets"),s=`CH${String(l.length+1).padStart(3,"0")}`,r={chalet_id:s,chalet_code:s,client_id:e,chalet_name:t,location:n,details:a,created_at:new Date().toISOString().split("T")[0],is_deleted:!1};return await w(`/chalets/${s}`,"PUT",r),g("chalets"),r},async addOrder({client_id:e,chalet_id:t,status:n,price:a,notes:l,created_at:s,scheduled_at:r="",deposit:i=0,created_by:o=""}){const h=await U("orders"),c=B(h,"OR",3),p={order_id:c,client_id:e,chalet_id:t,status:n,price:Number(a),notes:l,created_at:s,scheduled_at:r||"",deposit:Number(i||0),created_by:o||"",completed_at:n.includes("done")?s:"",is_deleted:!1};await w(`/orders/${c}`,"PUT",p),g("orders");try{if(p.deposit>0&&await this.addTransaction({type:"income",amount:Number(p.deposit),date:p.created_at,details:`دفعة مقدمة من الطلب ${c}`,order_id:c,created_by:p.created_by||""}),p.status==="done_paid"){const m=Number(p.price||0)-Number(p.deposit||0);m>0&&await this.addTransaction({type:"income",amount:m,date:p.created_at,details:`باقي الدفع من الطلب ${c}`,order_id:c,created_by:p.created_by||""})}}catch(m){console.error("Failed to create income transaction for order:",m)}return p},async updateClient(e,t){return await w(`/clients/${e}`,"PATCH",t),g("clients"),(await $("clients")).find(a=>a.client_id===e)},async updateChalet(e,t){return await w(`/chalets/${e}`,"PATCH",t),g("chalets"),(await $("chalets")).find(a=>a.chalet_id===e)},async updateOrder(e,t){const a=(await $("orders")).find(r=>r.order_id===e)||{};if(t.status){const r=new Date().toISOString().split("T")[0];t.status==="done_paid"||t.status==="done_unpaid"||t.status==="cancelled"?t.completed_at=r:(t.status==="pending"||t.status==="in_progress")&&(t.completed_at="")}await w(`/orders/${e}`,"PATCH",t),g("orders");const s=(await $("orders")).find(r=>r.order_id===e);try{const r=a.status,i=t.status||(s==null?void 0:s.status),o=Number(t.price??(s==null?void 0:s.price)??0),h=Number(t.deposit??(s==null?void 0:s.deposit)??0),p=(await this.getTransactions()).filter(m=>!m.is_deleted&&m.order_id===e&&m.type==="income").reduce((m,f)=>m+Number(f.amount||0),0);if(h>0&&h>Number(a.deposit||0)){const m=h-Number(a.deposit||0);m>0&&await this.addTransaction({type:"income",amount:m,date:new Date().toISOString().split("T")[0],details:`زيادة الدفعة من الطلب ${e}`,order_id:e,created_by:t.created_by||(s==null?void 0:s.created_by)||""})}if(r!=="done_paid"&&i==="done_paid"){const f=(await this.getTransactions()).filter(u=>!u.is_deleted&&u.order_id===e&&u.type==="income").reduce((u,b)=>u+Number(b.amount||0),0),d=o-f;if(d>0){const u=t.created_by||(s==null?void 0:s.created_by)||"";await this.addTransaction({type:"income",amount:d,date:new Date().toISOString().split("T")[0],details:`باقي الدفع من الطلب ${e}`,order_id:e,created_by:u})}}}catch(r){console.error("Failed to create income transaction for updated order:",r)}return s},async deleteClient(e){const t=await w(`/clients/${e}`,"PATCH",{is_deleted:!0});return g("clients"),t},async deleteChalet(e){const t=await w(`/chalets/${e}`,"PATCH",{is_deleted:!0});return g("chalets"),t},async deleteOrder(e){const t=await w(`/orders/${e}`,"PATCH",{is_deleted:!0});return g("orders"),t},async getTransactions(){return $("transactions")},async getWorkerAttendance(e){const t=e==="august"?"august":"july";try{return await w(`/worker_attendance/${t}`)||{workers:[]}}catch(n){return console.warn(`Failed to fetch worker attendance for ${t}:`,n),{workers:[]}}},async saveWorkerAttendance(e,t){const n=e==="august"?"august":"july",a={...t,month:n,updated_at:new Date().toISOString().split("T")[0]};return await w(`/worker_attendance/${n}`,"PUT",a),a},async addTransaction({type:e,amount:t,date:n,details:a="",order_id:l="",created_by:s=""}){const r=await U("transactions"),i=B(r,"TR",4),o={transaction_id:i,type:e,amount:Number(t||0),date:n||new Date().toISOString().split("T")[0],details:a||"",order_id:l||"",created_by:s||"",created_at:new Date().toISOString(),is_deleted:!1};return await w(`/transactions/${i}`,"PUT",o),g("transactions"),o},async updateTransaction(e,t){return await w(`/transactions/${e}`,"PATCH",t),g("transactions"),(await $("transactions")).find(a=>a.transaction_id===e)},async deleteTransaction(e){const t=await w(`/transactions/${e}`,"PATCH",{is_deleted:!0});return g("transactions"),t}};function T(e,t,n){if(!e)return null;const a=document.createElement("div");a.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",a.innerHTML=`
    <div class="bg-slate-800 rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden" style="max-width: min(90vw, 500px);">
      <div class="flex items-center justify-between p-6 border-b border-slate-700">
        <h2 class="text-xl font-semibold text-white">${t}</h2>
        <button class="text-slate-400 hover:text-white text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded" aria-label="Close">×</button>
      </div>
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">${n}</div>
    </div>
  `,e.appendChild(a);const l=a.querySelector('button[aria-label="Close"]');function s(){a.remove()}return a.addEventListener("click",r=>{r.target===a&&s()}),l==null||l.addEventListener("click",s),a}function L(e,t,n="",a=""){return`
    <div>
      <label class="form-label" for="${e}">${t}</label>
      <input id="${e}" type="text" class="form-input" placeholder="${n}" value="${a}" />
    </div>
  `}function Z(e,t,n="",a=""){return`
    <div>
      <label class="form-label" for="${e}">${t}</label>
      <input id="${e}" type="tel" class="form-input" placeholder="${n}" value="${a}" />
    </div>
  `}function V(e,t,n="",a=""){return`
    <div>
      <label class="form-label" for="${e}">${t}</label>
      <input id="${e}" type="number" class="form-input" placeholder="${n}" value="${a}" />
    </div>
  `}function ee(e,t,n=""){return`
    <div>
      <label class="form-label" for="${e}">${t}</label>
      <input id="${e}" type="date" class="form-input" value="${n}" />
    </div>
  `}function W(e,t,n,a=""){const l=n.map(s=>{const r=s.value===a?"selected":"";return`<option value="${s.value}" ${r}>${s.label}</option>`}).join("");return`
    <div>
      <label class="form-label" for="${e}">${t}</label>
      <select id="${e}" class="form-select">
        ${l}
      </select>
    </div>
  `}function j(e,t,n,a="",l="",s=""){const r=n.map(i=>{const o=i.value===a?"selected":"";return`<option value="${i.value}" ${o}>${i.label}</option>`}).join("");return`
    <div>
      <label class="form-label" for="${e}">${t}</label>
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap items-end">
        <select id="${e}" class="form-select flex-1">
          ${r}
        </select>
        ${s?`<button type="button" class="btn btn-secondary px-4 py-2 whitespace-nowrap" id="${l}">${s}</button>`:""}
      </div>
    </div>
  `}function G(e,t,n="",a=3,l=""){return`
    <div>
      <label class="form-label" for="${e}">${t}</label>
      <textarea id="${e}" rows="${a}" class="form-textarea" placeholder="${n}">${l}</textarea>
    </div>
  `}function D(e="grid-cols-1 md:grid-cols-2",t=""){return`<div class="grid ${e} gap-4">${t}</div>`}function te(e,t,n="primary"){return`<button type="button" class="${n==="secondary"?"btn btn-secondary":"btn btn-primary"}" id="${e}">${t}</button>`}function ae(e=[]){return`<div class="flex flex-col sm:flex-row justify-end gap-3 pt-4">${e.map(n=>te(n.id,n.label,n.style)).join(" ")}</div>`}function M(e=[],t=[]){const n=e.join(""),a=ae(t);return`<div class="space-y-4">${n}${a}</div>`}function C(e,t={}){const n={};for(const[a,l]of Object.entries(t)){const s=e.querySelector(`#${l}`);s&&(n[a]=s.value)}return n}function q(e,t={}){for(const n of Object.values(t)){const a=e.querySelector(`#${n}`);a&&(a.type==="number"?a.value="":a.tagName==="SELECT"?a.selectedIndex=0:a.value="")}}const ne=[{value:"owner",label:"owner"},{value:"broker",label:"broker"}];function se(e={}){return[L("client-name","الاسم","اسم العميل",e.name||""),Z("client-phone","الهاتف","رقم الهاتف",e.phone||""),W("client-type","النوع",ne,e.type||"owner")]}function re(e=[],t={}){const n=e.map(a=>({value:a.client_id,label:a.name}));return[L("chalet-name","الشاليه","اسم الشاليه",t.chalet_name||""),L("chalet-location","الموقع","الموقع الجغرافي",t.location||""),j("chalet-client","العميل",n,t.client_id||"","add-new-client-btn","+ عميل"),G("chalet-details","التفاصيل","تفاصيل الشاليه",4,t.details||"")]}function le(e=[],t=[],n={}){var i;const a=e.map(o=>({value:o.client_id,label:o.name})),l=n.client_id||((i=e[0])==null?void 0:i.client_id)||"",s=t.filter(o=>o.client_id===l).map(o=>({value:o.chalet_id,label:o.chalet_name})),r=[{value:"pending",label:"معلقة"},{value:"in_progress",label:"قيد التنفيذ"},{value:"done_unpaid",label:"تمت ولم يُدفع"},{value:"done_paid",label:"تمت ودُفع"},{value:"cancelled",label:"ملغاة"}];return[j("order-client","العميل",a,l,"add-client-btn","+ عميل"),j("order-chalet","الشاليه",s,n.chalet_id||"","add-chalet-btn","+ شاليه"),D("grid-cols-1 md:grid-cols-2",W("order-status","الحالة",r,n.status||"pending")+V("order-price","السعر","مثلاً 420",n.price||"")),D("grid-cols-1 md:grid-cols-2",ee("order-scheduled","تاريخ التنفيذ",n.scheduled_at||"")+V("order-deposit","الديبوزيت","مثلاً 100",n.deposit||"")),G("order-notes","الملاحظات","تفاصيل إضافية",3,n.notes||"")]}function oe(e={}){const t=se(e);return M(t,[{id:"save-client-button",label:"حفظ العميل"}])}function ce(e=[],t={}){const n=re(e,t);return M(n,[{id:"save-chalet-button",label:"حفظ الشاليه"}])}function ie(e=[],t=[],n={}){const a=le(e,t,n);return M(a,[{id:"save-order-button",label:"حفظ الطلب"}])}const k={notEmpty:(e,t)=>e!=null&&e.trim()?null:`${t} مطلوب`,phone:(e,t="الهاتف")=>e!=null&&e.trim()?/^(\+|00)?[0-9]{7,15}$/.test(e.replace(/\s/g,""))?null:`رقم ${t} غير صحيح`:`${t} مطلوب`,number:(e,t,n=!1)=>{if(e===""||e===null)return`${t} مطلوب`;const a=Number(e);return isNaN(a)?`${t} يجب أن يكون رقم`:!n&&a<=0?`${t} يجب أن يكون أكبر من 0`:null},email:(e,t="البريد الإلكتروني")=>e!=null&&e.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)?null:`${t} غير صحيح`:`${t} مطلوب`};function I(e,t){const n={};for(const[a,l]of Object.entries(e))if(t[a]){const s=t[a](l);s&&(n[a]=s)}return n}function O(e){return Object.keys(e).length>0}function H(e){const t=Object.keys(e)[0];return e[t]}async function J(e=null,t=null){const n=document.getElementById("modal-root"),a=oe(t||{}),l=T(n,t?"تعديل عميل":"إضافة عميل جديد",a);if(!l)return;function s(){l.remove()}const r=l.querySelector("#save-client-button");r==null||r.addEventListener("click",async()=>{const i=C(l,{name:"client-name",phone:"client-phone",type:"client-type"}),h=I(i,{name:c=>k.notEmpty(c,"الاسم"),phone:c=>k.phone(c,"الهاتف"),type:c=>k.notEmpty(c,"النوع")});if(O(h)){y("error",H(h));return}try{if(t&&t.client_id){const c=await S.updateClient(t.client_id,i);y("success","تم تعديل بيانات العميل"),s(),e&&e(c)}else{const c=await S.addClient(i);y("success","تم إضافة العميل بنجاح"),q(l,{name:"client-name",phone:"client-phone",type:"client-type"}),s(),e&&e(c)}}catch{y("error","حدث خطأ أثناء حفظ بيانات العميل")}})}async function de(e=[],t=null,n=null){const a=document.getElementById("modal-root"),l=ce(e,n||{}),s=T(a,n?"تعديل شاليه":"إضافة شاليه جديد",l);if(!s)return;function r(){s.remove()}const i=s.querySelector("#chalet-client");s.querySelector("#chalet-name");const o=s.querySelector("#add-new-client-btn"),h=s.querySelector("#save-chalet-button");o==null||o.addEventListener("click",async()=>{await J(async c=>{const p=i.value;i.innerHTML+=`<option value="${c.client_id}">${c.name}</option>`,i.value=c.client_id})}),h==null||h.addEventListener("click",async()=>{const c=C(s,{chalet_name:"chalet-name",location:"chalet-location",client_id:"chalet-client",details:"chalet-details"}),m=I(c,{chalet_name:f=>k.notEmpty(f,"اسم الشاليه"),location:f=>k.notEmpty(f,"الموقع"),client_id:f=>k.notEmpty(f,"العميل")});if(O(m)){y("error",H(m));return}try{if(n&&n.chalet_id){const f=await S.updateChalet(n.chalet_id,c);y("success","تم تعديل الشاليه"),r(),t&&t(f)}else{const f=await S.addChalet(c);y("success","تم إضافة الشاليه بنجاح"),q(s,{chalet_name:"chalet-name",location:"chalet-location",client_id:"chalet-client",details:"chalet-details"}),r(),t&&t(f)}}catch{y("error","خطأ في حفظ الشاليه")}})}function pe(e={},t={}){const n=document.getElementById("modal-root");if(!n||!e)return;const a=`
    <div class="space-y-4 text-slate-200">
      <div class="grid gap-3">
        <div class="flex justify-between items-start gap-4">
          <span class="font-semibold text-slate-300">الاسم</span>
          <span class="text-slate-100 text-right">${e.chalet_name||"-"}</span>
        </div>
        <div class="flex justify-between items-start gap-4">
          <span class="font-semibold text-slate-300">العميل</span>
          <span class="text-slate-100 text-right">${t.name||"غير محدد"}</span>
        </div>
        <div class="flex justify-between items-start gap-4">
          <span class="font-semibold text-slate-300">الموقع</span>
          <span class="text-slate-100 text-right">${e.location||"-"}</span>
        </div>
      </div>
      <div class="rounded-2xl bg-slate-900/70 border border-slate-700 p-4">
        <h3 class="text-sm font-semibold text-slate-200 mb-2">التفاصيل</h3>
        <p class="text-slate-300 whitespace-pre-wrap">${e.details||"-"}</p>
      </div>
    </div>
  `;T(n,"تفاصيل الشاليه",a)}async function me(e=[],t=[],n=null,a=null){const l=document.getElementById("modal-root"),s=ie(e,t,a||{}),r=T(l,a?"تعديل طلب":"إضافة طلب جديد",s);if(!r)return;function i(){r.remove()}const o=r.querySelector("#order-client"),h=r.querySelector("#order-chalet"),c=r.querySelector("#add-client-btn"),p=r.querySelector("#add-chalet-btn"),m=r.querySelector("#save-order-button");function f(){const d=o.value,u=t.filter(b=>b.client_id===d);h.innerHTML=u.length?u.map(b=>`<option value="${b.chalet_id}">${b.chalet_name}</option>`).join(""):'<option value="">لا يوجد شاليهات</option>'}o==null||o.addEventListener("change",f),a&&(o.value=a.client_id||o.value,f(),h.value=a.chalet_id||h.value,r.querySelector("#order-status").value=a.status||r.querySelector("#order-status").value,r.querySelector("#order-price").value=a.price||r.querySelector("#order-price").value,r.querySelector("#order-notes").value=a.notes||r.querySelector("#order-notes").value,r.querySelector("#order-scheduled")&&(r.querySelector("#order-scheduled").value=a.scheduled_at||""),r.querySelector("#order-deposit")&&(r.querySelector("#order-deposit").value=a.deposit||0)),c==null||c.addEventListener("click",async()=>{await J(async d=>{e.push(d);const u=o.value;o.innerHTML+=`<option value="${d.client_id}">${d.name}</option>`,o.value=d.client_id,f()})}),p==null||p.addEventListener("click",async()=>{await de(e,async d=>{t.push(d);const u=o.value;d.client_id===u&&(h.innerHTML+=`<option value="${d.chalet_id}">${d.chalet_name}</option>`)})}),m==null||m.addEventListener("click",async()=>{const d=C(r,{client_id:"order-client",chalet_id:"order-chalet",status:"order-status",price:"order-price",notes:"order-notes",scheduled_at:"order-scheduled",deposit:"order-deposit"});d.deposit=Number(d.deposit||0);const b=I(d,{client_id:v=>k.notEmpty(v,"العميل"),chalet_id:v=>k.notEmpty(v,"الشاليه"),price:v=>k.number(v,"السعر"),status:v=>k.notEmpty(v,"الحالة")});if(O(b)){y("error",H(b));return}try{if(a&&a.order_id){const v={client_id:d.client_id,chalet_id:d.chalet_id,status:d.status,price:Number(d.price),notes:d.notes,scheduled_at:d.scheduled_at||"",deposit:Number(d.deposit||0)};await S.updateOrder(a.order_id,v),y("success","تم تحديث الطلب"),i(),n&&n()}else d.created_at=new Date().toISOString().split("T")[0],d.created_by=x.getUserName(),await S.addOrder({...d,price:Number(d.price)}),y("success","تم إضافة الطلب بنجاح"),q(r,{client_id:"order-client",chalet_id:"order-chalet",status:"order-status",price:"order-price",notes:"order-notes"}),i(),n&&n()}catch(v){console.error(v),y("error","خطأ في حفظ الطلب")}})}async function fe(e=[],t=[],n=null,a=null){var f,d;const l=document.getElementById("modal-root");if(!l)return;const s=`
    <option value="expense" ${(a==null?void 0:a.type)==="expense"?"selected":""}>مصروف</option>
    <option value="income" ${(a==null?void 0:a.type)==="income"?"selected":""}>ايراد</option>
  `,r=await S.getClients(),i=new Map(t.map(u=>[u.chalet_id,u])),o=new Map(r.map(u=>[u.client_id,u.name])),h='<option value="">عام</option>'+(e.length?e.map(u=>{const b=i.get(u.chalet_id),v=(b==null?void 0:b.chalet_name)||u.chalet_id||"غير محدد",E=b&&o.get(b.client_id)||"غير محدد";return`<option value="${u.order_id}" ${(a==null?void 0:a.order_id)===u.order_id?"selected":""}>${u.order_id} - ${v} (${E})</option>`}).join(""):""),c=`
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="form-label" for="tx-type">النوع</label>
        <select id="tx-type" class="form-select">${s}</select>
      </div>
      <div>
        <label class="form-label" for="tx-amount">المبلغ</label>
        <input id="tx-amount" type="number" class="form-input" value="${(a==null?void 0:a.amount)||""}" />
      </div>
      <div>
        <label class="form-label" for="tx-date">التاريخ</label>
        <input id="tx-date" type="date" class="form-input" value="${(a==null?void 0:a.date)||new Date().toISOString().split("T")[0]}" />
      </div>
      <div>
        <label class="form-label" for="tx-order">مرتبط بطلب (اختياري)</label>
        <select id="tx-order" class="form-select">${h}</select>
      </div>
      <div class="sm:col-span-2">
        <label class="form-label" for="tx-details">التفاصيل</label>
        <textarea id="tx-details" rows="4" class="form-textarea">${(a==null?void 0:a.details)||""}</textarea>
      </div>
      <div class="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-2">
        <button class="btn btn-secondary w-full sm:w-auto" id="cancel-tx">إلغاء</button>
        <button class="btn btn-primary w-full sm:w-auto" id="save-tx">حفظ</button>
      </div>
    </div>
  `,p=T(l,a?"تعديل المعاملة":"إضافة معاملة جديدة",c);if(!p)return;function m(){p.remove()}(f=p.querySelector("#cancel-tx"))==null||f.addEventListener("click",()=>{m()}),(d=p.querySelector("#save-tx"))==null||d.addEventListener("click",async()=>{var F,A,R,P,z;const u=(F=p.querySelector("#tx-type"))==null?void 0:F.value,b=Number(((A=p.querySelector("#tx-amount"))==null?void 0:A.value)||0),v=(R=p.querySelector("#tx-date"))==null?void 0:R.value,E=((P=p.querySelector("#tx-order"))==null?void 0:P.value)||"",N=((z=p.querySelector("#tx-details"))==null?void 0:z.value)||"";if(!u||!b){y("error","الرجاء تعبئة النوع والمبلغ");return}try{a&&a.transaction_id?(await S.updateTransaction(a.transaction_id,{type:u,amount:b,date:v,order_id:E,details:N}),y("success","تم تعديل المعاملة")):(await S.addTransaction({type:u,amount:b,date:v,order_id:E,details:N,created_by:x.getUserName()}),y("success","تم إضافة المعاملة")),m(),n&&n()}catch(K){console.error("Transaction save error",K),y("error","حدث خطأ أثناء حفظ المعاملة")}})}function he(e){if(!e)return;e.innerHTML=`
    <div class="navbar-inner">
      <div class="flex items-center gap-3">
        <button id="sidebar-toggle" class="nav-menu-toggle" type="button" aria-label="فتح القائمة الجانبية">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <p class="navbar-title">ملاذ كلينينج</p>
          <p class="text-slate-400 text-sm hidden sm:block">نظام إدارة الطلبات</p>
        </div>
      </div>
    </div>
  `;const t=e.querySelector("#sidebar-toggle");t==null||t.addEventListener("click",()=>{var n;(n=window.toggleSidebar)==null||n.call(window,!0)})}function be(e){if(!e)return;const t=window.innerWidth<=1024;x.isAuthenticated()&&!x.getUserEmail()&&x.updateUserData("admin@malaz.com"),e.classList.add("sidebar"),e.classList.toggle("collapsed",t),e.innerHTML=`
      <!-- Brand Block -->
      <div class="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4 p-4 lg:p-6 border-b border-slate-700/50">
        <div class="relative">
          <div class="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center text-white font-bold text-lg lg:text-xl shadow-lg">
            م
          </div>
          <div class="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-accent-emerald rounded-full border-2 border-slate-800"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-slate-50 font-bold text-base lg:text-lg truncate">ملاذ كلينينج</p>
          <p class="text-slate-400 text-xs lg:text-sm">نظام إدارة الطلبات</p>
        </div>
        ${t?`
          <button class="sidebar-close lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 transition-colors duration-200 ml-auto" id="sidebar-close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        `:""}
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
        <a class="sidebar-link text-sm lg:text-base ${window.location.pathname.includes("index")||window.location.pathname==="/"?"sidebar-link-active":""}" href="index.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
            </svg>
          </div>
          <span class="sidebar-link-text">Dash board</span>
          ${window.location.pathname.includes("index")||window.location.pathname==="/"?`
            <div class="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
          `:""}
        </a>

        <a class="sidebar-link text-sm lg:text-base ${window.location.pathname.includes("calendar")?"sidebar-link-active":""}" href="calendar.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-emerald/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="sidebar-link-text">التقويم</span>
          ${window.location.pathname.includes("calendar")?`
            <div class="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></div>
          `:""}
        </a>

        <a class="sidebar-link text-sm lg:text-base ${window.location.pathname.includes("orders")?"sidebar-link-active":""}" href="orders.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-emerald/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <span class="sidebar-link-text">إدارة الطلبات</span>
          ${window.location.pathname.includes("orders")?`
            <div class="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></div>
          `:""}
        </a>

        <a class="sidebar-link text-sm lg:text-base ${window.location.hash.includes("#attendance")?"sidebar-link-active":""}" href="#attendance">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-emerald/20 to-accent-cyan/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <span class="sidebar-link-text">إدارة العمال</span>
          ${window.location.hash.includes("#attendance")?`
            <div class="w-2 h-2 bg-accent-emerald rounded-full animate-pulse"></div>
          `:""}
        </a>

        <a class="sidebar-link text-sm lg:text-base ${window.location.pathname.includes("clients")?"sidebar-link-active":""}" href="clients.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-amber/20 to-accent-pink/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
          </div>
          <span class="sidebar-link-text">إدارة العملاء</span>
          ${window.location.pathname.includes("clients")?`
            <div class="w-2 h-2 bg-accent-amber rounded-full animate-pulse"></div>
          `:""}
        </a>

        <a class="sidebar-link text-sm lg:text-base ${window.location.pathname.includes("chalets")?"sidebar-link-active":""}" href="chalets.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <span class="sidebar-link-text">إدارة الشاليهات</span>
          ${window.location.pathname.includes("chalets")?`
            <div class="w-2 h-2 bg-accent-purple rounded-full animate-pulse"></div>
          `:""}
        </a>

        <a class="sidebar-link text-sm lg:text-base ${window.location.pathname.includes("transactions")?"sidebar-link-active":""}" href="transactions.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-amber/20 to-accent-pink/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"/>
            </svg>
          </div>
          <span class="sidebar-link-text">المالية</span>
          ${window.location.pathname.includes("transactions")?`
            <div class="w-2 h-2 bg-accent-amber rounded-full animate-pulse"></div>
          `:""}
        </a>

        <a class="sidebar-link text-sm lg:text-base ${window.location.pathname.includes("analytics")?"sidebar-link-active":""}" href="analytics.html">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-emerald/20 to-accent-cyan/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <span class="sidebar-link-text">التحليلات</span>
          ${window.location.pathname.includes("analytics")?`
            <div class="w-2 h-2 bg-accent-emerald rounded-full animate-pulse"></div>
          `:""}
        </a>
      </nav>

      <!-- User Info & Logout -->
      <div class="p-3 lg:p-4 border-t border-slate-700/50 space-y-2 lg:space-y-3">
        <div class="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg bg-slate-800/50">
          <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg flex items-center justify-center text-white font-semibold text-xs lg:text-sm flex-shrink-0">
            ${x.getToken()?x.getUserName().charAt(0).toUpperCase():"?"}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-slate-50 font-medium text-xs lg:text-sm truncate">${x.getUserName()}</p>
            <p class="text-slate-400 text-xs">متصل الآن</p>
          </div>
        </div>

        <button id="sidebar-logout" class="sidebar-logout-button text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full text-sm lg:text-base">
          <div class="w-6 lg:w-8 h-6 lg:h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 lg:w-5 h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </div>
          <span class="sidebar-link-text">تسجيل الخروج</span>
        </button>
      </div>
    ${t?`
      <div class="sidebar-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden opacity-0 pointer-events-none transition-opacity duration-300" id="sidebar-overlay"></div>
    `:""}
  `;const n=e.querySelector("#sidebar-logout");n==null||n.addEventListener("click",()=>{x.logout()});const a=()=>{var r;const s=window.innerWidth<1024;e.classList.toggle("collapsed",s),s||(e.classList.remove("open"),(r=document.querySelector(".app-shell"))==null||r.classList.remove("sidebar-open"))};window.addEventListener("resize",a);let l=s=>{};if(t){const s=e,r=e.querySelector("#sidebar-overlay"),i=e.querySelector("#sidebar-close"),o=document.querySelector(".app-shell");l=c=>{c?(s==null||s.classList.remove("collapsed"),s==null||s.classList.add("open"),o==null||o.classList.add("sidebar-open"),r==null||r.classList.remove("opacity-0","pointer-events-none"),r==null||r.classList.add("opacity-100","pointer-events-auto")):(s==null||s.classList.add("collapsed"),s==null||s.classList.remove("open"),o==null||o.classList.remove("sidebar-open"),r==null||r.classList.remove("opacity-100","pointer-events-auto"),r==null||r.classList.add("opacity-0","pointer-events-none"))},r==null||r.addEventListener("click",()=>l(!1)),i==null||i.addEventListener("click",()=>l(!1)),e.querySelectorAll(".sidebar-link").forEach(c=>{c.addEventListener("click",()=>l(!1))})}window.toggleSidebar=l}export{S as a,pe as b,fe as c,be as d,he as e,de as f,J as g,T as r,me as s};
