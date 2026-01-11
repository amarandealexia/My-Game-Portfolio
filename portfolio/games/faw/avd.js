const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

const BASE_WIDTH = 1250;
const BASE_HEIGHT = 600;
canvas.width = BASE_WIDTH;
canvas.height = BASE_HEIGHT;
let scale = Math.min(canvas.width / BASE_WIDTH, canvas.height / BASE_HEIGHT);

const menu = document.getElementById('menu');
const levelSelect = document.getElementById('level-select');
const instructions = document.getElementById('instructions');

let movableBoxes = [];
let levers = [], pressurePlates = [], movingPlatforms = [];
let platforms = [];
let hazards = [];
const gameOverMenu = document.getElementById('game-over-menu');
const playAgainBtn = document.getElementById('play-again-btn');
const customBtn = document.getElementById('custom-btn');

let gameOver = false;
let currentLevel = 1;

let diamondsCollected = 0;
let diamonds = [];
diamondsCollected = parseInt(localStorage.getItem('diamonds')) || 0;

const gameWonMenu = document.getElementById('game-won-menu');
const menuBtn = document.getElementById('menu-btn');

function showGameWonMenu() {
  gameWonMenu.style.display = 'flex';
  cancelAnimationFrame(animFrame);
}

function hideGameWonMenu() {
  gameWonMenu.style.display = 'none';
}

menuBtn.addEventListener('click', () => {
  hideGameWonMenu();
  showMenu();
});
const audio = {

  collect: new Audio('audio/Diamond.mp3'),
  menu: new Audio('audio/menu.mp3'),
  level: new Audio('audio/level.mp3'),
  death: new Audio('audio/Death.mp3'),

  play: function (sound, volume = 1) {
    const audioClip = this[sound];
    if (!audioClip) return;

    audioClip.currentTime = 0;
    audioClip.volume = volume;
    audioClip.play().catch(e => console.log("Audio play failed:", e));
  },


  loop: function (sound, volume = 0.5) {
    const audioClip = this[sound];
    if (!audioClip) return;

    audioClip.currentTime = 0;
    audioClip.volume = volume;
    audioClip.loop = true;
    audioClip.play().catch(e => console.log("Audio loop failed:", e));
  }
};


let equippedSkins = {
  angel: 'default',
  demon: 'default'
};


const playerImages = {
  angel: {
    default: new Image(),
    angel1: new Image()
  },
  demon: {
    default: new Image(),
    devil1: new Image()
  }
};

playerImages.angel.default.src = 'assets/angel.png';
playerImages.angel.angel1.src = 'assets/angel1.png';
playerImages.demon.default.src = 'assets/demon.png';
playerImages.demon.devil1.src = 'assets/devil1.png';

playerImages.angel.default.onload = updateShopButtons;
playerImages.angel.angel1.onload = updateShopButtons;
playerImages.demon.default.onload = updateShopButtons;
playerImages.demon.devil1.onload = updateShopButtons;

function showGameOverMenu() {
  gameOverMenu.style.display = 'flex';
  cancelAnimationFrame(animFrame);
  gameOver = true;
}

function hideGameOverMenu() {
  gameOverMenu.style.display = 'none';
  gameOver = false;
}


playAgainBtn.addEventListener('click', () => {
  hideGameOverMenu();
  startGame(currentLevel);
});


customBtn.addEventListener('click', () => {
  location.reload();
});


function loadEquippedSkins() {
  const savedSkins = localStorage.getItem('equippedSkins');
  if (savedSkins) {
    equippedSkins = JSON.parse(savedSkins);
  }
  updateShopButtons();
}


