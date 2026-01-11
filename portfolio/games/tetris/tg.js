const canvas = document.getElementById('Tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

const nextCanvas = document.getElementById('nextPiece');
const nextContext = nextCanvas.getContext('2d');
nextContext.scale(20, 20);

const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');

const arena = createMatrix(12, 20);
const lineClearSound = new Audio('pan.mp3');

const colors = [
    null,
    '#FF90BB',
    '#FFC1DA',
    '#F8F8E1',
    '#8ACCD5',
    '#9EC6F3',
    '#9FB3DF',
    '#A53860'
];

const pieces = 'TJLOSZI';

function createMatrix(w, h) {
    return Array.from({ length: h }, () => new Array(w).fill(0));
}

function createPiece(type) {
    if (type === 'T') return [[0,0,0],[1,1,1],[0,1,0]];
    if (type === 'O') return [[2,2],[2,2]];
    if (type === 'L') return [[0,3,0],[0,3,0],[0,3,3]];
    if (type === 'J') return [[0,4,0],[0,4,0],[4,4,0]];
    if (type === 'I') return [[0,5,0,0],[0,5,0,0],[0,5,0,0],[0,5,0,0]];
    if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
    if (type === 'Z') return [[7,7,0],[0,7,7],[0,0,0]];
}

function drawMatrix(matrix, offset, ctx = context) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = colors[value];
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawNext() {
    nextContext.fillStyle = '#000';
    nextContext.fillRect(0, 0, 4, 4);
    drawMatrix(nextPiece, {x: 1, y: 1}, nextContext);
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function collide(arena, player) {
    const { matrix, pos } = player;
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (
                matrix[y][x] !== 0 &&
                (arena[y + pos.y] === undefined ||
                 arena[y + pos.y][x + pos.x] === undefined ||
                 arena[y + pos.y][x + pos.x] !== 0)
            ) {
                return true;
            }
        }
    }
    return false;
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        arenaSweep();
        playerReset();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    player.matrix = nextPiece;
    nextPiece = createPiece(pieces[(Math.random() * pieces.length) | 0]);
    player.pos.y = 0;
    player.pos.x =
        ((arena[0].length / 2) | 0) -
        ((player.matrix[0].length / 2) | 0);

    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        player.lines = 0;
        updateScore();
        updateLines();
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [matrix[x][y], matrix[y][x]] =
            [matrix[y][x], matrix[x][y]];
        }
    }
    dir > 0 ? matrix.forEach(row => row.reverse()) : matrix.reverse();
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function arenaSweep() {
    let rowCount = 1;
    let cleared = 0;

    outer: for (let y = arena.length - 1; y >= 0; y--) {
        for (let x = 0; x < arena[y].length; x++) {
            if (arena[y][x] === 0) continue outer;
        }
        arena.splice(y, 1);
        arena.unshift(new Array(arena[0].length).fill(0));
        player.score += rowCount * 10;
        player.lines++;
        rowCount *= 2;
        cleared++;
        y++;
    }

    if (cleared > 0) lineClearSound.play();
    updateScore();
    updateLines();
}

function updateScore() {
    scoreEl.textContent = player.score;
}

function updateLines() {
    linesEl.textContent = player.lines;
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) playerDrop();
    draw();
    drawNext();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') playerMove(-1);
    if (e.key === 'ArrowRight') playerMove(1);
    if (e.key === 'ArrowDown') playerDrop();
    if (e.key === 'ArrowUp') playerRotate(1);
    if (e.key === 'z') playerRotate(-1);
});

const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
    lines: 0
};

let nextPiece = createPiece(pieces[(Math.random() * pieces.length) | 0]);

playerReset();
update();
