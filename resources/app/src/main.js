/**
 * FX Vision — Windows main process.
 * Frameless window: custom titlebar (shell) + the broker as a BrowserView.
 * The FX Vision indicator is the HOSTED script (secret URL from /api/app-config),
 * injected into the broker page — it draws its own overlay and gates access via
 * /api/verify-trader. No native overlay needed.
 */
const { app, BrowserWindow, BrowserView, ipcMain, shell, session } = require('electron')
const path = require('path')
const fs = require('fs')
const { applySecurity } = require('./security')
const { GitHubConfigLoader } = require('./github-loader')

const isDev = !!process.env.FXV_DEV
const TITLEBAR = 40

// ── Renderização / qualidade do overlay ─────────────────────────────────────
// O painel FX Vision (indicador injetado sobre a corretora) usa blur/sombras/
// gradientes — só sai NÍTIDO com aceleração de GPU. Antes a GPU era desligada
// 100% (`disableHardwareAcceleration`) por causa de fechamento aleatório em
// ALGUMAS máquinas; o custo era o overlay borrado / "vidro" chapado (render por
// software / SwiftShader deixa a janela inteira mole).
//
// Agora, por padrão, a GPU fica LIGADA e forçada:
//   • ignore-gpu-blocklist  → usa a GPU mesmo em drivers na blocklist do Chromium
//     (causa comum de cair pro modo software = borrão), que é o cenário típico.
//   • enable-gpu-rasterization / enable-zero-copy → rasterização mais nítida.
// Rede de segurança: um crash do processo de GPU NÃO derruba o app (o Chromium
// cai sozinho pro software) — ver o handler `child-process-gone` mais abaixo.
//
// Válvula de escape POR MÁQUINA (sem rebuild): se um PC específico voltar a
// fechar sozinho, volte ao modo software só nele, por um destes caminhos:
//   • variável de ambiente  FXV_NO_GPU=1
//   • criar o arquivo vazio  <userData>\no-gpu.flag
//     (o caminho exato é impresso no log ao abrir: "[FXV] userData:")
function gpuDisabledByUser() {
  try {
    if (process.env.FXV_NO_GPU === '1') return true
    return fs.existsSync(path.join(app.getPath('userData'), 'no-gpu.flag'))
  } catch (e) { return false }
}
if (gpuDisabledByUser()) {
  app.disableHardwareAcceleration()
  console.log('[FXV] GPU desligada (fallback por máquina) → render por software')
} else {
  app.commandLine.appendSwitch('ignore-gpu-blocklist')
  app.commandLine.appendSwitch('enable-gpu-rasterization')
  app.commandLine.appendSwitch('enable-zero-copy')
}

// Nunca deixar uma exceção solta derrubar o app.
process.on('uncaughtException', (e) => { console.error('[FXV] uncaughtException', e) })
process.on('unhandledRejection', (e) => { console.error('[FXV] unhandledRejection', e) })
// Um crash do processo de GPU não deve fechar o app: o Chromium recupera sozinho
// (recompõe via software). Só logamos para diagnóstico.
app.on('child-process-gone', (_e, d) => {
  if (d && (d.type === 'GPU' || d.type === 'Gpu')) console.error('[FXV] GPU process gone:', d.reason)
})

let win = null
let brokerView = null
let cfg = {
  backend_url: 'https://fxvisionapp.com',
  broker_url: 'https://qxbroker.com/en/trade',
  allowlist: ['qxbroker.com', 'quotex.io', 'market-qx.pro', 'broker-qx.pro'],
}
let indicatorScript = null // cached script text
let brokerAllowlist = cfg.allowlist
let clickId = '' // id por dispositivo → vira o cid no postback da Quotex
let githubLoader = null

function initGithubLoader() {
  const githubConfigPath = resolveBundledFile('github-config.json')
  if (!githubConfigPath) return
  try {
    const githubConfig = JSON.parse(fs.readFileSync(githubConfigPath, 'utf8'))
    githubLoader = new GitHubConfigLoader(githubConfig)
    console.log('[FXV] GitHub config loader initialized')
  } catch (e) {
    console.warn('[FXV] GitHub config loader disabled:', e.message)
  }
}

function getBundledImageDataUrl(fileName) {
  const imagePath = resolveBundledFile(fileName)
  if (!imagePath) return ''
  try {
    return `data:image/png;base64,${fs.readFileSync(imagePath).toString('base64')}`
  } catch (e) {
    return ''
  }
}

