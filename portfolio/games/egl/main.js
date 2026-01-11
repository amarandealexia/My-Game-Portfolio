let state = {
  dress: 0,
  hair: 0,
  hat1: 0,
  hat2: 0,
  shoes: 0,
  face: 0,
};

document.addEventListener('DOMContentLoaded', function () {
  updateDress();
  updateHair();
  updateShoes();
  updateHat1();
  updateHat2();
  updateFace();
});

function themes() {
  const themesArray = ["Sweet Lolita", "Tea Party", "Goth Lolita", "Classic Lolita", "All Blue"];
  const randomIndex = Math.floor(Math.random() * themesArray.length);
  const chosenTheme = themesArray[randomIndex];
  document.getElementById("h3").innerText = "Theme: " + chosenTheme;
}

window.addEventListener('click', function playBloomin() {
  const audio = new Audio('bloomin.mp3');
  audio.volume = 0.2;
  audio.currentTime = 0;
  audio.loop = true;
  audio.play();
  window.removeEventListener('click', playBloomin);
});

function nextdress() {
  state.dress = (state.dress + 1) % 6;
  updateDress();
}

function updateDress() {
  let dress = document.querySelector("#dress");
  dress.style.backgroundImage = `url("/images/dress${state.dress}.png")`;
}

function nextshoes() {
  state.shoes = (state.shoes + 1) % 4;
  updateShoes();
}

function updateShoes() {
  let shoes = document.querySelector("#shoes");
  shoes.className = `doll-layer shoes${state.shoes}`;
  const audio = new Audio('meow.mp3');
  audio.volume = 0.7;
  audio.currentTime = 0;
  audio.play();
}

function nexthair() {
  state.hair = (state.hair + 1) % 3;
  updateHair();
}

function updateHair() {
  let hair = document.querySelector("#hair");
  hair.className = `doll-layer hair${state.hair}`;
  const audio = new Audio('meow.mp3');
  audio.volume = 0.7;
  audio.currentTime = 0;
  audio.play();
}

function nexthat1() {
  state.hat1 = (state.hat1 + 1) % 7;
  updateHat1();
}

function updateHat1() {
  let hat1 = document.querySelector("#hat1");
  hat1.className = `doll-layer hat${state.hat1}`;
  const audio = new Audio('meow.mp3');
  audio.volume = 0.7;
  audio.currentTime = 0;
  audio.play();
}

function nexthat2() {
  state.hat2 = (state.hat2 + 1) % 7;
  updateHat2();
}

function updateHat2() {
  let hat2 = document.querySelector("#hat2");
  hat2.className = `doll-layer hat${state.hat2}`;
  const audio = new Audio('meow.mp3');
  audio.volume = 0.7;
  audio.currentTime = 0;
  audio.play();
}

function nextface() {
  state.face = (state.face + 1) % 5;
  updateFace();
}

function updateFace() {
  let face = document.querySelector("#face");
  face.className = `doll-layer face${state.face}`;
  const audio = new Audio('meow.mp3');
  audio.volume = 0.7;
  audio.currentTime = 0;
  audio.play();
}

function saveOutfit() {
  const dollViewer = document.querySelector('.doll-viewer');
  html2canvas(dollViewer, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: null
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'lolita-outfit.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
  const audio = new Audio('meow.mp3');
  audio.volume = 0.7;
  audio.currentTime = 0;
  audio.play();
}
function randomizeOutfit() {
  state.dress = Math.floor(Math.random() * 6);  
  state.hair = Math.floor(Math.random() * 3);    
  state.hat1 = Math.floor(Math.random() * 7);    
  state.hat2 = Math.floor(Math.random() * 7);
  state.shoes = Math.floor(Math.random() * 4);   
  state.face = Math.floor(Math.random() * 5);   
  const audio = new Audio('meow.mp3');
  audio.volume = 0.7;
  audio.currentTime = 0;
  audio.play();
  updateDress();
  updateHair();
  updateHat1();
  updateHat2();
  updateShoes();
  updateFace();
}
function resetOutfit() {
  state = {
    dress: 0,
    hair: 0,
    hat1: 0,
    hat2: 0,
    shoes: 0,
    face: 0
  };

  updateDress();
  updateHair();
  updateHat1();
  updateHat2();
  updateShoes();
  updateFace();

  const audio = new Audio('meow.mp3');
  audio.volume = 0.7;
  audio.currentTime = 0;
  audio.play();
}

function saveSlot(slotNumber) {
  const key = `lolitaSlot${slotNumber}`;
  localStorage.setItem(key, JSON.stringify(state));
  const audio = new Audio('meow.mp3');
  audio.volume = 0.7;
  audio.play();

}

function loadSlot(slotNumber) {
  const key = `lolitaSlot${slotNumber}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    state = JSON.parse(saved);
    updateDress();
    updateHair();
    updateHat1();
    updateHat2();
    updateShoes();
    updateFace();
    const audio = new Audio('meow.mp3');
    audio.volume = 0.7;
    audio.play();

  }
}


document.querySelectorAll('.buttonBox').forEach((img, index) => {
  img.addEventListener('click', () => {
    if (img.nextElementSibling && img.nextElementSibling.classList.contains('secret-hat-btn')) {
      return;
    }

    const secretBtn = document.createElement('button');
    secretBtn.textContent = 'MaGic in youR Eyes';
    secretBtn.classList.add('secret-hat-btn');

   secretBtn.addEventListener('click', () => {
  document.getElementById('hat2').style.backgroundImage = 'url("./images/hat7.png")';
});


    img.insertAdjacentElement('afterend', secretBtn);
  });
});
//222 lines <3

const tarotCards = [
  { img: './tarot/moon.jpg', message: '🌙 The Moon — Trust your intuition, even when the path is unclear.' },
  { img: './tarot/lovers.jpg', message: '💘 The Lovers — A choice of the heart is blooming within you.' },
  { img: './tarot/star.jpg', message: '✨ The Star — Hope is not lost. A quiet miracle is unfolding.' },
  { img: './tarot/magician.jpg', message: '🪄 The Magician — You already have the tools. Begin your spell.' },
  { img: './tarot/empress.jpg', message: '🌺 The Empress — Let yourself be lush, abundant, and unapologetically soft.' },
  { img: './tarot/fool.jpg', message: '🎒 The Fool — Leap! The universe loves a little chaos and courage.' },
  { img: './tarot/temperance.jpg', message: '🫖 Temperance — Stir slowly. Balance will return with patience.' },
  { img: './tarot/tower.jpg', message: '⚡ The Tower — Sometimes collapse clears the sky for starlight.' }
];



function drawTarot() {
  const container = document.getElementById("tarot-container");
  const image = document.getElementById("tarot-image");
  const message = document.getElementById("tarot-message");
  image.style.width = '300px';
  image.style.height = '529px';
  const randomIndex = Math.floor(Math.random() * tarotCards.length);
  const card = tarotCards[randomIndex];
  image.src = card.img;
  message.textContent = card.message;
}



