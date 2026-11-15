// inicio.js: pantalla de bienvenida (registro de jugador al inicio). Se carga DESPUÉS de extras.js
(()=>{
if(typeof MUNDOS=="undefined"||typeof J=="undefined")return;
const ya=()=>{try{return sessionStorage.getItem("cjok")=="1"}catch(e){return window.name=="cjok"}};
const marcar=()=>{try{sessionStorage.setItem("cjok","1")}catch(e){window.name="cjok"}};
const PL=J("cjpl",[]),AV=["🐆","🦊","🐼","🐸","🐧","🦉","🐙","🦋"],tieneP=Object.keys(J("cj",{})).length>0;
let a=AV[0],raf=0;

const el=document.createElement("div");el.id="bienv";
el.innerHTML=`<div class="bv-in">
<h1 class="bv-t">COREL <b>PRO</b></h1>
<p class="bv-s">¡La aventura de los atajos comienza aquí!</p>
<div class="atomo" id="atomo" aria-hidden="true"><i class="orb o1"></i><i class="orb o2"></i><i class="orb o3"></i><i class="nuc"></i><i class="pt"></i><i class="pt"></i><img id="bvj" src="img/ok.png" alt="" onerror="this.outerHTML='<span id=bvj>🐆</span>'"></div>
<form class="bv-card" id="bvf" autocomplete="off">
<h2>🐾 ¡Bienvenido, explorador!</h2>
<p>Registra tu nombre para guardar tus avances y recompensas.</p>
<label for="bvn">Nombre del estudiante</label>
<input id="bvn" maxlength="14" placeholder="Escribe tu nombre">
<label>Elige tu compañero</label>
<div class="bv-av" id="bva">${AV.map((x,i)=>`<button type="button" class="${i?"":"sel"}" data-a="${x}" aria-label="Compañero ${x}">${x}</button>`).join("")}</div>
<label for="bvp">¿Ya tienes un perfil?</label>
<select id="bvp"><option value="__new">✨ Crear nuevo perfil</option>${tieneP?'<option value="">🐆 Jugador principal</option>':""}${PL.map(p=>`<option value="${p.n}">${p.a} ${p.n}</option>`).join("")}</select>
<p class="bv-err" id="bve" role="alert"></p>
<button class="bv-go" type="submit">¡ENTRAR A LA AVENTURA! 🚀</button>
<small>Tu progreso se guardará en este dispositivo.</small>
</form></div>`;
document.body.appendChild(el);

const $e=s=>el.querySelector(s),sel=$e("#bvp"),inp=$e("#bvn"),av=$e("#bva"),err=$e("#bve");
function modo(){const nuevo=sel.value=="__new";inp.disabled=!nuevo;av.classList.toggle("off",!nuevo);if(!nuevo)inp.value="";err.textContent=""}
// Si ya había jugado, deja marcado su perfil
const prev=P.cur?(PL.some(p=>p.n===P.cur)?P.cur:null):(tieneP?"":null);
if(prev!==null)sel.value=prev;modo();sel.onchange=modo;
av.querySelectorAll("button").forEach(b=>b.onclick=()=>{a=b.dataset.a;av.querySelectorAll("button").forEach(x=>x.classList.toggle("sel",x===b))});

// Animación: el jaguar orbita como un electrón
const A=$e("#atomo"),pts=[...el.querySelectorAll(".pt")],TH=[0,60,120].map(d=>d*Math.PI/180);
const pos=(i,f)=>{const w=A.clientWidth,x=w*.46*Math.cos(f),y=w*.17*Math.sin(f),c=Math.cos(TH[i]),s=Math.sin(TH[i]);return{x:x*c-y*s,y:x*s+y*c,z:Math.sin(f)}};
function frame(t){const j=document.getElementById("bvj");
 if(j){const p=pos(1,t*1.15);j.style.transform=`translate(-50%,-50%) translate(${p.x}px,${p.y}px) scale(${.85+.22*p.z})`;j.style.zIndex=p.z>0?3:1}
 pts.forEach((e,k)=>{const p=pos(k?2:0,t*(k?1.5:1.9)+k*2);e.style.transform=`translate(${p.x}px,${p.y}px)`;e.style.zIndex=p.z>0?3:1})}
const t0=performance.now(),loop=n=>{frame((n-t0)/1000);raf=requestAnimationFrame(loop)};
const play=()=>{cancelAnimationFrame(raf);if(matchMedia("(prefers-reduced-motion:reduce)").matches)frame(.9);else raf=requestAnimationFrame(loop)};

function cerrar(){el.classList.add("cerrado");cancelAnimationFrame(raf)}
$e("#bvf").onsubmit=e=>{e.preventDefault();err.textContent="";let n;
 if(sel.value=="__new"){n=inp.value.replace(/[^\p{L}\p{N} ]/gu,"").trim();
  if(!n){err.textContent="Escribe tu nombre para empezar 🙂";inp.focus();return}
  if(PL.some(p=>p.n.toLowerCase()===n.toLowerCase())){err.textContent="Ese nombre ya existe. Elígelo en «¿Ya tienes un perfil?»";return}
  PL.push({n,a});LS.s("cjpl",JSON.stringify(PL))}
 else n=sel.value;
 marcar();
 if(n!==P.cur){LS.s("cjp",n);location.reload();return}
 cerrar();SND.click();jag("celebra","¡Hola"+(n?", "+n:"")+"! Toca un mundo para jugar")};

// Tocar el título COREL PRO vuelve a abrir la bienvenida (para cambiar de jugador)
const h=document.querySelector("header h1");
if(h){h.title="Cambiar de jugador";h.onclick=()=>{SND.click();el.classList.remove("cerrado");modo();play()}}

if(ya())el.classList.add("cerrado");else play();
})();