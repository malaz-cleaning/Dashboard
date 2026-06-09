import{a as J}from"./toast-DJo7gZdP.js";/* empty css               */import"./main-CvJC25iB.js";import"./common-Ck034jIw.js";import{a as T,b as Q,s as W}from"./sidebar-jGvh9J_S.js";const d=document.getElementById("page-content"),B={pending:{label:"معلقة",color:"bg-amber-500/10 text-amber-400 border-amber-500/30",dot:"bg-amber-400"},in_progress:{label:"قيد التنفيذ",color:"bg-sky-500/10 text-sky-400 border-sky-500/30",dot:"bg-sky-400"},done_unpaid:{label:"تمت ولم يُدفع",color:"bg-orange-500/10 text-orange-400 border-orange-500/30",dot:"bg-orange-400"},done_paid:{label:"تمت ودُفع",color:"bg-emerald-500/10 text-emerald-400 border-emerald-500/30",dot:"bg-emerald-400"},cancelled:{label:"ملغاة",color:"bg-rose-500/10 text-rose-400 border-rose-500/30",dot:"bg-rose-400"}},E=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],X=["ح","ن","ث","ر","خ","ج","س"],K=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],S={chalet:'<svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',client:'<svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',calendar:'<svg class="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',revenue:'<svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',statsOrders:'<svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',statsPending:'<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',statsDone:'<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'};function H(e){return"EGP "+Number(e||0).toLocaleString("ar-EG")}function g(e){if(!e)return null;try{return new Date(e).toISOString().split("T")[0]}catch{return null}}function Z(e){const i=B[e]||{label:e,color:"bg-slate-850 text-slate-400 border-slate-700",dot:"bg-slate-500"};return`<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${i.color}">
    <span class="w-1.5 h-1.5 rounded-full ${i.dot}"></span>${i.label}
  </span>`}function ee(e,i,$,b){const u=new Date(e,i,1).getDay(),o=new Date(e,i+1,0).getDate(),r=g(new Date().toISOString());let p="";for(let f=0;f<u;f++)p+='<div class="aspect-square rounded-xl bg-slate-900/10 border border-transparent"></div>';for(let f=1;f<=o;f++){const D=`${e}-${String(i+1).padStart(2,"0")}-${String(f).padStart(2,"0")}`,w=$[D]||[],m=D===r,l=D===b,a=w.some(h=>h.status==="pending"||h.status==="in_progress"),t=w.some(h=>h.status==="done_paid"||h.status==="done_unpaid"),x=w.some(h=>h.status==="cancelled");let n="bg-slate-955/20 border-slate-900/30 text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-900/30";w.length>0&&(n="bg-slate-800/80 border-blue-500/20 text-slate-200 shadow-md shadow-black/10 hover:bg-slate-750 hover:border-blue-500/40 hover:text-slate-100"),m&&(n="bg-blue-600/10 border-blue-500/40 text-blue-400 font-bold shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20"),l&&(n="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 border-blue-400 text-white font-extrabold scale-[1.03] shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/30");const _=w.length?`
      <div class="flex gap-0.5 mt-1 justify-center flex-wrap max-w-full">
        ${a?`<span class="w-1.5 h-1.5 rounded-full bg-amber-400 ${l?"ring-1 ring-white":""}"></span>`:""}
        ${t?`<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 ${l?"ring-1 ring-white":""}"></span>`:""}
        ${x?`<span class="w-1.5 h-1.5 rounded-full bg-rose-400 ${l?"ring-1 ring-white":""}"></span>`:""}
      </div>`:"";p+=`
      <button class="calendar-day aspect-square rounded-2xl border cursor-pointer transition-all duration-350 flex flex-col items-center justify-center relative active:scale-90 touch-manipulation ${n}"
           data-date="${D}">
        <span class="text-xs md:text-sm font-extrabold">${f}</span>
        ${_}
        ${w.length>0?`
          <span class="absolute top-1 left-1.5 text-[8.5px] px-1.5 py-0.25 rounded-md font-extrabold font-mono shadow-sm ${l?"bg-white/20 text-white border border-white/10":"bg-blue-500/10 text-blue-450 border border-blue-500/20"}">${w.length}</span>`:""}
      </button>`}return`
    <div class="grid grid-cols-7 gap-1 md:gap-1.5">
      ${X.map(f=>`<div class="text-center text-[10px] md:text-xs font-bold text-slate-500 py-1.5">${f}</div>`).join("")}
      ${p}
    </div>`}function te(e,i,$){const b=i.find(r=>r.client_id===e.client_id)||{},u=$.find(r=>r.chalet_id===e.chalet_id)||{},o=e.scheduled_at||e.created_at||"-";return`
    <div class="group relative bg-slate-900/80 border border-slate-850/80 rounded-2xl p-4 hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-300 active:scale-[0.99] touch-manipulation mb-2">
      <div class="absolute right-0 top-0 bottom-0 w-1.5 rounded-r-2xl ${(B[e.status]||B.pending).dot} opacity-80"></div>
      
      <div class="flex items-start justify-between gap-3 pr-2">
        <div class="flex-1 min-w-0 space-y-2">
          <!-- Card Info Row -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[9px] font-bold font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/40">#${e.order_id}</span>
            ${Z(e.status)}
          </div>
          
          <!-- Chalet Row -->
          <div class="flex items-center gap-2 mt-1">
            ${S.chalet}
            <span class="text-slate-100 font-extrabold text-xs md:text-sm truncate leading-tight">${u.chalet_name||"غير محدد"}</span>
            <button type="button" class="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition" data-action="show-chalet-info" data-chalet-id="${u.chalet_id}" aria-label="تفاصيل الشاليه">i</button>
          </div>
          
          <!-- Client & Time Row -->
          <div class="flex items-center gap-3 text-[10px] md:text-xs text-slate-400 mt-1">
            <div class="flex items-center gap-1 min-w-0">
              ${S.client}
              <span class="truncate">${b.name||"غير محدد"}</span>
            </div>
            <div class="flex items-center gap-1 shrink-0 font-mono">
              ${S.calendar}
              <span>${o}</span>
            </div>
          </div>
        </div>
        
        <!-- Price Row -->
        <div class="text-left shrink-0 flex flex-col items-end justify-between self-stretch">
          <div class="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
            <p class="text-emerald-400 font-extrabold text-xs md:text-sm">${H(e.price)}</p>
          </div>
          ${e.deposit>0?`
            <p class="text-slate-500 text-[9px] mt-2">مقدم: <span class="text-emerald-500/90 font-bold">${H(e.deposit)}</span></p>
          `:""}
        </div>
      </div>
    </div>`}async function N(){if(!J.isAuthenticated()){window.location.href="login.html";return}if(d){d.classList.add("md:h-[calc(100vh-70px)]","md:overflow-hidden"),d.innerHTML=`
    <div class="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6 h-full flex flex-col justify-center">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-50 animate-pulse">التقويم الفاخر</h1>
          <p class="text-slate-400 text-sm mt-1 animate-pulse">شريط التحميل التفاعلي...</p>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center gap-3 py-20 text-slate-500 flex-1">
        <div class="w-8 h-8 rounded-full border-2 border-t-blue-500 border-slate-700 animate-spin"></div>
        <span class="text-sm font-semibold animate-pulse">جاري إعداد لوحة التحكم...</span>
      </div>
    </div>`;try{let f=function(l,a){const t={};return e.forEach(x=>{const n=g(x.scheduled_at||x.created_at);if(!n)return;const _=new Date(n);_.getFullYear()===l&&_.getMonth()===a&&(t[n]=t[n]||[],t[n].push(x))}),t},D=function(l,a){const t=e.filter(c=>{const j=g(c.scheduled_at||c.created_at);if(!j)return!1;const C=new Date(j);return C.getFullYear()===l&&C.getMonth()===a}),x=t.length,n=t.filter(c=>c.status==="pending"||c.status==="in_progress").length,_=t.filter(c=>c.status==="done_paid"||c.status==="done_unpaid").length,h=t.filter(c=>c.status==="done_paid").reduce((c,j)=>c+Number(j.price||0),0);return{total:x,pending:n,completed:_,revenue:h}},w=function(){if(r)return e.filter(l=>!(g(l.scheduled_at||l.created_at)!==r||y!=="all"&&l.status!==y)).sort((l,a)=>(l.order_id||"").localeCompare(a.order_id||""));{const l=g(b.toISOString());return e.filter(a=>{const t=g(a.scheduled_at||a.created_at);return!t||y!=="all"&&a.status!==y?!1:t>=l}).sort((a,t)=>{const x=g(a.scheduled_at||a.created_at)||"",n=g(t.scheduled_at||t.created_at)||"";return x.localeCompare(n)})}},m=function(){var F,q,R,z,G,P;const l=f(u,o),a=w(),t=D(u,o),x=g(b.toISOString()),n=new Date(x),h=`${K[n.getDay()]}، ${b.getDate()} ${E[b.getMonth()]} ${b.getFullYear()}`,j=[{key:"all",label:"الكل"},{key:"pending",label:"معلقة"},{key:"in_progress",label:"قيد التنفيذ"},{key:"done_unpaid",label:"غير مدفوع"},{key:"done_paid",label:"مدفوع"},{key:"cancelled",label:"ملغاة"}].map(s=>`<button class="filter-pill shrink-0 px-3.5 py-1.5 rounded-full text-[10px] md:text-xs font-bold border transition-all duration-200 active:scale-95 ${y===s.key?"bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/25 scale-[1.03]":"bg-slate-800/60 text-slate-400 border-slate-700/60 hover:border-slate-600"}" data-filter="${s.key}">${s.label}</button>`).join("");let C="الطلبات القادمة",I="جميع الطلبات المستقبلية مجدولة بالتاريخ",A=!1;if(r){const s=new Date(r);C=`طلبات يوم ${s.getDate()} ${E[s.getMonth()]}`,I="الطلبات المجدولة لهذا التاريخ تحديداً",A=!0}d.innerHTML=`
        <div class="p-3 md:p-5 max-w-[1500px] mx-auto space-y-4 md:space-y-5 h-full md:max-h-full flex flex-col md:overflow-hidden">

          <!-- Header Section -->
          <div class="flex items-center justify-between gap-4 flex-wrap shrink-0">
            <div>
              <h1 class="text-xl md:text-2xl font-extrabold text-slate-50 tracking-tight flex items-center gap-2">
                <span>التقويم التفاعلي</span>
                <span class="text-xs font-semibold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/25 rounded-md">لوحة تحكم ذكية</span>
              </h1>
              <p class="text-slate-400 text-[10px] md:text-xs mt-0.5">جدولة وعرض وتنظيم تفاصيل تنظيف الوحدات بكل سهولة</p>
            </div>
            
            <div class="flex items-center gap-3">
              <button id="add-order-btn-cal" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-blue-600/15 transition-all duration-200 active:scale-95 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7-7H5"/></svg>
                إضافة طلب
              </button>
              <div class="hidden sm:block text-left bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-2xl px-4 py-1.5">
                <p class="text-slate-500 text-[9px] font-bold">تاريخ اليوم</p>
                <p class="text-slate-200 font-extrabold text-xs mt-0.5">${h}</p>
              </div>
            </div>
          </div>

          <!-- Dynamic Monthly Statistics Strip -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            <div class="bg-slate-900/50 border border-slate-850/60 rounded-2xl p-3.5 flex items-center gap-3">
              <div class="p-2 rounded-xl bg-indigo-500/10 shrink-0">${S.statsOrders}</div>
              <div>
                <p class="text-slate-500 text-[10px] font-bold">طلبات الشهر</p>
                <p class="text-slate-100 font-extrabold text-sm md:text-base mt-0.5">${t.total}</p>
              </div>
            </div>
            
            <div class="bg-slate-900/50 border border-slate-850/60 rounded-2xl p-3.5 flex items-center gap-3">
              <div class="p-2 rounded-xl bg-amber-500/10 shrink-0">${S.statsPending}</div>
              <div>
                <p class="text-slate-500 text-[10px] font-bold">معلق / قيد التنفيذ</p>
                <p class="text-amber-400 font-extrabold text-sm md:text-base mt-0.5">${t.pending}</p>
              </div>
            </div>

            <div class="bg-slate-900/50 border border-slate-850/60 rounded-2xl p-3.5 flex items-center gap-3">
              <div class="p-2 rounded-xl bg-emerald-500/10 shrink-0">${S.statsDone}</div>
              <div>
                <p class="text-slate-500 text-[10px] font-bold">طلبات مكتملة</p>
                <p class="text-emerald-400 font-extrabold text-sm md:text-base mt-0.5">${t.completed}</p>
              </div>
            </div>

            <div class="bg-slate-900/50 border border-slate-850/60 rounded-2xl p-3.5 flex items-center gap-3">
              <div class="p-2 rounded-xl bg-emerald-500/10 shrink-0">${S.revenue}</div>
              <div>
                <p class="text-slate-500 text-[10px] font-bold">إيرادات مكتملة</p>
                <p class="text-slate-100 font-extrabold text-xs md:text-sm mt-0.5 text-emerald-300 font-mono">${H(t.revenue)}</p>
              </div>
            </div>
          </div>

          <!-- Mobile Segmented Controller -->
          <div class="flex md:hidden p-1 bg-slate-900/80 backdrop-blur-md border border-slate-850 rounded-2xl gap-1 shadow-inner shadow-black/20 shrink-0">
            <button id="tab-month" class="flex-1 py-3 rounded-xl text-xs font-extrabold transition-all duration-300 ${p==="month"?"bg-slate-800 text-blue-400 shadow-md shadow-black/20":"text-slate-400 hover:text-slate-200"}">التقويم الشهري</button>
            <button id="tab-timeline" class="flex-1 py-3 rounded-xl text-xs font-extrabold transition-all duration-300 ${p==="timeline"?"bg-slate-800 text-blue-400 shadow-md shadow-black/20":"text-slate-400 hover:text-slate-200"}">الطلبات القادمة</button>
          </div>

          <!-- Two-column main view -->
          <div class="flex-1 grid grid-cols-1 md:grid-cols-[1fr_340px] xl:grid-cols-[1fr_400px] gap-5 md:overflow-hidden min-h-0">

            <!-- LEFT: Monthly Grid (Hidden on mobile if tab-timeline is active) -->
            <div id="section-month" class="md:h-full md:flex md:flex-col md:overflow-hidden gap-4 ${p==="month"?"flex flex-col":"hidden md:flex"}">

              <div class="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800/80 p-4 shadow-lg flex-1 flex flex-col justify-center">
                <!-- Month control -->
                <div class="flex items-center justify-between mb-5 shrink-0">
                  <button id="prev-month" class="p-2 rounded-xl bg-slate-855 border border-slate-705 text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all active:scale-90">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </button>
                  <div class="text-center select-none">
                    <h2 class="text-slate-100 font-extrabold text-sm md:text-base">${E[o]}</h2>
                    <p class="text-slate-500 font-extrabold text-[10px] mt-0.5">${u}</p>
                  </div>
                  <button id="next-month" class="p-2 rounded-xl bg-slate-855 border border-slate-705 text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all active:scale-90">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                </div>

                <!-- Calendar month matrix -->
                <div class="flex-1 flex flex-col justify-center min-h-[260px]">
                  ${ee(u,o,l,r)}
                </div>

                <!-- Grid Legend Hub -->
                <div class="mt-4 pt-3.5 border-t border-slate-850/60 flex items-center justify-center gap-3.5 flex-wrap text-[9px] md:text-[10px] text-slate-500 font-bold shrink-0">
                  <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>معلقة / تنفيذ</span>
                  <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>تمت ودفع / لم يدفع</span>
                  <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>ملغاة</span>
                </div>
              </div>

            </div>

            <!-- RIGHT: Unified Feed View -->
            <div id="section-timeline" class="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800/80 p-4 shadow-lg flex flex-col md:h-full md:overflow-hidden ${p==="timeline"?"flex flex-col":"hidden md:flex"}">
              
              <!-- Smart Header -->
              <div class="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800/60 shrink-0">
                <div>
                  <h3 id="feed-title" class="text-slate-100 font-extrabold text-sm">${C}</h3>
                  <p id="feed-subtitle" class="text-slate-500 text-[10px] mt-0.5 font-bold">${I}</p>
                </div>
                ${A?`
                  <button id="reset-feed" class="text-[9px] md:text-[10px] font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-xl transition-all hover:bg-blue-500/20 hover:text-blue-300 active:scale-90 shrink-0">
                    عرض الكل
                  </button>
                `:""}
              </div>

              <!-- Horizontally scrollable status pills -->
              <div class="flex gap-1.5 mb-3.5 overflow-x-auto pb-2 no-scrollbar shrink-0">
                ${j}
              </div>

              <!-- Scrollable list -->
              <div class="flex-1 overflow-y-auto space-y-1 pr-0.5 no-scrollbar scroll-smooth">
                ${a.length===0?'<div class="text-center py-20 text-slate-500 text-xs">لا توجد طلبات متوافقة في هذا القسم</div>':(()=>{let s=null;return a.map(v=>{const M=g(v.scheduled_at||v.created_at)||"-",k=new Date(M),O=M===x,L=k.getDate(),V=E[k.getMonth()],U=K[k.getDay()];let Y="";return!r&&M!==s&&(s=M,Y=`
                            <div class="flex items-center gap-3 mt-3.5 mb-2 first:mt-0">
                              <div class="shrink-0 text-center w-10 bg-slate-800/50 px-1 py-1 rounded-xl border border-slate-750">
                                <div class="text-xs font-extrabold ${O?"text-blue-400":"text-slate-200"}">${L}</div>
                                <div class="text-[8px] text-slate-500 font-semibold leading-none mt-0.5">${V}</div>
                              </div>
                              <div class="flex-1 h-[1px] bg-slate-850"></div>
                              ${O?'<span class="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-full shrink-0 font-bold">اليوم</span>':`<span class="text-[9px] text-slate-500 font-bold shrink-0">${U}</span>`}
                            </div>`),Y+te(v,i,$)}).join("")})()}
              </div>
            </div>

          </div>
        </div>`,(F=d.querySelector("#add-order-btn-cal"))==null||F.addEventListener("click",async()=>{try{await Q(i,$,async()=>{N()})}catch(s){console.error("Failed to launch add order modal:",s)}}),(q=d.querySelector("#reset-feed"))==null||q.addEventListener("click",()=>{r=null,m()}),(R=d.querySelector("#tab-month"))==null||R.addEventListener("click",()=>{p="month",m()}),(z=d.querySelector("#tab-timeline"))==null||z.addEventListener("click",()=>{p="timeline",m()}),(G=d.querySelector("#prev-month"))==null||G.addEventListener("click",()=>{o--,o<0&&(o=11,u--),m()}),(P=d.querySelector("#next-month"))==null||P.addEventListener("click",()=>{o++,o>11&&(o=0,u++),m()}),d.querySelectorAll(".calendar-day").forEach(s=>{s.addEventListener("click",()=>{const v=s.dataset.date;r===v?r=null:(r=v,p="timeline"),m()})}),d.querySelectorAll(".filter-pill").forEach(s=>{s.addEventListener("click",()=>{y=s.dataset.filter,m()})}),d.addEventListener("click",s=>{const v=s.target.closest('button[data-action="show-chalet-info"]');if(!v)return;const M=v.dataset.chaletId;if(!M)return;const k=$.find(L=>L.chalet_id===M),O=k?i.find(L=>L.client_id===k.client_id)||{}:{};k&&W(k,O)})};const[e,i,$]=await Promise.all([T.getOrders(),T.getClients(),T.getChalets()]),b=new Date;let u=b.getFullYear(),o=b.getMonth(),y="all",r=null,p="month";m()}catch(e){console.error("Error rendering calendar:",e),d.innerHTML=`
      <div class="p-6 max-w-[500px] mx-auto text-center py-20 space-y-4">
        <div class="text-red-500 text-3xl font-extrabold">⚠️</div>
        <h2 class="text-slate-100 font-bold text-lg">فشل تحميل التقويم</h2>
        <p class="text-slate-400 text-sm">يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.</p>
        <button onclick="window.location.reload()" class="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95">إعادة المحاولة</button>
      </div>`}}}window.location.pathname.includes("calendar.html")&&document.addEventListener("DOMContentLoaded",N);
