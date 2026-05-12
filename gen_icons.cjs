const { createCanvas } = require('canvas')
const fs = require('fs')

function drawIcon(size) {
  const c = createCanvas(size, size)
  const ctx = c.getContext('2d')
  const s = size / 512

  // Rounded background
  const r = 110 * s
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(size - r, 0)
  ctx.quadraticCurveTo(size, 0, size, r)
  ctx.lineTo(size, size - r)
  ctx.quadraticCurveTo(size, size, size - r, size)
  ctx.lineTo(r, size)
  ctx.quadraticCurveTo(0, size, 0, size - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fillStyle = '#0f0f0f'
  ctx.fill()

  // Chef hat dome
  ctx.beginPath()
  ctx.ellipse(256 * s, 195 * s, 112 * s, 100 * s, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FF6B35'
  ctx.fill()

  // Chef hat band
  const bx = 148 * s, by = 270 * s, bw = 216 * s, bh = 52 * s, br = 10 * s
  ctx.beginPath()
  ctx.moveTo(bx + br, by)
  ctx.lineTo(bx + bw - br, by)
  ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br)
  ctx.lineTo(bx + bw, by + bh - br)
  ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh)
  ctx.lineTo(bx + br, by + bh)
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br)
  ctx.lineTo(bx, by + br)
  ctx.quadraticCurveTo(bx, by, bx + br, by)
  ctx.closePath()
  ctx.fillStyle = '#FF6B35'
  ctx.fill()

  // Divider line
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.fillRect(148 * s, 268 * s, 216 * s, 4 * s)

  // Dome highlight
  ctx.save()
  ctx.translate(222 * s, 165 * s)
  ctx.rotate(-20 * Math.PI / 180)
  ctx.beginPath()
  ctx.ellipse(0, 0, 38 * s, 28 * s, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.fill()
  ctx.restore()

  // "cheff" text
  const fontSize = Math.round(108 * s)
  ctx.font = `900 ${fontSize}px sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('cheff', 256 * s, 415 * s)

  return c.toBuffer('image/png')
}

fs.writeFileSync('./public/pwa-192x192.png', drawIcon(192))
console.log('✓ pwa-192x192.png')

fs.writeFileSync('./public/pwa-512x512.png', drawIcon(512))
console.log('✓ pwa-512x512.png')
