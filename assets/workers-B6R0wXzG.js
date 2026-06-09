import{a as $}from"./toast-DJo7gZdP.js";/* empty css               */import"./main-CvJC25iB.js";import"./app-BxrMDxTZ.js";import{a as k}from"./sidebar-BYx7eQyN.js";import"./orders-CqE60mXO.js";import"./clients-CRC5Ldra.js";import"./chalets-Bruj8esw.js";import"./analytics-BPojQq6G.js";const v=10,c=31;let d="july",o=h(),N=null;function h(){return{month:d,updated_at:"",workers:Array.from({length:v},(n,t)=>({id:t+1,name:"",notes:"",attendance:Array.from({length:c},()=>"")})),summaryNotes:Array.from({length:c},()=>({present:"",absent:""}))}}function E(n){if(!n||!Array.isArray(n.workers))return h();const t=Array.from({length:v},(a,r)=>{const s=n.workers[r]||{},l=Array.isArray(s.attendance)?s.attendance.slice(0,c).concat(Array.from({length:Math.max(0,c-s.attendance.length)},()=>"")):Array.from({length:c},()=>"");return{id:r+1,name:s.name||"",notes:s.notes||"",attendance:l}}),e=Array.from({length:c},(a,r)=>{const s=n.summaryNotes&&n.summaryNotes[r]||{};return{present:s.present||"",absent:s.absent||""}});return{month:n.month||d,updated_at:n.updated_at||"",workers:t,summaryNotes:e}}function y(n){return String(n||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function C(){var t,e;const n=document.getElementById("page-title");if(n){const a=d==="august"?"أغسطس":"يوليو";n.textContent=`📋 جدول حضور وغياب العمال — ${a} ٢٠٢٦ · الساحل الشمالي`}(t=document.getElementById("month-july"))==null||t.classList.toggle("active",d==="july"),(e=document.getElementById("month-august"))==null||e.classList.toggle("active",d==="august")}function p(){const n=document.getElementById("hdr"),t=document.getElementById("tbd");if(!(!n||!t)){n.innerHTML="",n.appendChild(m("#","th-num")),n.appendChild(m("اسم العامل","th-name"));for(let e=1;e<=c;e++)n.appendChild(m(e,"th-date"));n.appendChild(m("ملاحظات","th-notes")),t.innerHTML=o.workers.map((e,a)=>{const r=e.attendance.map((s,l)=>`
            <td class="td-attend">
              <button type="button" class="${s==="ok"?"btn-att ok":s==="no"?"btn-att no":"btn-att"}" data-action="toggle" data-worker="${a}" data-day="${l}">${s==="ok"?"✔":s==="no"?"✖":""}</button>
            </td>
          `).join("");return`
        <tr>
          <td class="td-num">${e.id}</td>
          <td class="td-name">
            <input type="text" data-field="name" data-worker="${a}" value="${y(e.name)}" placeholder="اسم العامل" />
          </td>
          ${r}
          <td class="td-notes">
            <input type="text" data-field="notes" data-worker="${a}" value="${y(e.notes)}" placeholder="ملاحظات" />
          </td>
        </tr>
      `}).join("")}}const I=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];function A(n){const t=d==="august"?7:6,e=new Date(2026,t,n+1);return I[e.getDay()]}function g(){const n=document.getElementById("summary-hdr"),t=document.getElementById("summary-tbd");if(!n||!t)return;n.innerHTML="",n.appendChild(m("","th-num")),n.appendChild(m("اليوم","th-name"));for(let r=1;r<=c;r++){const s=document.createElement("th");s.className="th-date",s.innerHTML=`
      <span class="date-label">${r}</span>
      <span class="day-label">${A(r-1)}</span>
    `,n.appendChild(s)}const e=o.summaryNotes.map((r,s)=>`
        <td class="summary-cell">
          <div class="summary-pill ok">✔ ${o.workers.reduce((u,i)=>u+(i.attendance[s]==="ok"?1:0),0)}</div>
          <input type="text" class="summary-input" placeholder="ملاحظة حاضر" data-summary-day="${s}" data-summary-type="present" value="${y(r.present)}" />
        </td>
      `).join(""),a=o.summaryNotes.map((r,s)=>`
        <td class="summary-cell">
          <div class="summary-pill no">✖ ${o.workers.reduce((u,i)=>u+(i.attendance[s]==="no"?1:0),0)}</div>
          <input type="text" class="summary-input" placeholder="ملاحظة غائب" data-summary-day="${s}" data-summary-type="absent" value="${y(r.absent)}" />
        </td>
      `).join("");t.innerHTML=`
    <tr>
      <td class="td-num"></td>
      <td class="td-name">حضور</td>
      ${e}
    </tr>
    <tr>
      <td class="td-num"></td>
      <td class="td-name">غياب</td>
      ${a}
    </tr>
  `}function m(n,t){const e=document.createElement("th");return e.className=t,e.textContent=n,e}function b(){clearTimeout(N),N=setTimeout(()=>{w(!0)},700)}function B(n){const t=n.target.closest('[data-action="toggle"]');if(!t)return;const e=Number(t.dataset.worker),a=Number(t.dataset.day);Number.isNaN(e)||Number.isNaN(a)||(S(e,a),b())}function L(n){const t=n.target;if(!t.dataset.field||t.dataset.worker===void 0)return;const e=Number(t.dataset.worker),a=t.dataset.field;Number.isNaN(e)||(o.workers[e][a]=t.value||"",b())}function T(n){const t=n.target;if(!t.dataset.summaryDay||!t.dataset.summaryType)return;const e=Number(t.dataset.summaryDay),a=t.dataset.summaryType;Number.isNaN(e)||!["present","absent"].includes(a)||(o.summaryNotes[e][a]=t.value||"",b())}function S(n,t){const e=o.workers[n];if(!e)return;const a=e.attendance[t]||"";e.attendance[t]=a==="ok"?"no":a==="no"?"":"ok",p(),g()}async function w(n=!1){const t=document.getElementById("save-btn");!n&&t&&(t.disabled=!0);const e=document.getElementById("syncMsg");e&&(e.textContent=n?"جارٍ الحفظ تلقائياً...":"جارٍ الحفظ...",e.className="sync-msg loading");try{const a={month:d,updated_at:new Date().toISOString().split("T")[0],workers:o.workers,summaryNotes:o.summaryNotes},r=await k.saveWorkerAttendance(d,a);o=E(r),p(),g(),e&&(e.textContent="✔ تم حفظ البيانات بنجاح",e.className="sync-msg ok")}catch(a){console.error("Save error:",a),e&&(e.textContent="✖ فشل حفظ البيانات",e.className="sync-msg err")}finally{!n&&t&&(t.disabled=!1)}}async function f(n){d=n==="august"?"august":"july",C();const t=document.getElementById("syncMsg");t&&(t.textContent="جارٍ التحميل...",t.className="sync-msg loading");try{const e=await k.getWorkerAttendance(d);o=E(e),p(),g(),t&&(t.textContent=o.updated_at?`آخر حفظ: ${o.updated_at}`:"لم يتم الحفظ بعد",t.className="sync-msg")}catch(e){console.error("Load error:",e),o=h(),p(),g(),t&&(t.textContent="✖ فشل تحميل البيانات",t.className="sync-msg err")}}function x(){var n,t,e,a,r,s;if(!$.isAuthenticated()){window.location.href="login.html";return}(n=document.getElementById("month-july"))==null||n.addEventListener("click",()=>f("july")),(t=document.getElementById("month-august"))==null||t.addEventListener("click",()=>f("august")),(e=document.getElementById("save-btn"))==null||e.addEventListener("click",()=>w(!1)),(a=document.getElementById("tbl"))==null||a.addEventListener("click",B),(r=document.getElementById("tbl"))==null||r.addEventListener("input",L),(s=document.getElementById("summary-table"))==null||s.addEventListener("input",T),C(),f(d)}document.addEventListener("DOMContentLoaded",x);
