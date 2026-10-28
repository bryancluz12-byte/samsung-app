const P=[
{n:"Galaxy S",k:"phone",f:"phone",d:"La línea insignia de celulares: cámara de alta resolución, batería de larga duración y un procesador pensado para la IA.",g:["Cámara de 200 MP","Batería de 5000 mAh","Procesador con NPU"]},
{n:"Z Fold y Flip",k:"fold",f:"fold",d:"Celulares plegables que se abren para dar más pantalla o se doblan para guardarse en el bolsillo.",g:["Plegable","Multitarea","Portátil"]},
{n:"Galaxy Tab",k:"tab",f:"tab",d:"Tabletas para estudiar, dibujar, ver series y trabajar, con opción de lápiz S Pen.",g:["S Pen","Pantalla grande","Estudio"]},
{n:"Galaxy Book",k:"book",f:"book",d:"Laptop 2 en 1 con pantalla táctil que se dobla como tableta y funciona con S Pen y Galaxy AI.",g:["2 en 1","S Pen","Galaxy AI"]},
{n:"Galaxy Watch",k:"watch",f:"watch",d:"Reloj inteligente de pantalla circular para seguir tu actividad, recibir avisos y usar Galaxy AI desde la muñeca.",g:["Pantalla circular","Galaxy AI","Actividad"]},
{n:"Galaxy Buds",k:"buds",f:"buds",d:"Audífonos inalámbricos para música, llamadas y videos, con cancelación de ruido en varios modelos.",g:["Inalámbricos","Llamadas","Música"]},
{n:"Televisores",k:"tv",f:"tv",d:"Pantallas para cine en casa, videojuegos y streaming, con apps integradas.",g:["4K y más","Streaming","Gaming"]}
];
const tabs=document.getElementById('tabs'),dev=document.getElementById('dev'),foto=document.getElementById('foto'),art=document.getElementById('art');
function sel(i){
  const p=P[i];
  pt.textContent=p.n;pd.textContent=p.d;
  pg.innerHTML=p.g.map(t=>'<li>'+t+'</li>').join('');
  dev.dataset.k=p.k;
  // Si existe img/<nombre>.jpg se usa la foto; si no, la ilustración CSS
  foto.hidden=true;dev.hidden=false;art.classList.remove('has-foto');
  foto.onload=()=>{foto.hidden=false;dev.hidden=true;art.classList.add('has-foto')};
  foto.alt=p.n;foto.src='img/'+p.f+'.jpg';
  [...tabs.children].forEach((b,j)=>b.setAttribute('aria-selected',j===i));
}
P.forEach((p,i)=>{
  const b=document.createElement('button');
  b.role='tab';b.textContent=p.n;b.onclick=()=>sel(i);
  b.onkeydown=e=>{const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
    if(d){e.preventDefault();const n=(i+d+P.length)%P.length;sel(n);tabs.children[n].focus()}};
  tabs.appendChild(b);
});
sel(0);

// PWA: service worker + descarga/instalación
if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
let ev;
const inst=document.getElementById('instalar'),desc=document.getElementById('descargar'),ayuda=document.getElementById('ayuda');
const yaInstalada=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
if(yaInstalada){desc.hidden=true}
async function instalar(){
  if(ev){ev.prompt();await ev.userChoice;ev=null;inst.hidden=true;return}
  let msg='Tu navegador no ofreció el instalador (puede tardar unos segundos tras cargar, o la app ya está instalada).';
  if(location.protocol==='file:')msg='Abriste el archivo directamente (file://). Ábrelo desde http://localhost/samsung-app/ con Apache encendido en XAMPP.';
  else if(!window.isSecureContext)msg='Esta dirección (http://IP) no se considera segura y el navegador no permite instalar. Usa http://localhost/samsung-app/ en tu PC, o publica la app con HTTPS.';
  else if(!('serviceWorker' in navigator))msg='Este navegador no permite instalar apps web. Prueba con Chrome o Edge.';
  document.getElementById('diag').innerHTML='<b>'+msg+'</b>';
  ayuda.showModal();
}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();ev=e;if(!yaInstalada)inst.hidden=false});
addEventListener('appinstalled',()=>{inst.hidden=true;desc.hidden=true});
inst.onclick=desc.onclick=instalar;
document.getElementById('cerrar').onclick=()=>ayuda.close();
const i2=document.getElementById('inst2');if(i2)i2.onclick=instalar;