function showMenu() {
  menu.style.display = 'flex';
  levelSelect.style.display = 'none';
  instructions.style.display = 'none';
  document.getElementById('back-to-levels').style.display = 'none';
  cancelAnimationFrame(animFrame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  diamondsCollected = parseInt(localStorage.getItem('diamonds')) || 0;
  updateDiamondUI();
  audio.loop('menu');
  loadEquippedSkins();
}

function showLevelSelect() {
  menu.style.display = 'none';
  levelSelect.style.display = 'flex';
}

function showInstructions() {
  menu.style.display = 'none';
  instructions.style.display = 'flex';
}

function backToLevelSelect() {
  cancelAnimationFrame(animFrame);
  showLevelSelect();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const levels = {
  1: {
    platforms: [
      { x: 0, y: 600, width: 1100, height: 20 },
      { x: 1100, y: 550, width: 150, height: 70 },
      { x: 0, y: 520, width: 100, height: 20 },
      { x: 700, y: 460, width: 200, height: 30 },
      { x: 900, y: 480, width: 130, height: 30 },
      { x: 0, y: 430, width: 700, height: 30 },
      { x: 100, y: 300, width: 700, height: 30 },
      { x: 800, y: 280, width: 450, height: 30 },
      { x: 800, y: 170, width: 290, height: 30 },
      { x: 0, y: 100, width: 800, height: 30 },
      { x: 750, y: 100, width: 50, height: 100 },
    ],
    hazards: [
      { x: 400, y: 590, width: 50, height: 10, type: 'water' },
      { x: 700, y: 590, width: 50, height: 10, type: 'lava' },
      { x: 770, y: 450, width: 50, height: 10, type: 'mud' },
    ],
    levers: [
      { x: 850, y: 260, width: 20, height: 20, activated: false }
    ],
    pressurePlates: [
      { x: 500, y: 420, width: 40, height: 10, activated: false },
      { x: 500, y: 290, width: 40, height: 10, activated: false }
    ],
    movingPlatforms: [
      {
        x: 0,
        y: 410,
        width: 100,
        height: 20,
        direction: "up",
        speed: 1,
        active: false,
        originalY: 410,
        range: 100,
        hasMoved: false,
        triggerType: 'pressure'
      },
      {
        x: 1090,
        y: 170,
        width: 180,
        height: 20,
        direction: "down",
        speed: 1,
        active: false,
        originalY: 170,
        range: 70,
        hasMoved: false,
        triggerType: 'lever'
      }
    ],
    boxes: [
      { x: 950, y: 140, width: 30, height: 30, velX: 0, velY: 0 }
    ],
    diamonds: [
      { x: 420, y: 520, width: 10, height: 10, collected: false },
      { x: 720, y: 520, width: 10, height: 10, collected: false },
      { x: 700, y: 50, width: 10, height: 10, collected: false },
    ],
    doors: [
      { x: 200, y: 50, width: 50, height: 50, angelEntered: false, demonEntered: false }
    ]
  },
  2: {
    platforms: [
      { x: 0, y: 600, width: 1100, height: 20 },
      { x: 1100, y: 520, width: 150, height: 100 },
      { x: 0, y: 450, width: 1000, height: 20 },
      { x: 150, y: 530, width: 100, height: 20 },
      { x: 500, y: 530, width: 100, height: 20 },
      { x: 0, y: 380, width: 100, height: 90 },
      { x: 180, y: 310, width: 1100, height: 20 },
      { x: 500, y: 200, width: 100, height: 110 },
      { x: 285, y: 235, width: 100, height: 20 },
      { x: 703, y: 235, width: 100, height: 20 },
      { x: 900, y: 235, width: 100, height: 90 },
      { x: 1000, y: 180, width: 250, height: 150 },
      { x: 750, y: 110, width: 230, height: 20 },
      { x: 0, y: 110, width: 650, height: 20 },
    ],
    hazards: [
      { x: 150, y: 590, width: 100, height: 10, type: 'lava' },
      { x: 150, y: 530, width: 100, height: 10, type: 'water' },
      { x: 500, y: 590, width: 100, height: 10, type: 'water' },
      { x: 500, y: 530, width: 100, height: 10, type: 'lava' },
      { x: 260, y: 300, width: 240, height: 10, type: 'mud' },
      { x: 600, y: 300, width: 300, height: 10, type: 'mud' },

    ],
    pressurePlates: [
      { x: 800, y: 440, width: 40, height: 10, activated: false },
      { x: 300, y: 440, width: 40, height: 10, activated: false },
    ],
    levers: [
      { x: 800, y: 90, width: 20, height: 20, activated: false }
    ],
    movingPlatforms: [
      {
        x: 540,
        y: 310,
        width: 20,
        height: 160,
        direction: "up",
        speed: 4,
        active: false,
        originalY: 310,
        range: 120,
        hasMoved: false,
        triggerType: 'pressure'
      },
      {
        x: 650,
        y: -20,
        width: 100,
        height: 20,
        direction: "down",
        speed: 1,
        active: false,
        originalY: -20,
        range: 130,
        hasMoved: false,
        triggerType: 'lever'
      }
    ],
    diamonds: [
      { x: 195, y: 490, width: 10, height: 10, collected: false },
      { x: 545, y: 490, width: 10, height: 10, collected: false },
      { x: 693, y: 50, width: 10, height: 10, collected: false },
    ],
    doors: [
      { x: 200, y: 60, width: 50, height: 50, angelEntered: false, demonEntered: false }
    ]
  },

};

let players = {};
let keys = {};
let gravity = 0.3;
let animFrame;

playerImages.angel.src = 'assets/angel.png';
playerImages.demon.src = 'assets/demon.png';

function startGame(levelNum) {
  currentLevel = levelNum;
  menu.style.display = 'none';
  levelSelect.style.display = 'none';
  instructions.style.display = 'none';
  audio.loop('level');
  diamondsCollected = parseInt(localStorage.getItem('diamonds')) || 0;
  updateDiamondUI();
  loadEquippedSkins();
  const levelData = levels[levelNum];
  //
  diamonds = (levelData.diamonds || []).map(d => ({
    ...d,
    collected: d.collected || false
  }));

  movableBoxes = levelData.boxes || [];

  players = {
    angel: {
      x: 0,
      y: 450,
      width: 65,
      height: 65,
      color: 'blue',
      speed: 6,
      velX: 0,
      velY: 0,
      jumping: false,
      grounded: false
    },
    demon: {
      x: 0,
      y: 500,
      width: 65,
      height: 65,
      color: 'red',
      speed: 6,
      velX: 0,
      velY: 0,
      jumping: false,
      grounded: false
    }
  };

  platforms = levelData.platforms || [];
  hazards = levelData.hazards || [];
  levers = levelData.levers || [];
  pressurePlates = levelData.pressurePlates || [];
  movingPlatforms = levelData.movingPlatforms || [];

  animFrame = requestAnimationFrame(update);
}

window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);

window.addEventListener("keydown", e => {
  if (e.code === "KeyM") {
    showMenu();
  } else if (e.code === "Escape") {
    backToLevelSelect();
  } else if (e.code === "KeyR") {
    location.reload();
  }
});

function handleMovement(player, left, right, jump) {
  player.velX = 0;
  if (keys[left]) player.velX = -player.speed;
  if (keys[right]) player.velX = player.speed;
  if (keys[jump] && !player.jumping && player.grounded) {
    player.velY = -6;
    player.jumping = true;
    player.grounded = false;
  }
}

function handleBoxCollision(player) {
  movableBoxes.forEach(box => {

    if (
      player.x + player.width > box.x &&
      player.x < box.x &&
      player.y + player.height > box.y &&
      player.y < box.y + box.height
    ) {
      box.x += player.speed;
    }


    if (
      player.x < box.x + box.width &&
      player.x + player.width > box.x + box.width &&
      player.y + player.height > box.y &&
      player.y < box.y + box.height
    ) {
      box.x -= player.speed;
    }
  });
}

function handleDiamondCollection() {
  diamonds.forEach(diamond => {
    if (!diamond.collected) {
      Object.values(players).forEach(player => {
        if (player.x < diamond.x + diamond.width &&
          player.x + player.width > diamond.x &&
          player.y < diamond.y + diamond.height &&
          player.y + player.height > diamond.y) {
          diamond.collected = true;
          diamondsCollected++;
          localStorage.setItem('diamonds', diamondsCollected);
          updateDiamondUI();
          audio.play('collect');
        }
      });
    }
  });
}

function updateDiamondUI() {
  document.getElementById('diamond-count').textContent = diamondsCollected;
}

function openShop() {
  document.getElementById('shop-window').style.display = 'block';
  cancelAnimationFrame(animFrame);
  updateShopButtons();
}

function closeShop() {
  document.getElementById('shop-window').style.display = 'none';
  if (!gameOver && !menu.style.display === 'flex') {
    animFrame = requestAnimationFrame(update);
  }
}
function buyItem(skinType, cost) {
  if (diamondsCollected >= cost) {
    diamondsCollected -= cost;
    localStorage.setItem('diamonds', diamondsCollected);

    if (skinType.includes('angel')) {
      equippedSkins.angel = skinType;
    } else {
      equippedSkins.demon = skinType;
    }


    localStorage.setItem('equippedSkins', JSON.stringify(equippedSkins));

    updateDiamondUI();
    updateShopButtons();
    return true;
  } else {
    alert("Not enough diamonds!");
    return false;
  }
}

function updateShopButtons() {
  const shopItems = document.querySelectorAll('.shop-item');

  shopItems.forEach(item => {
    const img = item.querySelector('img');
    const skinType = img.alt.toLowerCase();
    const skinName = img.src.split('/').pop().split('.')[0];

    const button = item.querySelector('button') || document.createElement('button');


    const isEquipped = (skinType === 'angel' && equippedSkins.angel === skinName) ||
      (skinType === 'devil' && equippedSkins.demon === skinName);

    if (isEquipped) {
      button.textContent = 'Unequip';
      button.onclick = function () {
        unequipSkin(skinType);
      };
    } else {
      const cost = item.getAttribute('data-cost') || 10;
      button.textContent = `Buy (${cost} 💎)`;
      button.onclick = function () {
        buyItem(skinName, parseInt(cost));
      };
    }

    if (!item.querySelector('button')) {
      item.appendChild(button);
    }
  });
}
function unequipSkin(characterType) {
  if (characterType === 'angel') {
    equippedSkins.angel = 'default';
  } else {
    equippedSkins.demon = 'default';
  }

  localStorage.setItem('equippedSkins', JSON.stringify(equippedSkins));
  updateShopButtons();
}

function checkDoorCollisions() {
  const levelData = levels[currentLevel];
  if (!levelData.doors) return false;

  let allDoorsComplete = true;

  levelData.doors.forEach(door => {

    if (!door.angelEntered &&
      players.angel.x < door.x + door.width &&
      players.angel.x + players.angel.width > door.x &&
      players.angel.y < door.y + door.height &&
      players.angel.y + players.angel.height > door.y) {
      door.angelEntered = true;
    }


    if (!door.demonEntered &&
      players.demon.x < door.x + door.width &&
      players.demon.x + players.demon.width > door.x &&
      players.demon.y < door.y + door.height &&
      players.demon.y + players.demon.height > door.y) {
      door.demonEntered = true;
    }


    if (!door.angelEntered || !door.demonEntered) {
      allDoorsComplete = false;
    }
  });

  return allDoorsComplete;
}

function checkPlatformCollision(player) {
  player.grounded = false;


  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height <= p.y + p.height &&
      player.y + player.height + player.velY >= p.y
    ) {
      player.y = p.y - player.height;
      player.velY = 0;
      player.jumping = false;
      player.grounded = true;
    }
  });


  movingPlatforms.forEach(mp => {
    if (
      player.x < mp.x + mp.width &&
      player.x + player.width > mp.x &&
      player.y + player.height <= mp.y + mp.height &&
      player.y + player.height + player.velY >= mp.y
    ) {

      player.y = mp.y - player.height;
      player.velY = 0;
      player.jumping = false;
      player.grounded = true;


      if (mp.deltaY !== 0) {
        player.y += mp.deltaY;
      }
    }
  });


  if (player.y + player.height >= BASE_HEIGHT) {
    player.y = BASE_HEIGHT - player.height;
    player.velY = 0;
    player.jumping = false;
    player.grounded = true;
  }
}


