const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const GAME_HEIGHT = 300

const player = {
  x: canvas.width / 4,
  y: GAME_HEIGHT - 30,
  w: 20,
  h: 20,
  vy: 0,
  grounded: false
}

let gravity = 0.6
let jumpPower = 12
let speed = 4
let score = 0
let best = 0
let running = false

let platforms = []
let lastX = 0

function resetPlatforms() {
  platforms = [{
    x: 0,
    y: GAME_HEIGHT - 5,
    w: canvas.width,
    h: 5
  }]
  lastX = canvas.width
}

function spawnPlatform() {
  const w = 60 + Math.random() * 100
  const gap = 120 + Math.random() * 120

  platforms.push({
    x: lastX + gap,
    y: GAME_HEIGHT - 5,
    w,
    h: 5
  })

  lastX += gap + w
}

function start() {
  player.y = GAME_HEIGHT - 30
  player.vy = 0
  score = 0
  speed = 4
  resetPlatforms()
  running = true
  requestAnimationFrame(update)
}

document.addEventListener('keydown', e => {
  if (!running && e.code === 'Space') start()
  if (running && e.code === 'Space' && player.grounded) {
    player.vy = -jumpPower
    player.grounded = false
  }
})

function update() {
  if (!running) return

  player.vy += gravity
  player.y += player.vy

  platforms.forEach(p => p.x -= speed)
  platforms = platforms.filter(p => p.x + p.w > 0)

  if (platforms[platforms.length - 1].x < canvas.width) spawnPlatform()

  player.grounded = false
  platforms.forEach(p => {
    if (
      player.x < p.x + p.w &&
      player.x + player.w > p.x &&
      player.y + player.h > p.y &&
      player.y + player.h < p.y + p.h + 10 &&
      player.vy >= 0
    ) {
      player.y = p.y - player.h
      player.vy = 0
      player.grounded = true
    }
  })

  if (player.y > GAME_HEIGHT + 100) {
    running = false
    best = Math.max(best, Math.floor(score))
    drawGameOver()
    return
  }

  score += speed * 0.05
  speed += 0.0008

  draw()
  requestAnimationFrame(update)
}

function draw() {
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#8B7355'
  ctx.fillRect(0, GAME_HEIGHT, canvas.width, canvas.height)

  ctx.fillStyle = '#333'
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h))

  ctx.fillStyle = 'red'
  ctx.fillRect(player.x, player.y, player.w, player.h)

  ctx.fillStyle = '#000'
  ctx.font = '16px sans-serif'
  ctx.fillText('Score: ' + Math.floor(score), 10, 20)
  ctx.fillText('Best: ' + best, 10, 40)
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.font = '32px sans-serif'
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40)
  ctx.font = '20px sans-serif'
  ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 20)
}

drawGameOver()