function resolveBundledFile(fileName) {
  const candidates = [
    path.join(app.getAppPath(), fileName),
    path.join(__dirname, '..', fileName),
    path.join(__dirname, fileName),
    path.join(process.cwd(), fileName),
    path.join(process.resourcesPath || '', fileName),
    path.join(process.resourcesPath || '', 'app.asar', fileName),
  ]
  for (const p of candidates) {
    try {
      if (p && fs.existsSync(p)) return p
    } catch (e) { /* ignore */ }
  }
  return null
}

// Gera/persiste um click_id por dispositivo (atribuição determinística no cadastro).
function getClickId() {
  try {
    const p = path.join(app.getPath('userData'), 'fxv_click_id.txt')
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').trim()
    const id = require('crypto').randomBytes(8).toString('hex')
    fs.writeFileSync(p, id)
    return id
  } catch (e) { return '' }
}
function brokerUrlWithClick() {
  if (!clickId) return cfg.broker_url
  return cfg.broker_url + (cfg.broker_url.includes('?') ? '&' : '?') + 'click_id=' + encodeURIComponent(clickId)
}

async function loadConfig() {
  const configPath = resolveBundledFile('config.json') || resolveBundledFile('app-config.json')
  try {
    if (configPath) {
      const c = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      cfg = Object.assign(cfg, c || {})
      if (c && c.backend_url) cfg.backend_url = String(c.backend_url).replace(/\/$/, '')
    }
  } catch (e) { /* defaults */ }

  if (githubLoader) {
    try {
      const remoteCfg = await githubLoader.loadFromGitHub('config')
      if (remoteCfg && typeof remoteCfg === 'object') {
        cfg = Object.assign(cfg, remoteCfg)
        if (remoteCfg.backend_url) cfg.backend_url = String(remoteCfg.backend_url).replace(/\/$/, '')
        if (remoteCfg.broker && remoteCfg.broker.url) cfg.broker_url = remoteCfg.broker.url
        if (remoteCfg.indicator && remoteCfg.indicator.script_url) cfg.indicator_url = remoteCfg.indicator.script_url
      }
    } catch (e) {
      console.warn('[FXV] GitHub remote config failed, using local defaults')
    }
  }

  brokerAllowlist = cfg.allowlist || []
}

function contentSize() { return win ? win.getContentSize() : [1366, 820] }
function brokerBounds() {
  const [w, h] = contentSize()
  return { x: 0, y: TITLEBAR, width: w, height: Math.max(0, h - TITLEBAR) }
}
function layout() { if (brokerView) brokerView.setBounds(brokerBounds()) }
function status(s) { if (win && !win.isDestroyed()) win.webContents.send('broker:status', s) }

async function fetchAppConfig() {
  try {
    const r = await fetch(`${cfg.backend_url}/api/app-config`)
    const d = await r.json()
    if (d?.broker?.url) cfg.broker_url = d.broker.url
    if (Array.isArray(d?.broker?.allowlist) && d.broker.allowlist.length) {
      brokerAllowlist = Array.from(new Set([...d.broker.allowlist, ...cfg.allowlist]))
    }
    if (d?.indicator?.script_url) cfg.indicator_url = d.indicator.script_url
  } catch (e) { /* use config.json defaults */ }
}

async function getIndicatorScript() {
  if (indicatorScript) return indicatorScript

  if (githubLoader) {
    try {
      const remoteScript = await githubLoader.loadFromGitHub('indicator')
      if (typeof remoteScript === 'string' && remoteScript.trim()) {
        indicatorScript = remoteScript
        return indicatorScript
      }
    } catch (e) { /* fallback to local */ }
  }

  const localScriptPath = resolveBundledFile('indicator.js')
  if (localScriptPath) {
    try {
      indicatorScript = fs.readFileSync(localScriptPath, 'utf8')
      return indicatorScript
    } catch (e) { /* fallback to remote */ }
  }

  let url = cfg.indicator_url
  if (!url) return null
  if (cfg.indicator_key) url += (url.includes('?') ? '&' : '?') + 'key=' + encodeURIComponent(cfg.indicator_key)
  try {
    const r = await fetch(url)
    if (!r.ok) return null
    indicatorScript = await r.text()
  } catch (e) { indicatorScript = null }
  return indicatorScript
}

