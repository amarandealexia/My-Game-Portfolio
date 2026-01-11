
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

const keys = {};

let platforms = [];

function resetPlatforms() {
  platforms = [
    { x: 0, y: GAME_HEIGHT - 5, width: width + 50, height: 5 }
  ];
}

resetPlatforms();


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


  player.grounded = false;
  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y < p.y + p.height &&
      player.y + player.height > p.y
    ) {
      player.y = p.y - player.height;
      player.velY = 0;
      player.grounded = true;
      player.jumping = false;
    }
  });

 
  if (player.y > GAME_HEIGHT + 100 || player.x < -50 || player.x > width + 50) {
    endGame();
    return;
  }

  draw();
  requestAnimationFrame(update);
}


function draw() {
  ctx.clearRect(0, 0, width, height);

  
  ctx.fillStyle = '#333';
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);


  ctx.fillStyle = 'black';
  ctx.font = '16px sans-serif';
  ctx.fillText('Score: ' + Math.floor(score / 10), width / 2, 20);
}

function endGame() {
  gameRunning = false;
  bestScore = Math.max(bestScore, Math.floor(score / 10));

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.font = '24px sans-serif';
  ctx.fillText('Game Over', width / 2, height / 2 - 20);
  ctx.font = '16px sans-serif';
  ctx.fillText('Score: ' + Math.floor(score / 10), width / 2, height / 2 + 10);
  ctx.fillText('Best: ' + bestScore, width / 2, height / 2 + 30);
  ctx.fillText('Press SPACE to restart', width / 2, height / 2 + 60);
}

ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.font = '24px sans-serif';
ctx.fillText('Endless Runner', width / 2, height / 2 - 20);
ctx.font = '16px sans-serif';
ctx.fillText('Press SPACE to start', width / 2, height / 2 + 20);
