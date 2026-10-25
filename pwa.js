// Private Me Work · installazione come app sulla schermata Home
(function () {
  if ('serviceWorker' in navigator) addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}) })
  var stand = matchMedia('(display-mode: standalone)').matches || navigator.standalone
  var VAPID = 'BCzhlX33LkHxCt3kaglEEqu3UzYoJ_-Bp99qFKaJbzgHltggfxsgD3FQwlgQCkV3qRNMSxrRdOHiJjmA1wP_ePA'
  var u8 = function (s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); var r = atob(s + '==='.slice((s.length + 3) % 4)), a = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) a[i] = r.charCodeAt(i); return a }
  var b64 = function (buf) { var s = ''; new Uint8Array(buf).forEach(function (c) { s += String.fromCharCode(c) }); return btoa(s) }
  // Notifiche: da chiamare dopo l'accesso (sb = client Supabase)
  window.pmwNotifiche = function (sb) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    if (ios && !stand) return
    var salva = function () {
      return navigator.serviceWorker.ready.then(function (reg) {
        return reg.pushManager.getSubscription().then(function (s) {
          return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: u8(VAPID) })
        })
      }).then(function (s) {
        var k = s.toJSON().keys || {}
        return sb.rpc('registra_push', { p_endpoint: s.endpoint, p_p256dh: k.p256dh, p_auth: k.auth })
      })
    }
    if (Notification.permission === 'granted') { salva().catch(function () {}); return }
    if (Notification.permission !== 'default') return
    try { if (localStorage.getItem('pmw-notif') === 'no') return } catch (e) {}
    if (document.getElementById('pmw-notif')) return
    var box = document.createElement('div'); box.id = 'pmw-notif'; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Attiva le notifiche')
    box.style.cssText = 'position:fixed;left:12px;right:76px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:34;background:var(--card);color:var(--ink);border:1px solid var(--ln);border-radius:16px;padding:12px 14px;box-shadow:0 10px 24px -8px rgba(0,0,0,.35);font:600 14px/1.35 system-ui,sans-serif'
    box.innerHTML = '<div style="margin-bottom:8px">Vuoi ricevere una notifica per messaggi e avvisi?</div><div style="display:flex;gap:8px"></div>'
    var si = document.createElement('button'), no = document.createElement('button')
    si.textContent = 'Attiva'; no.textContent = 'Non ora'
    si.style.cssText = 'border:0;border-radius:12px;background:var(--g);color:#fff;font-weight:700;padding:9px 16px;cursor:pointer'
    no.style.cssText = 'border:0;border-radius:12px;background:var(--tint);color:var(--ink);font-weight:700;padding:9px 16px;cursor:pointer'
    box.lastChild.appendChild(si); box.lastChild.appendChild(no); document.body.appendChild(box)
    si.onclick = function () { Notification.requestPermission().then(function (p) { box.remove(); if (p === 'granted') salva().catch(function () {}) }) }
    no.onclick = function () { try { localStorage.setItem('pmw-notif', 'no') } catch (e) {} box.remove() }
  }
  if (stand) return
  var ua = navigator.userAgent, ios = /iphone|ipad|ipod/i.test(ua), mobile = ios || /android/i.test(ua)
  if (!mobile) return
  try { if (localStorage.getItem('pmw-inst') === 'no') return } catch (e) {}
  var ev = null
  addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); ev = e; if (box) btn.textContent = 'Installa' })
  var box, btn
  function show() {
    box = document.createElement('div')
    box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Installa Private Me Work')
    box.style.cssText = 'position:fixed;left:12px;right:76px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:34;background:var(--card);color:var(--ink);border:1px solid var(--ln);border-radius:16px;padding:12px 14px;box-shadow:0 10px 24px -8px rgba(0,0,0,.35);font:600 14px/1.35 system-ui,sans-serif'
    box.innerHTML = '<div style="margin-bottom:8px">Aggiungi Private Me Work alla schermata Home: si apre come un’app.</div><div style="display:flex;gap:8px"></div>'
    btn = document.createElement('button'); btn.textContent = ios ? 'Come fare' : 'Installa'
    btn.style.cssText = 'border:0;border-radius:12px;background:var(--g);color:#fff;font-weight:700;padding:9px 16px;cursor:pointer'
    var no = document.createElement('button'); no.textContent = 'Non ora'
    no.style.cssText = 'border:0;border-radius:12px;background:var(--tint);color:var(--ink);font-weight:700;padding:9px 16px;cursor:pointer'
    box.lastChild.appendChild(btn); box.lastChild.appendChild(no)
    btn.onclick = function () {
      if (ev) { ev.prompt(); ev.userChoice.then(function () { box.remove() }); return }
      alert(ios ? 'Su iPhone: tocca il pulsante Condividi (il quadrato con la freccia) in Safari, poi “Aggiungi alla schermata Home”.' : 'Apri il menu del browser (i tre puntini in alto a destra) e scegli “Installa app” o “Aggiungi a schermata Home”.')
    }
    no.onclick = function () { try { localStorage.setItem('pmw-inst', 'no') } catch (e) {} box.remove() }
    document.body.appendChild(box)
  }
  addEventListener('load', function () { setTimeout(show, 2500) })
})()
