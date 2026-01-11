// Cleaned and structured version of your Galaga-inspired game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};

document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'ShiftLeft') dash();
});

document.addEventListener('keyup', e => keys[e.code] = false);

let player, enemies, enemyBullets, stage, formatDirection, score, highScore, lastEnemyShot, explosions, gameOver;

let canDash = true;
const dashCooldown = 2000;
const dashDistance = 100;

function resetGame() {
    player = {
        x: canvas.width / 2 - 20,
        y: canvas.height - 60,
        width: 40,
        height: 30,
        speed: 5,
        bullets: [],
        alive: true,
        lastShot: 0
    };
    enemies = [];
    enemyBullets = [];
    explosions = [];
    stage = 1;
    formatDirection = 1;
    lastEnemyShot = 0;
    score = 0;
    highScore = localStorage.getItem('highscore') || 0;
    gameOver = false;
    spawnEnemies();
    document.getElementById('restartBtn').style.display = 'none';
}

function playSound({ frequency = 440, type = "square", duration = 0.1, volume = 0.1 }) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function spawnEnemies() {
    const cols = 6, rows = 4, spacingX = 60, spacingY = 50, offsetX = 60, offsetY = 60;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let hp = 1, color = 'lime';
            if (row === 0) { hp = 3; color = 'yellow'; }
            else if (row === 1) { hp = 2; color = 'blue'; }
            enemies.push({
                x: offsetX + col * spacingX,
                y: offsetY + row * spacingY,
                width: 30,
                height: 30,
                alive: true,
                hp: hp,
                color: color
            });
        }
    }
}

function shoot() {
    if (Date.now() - player.lastShot > 300) {
        player.bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10,
            speed: 7,
            hit: false
        });
        player.lastShot = Date.now();
        playSound({ frequency: 880, type: "square", duration: 0.05, volume: 0.2 });
    }
}

function enemyShot() {
    const aliveEnemies = enemies.filter(e => e.alive);
    if (aliveEnemies.length === 0) return;
    const e = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    enemyBullets.push({
        x: e.x + e.width / 2 - 2,
        y: e.y + e.height,
        width: 4,
        height: 10,
        speed: 4
    });
}

function update() {
    if (gameOver) return;

    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    if (keys['Space']) shoot();

    player.bullets.forEach(b => b.y -= b.speed);
    player.bullets = player.bullets.filter(b => b.y > 0 && !b.hit);

    const moveAmt = 0.5 + stage * 0.05;
    let shouldReverse = false;

    enemies.forEach(e => {
        if (e.alive) {
            e.x += moveAmt * formatDirection;
            if (e.x < 0 || e.x + e.width > canvas.width) shouldReverse = true;
        }
    });
    if (shouldReverse) {
        formatDirection *= -1;
        enemies.forEach(e => e.y += 10);
    }

    player.bullets.forEach(bullet => {
        enemies.forEach(e => {
            if (e.alive && bullet.x < e.x + e.width && bullet.x + bullet.width > e.x && bullet.y < e.y + e.height && bullet.y + bullet.height > e.y) {
                e.hp--;
                bullet.hit = true;
                if (e.hp <= 0) {
                    e.alive = false;
                    score += 100;
                    explosions.push({ x: e.x + e.width / 2, y: e.y + e.height / 2, radius: 0, createdAt: Date.now() });
                    playSound({ frequency: 220, type: "sawtooth", duration: 0.15, volume: 0.1 });
                } else {
                    playSound({ frequency: 440, type: "triangle", duration: 0.15, volume: 0.1 });
                }
            }
        });
    });

    const interval = Math.max(150, 1000 - stage * 100);
    if (Date.now() - lastEnemyShot > interval) {
        enemyShot();
        lastEnemyShot = Date.now();
    }

    enemyBullets.forEach(b => b.y += b.speed);
    enemyBullets = enemyBullets.filter(b => b.y < canvas.height);

    enemyBullets.forEach(b => {
        if (b.x < player.x + player.width && b.x + b.width > player.x && b.y < player.y + player.height && b.y + b.height > player.y) {
            player.alive = false;
            gameOver = true;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highscore", highScore);
            }
            document.getElementById('restartBtn').style.display = "block";
        }
    });

    explosions = explosions.filter(ex => Date.now() - ex.createdAt < 300);
    explosions.forEach(ex => ex.radius += 1.5);
}

function dash() {
    if (!canDash || !player.alive) return;

    if (keys['ArrowLeft']) {
        player.x = Math.max(0, player.x - dashDistance);
    } else if (keys['ArrowRight']) {
        player.x = Math.min(canvas.width - player.width, player.x + dashDistance);
    }

    canDash = false;
    setTimeout(() => canDash = true, dashCooldown);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = '30px Arial';
        ctx.fillText("Game Over", canvas.width / 2 - 75, canvas.height / 2 - 20);
        ctx.font = '20px Courier';
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2);
        ctx.fillText(`Highscore: ${highScore}`, canvas.width / 2 - 80, canvas.height / 2 + 30);
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    player.bullets.forEach(b => {
        ctx.fillStyle = 'red';
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    enemies.forEach(e => {
        if (e.alive) {
            ctx.fillStyle = e.color;
            ctx.fillRect(e.x, e.y, e.width, e.height);
        }
    });

    enemyBullets.forEach(b => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    explosions.forEach(ex => {
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, ex.radius, 0, Math.PI * 2);
        ctx.fillStyle = "orange";
        ctx.fill();
    });

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`Stage: ${stage}`, 10, 20);
    ctx.fillText(`Score: ${score}`, 10, 40);
    ctx.fillText(`Highscore: ${highScore}`, 10, 60);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

resetGame();
gameLoop();