function checkHazardCollision(player, type) {
  if (gameOver) return;

  hazards.forEach(h => {
    if (
      h.type === type &&
      player.x < h.x + h.width &&
      player.x + player.width > h.x &&
      player.y + player.height >= h.y &&
      player.y + player.height <= h.y + h.height &&
      player.velY >= 0
    ) {
      audio.play('death');
      showGameOverMenu();
    }
  });
}

function drawDoors() {
  const levelData = levels[currentLevel];
  if (!levelData.doors) return;

  levelData.doors.forEach(door => {

    ctx.fillStyle = 'brown';
    ctx.fillRect(door.x, door.y, door.width, door.height);


    if (door.angelEntered) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(door.x + 5, door.y + 5, 15, 15);
    }
    if (door.demonEntered) {
      ctx.fillStyle = 'red';
      ctx.fillRect(door.x + 30, door.y + 5, 15, 15);
    }
  });
}

function drawBoxes() {
  ctx.fillStyle = "white";
  movableBoxes.forEach(box => {
    ctx.fillRect(box.x, box.y, box.width, box.height);
  });
}

function drawPlatforms() {
  ctx.fillStyle = "gray";
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));
}

function drawHazards() {
  hazards.forEach(h => {
    ctx.fillStyle = h.type === 'lava' ? '#67779e' :
      h.type === 'water' ? '#9e6777' :
        h.type === 'mud' ? 'black' : 'brown';
    ctx.fillRect(h.x, h.y, h.width, h.height);
  });
}

