const canvas = document.getElementById('whackcanvas');
const ctx = canvas.getContext('2d');
const scoredisplay = document.getElementById('score');
const timerElement = document.getElementById("timer");
const audio = document.getElementById("audio");

const boxSize = 50;
let boxX, boxY;
let boxColor = "red";

let score = 0;
let timeLeft = 10;
let gameRunning = true;

const highs = Number(localStorage.getItem("high")) || 0;

function drawBox() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boxX = Math.random() * (canvas.width - boxSize);
    boxY = Math.random() * (canvas.height - boxSize);

    ctx.fillStyle = boxColor;
    ctx.fillRect(boxX, boxY, boxSize, boxSize);
}

function clickHandler(e) {
    if (!gameRunning) return; // 🚫 stop when game ends

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (
        clickX >= boxX && clickX <= boxX + boxSize &&
        clickY >= boxY && clickY <= boxY + boxSize
    ) {
        score++;
        scoredisplay.textContent = score;

        audio.currentTime = 0;
        audio.play();

        boxColor =
            boxColor === "red" ? "blue" :
            boxColor === "blue" ? "yellow" : "red";

        drawBox();
    }
}

canvas.addEventListener("click", clickHandler);
drawBox();

const countdown = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time left: ${timeLeft}`;

    if (timeLeft <= 0) {
        clearInterval(countdown);
        gameRunning = false; // 🛑 stop game
        timerElement.textContent = "Time's up!";

        if (score > highs) {
            localStorage.setItem("high", score);
            alert("New Highscore! " + score);
        } else {
            alert("Your final score is: " + score);
        }
    }
}, 1000); // ⏱️ always 1 second
