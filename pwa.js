// Private Me Work · installazione come app sulla schermata Home
(function () {
  if ('serviceWorker' in navigator) addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}) })
  var stand = matchMedia('(display-mode: standalone)').matches || navigator.standalone
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
