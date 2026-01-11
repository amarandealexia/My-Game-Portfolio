

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = document.body.clientWidth;
let height = document.body.clientHeight;
let gameHeight = 300;
let requestID;
let player = {
    x: Math.round(width / 3),
    y: gameHeight - 30,
    width: 10,
    height: 10,
    speed: 2,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false
};

let keys = [];
let friction = 0.8;
let gravity = 0.2;
let verticalSpeed = 1;
let score = 0;
let bestScore = 0;
let touches = [];
let touchButtonSize = 70;
let touchButtonMargin = 20;

let upButton = {
    x: touchButtonMargin,
    y: height - touchButtonMargin - touchButtonSize,
    width: touchButtonSize,
    height: touchButtonSize
};

let leftButton = {
    x: width - 2 * touchButtonMargin - 2 * touchButtonSize,
    y: height - touchButtonMargin - touchButtonSize,
    width: touchButtonSize,
    height: touchButtonSize
};

let rightButton = {
    x: width - touchButtonMargin - touchButtonSize,
    y: height - touchButtonMargin - touchButtonSize,
    width: touchButtonSize,
    height: touchButtonSize
};

let touchButtonTimeout = 0;
let drawCount = 1;
let boxes = [{
    x: 0,
    y: gameHeight - 4,
    width: width + 20,
    height: 4
}];

canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
let scale = window.devicePixelRatio;
canvas.width = width * scale;
canvas.height = height * scale;
ctx.scale(scale, scale);

// Main menu loop
function mainMenuDraw() {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '48px serif';
    ctx.fillText("Endless Runner", width / 2, height / 2);
    ctx.font = "14px sans-serif";
    ctx.fillText("Press space or tap to start", width / 2, height / 2 + 40);
    ctx.restore();
    requestID = requestAnimationFrame(mainMenuLoop);
}

function mainMenuLoop() {
    if (keys[32] || touches.length > 0) {
        resetGameState();
        requestID = requestAnimationFrame(update);
    } else {
        requestID = requestAnimationFrame(mainMenuLoop);
    }
}

// Game update
function update() {
    if (keys[38] || keys[32] || keys[87]) jumpAction();
    if (keys[39] || keys[68]) goRightAction();
    if (keys[37] || keys[65]) goLeftAction();

    for (let i = 0; i < touches.length; i++) {
        if (buttonTouched(upButton, touches[i])) jumpAction();
        else if (buttonTouched(leftButton, touches[i])) goLeftAction();
        else if (buttonTouched(rightButton, touches[i])) goRightAction();
    }

    if (touchButtonTimeout > 0) touchButtonTimeout--;

    for (let i = 0; i < boxes.length; i++) {
        boxes[i].x -= verticalSpeed;
        score += verticalSpeed;
    }

    verticalSpeed = Math.min(9, (drawCount / 2000) * (2 - drawCount / 2000));
    drawCount++;

    if (boxes[0].x + boxes[0].width < 0) boxes.shift();

    player.velX *= friction;
    player.velY += gravity;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "pink";
    ctx.beginPath();

    player.grounded = false;
    for (let i = 0; i < boxes.length; i++) {
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        let dir = colCheck(player, boxes[i]);
        if (dir === "l" || dir === "r") {
            player.velX = 0;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }
    }

    if (player.grounded) player.velY = 0;

    player.x += player.velX;
    player.y += player.velY;

    ctx.fill();
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.restore();

    ctx.save();
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = 'center';
    ctx.fillText("Score: " + Math.round(score / 100), width / 2, 20);
    ctx.fillText("Best: " + bestScore, width / 2, 40);
    ctx.restore();

    if (touchButtonTimeout > 0) {
        ctx.fillStyle = "blue";
        ctx.fillRect(upButton.x, upButton.y, upButton.width, upButton.height);
        ctx.fillRect(leftButton.x, leftButton.y, leftButton.width, leftButton.height);
        ctx.fillRect(rightButton.x, rightButton.y, rightButton.width, rightButton.height);
        ctx.fillStyle = "white";
        drawTriangle(upButton.x + upButton.width / 2, upButton.y + upButton.height / 2, 0, 15);
        drawTriangle(leftButton.x + leftButton.width / 2, leftButton.y + leftButton.height / 2, -Math.PI / 2, 15);
        drawTriangle(rightButton.x + rightButton.width / 2, rightButton.y + rightButton.height / 2, Math.PI / 2, 15);
    }

    if ((player.y > gameHeight + 20) || (player.x + player.width < 0) || (player.x > width)) {
        bestScore = Math.max(bestScore, Math.round(score / 100));
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.textAlign = "center";
        ctx.font = "18px sans-serif";
        ctx.fillText("Game Over", width / 2, 60);
        ctx.font = "14px sans-serif";
        ctx.fillText("Score: " + Math.round(score / 100), width / 2, 90);
        ctx.fillText("Best: " + bestScore, width / 2, 110);
        ctx.fillText("Press space or tap to restart", width / 2, 140);
        ctx.restore();
        requestID = requestAnimationFrame(mainMenuLoop);
    } else {
        requestID = requestAnimationFrame(update);
    }
}

// Helpers
function drawTriangle(x, y, angle, radius) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(-radius * 0.866, radius / 2);
    ctx.lineTo(radius * 0.866, radius / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function buttonTouched(button, touch) {
    return (
        touch.pageX >= button.x &&
        touch.pageX <= button.x + button.width &&
        touch.pageY >= button.y &&
        touch.pageY <= button.y + button.height
    );
}

function jumpAction() {
    if (!player.jumping && player.grounded) {
        player.jumping = true;
        player.grounded = false;
        player.velY = -player.speed * 3.5;
    }
}

function goLeftAction() {
    if (player.velX > -player.speed * 4) {
        player.velX -= player.speed;
    }
}

function goRightAction() {
    if (player.velX < player.speed * 4) {
        player.velX += player.speed;
    }
}

function resetGameState() {
    player.x = Math.round(width / 3);
    player.y = gameHeight - 30;
    player.velX = 0;
    player.velY = 0;
    player.jumping = false;
    player.grounded = false;

    verticalSpeed = 1;
    drawCount = 1;
    score = 0;

    boxes = [{
        x: 0,
        y: gameHeight - 4,
        width: width + 20,
        height: 4
    }];
}

function colCheck(shapeA, shapeB) {
    let vX = (shapeA.x + shapeA.width / 2) - (shapeB.x + shapeB.width / 2);
    let vY = (shapeA.y + shapeA.height / 2) - (shapeB.y + shapeB.height / 2);
    let hWidths = (shapeA.width / 2) + (shapeB.width / 2);
    let hHeights = (shapeA.height / 2) + (shapeB.height / 2);
    let colDir = null;

    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        let oX = hWidths - Math.abs(vX);
        let oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

canvas.addEventListener('touchstart', function (e) {
    touchButtonTimeout = 60 * 5;
    const changedTouches = e.changedTouches;
    for (let i = 0; i < changedTouches.length; i++) {
        touches.push({
            id: changedTouches[i].identifier,
            pageX: changedTouches[i].pageX,
            pageY: changedTouches[i].pageY
        });
    }
});

canvas.addEventListener('touchend', function (e) {
    const changedTouches = e.changedTouches;
    for (let i = 0; i < changedTouches.length; i++) {
        touches = touches.filter(t => t.id !== changedTouches[i].identifier);
    }
});

mainMenuDraw();

