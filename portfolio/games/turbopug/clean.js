const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const GAME_HEIGHT = 300;

const player = {
  x: width / 3,
  y: GAME_HEIGHT - 30,
  width: 20,
  height: 20,
  speed: 4,
  velX: 0,
  velY: 0,
  jumping: false,
  grounded: false
};

let gravity = 0.5;
let friction = 0.8;
let verticalSpeed = 2;
let score = 0;
let bestScore = 0;
let gameRunning = false;
let lastPlatformX = 0;
let platformGap = 200;
let minPlatformWidth = 60;
let maxPlatformWidth = 120;

const keys = {};
let platforms = [];

function resetPlatforms() {
  platforms = [
    { x: 0, y: GAME_HEIGHT - 5, width: width + 50, height: 5 }
  ];
  lastPlatformX = platforms[0].width;
}

resetPlatforms();

function generatePlatform() {
  const platformWidth = Math.random() * (maxPlatformWidth - minPlatformWidth) + minPlatformWidth;
  const platformX = lastPlatformX + platformGap + Math.random() * 100;
  
  platforms.push({
    x: platformX,
    y: GAME_HEIGHT - 5,
    width: platformWidth,
    height: 5
  });
  
  lastPlatformX = platformX + platformWidth;
}

function removeOffscreenPlatforms() {
  platforms = platforms.filter(platform => platform.x + platform.width > 0);
}

document.addEventListener('keydown', e => {
  keys[e.keyCode] = true;
  if (!gameRunning && e.keyCode === 32) startGame();
});

document.addEventListener('keyup', e => {
  keys[e.keyCode] = false;
});

function startGame() {
  resetGame();
  gameRunning = true;
  requestAnimationFrame(update);
}

function resetGame() {
  player.x = width / 3;
  player.y = GAME_HEIGHT - 30;
  player.velX = 0;
  player.velY = 0;
  player.jumping = false;
  player.grounded = false;

  score = 0;
  verticalSpeed = 2;
  resetPlatforms();
}

function update() {
  if (!gameRunning) return;

 
  player.velX = 0;
  if (keys[37] || keys[65]) player.velX = -player.speed;
  if (keys[39] || keys[68]) player.velX = player.speed;

  if ((keys[38] || keys[32] || keys[87]) && player.grounded) {
    player.jumping = true;
    player.grounded = false;
    player.velY = -10;
  }

 
  player.velX *= friction;
  player.velY += gravity;

  player.x += player.velX;
  player.y += player.velY;

  
  platforms.forEach(p => p.x -= verticalSpeed);
  score += verticalSpeed;

  if (platforms[platforms.length - 1].x + platforms[platforms.length - 1].width < width) {
    generatePlatform();
  }

  removeOffscreenPlatforms();

  player.grounded = false;
  for (let i = 0; i < platforms.length; i++) {
    const p = platforms[i];
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y < p.y + p.height &&
      player.y + player.height > p.y
    ) {
    
      if (player.y + player.height <= p.y + 10 && player.velY >= 0) {
        player.y = p.y - player.height;
        player.velY = 0;
        player.grounded = true;
        player.jumping = false;
      }
    }
  }

 
  if (player.y > GAME_HEIGHT + 100 || player.x < -50 || player.x > width + 50) {
    endGame();
    return;
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {

  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#8B7355';
  ctx.fillRect(0, GAME_HEIGHT, width, height - GAME_HEIGHT);

  ctx.fillStyle = '#333';
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = 'black';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + Math.floor(score / 10), 10, 20);
  
  ctx.fillText('Best: ' + bestScore, 10, 40);
}

function endGame() {
  gameRunning = false;
  const finalScore = Math.floor(score / 10);
  bestScore = Math.max(bestScore, finalScore);
  
  drawGameOverScreen(finalScore);
}

function drawGameOverScreen(finalScore) {
 
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '32px sans-serif';
  ctx.fillText('Game Over', width / 2, height / 2 - 60);
  
  ctx.font = '24px sans-serif';
  ctx.fillText('Score: ' + finalScore, width / 2, height / 2 - 20);
  ctx.fillText('Best: ' + bestScore, width / 2, height / 2 + 10);
  
  ctx.font = '18px sans-serif';
  ctx.fillText('Press SPACE to restart', width / 2, height / 2 + 50);
}

function drawStartScreen() {
  
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, width, height);
  
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.font = '32px sans-serif';
  ctx.fillText('Endless Runner', width / 2, height / 2 - 60);
  
  ctx.font = '20px sans-serif';
  ctx.fillText('Controls:', width / 2, height / 2 - 20);
  ctx.fillText('← → / A D - Move', width / 2, height / 2 + 10);
  ctx.fillText('↑ / SPACE / W - Jump', width / 2, height / 2 + 40);
  
  ctx.font = '24px sans-serif';
  ctx.fillText('Press SPACE to start', width / 2, height / 2 + 90);
}

drawStartScreen();