async function injectIndicator() {
  if (!brokerView || brokerView.webContents.isDestroyed()) return
  const code = await getIndicatorScript()
  if (!code) return
  const logoDataUrl = getBundledImageDataUrl('logo.png')
  // guard against double-injection within the same document
  const wrapped = `(function(){window.__FXV_PLATFORM__='windows';window.__FXV_CLICK_ID__='${clickId}';window.__FXV_LOGO_URL__=${JSON.stringify(logoDataUrl)};if(window.__FXV_IND__)return;window.__FXV_IND__=1;try{${code}\n}catch(e){console.error('FXV indicator error',e);}})();`
  try { await brokerView.webContents.executeJavaScript(wrapped, true) } catch (e) { /* ignore */ }
}

function loadBroker() {
  if (!brokerView) {
    const ses = session.fromPartition('persist:broker')
    // Relax CSP so the injected indicator (and its supabase-js dependency) can run.
    ses.webRequest.onHeadersReceived((details, cb) => {
      const h = details.responseHeaders || {}
      for (const k of Object.keys(h)) {
        if (/^content-security-policy/i.test(k)) delete h[k]
      }
      cb({ responseHeaders: h })
    })
    brokerView = new BrowserView({
      webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, partition: 'persist:broker' },
    })
    win.addBrowserView(brokerView)
    applySecurity(brokerView.webContents, { allowlist: () => brokerAllowlist, isDev, allowLocal: false, onBlocked: (u) => {
      // links do Telegram (botão 💬 Suporte do indicador) abrem no navegador/app do sistema
      if (/^https?:\/\/(t\.me|telegram\.me)\//i.test(u)) { shell.openExternal(u); return }
      status({ blocked: u })
    } })
    brokerView.webContents.on('did-finish-load', () => { status({ ok: true }); injectIndicator() })
    brokerView.webContents.on('did-fail-load', (e, code, desc, url, isMain) => {
      if (!isMain || code === -3) return
      status({ ok: false, detail: `${desc} (${code})` })
    })
    // Se o processo da página travar, recarrega em vez de derrubar o app.
    brokerView.webContents.on('render-process-gone', () => {
      status({ ok: false, detail: 'recarregando…' })
      try { brokerView.webContents.reload() } catch (e) { /* ignore */ }
    })
  }
  brokerView.setBounds(brokerBounds())
  brokerView.webContents.loadURL(brokerUrlWithClick())
}

function createWindow() {
  win = new BrowserWindow({
    width: 1366, height: 820, minWidth: 1100, minHeight: 680,
    frame: false, backgroundColor: '#0a0e16', show: false,
    icon: path.join(__dirname, '..', 'assets', 'icon.ico'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true },
  })
  win.loadFile(path.join(__dirname, 'renderer', 'shell.html'))
  win.once('ready-to-show', async () => {
    win.show()
    await fetchAppConfig()
    loadBroker()
  })
  win.on('resize', layout)
  win.on('maximize', () => setTimeout(layout, 40))
  win.on('unmaximize', () => setTimeout(layout, 40))
  win.on('closed', () => { win = null; brokerView = null })
  if (process.env.FXV_DEVTOOLS === '1') win.webContents.openDevTools({ mode: 'detach' })
}

// Single-instance: ao tentar abrir de novo, foca a janela existente (ou recria se sumiu),
// em vez de abrir uma 2ª cópia / não abrir nada.
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (!win || win.isDestroyed()) { createWindow() }
    else { if (win.isMinimized()) win.restore(); win.show(); win.focus() }
  })
  app.whenReady().then(() => {
    try { console.log('[FXV] userData:', app.getPath('userData')) } catch (e) {}
    initGithubLoader()
    loadConfig()
    clickId = getClickId()
    createWindow()
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
  })
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
}

ipcMain.on('app:minimize', () => win && win.minimize())
ipcMain.on('app:maximize', () => { if (win) win.isMaximized() ? win.unmaximize() : win.maximize() })
ipcMain.on('app:close', () => win && win.close())
ipcMain.on('app:reloadBroker', () => brokerView && brokerView.webContents.reload())
ipcMain.on('app:openExternal', (e, url) => { if (typeof url === 'string' && /^https?:\/\//i.test(url)) shell.openExternal(url) })
