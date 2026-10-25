// Private Me Work · service worker minimo: rende l'app installabile e apre la schermata anche con rete lenta.
// Non salva mai dati personali: gestisce solo i file statici del sito (non le chiamate a Supabase).
const V = 'pmw-v2'
const SHELL = ['./', 'index.html', 'hr.html', 'contabilita.html', 'style.css', 'config.js', 'favicon.png', 'icon-192.png', 'logo-work.png']
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()))
})
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url)
  if (r.method !== 'GET' || u.origin !== location.origin) return
  e.respondWith(
    fetch(r).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)) }
      return res
    }).catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  )
})

// Notifiche push: messaggi e avvisi
self.addEventListener('push', e => {
  let d = {}
  try { d = e.data ? e.data.json() : {} } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.title || 'Private Me Work', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || 'pmw', renotify: true, data: { url: d.url || '/' }
  }))
})
self.addEventListener('notificationclick', e => {
  e.notification.close()
  const url = (e.notification.data && e.notification.data.url) || '/'
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if (c.url.startsWith(self.location.origin) && 'focus' in c) { c.navigate(url).catch(() => {}); return c.focus() } }
    return self.clients.openWindow(url)
  }))
})
