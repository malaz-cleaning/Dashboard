import{a as m}from"./auth-CC3zXfFT.js";const T={clients:[],chalets:[],orders:[]},_="malaz-cleaning",S=`https://${_}-default-rtdb.firebaseio.com`,g={clients:null,chalets:null,orders:null,transactions:null};async function c(e,t="GET",n=null){try{const i=m.getToken();let r=`${S}${e}.json`;i&&(r+=`?auth=${i}`);const a={method:t,headers:{"Content-Type":"application/json"}};n&&(a.body=JSON.stringify(n));const s=await fetch(r,a);if(!s.ok)throw s.status===401?(m.logout(),new Error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى")):new Error(`Firebase error: ${s.statusText}`);return s.json()}catch(i){throw console.error("Firebase Error:",i),i}}async function p(e){if(g[e])return g[e];try{const t=await c(`/${e}`);return t?(g[e]=Object.values(t).filter(n=>!n.is_deleted),g[e]):(g[e]=[],[])}catch(t){return console.warn(`Failed to fetch ${e} from Firebase, using local state:`,t),g[e]=T[e]||[],g[e]}}function h(...e){e.forEach(t=>{g[t]!==void 0&&(g[t]=null)})}async function k(e){try{return await c(`/${e}`)||{}}catch(t){return console.warn(`Failed to fetch raw ${e} from Firebase:`,t),{}}}function y(e,t,n=3){const r=Object.keys(e||{}).filter(a=>typeof a=="string").reduce((a,s)=>{if(!s.startsWith(t))return a;const l=parseInt(s.slice(t.length),10);return Number.isNaN(l)?a:Math.max(a,l)},0);return`${t}${String(r+1).padStart(n,"0")}`}const j={async getClients(){return p("clients")},async getChalets(){return p("chalets")},async getOrders(){return p("orders")},async addClient({type:e,name:t,phone:n}){const i=await p("clients"),r=`CL${String(i.length+1).padStart(3,"0")}`,a={client_id:r,type:e,name:t,phone:n,created_at:new Date().toISOString().split("T")[0],is_deleted:!1};return await c(`/clients/${r}`,"PUT",a),h("clients"),a},async addChalet({client_id:e,chalet_name:t,location:n,details:i}){const r=await p("chalets"),a=`CH${String(r.length+1).padStart(3,"0")}`,s={chalet_id:a,chalet_code:a,client_id:e,chalet_name:t,location:n,details:i,created_at:new Date().toISOString().split("T")[0],is_deleted:!1};return await c(`/chalets/${a}`,"PUT",s),h("chalets"),s},async addOrder({client_id:e,chalet_id:t,status:n,price:i,notes:r,created_at:a,scheduled_at:s="",deposit:l=0,created_by:d=""}){const w=await k("orders"),b=y(w,"OR",3),u={order_id:b,client_id:e,chalet_id:t,status:n,price:Number(i),notes:r,created_at:a,scheduled_at:s||"",deposit:Number(l||0),created_by:d||"",completed_at:n.includes("done")?a:"",is_deleted:!1};await c(`/orders/${b}`,"PUT",u),h("orders");try{if(u.deposit>0&&await this.addTransaction({type:"income",amount:Number(u.deposit),date:u.created_at,details:`دفعة مقدمة من الطلب ${b}`,order_id:b,created_by:u.created_by||""}),u.status==="done_paid"){const o=Number(u.price||0)-Number(u.deposit||0);o>0&&await this.addTransaction({type:"income",amount:o,date:u.created_at,details:`باقي الدفع من الطلب ${b}`,order_id:b,created_by:u.created_by||""})}}catch(o){console.error("Failed to create income transaction for order:",o)}return u},async updateClient(e,t){return await c(`/clients/${e}`,"PATCH",t),h("clients"),(await p("clients")).find(i=>i.client_id===e)},async updateChalet(e,t){return await c(`/chalets/${e}`,"PATCH",t),h("chalets"),(await p("chalets")).find(i=>i.chalet_id===e)},async updateOrder(e,t){const i=(await p("orders")).find(s=>s.order_id===e)||{};if(t.status){const s=new Date().toISOString().split("T")[0];t.status==="done_paid"||t.status==="done_unpaid"||t.status==="cancelled"?t.completed_at=s:(t.status==="pending"||t.status==="in_progress")&&(t.completed_at="")}await c(`/orders/${e}`,"PATCH",t),h("orders");const a=(await p("orders")).find(s=>s.order_id===e);try{const s=i.status,l=t.status||(a==null?void 0:a.status),d=Number(t.price??(a==null?void 0:a.price)??0),w=Number(t.deposit??(a==null?void 0:a.deposit)??0),u=(await this.getTransactions()).filter(o=>!o.is_deleted&&o.order_id===e&&o.type==="income").reduce((o,v)=>o+Number(v.amount||0),0);if(w>0&&w>Number(i.deposit||0)){const o=w-Number(i.deposit||0);o>0&&await this.addTransaction({type:"income",amount:o,date:new Date().toISOString().split("T")[0],details:`زيادة الدفعة من الطلب ${e}`,order_id:e,created_by:t.created_by||(a==null?void 0:a.created_by)||""})}if(s!=="done_paid"&&l==="done_paid"){const v=(await this.getTransactions()).filter(f=>!f.is_deleted&&f.order_id===e&&f.type==="income").reduce((f,$)=>f+Number($.amount||0),0),x=d-v;if(x>0){const f=t.created_by||(a==null?void 0:a.created_by)||"";await this.addTransaction({type:"income",amount:x,date:new Date().toISOString().split("T")[0],details:`باقي الدفع من الطلب ${e}`,order_id:e,created_by:f})}}}catch(s){console.error("Failed to create income transaction for updated order:",s)}return a},async deleteClient(e){const t=await c(`/clients/${e}`,"PATCH",{is_deleted:!0});return h("clients"),t},async deleteChalet(e){const t=await c(`/chalets/${e}`,"PATCH",{is_deleted:!0});return h("chalets"),t},async deleteOrder(e){const t=await c(`/orders/${e}`,"PATCH",{is_deleted:!0});return h("orders"),t},async getTransactions(){return p("transactions")},async addTransaction({type:e,amount:t,date:n,details:i="",order_id:r="",created_by:a=""}){const s=await k("transactions"),l=y(s,"TR",4),d={transaction_id:l,type:e,amount:Number(t||0),date:n||new Date().toISOString().split("T")[0],details:i||"",order_id:r||"",created_by:a||"",created_at:new Date().toISOString(),is_deleted:!1};return await c(`/transactions/${l}`,"PUT",d),h("transactions"),d},async updateTransaction(e,t){return await c(`/transactions/${e}`,"PATCH",t),h("transactions"),(await p("transactions")).find(i=>i.transaction_id===e)},async deleteTransaction(e){const t=await c(`/transactions/${e}`,"PATCH",{is_deleted:!0});return h("transactions"),t}};function L(e){if(!e)return;e.innerHTML=`
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
  `;const t=e.querySelector("#sidebar-toggle");t==null||t.addEventListener("click",()=>{var n;(n=window.toggleSidebar)==null||n.call(window,!0)})}function M(e){if(!e)return;const t=window.innerWidth<=1024;m.isAuthenticated()&&!m.getUserEmail()&&m.updateUserData("admin@malaz.com"),e.classList.add("sidebar"),e.classList.toggle("collapsed",t),e.innerHTML=`
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
            ${m.getToken()?m.getUserName().charAt(0).toUpperCase():"?"}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-slate-50 font-medium text-xs lg:text-sm truncate">${m.getUserName()}</p>
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
  `;const n=e.querySelector("#sidebar-logout");n==null||n.addEventListener("click",()=>{m.logout()});const i=()=>{var s;const a=window.innerWidth<1024;e.classList.toggle("collapsed",a),a||(e.classList.remove("open"),(s=document.querySelector(".app-shell"))==null||s.classList.remove("sidebar-open"))};window.addEventListener("resize",i);let r=a=>{};if(t){const a=e,s=e.querySelector("#sidebar-overlay"),l=e.querySelector("#sidebar-close"),d=document.querySelector(".app-shell");r=w=>{w?(a==null||a.classList.remove("collapsed"),a==null||a.classList.add("open"),d==null||d.classList.add("sidebar-open"),s==null||s.classList.remove("opacity-0","pointer-events-none"),s==null||s.classList.add("opacity-100","pointer-events-auto")):(a==null||a.classList.add("collapsed"),a==null||a.classList.remove("open"),d==null||d.classList.remove("sidebar-open"),s==null||s.classList.remove("opacity-100","pointer-events-auto"),s==null||s.classList.add("opacity-0","pointer-events-none"))},s==null||s.addEventListener("click",()=>r(!1)),l==null||l.addEventListener("click",()=>r(!1))}window.toggleSidebar=r}export{j as a,M as b,L as r};
