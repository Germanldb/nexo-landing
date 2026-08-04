var e={menos_500:`Menos de 500`,"500_2000":`500 a 2,000`,"2000_5000":`2,000 a 5,000`,mas_5000:`Más de 5,000`,wisp:`Wireless (WISP)`,ftth:`Fibra (FTTH)`,hibrida:`Híbrida`,rsg:`RSG`,nexo:`Nexo`,callme:`Callme`,wispro:`Wispro`,mikrowisp:`Mikrowisp`,smartisp:`SmartISP`,wisphub:`Wisphub`,ucrm:`UCRM`,splynx:`Splynx`,otro:`Otro`,mikrotik:`MikroTik`,cambium_networks:`Cambium Networks`,issabel_asterisk:`Issabel / Asterisk`,ubiquiti:`Ubiquiti`,cisco:`Cisco`,zte_olt:`ZTE OLT`,huawei:`Huawei`,tp_link:`TP-Link`,vsol_olt:`VSOL OLT`,fortinet:`Fortinet`,tenda:`Tenda`,netonix:`Netonix`,zabbix:`Zabbix`,grandstream:`GrandStream`,otros:`Otros`},t=document.getElementById(`captaciones-loading`),n=document.getElementById(`captaciones-error`),r=document.getElementById(`captaciones-empty`),i=document.getElementById(`captaciones-trash-empty`),a=document.getElementById(`captaciones-trash-notice`),o=document.getElementById(`captaciones-table-wrap`),s=document.getElementById(`captaciones-tbody`),c=document.getElementById(`captaciones-total`),l=document.getElementById(`captaciones-trash-total`),u=document.getElementById(`captaciones-showing`),d=document.getElementById(`captaciones-updated`),f=document.getElementById(`captaciones-search`),p=document.getElementById(`captaciones-refresh`),m=document.getElementById(`admin-logout`),h=document.getElementById(`captaciones-view-active`),g=document.getElementById(`captaciones-view-trash`),_=document.getElementById(`captaciones-stat-active`),v=document.getElementById(`captaciones-stat-trash`),y=document.getElementById(`captaciones-trash-count`),b=[],x=null,S=!1,C=0,w=3;function T(t){return t?e[t]??t:`—`}function E(e){return e?.length?e.map(e=>T(e)).join(`, `):`—`}function D(e){return new Intl.DateTimeFormat(`es-VE`,{dateStyle:`short`,timeStyle:`short`}).format(new Date(e))}function O(e){let t=new Date(e);return t.setDate(t.getDate()+w),t}function k(e){return new Intl.DateTimeFormat(`es-VE`,{dateStyle:`short`,timeStyle:`short`}).format(O(e))}function A(){h?.classList.toggle(`bg-nexo-primary`,!S),h?.classList.toggle(`text-nexo-dark`,!S),h?.classList.toggle(`text-nexo-text`,S),h?.classList.toggle(`hover:bg-nexo-bg-surface`,S),g?.classList.toggle(`bg-nexo-primary`,S),g?.classList.toggle(`text-nexo-dark`,S),g?.classList.toggle(`text-nexo-text`,!S),g?.classList.toggle(`hover:bg-nexo-bg-surface`,!S),_?.classList.toggle(`ring-2`,!S),_?.classList.toggle(`ring-nexo-primary/40`,!S),_?.classList.toggle(`bg-nexo-primary/5`,!S),v?.classList.toggle(`ring-2`,S),v?.classList.toggle(`ring-amber-400/50`,S),v?.classList.toggle(`bg-amber-50/10`,S),a?.classList.toggle(`hidden`,!S)}function j(){o?.scrollIntoView({behavior:`smooth`,block:`start`})}function M(){S&&(S=!1,H())}function N(){if(S){j();return}S=!0,H().then(j)}function P(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}function F(e,t){return`<div><dt class="text-[10px] font-bold uppercase tracking-wider text-nexo-text-muted mb-1">${e}</dt><dd class="text-nexo-text">${t?.trim()?P(t):`—`}</dd></div>`}function I(e){return`
      <dl class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        ${F(`Cargo`,e.cargo)}
        ${F(`Email`,e.email)}
        ${F(`Clientes`,T(e.num_clientes))}
        ${F(`País`,e.pais)}
        ${F(`Estado`,e.estado)}
        ${F(`Ciudad / región`,e.ciudad_region)}
        ${F(`Infraestructura`,T(e.infraestructura))}
        ${F(`Soluciones`,E(e.soluciones))}
        ${F(`Marcas RSG`,E(e.rsg_marcas))}
        ${F(`Otra marca RSG`,e.rsg_marcas_otro)}
        ${F(`Software actual`,T(e.software_actual))}
        ${F(`Otro software`,e.software_otro)}
        ${F(`Inconvenientes`,e.inconvenientes_sistema)}
        ${F(`Expectativas`,e.expectativas)}
      </dl>
    `}function L(e,t){let n=t.trim().toLowerCase();return n?e.filter(e=>[e.nombre,e.empresa,e.email,e.whatsapp,e.pais,e.estado,e.ciudad_region].filter(Boolean).some(e=>String(e).toLowerCase().includes(n))):e}function R(e){if(!(!s||!u)){if(u.textContent=String(e.length),e.length===0){o?.classList.add(`hidden`),r?.classList.toggle(`hidden`,S),i?.classList.toggle(`hidden`,!S),s.innerHTML=``;return}r?.classList.add(`hidden`),i?.classList.add(`hidden`),o?.classList.remove(`hidden`),s.innerHTML=e.map(e=>{let t=x===e.id,n=S&&e.deleted_at?`<div class="text-xs text-amber-700 mt-1">Se elimina el ${P(k(e.deleted_at))}</div>`:``;return`
          <tr class="border-b border-nexo-border hover:bg-nexo-bg-surface/70 transition-colors">
            <td class="px-4 py-4 align-top whitespace-nowrap text-nexo-text-muted">
              <div>${P(D(S&&e.deleted_at?e.deleted_at:e.fecha_ingreso))}</div>
              ${S?`<div class="text-[10px] uppercase tracking-wider mt-1 text-amber-700">En papelera</div>`:``}
            </td>
            <td class="px-4 py-4 align-top">
              <div class="font-semibold text-nexo-dark">${P(e.nombre)}</div>
              <div class="text-nexo-text-muted text-xs mt-1">${P(e.email)}</div>
              ${n}
            </td>
            <td class="px-4 py-4 align-top">
              <div class="font-medium text-nexo-dark">${P(e.empresa)}</div>
              <div class="text-nexo-text-muted text-xs mt-1">${P(e.cargo)}</div>
            </td>
            <td class="px-4 py-4 align-top whitespace-nowrap">${P(e.whatsapp)}</td>
            <td class="px-4 py-4 align-top">${P(E(e.soluciones))}</td>
            <td class="px-4 py-4 align-top text-right">
              <div class="inline-flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="text-xs font-bold uppercase tracking-[0.12em] text-nexo-primary hover:text-nexo-accent transition-colors"
                  data-toggle-id="${e.id}"
                >
                  ${t?`Ocultar`:`Ver más`}
                </button>
                ${S?`<button
                        type="button"
                        class="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-nexo-primary/30 text-nexo-primary hover:bg-nexo-primary/10 transition-colors text-[10px] font-bold uppercase tracking-[0.1em]"
                        data-restore-id="${e.id}"
                        title="Restaurar registro"
                        aria-label="Restaurar registro"
                      >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 7v6h6"></path>
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.69 3"></path>
    </svg>
  <span>Restaurar</span></button>`:`<button
                        type="button"
                        class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-red-300/40 text-red-600 hover:bg-red-50 transition-colors"
                        data-delete-id="${e.id}"
                        title="Mover a papelera"
                        aria-label="Mover a papelera"
                      >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 6h18"></path>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      <line x1="10" x2="10" y1="11" y2="17"></line>
      <line x1="14" x2="14" y1="11" y2="17"></line>
    </svg>
  </button>`}
              </div>
            </td>
          </tr>
          ${t?`<tr class="bg-nexo-bg-surface/50 border-b border-nexo-border">
                  <td colspan="6" class="px-4 py-5">${I(e)}</td>
                </tr>`:``}
        `}).join(``),s.querySelectorAll(`[data-toggle-id]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.toggleId);x=x===t?null:t,R(L(b,f?.value??``))})}),s.querySelectorAll(`[data-delete-id]`).forEach(e=>{e.addEventListener(`click`,()=>{U(Number(e.dataset.deleteId))})}),s.querySelectorAll(`[data-restore-id]`).forEach(e=>{e.addEventListener(`click`,()=>{W(Number(e.dataset.restoreId))})})}}function z(e){t?.classList.toggle(`hidden`,!e)}function B(e){if(n){if(!e){n.classList.add(`hidden`),n.textContent=``;return}n.textContent=e,n.classList.remove(`hidden`)}}async function V(){try{let e=await fetch(`/api/admin/session`,{credentials:`include`}),t=await e.json();return!e.ok||!t.ok?(window.location.href=`/admin/`,!1):!0}catch{return window.location.href=`/admin/`,!1}}async function H(){B(null),z(!0),r?.classList.add(`hidden`),i?.classList.add(`hidden`),o?.classList.add(`hidden`);try{let e=await fetch(`/api/captaciones${S?`?papelera=1`:``}`,{credentials:`include`}),t=await e.json();if(e.status===401){window.location.href=`/admin/`;return}if(!e.ok||!t.ok||!t.data)throw Error(t.message??`No se pudieron cargar los registros`);b=t.data,x=null,C=t.trashTotal??0,w=t.retentionDays??3,c&&(c.textContent=String(t.activeTotal??t.total??b.length)),l&&(l.textContent=String(C)),y&&(y.textContent=`(${C})`),d&&(d.textContent=D(new Date().toISOString())),A(),R(L(b,f?.value??``))}catch(e){B(e instanceof Error?e.message:`Error de conexión`)}finally{z(!1)}}async function U(e){let t=b.find(t=>t.id===e),n=t?`${t.nombre} · ${t.empresa}`:`registro #${e}`;if(window.confirm(`¿Mover a la papelera "${n}"?\n\nSe eliminará definitivamente después de ${w} días.`)){B(null);try{let t=await fetch(`/api/captaciones/${e}`,{method:`DELETE`,credentials:`include`}),n=await t.json();if(t.status===401){window.location.href=`/admin/`;return}if(!t.ok||!n.ok)throw Error(n.message??`No se pudo mover el registro a la papelera`);await H()}catch(e){B(e instanceof Error?e.message:`Error de conexión`)}}}async function W(e){B(null);try{let t=await fetch(`/api/captaciones/${e}/restaurar`,{method:`POST`,credentials:`include`}),n=await t.json();if(t.status===401){window.location.href=`/admin/`;return}if(!t.ok||!n.ok)throw Error(n.message??`No se pudo restaurar el registro`);S=!1,await H()}catch(e){B(e instanceof Error?e.message:`Error de conexión`)}}f?.addEventListener(`input`,()=>{R(L(b,f.value))}),p?.addEventListener(`click`,()=>{H()}),h?.addEventListener(`click`,M),g?.addEventListener(`click`,N),_?.addEventListener(`click`,M),v?.addEventListener(`click`,N),m?.addEventListener(`click`,async()=>{await fetch(`/api/admin/logout`,{method:`POST`,credentials:`include`}),window.location.href=`/admin/`}),V().then(e=>{e&&H()});