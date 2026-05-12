const { spawn } = require('child_process')
const os         = require('os')
const qrcode     = require('qrcode-terminal')
const ngrok      = require('@ngrok/ngrok')
const fs         = require('fs')
const path       = require('path')

const CONFIG_FILE = path.join(__dirname, '.ngrok-config')
const PORT        = 3000

function getLocalIP() {
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address
    }
  }
  return 'localhost'
}

// Читаем конфиг: первая строка — токен, вторая (опционально) — статичный домен
function readConfig() {
  const token  = process.env.NGROK_AUTHTOKEN || ''
  const domain = process.env.NGROK_DOMAIN    || ''
  if (token) return { token, domain }

  if (!fs.existsSync(CONFIG_FILE)) return { token: '', domain: '' }
  const lines = fs.readFileSync(CONFIG_FILE, 'utf8').trim().split('\n').map(l => l.trim())
  const fileDomain = (lines[1] || '').replace(/^https?:\/\//, '')
  return { token: lines[0] || '', domain: fileDomain }
}

function printHeader(ngrokUrl) {
  console.clear()
  console.log('\x1b[38;5;208m')
  console.log('  ██████╗██╗  ██╗███████╗███████╗███████╗')
  console.log('  ██╔════╝██║  ██║██╔════╝██╔════╝██╔════╝')
  console.log('  ██║     ███████║█████╗  █████╗  █████╗  ')
  console.log('  ██║     ██╔══██║██╔══╝  ██╔══╝  ██╔══╝  ')
  console.log('  ╚██████╗██║  ██║███████╗██║     ██║     ')
  console.log('   ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝     ')
  console.log('\x1b[0m')
  const ip = getLocalIP()
  console.log(`  \x1b[2mLocal:\x1b[0m   \x1b[36mhttp://localhost:${PORT}\x1b[0m`)
  console.log(`  \x1b[2mSenet:\x1b[0m   \x1b[32mhttp://${ip}:${PORT}\x1b[0m`)
  if (ngrokUrl) {
    console.log(`  \x1b[2mNgrok:\x1b[0m   \x1b[35m${ngrokUrl}\x1b[0m  \x1b[33m← Google OAuth ✓\x1b[0m`)
  }
  console.log()
}

function startVite() {
  const vite = spawn('npx', ['vite', '--host'], { stdio: 'inherit', shell: true })
  vite.on('close', code => process.exit(code ?? 0))
}

function showQR(url, label) {
  qrcode.generate(url, { small: true }, qr => {
    qr.split('\n').forEach(l => console.log('  ' + l))
    console.log(`  ${label}\n`)
    startVite()
  })
}

async function startWithNgrok(token, domain) {
  try {
    const opts = { addr: PORT, authtoken: token }
    if (domain) opts.domain = domain
    const listener = await ngrok.forward(opts)
    const url = listener.url()
    printHeader(url)
    showQR(url, 'Отсканируй — откроется приложение с HTTPS (Google OAuth работает)')
  } catch (e) {
    console.error('\x1b[31m  Ngrok ошибка:\x1b[0m', e.message)
    console.log('  Запускаем без ngrok...\n')
    const ip = getLocalIP()
    printHeader(null)
    showQR(`http://${ip}:${PORT}`, 'Локальная сеть (Google OAuth только на localhost)')
  }
}

function showSetupGuide() {
  console.clear()
  console.log('\x1b[33m')
  console.log('  ╔════════════════════════════════════════════════════╗')
  console.log('  ║           Настройка ngrok (один раз)               ║')
  console.log('  ╚════════════════════════════════════════════════════╝')
  console.log('\x1b[0m')
  console.log('  1. Зарегистрируйся на \x1b[36mhttps://ngrok.com\x1b[0m')
  console.log('  2. Скопируй Auth Token из раздела "Your Authtoken"')
  console.log('  3. Получи \x1b[35mстатичный домен\x1b[0m: dashboard.ngrok.com/domains → "+ New Domain"')
  console.log('     (бесплатно, URL не меняется — добавь его в Google Cloud Console один раз)')
  console.log()
  console.log('  4. Создай файл \x1b[32m.ngrok-config\x1b[0m:')
  console.log('     \x1b[2mСтрока 1:\x1b[0m твой_auth_token')
  console.log('     \x1b[2mСтрока 2:\x1b[0m твой-домен.ngrok-free.app')
  console.log()
  console.log('  Пример файла .ngrok-config:')
  console.log('  \x1b[32m2abc123xyz_твойтокен...\x1b[0m')
  console.log('  \x1b[32mfox-helpful-crane.ngrok-free.app\x1b[0m')
  console.log()
  console.log('  5. В Google Cloud Console добавь:')
  console.log('     \x1b[2mAuthorized JavaScript origins:\x1b[0m https://твой-домен.ngrok-free.app')
  console.log('     \x1b[2mAuthorized redirect URIs:\x1b[0m      https://твой-домен.ngrok-free.app')
  console.log()
  console.log('  Запускаем без ngrok...\n')
}

async function main() {
  const { token, domain } = readConfig()

  if (!token) {
    showSetupGuide()
    const ip = getLocalIP()
    printHeader(null)
    showQR(`http://${ip}:${PORT}`, 'Локальная сеть (Google OAuth только на localhost)')
    return
  }

  printHeader(null)
  console.log('  \x1b[2mПоднимаем ngrok туннель' + (domain ? ` (${domain})` : '') + '...\x1b[0m\n')
  await startWithNgrok(token, domain)
}

main()
