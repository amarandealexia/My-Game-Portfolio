const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const gridSize = 20
const tileCount = canvas.width / gridSize
let snake = [{ x: 10, y: 10 }]
let foodColor
let food = { x: 5, y: 5 } // food should be a single object, not an array
let dx = 1, dy = 0
let score = 0
let gameOver = false
var colors = ['purple', 'yellow', 'orange', 'brown', 'black'];
highScore = localStorage.getItem('highscore') || 0;

function drawRect(x, y, color) {
    ctx.fillStyle = color
    ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1)
}

function gameLoop() { // added parentheses here
    if (gameOver) {
        ctx.fillStyle = "red"
        ctx.font = "30px Arial"
        ctx.fillText("Game over", 100, 200)
        ctx.fillText(`Highscore: ${highScore}`, 100, 250);
        return // added to stop the loop after game over
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy } // fixed typo: snake[0] + dy → snake[0].y + dy

    if (
        head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount ||
        snake.some(part => part.x === head.x && part.y === head.y)
    ) {
        gameOver = true
        return
    }
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highscore", highScore);
    }
    snake.unshift(head)

    if (head.x === food.x && head.y === food.y) {
        score++
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        }
        foodColor = colors[Math.floor(Math.random() * colors.length)]
    } else {
        snake.pop()
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    snake.forEach((part, i) => drawRect(part.x, part.y, i === 0 ? "#0f0" : "#0a0")) // fixed part, y → part.y

    drawRect(food.x, food.y, foodColor
    )

    ctx.fillStyle = "white"
    ctx.font = "10px Arial"
    ctx.fillText('Score: ' + score, 10, 390) // fixed: fillStyle → fillText

}
document.getElementById('restart').addEventListener("click", function () {
    location.reload();
})
document.getElementById("resetHighscore").addEventListener("click", () => {
    localStorage.removeItem("highscore");
    location.reload();
});

// Moved the key listener outside of gameLoop to avoid multiple bindings
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1 }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1 }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0 }
    if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0 }
})

setInterval(gameLoop, 100)
