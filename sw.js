// SW minimo: cache offline
const CACHE='megamania-v1';
const FILES=['./','./index.html','./style.css','./manifest.json',
'./js/sprites.js','./js/audio.js','./js/input.js','./js/collisions.js','./js/bullets.js',
'./js/energy.js','./js/levels.js','./js/enemies.js','./js/player.js','./js/ui.js','./js/main.js'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('fetch',e=>{ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))); });
