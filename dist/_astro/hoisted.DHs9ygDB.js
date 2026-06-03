import"./hoisted.3DXyw1OE.js";const V=`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 6h18"></path>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      <line x1="10" x2="10" y1="11" y2="17"></line>
      <line x1="14" x2="14" y1="11" y2="17"></line>
    </svg>
  `,q=`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 7v6h6"></path>
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.69 3"></path>
    </svg>
  `,H={menos_500:"Menos de 500","500_2000":"500 a 2,000","2000_5000":"2,000 a 5,000",mas_5000:"Más de 5,000",wisp:"Wireless (WISP)",ftth:"Fibra (FTTH)",hibrida:"Híbrida",rsg:"RSG",nexo:"Nexo",callme:"Callme",wispro:"Wispro",mikrowisp:"Mikrowisp",smartisp:"SmartISP",wisphub:"Wisphub",ucrm:"UCRM",splynx:"Splynx",otro:"Otro",mikrotik:"MikroTik",cambium_networks:"Cambium Networks",issabel_asterisk:"Issabel / Asterisk",ubiquiti:"Ubiquiti",cisco:"Cisco",zte_olt:"ZTE OLT",huawei:"Huawei",tp_link:"TP-Link",vsol_olt:"VSOL OLT",fortinet:"Fortinet",tenda:"Tenda",netonix:"Netonix",zabbix:"Zabbix",grandstream:"GrandStream",otros:"Otros"},P=document.getElementById("captaciones-loading"),p=document.getElementById("captaciones-error"),w=document.getElementById("captaciones-empty"),L=document.getElementById("captaciones-trash-empty"),F=document.getElementById("captaciones-trash-notice"),v=document.getElementById("captaciones-table-wrap"),c=document.getElementById("captaciones-tbody"),B=document.getElementById("captaciones-total"),_=document.getElementById("captaciones-trash-total"),C=document.getElementById("captaciones-showing"),M=document.getElementById("captaciones-updated"),y=document.getElementById("captaciones-search"),W=document.getElementById("captaciones-refresh"),G=document.getElementById("admin-logout"),m=document.getElementById("captaciones-view-active"),g=document.getElementById("captaciones-view-trash"),h=document.getElementById("captaciones-stat-active"),x=document.getElementById("captaciones-stat-trash"),D=document.getElementById("captaciones-trash-count");let d=[],f=null,n=!1,E=0,$=3;function b(t){return t?H[t]??t:"—"}function k(t){return t?.length?t.map(e=>b(e)).join(", "):"—"}function N(t){return new Intl.DateTimeFormat("es-VE",{dateStyle:"short",timeStyle:"short"}).format(new Date(t))}function z(t){const e=new Date(t);return e.setDate(e.getDate()+$),e}function U(t){return new Intl.DateTimeFormat("es-VE",{dateStyle:"short",timeStyle:"short"}).format(z(t))}function Z(){m?.classList.toggle("bg-nexo-primary",!n),m?.classList.toggle("text-nexo-dark",!n),m?.classList.toggle("text-nexo-text",n),m?.classList.toggle("hover:bg-nexo-bg-surface",n),g?.classList.toggle("bg-nexo-primary",n),g?.classList.toggle("text-nexo-dark",n),g?.classList.toggle("text-nexo-text",!n),g?.classList.toggle("hover:bg-nexo-bg-surface",!n),h?.classList.toggle("ring-2",!n),h?.classList.toggle("ring-nexo-primary/40",!n),h?.classList.toggle("bg-nexo-primary/5",!n),x?.classList.toggle("ring-2",n),x?.classList.toggle("ring-amber-400/50",n),x?.classList.toggle("bg-amber-50/10",n),F?.classList.toggle("hidden",!n)}function O(){v?.scrollIntoView({behavior:"smooth",block:"start"})}function R(){n&&(n=!1,u())}function j(){if(n){O();return}n=!0,u().then(O)}function r(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function s(t,e){const a=e?.trim()?r(e):"—";return`<div><dt class="text-[10px] font-bold uppercase tracking-wider text-nexo-text-muted mb-1">${t}</dt><dd class="text-nexo-text">${a}</dd></div>`}function J(t){return`
      <dl class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        ${s("Cargo",t.cargo)}
        ${s("Email",t.email)}
        ${s("Clientes",b(t.num_clientes))}
        ${s("País",t.pais)}
        ${s("Estado",t.estado)}
        ${s("Ciudad / región",t.ciudad_region)}
        ${s("Infraestructura",b(t.infraestructura))}
        ${s("Soluciones",k(t.soluciones))}
        ${s("Marcas RSG",k(t.rsg_marcas))}
        ${s("Otra marca RSG",t.rsg_marcas_otro)}
        ${s("Software actual",b(t.software_actual))}
        ${s("Otro software",t.software_otro)}
        ${s("Inconvenientes",t.inconvenientes_sistema)}
        ${s("Expectativas",t.expectativas)}
      </dl>
    `}function I(t,e){const a=e.trim().toLowerCase();return a?t.filter(i=>[i.nombre,i.empresa,i.email,i.whatsapp,i.pais,i.estado,i.ciudad_region].filter(Boolean).some(o=>String(o).toLowerCase().includes(a))):t}function S(t){if(!(!c||!C)){if(C.textContent=String(t.length),t.length===0){v?.classList.add("hidden"),w?.classList.toggle("hidden",n),L?.classList.toggle("hidden",!n),c.innerHTML="";return}w?.classList.add("hidden"),L?.classList.add("hidden"),v?.classList.remove("hidden"),c.innerHTML=t.map(e=>{const a=f===e.id,i=n&&e.deleted_at?`<div class="text-xs text-amber-700 mt-1">Se elimina el ${r(U(e.deleted_at))}</div>`:"";return`
          <tr class="border-b border-nexo-border hover:bg-nexo-bg-surface/70 transition-colors">
            <td class="px-4 py-4 align-top whitespace-nowrap text-nexo-text-muted">
              <div>${r(N(n&&e.deleted_at?e.deleted_at:e.fecha_ingreso))}</div>
              ${n?'<div class="text-[10px] uppercase tracking-wider mt-1 text-amber-700">En papelera</div>':""}
            </td>
            <td class="px-4 py-4 align-top">
              <div class="font-semibold text-nexo-dark">${r(e.nombre)}</div>
              <div class="text-nexo-text-muted text-xs mt-1">${r(e.email)}</div>
              ${i}
            </td>
            <td class="px-4 py-4 align-top">
              <div class="font-medium text-nexo-dark">${r(e.empresa)}</div>
              <div class="text-nexo-text-muted text-xs mt-1">${r(e.cargo)}</div>
            </td>
            <td class="px-4 py-4 align-top whitespace-nowrap">${r(e.whatsapp)}</td>
            <td class="px-4 py-4 align-top">${r(k(e.soluciones))}</td>
            <td class="px-4 py-4 align-top text-right">
              <div class="inline-flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="text-xs font-bold uppercase tracking-[0.12em] text-nexo-primary hover:text-nexo-accent transition-colors"
                  data-toggle-id="${e.id}"
                >
                  ${a?"Ocultar":"Ver más"}
                </button>
                ${n?`<button
                        type="button"
                        class="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-nexo-primary/30 text-nexo-primary hover:bg-nexo-primary/10 transition-colors text-[10px] font-bold uppercase tracking-[0.1em]"
                        data-restore-id="${e.id}"
                        title="Restaurar registro"
                        aria-label="Restaurar registro"
                      >${q}<span>Restaurar</span></button>`:`<button
                        type="button"
                        class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-red-300/40 text-red-600 hover:bg-red-50 transition-colors"
                        data-delete-id="${e.id}"
                        title="Mover a papelera"
                        aria-label="Mover a papelera"
                      >${V}</button>`}
              </div>
            </td>
          </tr>
          ${a?`<tr class="bg-nexo-bg-surface/50 border-b border-nexo-border">
                  <td colspan="6" class="px-4 py-5">${J(e)}</td>
                </tr>`:""}
        `}).join(""),c.querySelectorAll("[data-toggle-id]").forEach(e=>{e.addEventListener("click",()=>{const a=Number(e.dataset.toggleId);f=f===a?null:a,S(I(d,y?.value??""))})}),c.querySelectorAll("[data-delete-id]").forEach(e=>{e.addEventListener("click",()=>{const a=Number(e.dataset.deleteId);Q(a)})}),c.querySelectorAll("[data-restore-id]").forEach(e=>{e.addEventListener("click",()=>{const a=Number(e.dataset.restoreId);X(a)})})}}function A(t){P?.classList.toggle("hidden",!t)}function l(t){if(p){if(!t){p.classList.add("hidden"),p.textContent="";return}p.textContent=t,p.classList.remove("hidden")}}async function K(){try{const t=await fetch("/api/admin/session",{credentials:"include"}),e=await t.json();return!t.ok||!e.ok?(window.location.href="/admin/",!1):!0}catch{return window.location.href="/admin/",!1}}async function u(){l(null),A(!0),w?.classList.add("hidden"),L?.classList.add("hidden"),v?.classList.add("hidden");try{const e=await fetch(`/api/captaciones${n?"?papelera=1":""}`,{credentials:"include"}),a=await e.json();if(e.status===401){window.location.href="/admin/";return}if(!e.ok||!a.ok||!a.data)throw new Error(a.message??"No se pudieron cargar los registros");d=a.data,f=null,E=a.trashTotal??0,$=a.retentionDays??3,B&&(B.textContent=String(a.activeTotal??a.total??d.length)),_&&(_.textContent=String(E)),D&&(D.textContent=`(${E})`),M&&(M.textContent=N(new Date().toISOString())),Z(),S(I(d,y?.value??""))}catch(t){l(t instanceof Error?t.message:"Error de conexión")}finally{A(!1)}}async function Q(t){const e=d.find(o=>o.id===t),a=e?`${e.nombre} · ${e.empresa}`:`registro #${t}`;if(window.confirm(`¿Mover a la papelera "${a}"?

Se eliminará definitivamente después de ${$} días.`)){l(null);try{const o=await fetch(`/api/captaciones/${t}`,{method:"DELETE",credentials:"include"}),T=await o.json();if(o.status===401){window.location.href="/admin/";return}if(!o.ok||!T.ok)throw new Error(T.message??"No se pudo mover el registro a la papelera");await u()}catch(o){l(o instanceof Error?o.message:"Error de conexión")}}}async function X(t){l(null);try{const e=await fetch(`/api/captaciones/${t}/restaurar`,{method:"POST",credentials:"include"}),a=await e.json();if(e.status===401){window.location.href="/admin/";return}if(!e.ok||!a.ok)throw new Error(a.message??"No se pudo restaurar el registro");n=!1,await u()}catch(e){l(e instanceof Error?e.message:"Error de conexión")}}y?.addEventListener("input",()=>{S(I(d,y.value))});W?.addEventListener("click",()=>{u()});m?.addEventListener("click",R);g?.addEventListener("click",j);h?.addEventListener("click",R);x?.addEventListener("click",j);G?.addEventListener("click",async()=>{await fetch("/api/admin/logout",{method:"POST",credentials:"include"}),window.location.href="/admin/"});K().then(t=>{t&&u()});