function drawLevers() {
  ctx.fillStyle = 'silver';
  levers.forEach(l => {
    ctx.fillRect(l.x, l.y, l.width, l.height);
    if (l.activated) {
      ctx.fillStyle = 'green';
      ctx.fillRect(l.x + 5, l.y + 5, l.width - 10, l.height - 10);
      ctx.fillStyle = 'silver';
    }
  });
}

function drawPressurePlates() {
  ctx.fillStyle = 'silver';
  pressurePlates.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
    if (p.activated) {
      ctx.fillStyle = 'green';
      ctx.fillRect(p.x + 5, p.y + 2, p.width - 10, p.height - 4);
      ctx.fillStyle = 'silver';
    }
  });
}

function drawMovingPlatforms() {
  ctx.fillStyle = 'white';
  movingPlatforms.forEach(mp => {
    ctx.fillRect(mp.x, mp.y, mp.width, mp.height);
  });
}
const BARRIER_X = 800;

function updateBoxes() {
  movableBoxes.forEach(box => {

    box.velY += gravity;


    box.x += box.velX;
    box.y += box.velY;


    if (box.x < BARRIER_X) {
      box.x = BARRIER_X;
      box.velX = 0;
    }


    if (box.y + box.height > BASE_HEIGHT) {
      box.y = BASE_HEIGHT - box.height;
      box.velY = 0;
    }


    if (box.x < 0) {
      box.x = 0;
      box.velX = 0;
    }


    platforms.forEach(p => {
      if (
        box.x < p.x + p.width &&
        box.x + box.width > p.x &&
        box.y + box.height <= p.y + p.height &&
        box.y + box.height + box.velY >= p.y
      ) {
        box.y = p.y - box.height;
        box.velY = 0;
      }
    });


    movingPlatforms.forEach(mp => {
      if (
        box.x < mp.x + mp.width &&
        box.x + box.width > mp.x &&
        box.y + box.height <= mp.y + mp.height &&
        box.y + box.height + box.velY >= mp.y
      ) {
        box.y = mp.y - box.height;
        box.velY = 0;


        if (mp.deltaY !== 0) {
          box.y += mp.deltaY;
        }
      }
    });
  });
}




