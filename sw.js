const CACHE='works-editor-v4';
const FILES=['./','index.html','manifest.webmanifest','lib/mammoth.browser.min.js','lib/docx.umd.js','lib/jszip.min.js','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// Páginas: primero la red (siempre la versión más nueva); sin internet, la copia guardada.
// Librerías e íconos: primero la copia guardada.
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const isPage=r.mode==='navigate'||/\.(html|webmanifest)$/.test(new URL(r.url).pathname)||new URL(r.url).pathname.endsWith('/');
  if(isPage){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c)).catch(()=>{});return res;}).catch(()=>caches.match(r).then(h=>h||caches.match('index.html'))));
  }else{
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c)).catch(()=>{});return res;})));
  }
});
