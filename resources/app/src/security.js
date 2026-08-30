/**
 * FX Vision Windows — interface protection for the broker WebView.
 * Interface/UX protection, not unbreakable security.
 */
function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase() } catch (e) { return '' }
}
function normDomain(d) {
  d = String(d || '').trim().toLowerCase()
  if (!d) return ''
  d = d.replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
  d = d.replace(/[/?#].*$/, '')
  d = d.replace(/:\d+$/, '')
  d = d.replace(/^www\./, '')
  return d
}
function isAllowed(url, list) {
  if (!url) return false
  if (url.startsWith('file://') || url.startsWith('about:')) return true
  if (url.startsWith('devtools://')) return false
  const h = hostOf(url)
  if (!h) return false
  return (list || []).some((raw) => {
    const d = normDomain(raw)
    return d && (h === d || h.endsWith('.' + d))
  })
}
function applySecurity(wc, opts = {}) {
  const { allowlist = [], isDev = false, allowLocal = false, onBlocked = null } = opts
  const list = () => (typeof allowlist === 'function' ? (allowlist() || []) : (allowlist || []))
  wc.on('context-menu', (e) => e.preventDefault())
  wc.setWindowOpenHandler(({ url }) => {
    if (allowLocal || isAllowed(url, list())) wc.loadURL(url)
    else if (onBlocked) onBlocked(url)
    return { action: 'deny' }
  })
  wc.on('will-navigate', (e, url) => {
    if (allowLocal) return
    if (!isAllowed(url, list())) { e.preventDefault(); if (onBlocked) onBlocked(url) }
  })
  wc.on('will-redirect', (e, url) => {
    if (allowLocal) return
    if (!isAllowed(url, list())) { e.preventDefault(); if (onBlocked) onBlocked(url) }
  })
  if (!isDev) wc.on('devtools-opened', () => wc.closeDevTools())
}
module.exports = { applySecurity, isAllowed, hostOf }
