const $ = (id) => document.getElementById(id)
$('min').onclick = () => window.fxv.minimize()
$('max').onclick = () => window.fxv.maximize()
$('close').onclick = () => window.fxv.close()
$('reload').onclick = () => window.fxv.reload()

const st = $('status')
window.fxv.onStatus((s) => {
  if (s.ok) { st.className = 'status ok'; st.innerHTML = '<i class="dot"></i> Sessão segura · FX Vision' }
  else if (s.blocked) { st.className = 'status'; st.innerHTML = '<i class="dot"></i> Navegação bloqueada (fora da allowlist)' }
  else if (s.ok === false) { st.className = 'status err'; st.innerHTML = '<i class="dot"></i> Falha ao carregar (' + (s.detail || 'erro') + ')' }
})
