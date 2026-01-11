
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const paddleHeight = 100;
const paddleWidth = 10;
let ballSize = 10;

// Background colors with transparency for trail effect
//the more you know
const backgrounds = ["rgb(58, 5, 25,0.1)", "rgb(103, 13, 47,0.1)", "rgb(165, 56, 96,0.1)", "rgb(239, 136, 173,0.1)"];
let currentBackgroundIndex = 0;

document.getElementById('size').addEventListener("click", () => {
    ballSize = 100;
});

let leftPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0
};

let rightPaddle = {
    x: canvas.width - 20,
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5 * (Math.random() > 0.5 ? 1 : -1),
    dy: 4 * (Math.random() > 0.5 ? 1 : -1)
};

const keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall() {
    drawRect(ball.x, ball.y, ballSize, ballSize, "#fff");
}

function drawScores() {
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(leftPaddle.score, canvas.width / 4, 30);
    ctx.fillText(rightPaddle.score, canvas.width * 3 / 4, 30);
}

function update() {

    if (keys["w"] && leftPaddle.y > 0) leftPaddle.y -= 6;
    if (keys["s"] && leftPaddle.y + paddleHeight < canvas.height) leftPaddle.y += 6;
    if (keys["ArrowUp"] && rightPaddle.y > 0) rightPaddle.y -= 6;
    if (keys["ArrowDown"] && rightPaddle.y + paddleHeight < canvas.height) rightPaddle.y += 6;


    ball.x += ball.dx;
    ball.y += ball.dy;


    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
        ball.dy *= -1;
    }


    if (
        ball.x <= leftPaddle.x + paddleWidth &&
        ball.y + ballSize >= leftPaddle.y &&
        ball.y <= leftPaddle.y + paddleHeight
    ) {
        ball.dx *= -1;
        ball.x = leftPaddle.x + paddleWidth;
    }


    if (
        ball.x + ballSize >= rightPaddle.x &&
        ball.y + ballSize >= rightPaddle.y &&
        ball.y <= rightPaddle.y + paddleHeight
    ) {
        ball.dx *= -1;
        ball.x = rightPaddle.x - ballSize;
    }


    if (ball.x < 0) {
        rightPaddle.score++;
        resetBall();

    } else if (ball.x > canvas.width) {
        leftPaddle.score++;
        resetBall();
    }
}

function draw() {

    ctx.fillStyle = backgrounds[currentBackgroundIndex];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight, "#fff");
    drawRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight, "#fff");
    drawBall();
    drawScores();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
setInterval(function changeColor() { currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length; }, 3000);

gameLoop();