function updatePressurePlates() {
  pressurePlates.forEach(p => {
    p.activated = false;


    for (let key in players) {
      const player = players[key];
      if (playerIsOnPlate(player, p)) {
        p.activated = true;
        break;
      }
    }


    if (!p.activated) {
      for (let box of movableBoxes) {
        if (boxIsOnPlate(box, p)) {
          p.activated = true;
          break;
        }
      }
    }
  });
}

function playerIsOnPlate(player, plate) {
  return (
    player.x < plate.x + plate.width &&
    player.x + player.width > plate.x &&
    player.y + player.height >= plate.y &&
    player.y + player.height <= plate.y + plate.height + 15 &&
    (player.velY >= 0 || player.grounded)
  );
}

function boxIsOnPlate(box, plate) {
  return (
    box.x < plate.x + plate.width &&
    box.x + box.width > plate.x &&
    box.y + box.height >= plate.y &&
    box.y + box.height <= plate.y + plate.height + 15 &&
    (box.velY >= 0 || Math.abs(box.velY) < 0.1)
  );
}

function updateMovingPlatforms() {
  movingPlatforms.forEach(mp => {

    let oldY = mp.y;


    if (mp.triggerType === 'pressure') {
      mp.active = pressurePlates.some(p => p.activated);
    }
    else if (mp.triggerType === 'lever') {
      mp.active = levers.some(l => l.activated);
    }


    if (mp.active) {
      if (!mp.hasMoved) mp.hasMoved = true;

      if (mp.direction === 'up') {
        mp.y = Math.max(mp.originalY - mp.range, mp.y - mp.speed);
      }
      else if (mp.direction === 'down') {
        mp.y = Math.min(mp.originalY + mp.range, mp.y + mp.speed);
      }
    }
    else if (mp.hasMoved) {

      if (mp.direction === 'up') {
        mp.y = Math.min(mp.originalY, mp.y + mp.speed);
        if (mp.y >= mp.originalY) mp.hasMoved = false;
      }
      else if (mp.direction === 'down') {
        mp.y = Math.max(mp.originalY, mp.y - mp.speed);
        if (mp.y <= mp.originalY) mp.hasMoved = false;
      }
    }


    mp.deltaY = mp.y - oldY;
  });
}


