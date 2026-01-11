const canvas = document.getElementById('whackcanvas');
const ctx = canvas.getContext('2d');
const scoredisplay = document.getElementById('score');
const timerElement = document.getElementById("timer");
const audio = document.getElementById("audio");
let newTime = 1000
const highs=localStorage.getItem("high") || 0;
let score = 0;
let boxX, boxY;
const boxSize = 50;
let boxColor = "red"; // start color


function drawbox() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boxX = Math.floor(Math.random() * (canvas.width - boxSize));
    boxY = Math.floor(Math.random() * (canvas.height - boxSize));
    ctx.fillStyle = boxColor;
    ctx.fillRect(boxX, boxY, boxSize, boxSize);
}

canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (
        clickX >= boxX && clickX <= boxX + boxSize &&
        clickY >= boxY && clickY <= boxY + boxSize
    ) {
        newTime=newTime-500
        score++;
        scoredisplay.textContent = score;

        /*if (audio) audio.play();*/
audio.currentTime=0;
audio.play();
        boxColor = boxColor === "red" ? "blue" : boxColor === "blue" ? "yellow" : "red";


        drawbox();
        console.log(newTime)
    }
});

drawbox();

let timeLeft = 10;

const countdown = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time left: ${timeLeft}`;

    if (timeLeft <= 0) {
        timerElement.textContent = "Time's up!";
        clearInterval(countdown);
       
        canvas.removeEventListener('click',clickHandler)
    if(score>highs)
    {highscore=score;
        localStorage.setItem('highschore',highs)
        
        alert('New Highscore!'+ highs)
    } else { alert("Your final score is:"+ score)}
    }

}, newTime);

// something is definetily not right with that highscore but i'm too tired to care
//omg it fudged up the whole script
