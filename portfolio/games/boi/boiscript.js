const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 500;


const playerImage = new Image();
playerImage.src = 'assets//ooeeoo.png';


const enemyImage = new Image();
enemyImage.src = 'assets//badguy.png';

const doorImage = new Image();
doorImage.src = 'assets//door.png';

const audio = new Audio('assets/pan.mp3');
audio.volume = 0.2;

let enemySpawnInterval = null;
let lastHitTime = 0;
const HIT_COOLDOWN = 1000; 
let isGameOver = false;

const player = {
  x: canvas.width / 2.5,
  y: canvas.height / 2.5,
  size: 100,
  speed: 4,
  health: 3,
};

const keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

const door = {
  x: -20,
  y: 200,
  width: 100,
  height: 100
};

const projectiles = [];
//ENEMIES WOWOWOWO
const enemies = [];

function spawnEnemy() {
  const size = 50;
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  enemies.push({ x, y, size, speed: 1.5 });
}

setInterval(spawnEnemy, 2000); //this just spawns them

document.addEventListener('keydown', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }

  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    shoot(e.key);
  }
});

// PUT YOUR HATS ON CAUSE IM ABOUT TO LITERALLY SOUND LIKE COLUMBUS FINDIN AMERICA
// these two up and down lines are literally jesus. they verify if the key is pressed (keydown) or not pressed (keyup)
document.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

// Function to shoot projectiles
function shoot(direction) {
  const size = 10;
  const speed = 5;

  let dx = 0;
  let dy = 0;

  if (direction === 'ArrowUp') dy = -speed;
  if (direction === 'ArrowDown') dy = speed;
  if (direction === 'ArrowLeft') dx = -speed;
  if (direction === 'ArrowRight') dx = speed;

  // Push new projectile to the projectiles array
  projectiles.push({
    x: player.x + player.size / 2 - size / 2,
    y: player.y + player.size / 2 - size / 2,
    dx,
    dy,
    size
  });
}

function update() {
  if (keys.w) player.y -= player.speed;
  if (keys.s) player.y += player.speed;
  if (keys.a) player.x -= player.speed;
  if (keys.d) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // Move projectiles
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].x += projectiles[i].dx;
    projectiles[i].y += projectiles[i].dy;
  }

  // Remove projectiles that go off-screen
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    if (
      p.x < 0 || p.x > canvas.width ||
      p.y < 0 || p.y > canvas.height
    ) {
      projectiles.splice(i, 1);
    }
  }

  // Move enemies toward the player
  for (let enemy of enemies) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 1) {
      enemy.x += (dx / distance) * enemy.speed;
      enemy.y += (dy / distance) * enemy.speed;
    } // i do not understand this but it shall work bitch
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);

  
  ctx.fillStyle = ' #b03748';
  for (const p of projectiles) {
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.drawImage(doorImage, door.x, door.y, door.width, door.height);
  
  ctx.fillStyle = 'black';
  for (const enemy of enemies) {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.size, enemy.size);
  }

  // Display health
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`${player.health} ❤️`, 10, 20);
}

function collisionDetection() {
  for (let enemy of enemies) {
    if (player.x < enemy.x + enemy.size &&
      player.x + player.size > enemy.x &&
      player.y < enemy.y + enemy.size &&
      player.y + player.size > enemy.y) {
      player.health -= 1; 
      enemies.splice(enemies.indexOf(enemy), 1); 
      break;
    }
  }
  if (player.x < door.x + door.width &&
    player.x + player.size > door.x &&
    player.y < door.y + door.height &&
    player.y + player.size > door.y) {

    enterNewRoom();
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];

      if (p.x < enemy.x + enemy.size &&
        p.x + p.size > enemy.x &&
        p.y < enemy.y + enemy.size &&
        p.y + p.size > enemy.y) {

        projectiles.splice(i, 1); // Remove projectile
        enemies.splice(j, 1); // Remove enemy

        audio.currentTime = 0;
        audio.play();
        break; // Exit loop after collision to avoid removing multiple enemies
      }
    }
  }
}

function enterNewRoom() {
  
  enemies.length = 0; 
  player.x = canvas.width ; // resetare??
  player.y = canvas.height / 2.5;
  setInterval(spawnEnemy, 2000);
}

function gameOver() {
  if (player.health <= 0 && !isGameOver) {
    isGameOver = true;
    clearInterval(enemySpawnInterval);
    setTimeout(() => {
      location.reload();
    }, 500);
  }
}


function gameLoop() {
  update();
  collisionDetection();
  draw();
  gameOver();
  requestAnimationFrame(gameLoop);
}

gameLoop();