function update() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(scale, scale);

  handleMovement(players.angel, 'KeyA', 'KeyD', 'KeyW');
  handleMovement(players.demon, 'ArrowLeft', 'ArrowRight', 'ArrowUp');


  for (const key in players) {
    let player = players[key];
    player.velY += gravity;
    player.x += player.velX;
    player.y += player.velY;

    checkPlatformCollision(player);


    if (key === 'angel') {
      checkHazardCollision(player, 'lava');
      checkHazardCollision(player, 'mud');
    } else if (key === 'demon') {
      checkHazardCollision(player, 'water');
      checkHazardCollision(player, 'mud');
    }

    handleBoxCollision(player);


    if (player.x < 0) player.x = 0;
    if (player.x + player.width > BASE_WIDTH) player.x = BASE_WIDTH - player.width;

    if (player.y + player.height > BASE_HEIGHT) {
      player.y = BASE_HEIGHT - player.height;
      player.velY = 0;
      player.jumping = false;
      player.grounded = true;
    }
  }


  levers.forEach(l => {
    for (const key in players) {
      let p = players[key];
      if (
        p.x < l.x + l.width &&
        p.x + p.width > l.x &&
        p.y + p.height > l.y &&
        p.y < l.y + l.height &&

        ((key === 'angel' && keys['KeyE']) || (key === 'demon' && keys['KeyE']))
      ) {
        l.activated = !l.activated;
      }
    }
  });
  function drawDiamonds() {
    diamonds.forEach(diamond => {
      if (!diamond.collected) {
        ctx.fillStyle = 'cyan';
        ctx.fillRect(diamond.x, diamond.y, diamond.width, diamond.height);
      }
    });
  }

  pressurePlates.forEach(p => {

    const boxOnPlate = movableBoxes.some(box =>
      box.x < p.x + p.width &&
      box.x + box.width > p.x &&
      box.y + box.height > p.y &&
      box.y < p.y + p.height
    );


    if (boxOnPlate) {
      p.activated = true;
    } else if (p.activated) {

      p.activated = false;
    }
  });

  drawDoors();
  updatePressurePlates();
  updateMovingPlatforms();
  updateBoxes();
  drawPlatforms();
  drawHazards();
  drawLevers();
  drawPressurePlates();
  drawMovingPlatforms();
  drawBoxes();
  drawDiamonds();
  handleDiamondCollection();
  updateDiamondUI();
  if (checkDoorCollisions()) {
    diamondsCollected += 5;
    localStorage.setItem('diamonds', diamondsCollected);
    updateDiamondUI();
    showGameWonMenu();
    return;
  }

  for (const key in players) {
    let p = players[key];
    let img = playerImages[key][equippedSkins[key]];

    if (img && img.complete) {
      ctx.drawImage(img, p.x, p.y, p.width, p.height);
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.width, p.height);
    }
  }

  ctx.fillStyle = 'white';
  ctx.font = `${20 * scale}px Arial`;
  ctx.fillText(`💎: ${diamondsCollected}`, 20 * scale, 30 * scale);
  ctx.restore();
  animFrame = requestAnimationFrame(update);
}
loadEquippedSkins();
showMenu();

console.log(diamondsCollected)