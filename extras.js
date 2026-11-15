// extras.js: novedades del juego. Se carga DESPUÉS de script.js (no lo reemplaza).
(()=>{
if(typeof MUNDOS=="undefined")return;
const ld=d=>d.toLocaleDateString("sv-SE");
const modal=(t,h)=>{$("#mTitle").textContent=t;$("#manual").innerHTML=h;$("#modal").classList.add("on")};
document.documentElement.style.fontSize=(LS.g("cjs")||100)+"%";

// ---- Botones y zonas nuevas
$("header div").insertAdjacentHTML("afterbegin",'<button class="ib" id="bPerf" aria-label="Jugadores">🐆</button><button class="ib" id="bSet" aria-label="Ajustes">⚙️</button>');
$("#worlds").insertAdjacentHTML("afterend",'<div id="xtra" class="row"></div>');
$("main").insertAdjacentHTML("beforeend",'<section id="prac" class="s"><div id="pg" class="card"></div><div class="row"><button class="big alt" id="pSkip">⏭️ Saltar</button></div></section>');

// ---- Jugadores (nombre + avatar). El jugador principal conserva el progreso actual.
const PL=J("cjpl",[]),AV=["🐆","🦊","🐼","🐸","🐧","🦉","🐙","🦋"],me=PL.find(p=>p.n===P.cur);
$("#bPerf").textContent=me?me.a:"🐆";
$("#bPerf").onclick=()=>{SND.click();let a=AV[0];
 modal("👥 Jugadores",'<button class="pf" data-n="">🐆 Jugador principal'+(P.cur?"":" ✔")+"</button>"+PL.map(p=>`<button class="pf" data-n="${p.n}">${p.a} ${p.n}${p.n===P.cur?" ✔":""}</button>`).join("")+'<h3>➕ Nuevo jugador</h3><input id="pn" maxlength="14" placeholder="Nombre" style="font:inherit;font-size:1.2rem;padding:8px;width:100%;margin-bottom:6px"><div class="row" id="pav">'+AV.map((x,i)=>`<button class="ib${i?"":" sel"}" data-a="${x}">${x}</button>`).join("")+'</div><button class="big" id="pok">Crear jugador</button>');
 $$(".pf").forEach(b=>b.onclick=()=>{LS.s("cjp",b.dataset.n);location.reload()});
 $$("#pav button").forEach(b=>b.onclick=()=>{a=b.dataset.a;$$("#pav button").forEach(x=>x.classList.toggle("sel",x===b))});
 $("#pok").onclick=()=>{const n=$("#pn").value.replace(/[^\p{L}\p{N} ]/gu,"").trim();if(!n)return;if(!PL.some(p=>p.n===n)){PL.push({n,a});LS.s("cjpl",JSON.stringify(PL))}LS.s("cjp",n);location.reload()}};

// ---- Logros y racha
const LG=[["🔥","3 días seguidos",g=>g.r>=3],["📅","7 días seguidos",g=>g.r>=7],["🌟","10 niveles perfectos",g=>g.p>=10],["👑","Primer jefe vencido",()=>Object.keys(BS).length>=1],["🏆","Los 11 jefes vencidos",()=>Object.keys(BS).length>=11]];
const logros=()=>{const g=J(K("cjg"),{});return'<h3>🏅 Logros</h3>'+LG.map(([e,n,f])=>`<div class="w ${f(g)?"":"lock"}" style="margin:6px 0"><b style="display:inline">${f(g)?e:"🔒"}</b> ${n}</div>`).join("")};
$("#bAlb").addEventListener("click",()=>$("#manual").insertAdjacentHTML("beforeend",logros()));

// ---- Ajustes
$("#bSet").onclick=()=>{SND.click();const sz=+(LS.g("cjs")||100);
 modal("⚙️ Ajustes",'<h3>🔊 Voz</h3><div class="row">'+[["🐢",.7],["🙂",.85],["🐇",1.05]].map(([e,v])=>`<button class="ib sv${v==VR?" sel":""}" data-v="${v}">${e}</button>`).join("")+'</div><h3>🔠 Letra</h3><div class="row">'+[90,100,115].map((v,i)=>`<button class="ib sz${v==sz?" sel":""}" data-v="${v}" style="font-size:${1+i*.3}rem">A</button>`).join("")+"</div>"+logros()+'<h3>🗑️ Progreso</h3><button id="rst">Borrar el progreso de este jugador</button>');
 $$(".sv").forEach(b=>b.onclick=()=>{VR=+b.dataset.v;LS.s("cjv",VR);$$(".sv").forEach(x=>x.classList.toggle("sel",x===b));say("Así hablo ahora")});
 $$(".sz").forEach(b=>b.onclick=()=>{LS.s("cjs",b.dataset.v);document.documentElement.style.fontSize=b.dataset.v+"%";$$(".sz").forEach(x=>x.classList.toggle("sel",x===b))});
 let c=0;$("#rst").onclick=e=>{if(!c){c=1;e.target.textContent="⚠️ ¿Seguro? Toca otra vez";setTimeout(()=>{c=0;e.target.textContent="Borrar el progreso de este jugador"},4000);return}
  ["cj","cje","cjb","cjf","cjg"].forEach(b=>LS.s(K(b),"{}"));location.reload()}};

// ---- Repaso, Gran jefe y práctica
const go=(arr,l)=>{L=l;rounds=arr;R=0;fails=0;round()};
const tec=matchMedia("(pointer:fine)").matches;
function xr(){const n=Object.keys(FL).length,g=done(10)>=3,r=J(K("cjg"),{}).r||0;
 $("#xtra").innerHTML=(r?`<div class="card" style="width:100%">🔥 Racha: ${r} ${r>1?"días":"día"}</div>`:"")+`<button class="big alt" id="xRep">🔁 Repaso${n?" ("+n+")":""}</button>`+(tec?'<button class="big alt" id="xPrac">⌨️ Práctica con teclado</button>':"")+`<button class="big alt${g?"":" lock"}" id="xJefe">${g?"👑":"🔒"} Gran jefe</button>`;
 $("#xRep").onclick=()=>{SND.click();const l=Object.keys(FL).map(k=>{const i=k.indexOf("|");return MUNDOS[k.slice(0,i)]?.items.find(t=>t.k===k.slice(i+1))}).filter(Boolean);
  if(!l.length)return jag("celebra","¡Nada que repasar! Vas muy bien");go(sh(l).slice(0,6),4)};
 $("#xJefe").onclick=()=>{SND.click();if(!g){SND.bad();return jag("senala","Termina los 11 mundos para el Gran jefe")}
  const v=new Set();go(sh(MUNDOS.flatMap(m=>m.items)).filter(t=>!v.has(t.k+t.v)&&v.add(t.k+t.v)).slice(0,10),5)};
 if($("#xPrac"))$("#xPrac").onclick=()=>{SND.click();prac()}}
const _h=home;home=function(){_h();xr()};

// Práctica real con el teclado (solo PC). Se excluyen atajos que el navegador no deja capturar.
const BAD=["Ctrl + N","Ctrl + T","Ctrl + Shift + T","F5","F11","F12","Ctrl + W","Ctrl + Shift + Q","Ctrl + Shift + A"];
const NM={"Barra espaciadora":" ","Espacio":" ","Inicio":"Home","Fin":"End","Page Up":"PageUp","Page Down":"PageDown","Esc":"Escape"};
let pool=[],pi=0,cur=null;
function match(e,k){const t=k.split(" + "),c=t.includes("Ctrl"),s=t.includes("Shift"),a=t.includes("Alt"),m=t[t.length-1];
 if((e.ctrlKey||e.metaKey)!==c||e.shiftKey!==s||e.altKey!==a)return false;
 if(m=="Flechas")return/^Arrow/.test(e.key);
 return e.key.toLowerCase()===(NM[m]||m).toLowerCase()}
function prac(){const v=new Set();pool=sh(MUNDOS.flatMap(m=>m.items)).filter(t=>!BAD.includes(t.k)&&!v.has(t.k)&&v.add(t.k)).slice(0,8);pi=0;show("prac");sig()}
function sig(){if(pi>=pool.length){cur=null;SND.win();confeti(60);jag("celebra","¡Practicaste como un experto!");return home()}
 cur=pool[pi];const m=MUNDOS[cur.w];$("#pg").innerHTML=`🐾 ${pi+1}/${pool.length}<br><span class="an">${m.a}</span><br>Presiona el atajo para:<br><b>${cur.v}</b><br><span class="keys">${kc(cur.k)}</span>`;
 jag("ok","Presiona "+hablar(cur.k)+" en tu teclado",false);say("Presiona "+hablar(cur.k)+". "+cur.v)}
$("#pSkip").onclick=()=>{SND.click();pi++;sig()};
document.addEventListener("keydown",e=>{if(!$("#prac").classList.contains("on")||!cur||e.repeat||["Control","Shift","Alt","Meta"].includes(e.key))return;
 e.preventDefault();const g=$("#pg");
 if(match(e,cur.k)){SND.ok();confeti(10);g.classList.remove("sh");const x=cur;cur=null;setTimeout(()=>{pi++;sig()},900)}
 else{SND.bad();g.classList.remove("sh");void g.offsetWidth;g.classList.add("sh")}});

// ---- Estrellas por nivel, jefe, racha y logros (se añaden al terminar cada nivel)
const _f=finish;finish=function(){const e=fails==0?3:fails<3?2:1,g=J(K("cjg"),{}),antes=LG.filter(([,,f])=>f(g)).length;_f();
 if(L<4){const k=W+"-"+L;if(e>(ST[k]||0)){ST[k]=e;LS.s(K("cje"),JSON.stringify(ST))}}
 if(L==3){if(e>=2){if(!BS[W]){BS[W]=1;LS.s(K("cjb"),JSON.stringify(BS))}}else $("#eTitle").textContent="¡Casi! Inténtalo otra vez 💪"}
 const h=ld(new Date());if(g.d!==h){g.r=g.d===ld(new Date(Date.now()-864e5))?(g.r||0)+1:1;g.d=h}
 if(e==3)g.p=(g.p||0)+1;LS.s(K("cjg"),JSON.stringify(g));
 const nu=LG.filter(([,,f])=>f(g));
 if(nu.length>antes){const n=nu[nu.length-1];$("#stars").insertAdjacentHTML("beforeend",`<div style="font-size:1.4rem">${n[0]} Logro: ${n[1]}</div>`);jag("celebra","¡Nuevo logro: "+n[1]+"!")}};

xr();
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
})();