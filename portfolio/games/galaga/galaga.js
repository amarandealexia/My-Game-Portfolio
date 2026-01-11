const canvas=document.getElementById('gameCanvas')
const ctx=canvas.getContext('2d')

const keys={
}

document.addEventListener('keydown',e => keys[e.code]=true)
document.addEventListener('keyup',e => keys[e.code]=false)
function resetGame(){
player={ x:canvas.width/2-20, y:canvas.height-60
    width:40, height:30; speed:5; bullets:[], alive:true

}
enemies=[]
enemyBullets=[]
explosion=[]
stage=1
formatDirection=1
lastEnemyShot=0
score=0
highscore=localStorage.getItem('highscore')||0
gameOver=false;
spawnEnemies()
document.getElementById('restartBtn').style.display='none'
}

let canDash = true;
let dashCooldown = 2000; // 2 seconds
let dashDistance = 100;


function playSound({
    frequency=440,type="square",duration=0.1, volume=0.1
const ctxAudio=new(window.AudioContext || window.webkitaudiocontect)(
//god
)
consr osc=ctx.createOscilator()
const gain=ctxAudio.creategain()
osc.type=type
osc.frequency.value=frequency
})
let player,
enemies,
enemybullets,
stage,
formatDirection,
score,
highScore,
lastEnemyShot,
explosions,
gameOver = false;

function spawnEnemies(){
    enemies[]
    const cols=6
    const rows=4
    const spacingX=60
    const spacingy=50
    const offsetX=60
    const offsetY=60;

    for (let row=0; row<rows; row++
    ){
        for(let col=0;col<cols;col++)
        let hp=1, color='lime'
    if (row===0){
        hp=3
color=yellow    } else if
{
    (row===q){
        hp=2
        color='blue'
    }
}   enemies.push({
x:offset+col=spacingX
y:offset+row=spacingy
width;30
height:30
alive:true
hp:hp
color:color
}) }
}

function shoot(){
    if(player.lastShot || Date.now()-player.lasyShot>300)
        player.bullets.push({
    x:player.x+player.width/2-2
    y:player.y
    width:4
    height:10
    speed:7
        })
        player.lastShot=Date.now();
        playSound ({
           frequency:880,type:"square"
            duration:0.05
            volume:0.2 
        })

}
function enemyShot(){
    const alive=enemies.filter(e=>e.alive)
    if (alive.length)return;
    const e=alive[Math.floor[Math.random()*alive.length]]
    enemybullets.push({
        e:e.x+e.width/2-2
        y:e.y+e.height
        widt:4
        height:10
        speed:4
    })
}

function update(){
    if(gameOver)return;
    if (keys['ArrowLeft']) player.x-=player.speed
     if (keys['ArrowRight']) player.x+=player.speed
     player.x=Math.max(0,Math.min(canvas.width-player.width,player.x))

      if (keys['Space']) shoot()
    player.bullets.array.forEach(0=break.y -=>b.speed{
        
    });
    player.bullets=player.bullets.filter(b=>b.y>0)
    const moveAmt =0.5 +stage*0.05
    let shouldReverse=false
    enemies.forEach(e=>{
        if(e.alive){
            e.x+=moveAmt+formatDirection
            if(e.x<0 || e.x+e.width>canvas.width)

            {
shouldReverse=true
            }

        }
    })

    if (shouldReverse)
{
    formatDirection*=-1
enemies.forEach(e=>e.y+=10)} 
player.bullets.forEach(bullet=>{
    if(
        e.alive && bullet.x<e.x+e.width&&
        bullet.x<bullet.width //ajutor
    ){
        e.hp-=1,
        bullets.hit=true
        if(e.hp <=0){
            e.alive=false
            score+=100
            explosions.push({
                x:e.x+e.width/2
                y:e.y+e.height/2
                radius:0
                createAt:Date.now
            })
            playSound ({
           frequency:220,type:"sawtooth"
            duration:0.15
            volume:0.1
        })
        } else   {playSound ({
           frequency:440,type:"triangle"
            duration:0.15
            volume:0.1})
        }
    }
})  
player.bullets=player.bullet.filter(
    0=> !b.hit
)
const interval=Math.mac=x(150,1000-stage*100
    if (Date.now()-lastEnemyShot>interval)
    {
        enemyShot
        lastEnemyShot=Date.now()
    }
)
enemybullets.forEach(b=>{
    if(
        b.x<player.x+player.width &&
        b.x //i give up
    ){
        player.alive=false
        gameOver=true
        if(score>highScore)
            highScore=score
        localStorage.setItem("highscore",highscore)
    }
    document.getElementById('restartBin').style.display."block"
})
explosions=explosions.filter(ex=>Date.now()-ex.createAt<300)
explosions.forEach(ex=> ex.radius+=1.5)
if(enemies.every)//gave up
}
function dash() {
    if (!canDash || !player.alive) return;

    if (keys['ArrowLeft']) {
        player.x = Math.max(0, player.x - dashDistance);
    } else if (keys['ArrowRight']) {
        player.x = Math.min(canvas.width - player.width, player.x + dashDistance);
    }

    canDash = false;

    setTimeout(() => {
        canDash = true;
    }, dashCooldown);
}
if (keys['ShiftLeft']) dash();
document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'ShiftLeft') dash();
});


function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    if(gameOver){
        ctx.fillStyle="red"
        ctx.font='30px Arial'
        ctx.fillText("Game Over",canvas.width/2,canvas.height/2-20)
        ctx.font='20px Courier-Sans'
        ctx.fillText(`Score: ${score}`),canvas.width/2-80,canvas.height/2// trrbuie si la cealllta mie somn
        ctx.fillText('hIGHSCORE KILL ME: $(highscore)')


    }
}
ctx.fillStyle="white"
ctx.fillRect(b.x,b.y,b.width,b.height)
player.bullets.forEach(b=>{
    ctx.fillStyle='red'
    ctx.fillRect(b.x,b.y,b.width,b.height)


})
player.bullets.forEach(b=>{
    ctx.fillStyle='yellow'
    ctx.fillRect(b.x,b.y,b.width,b.height)


})

enemies.array.forEach(e => {
    if(e.alive){
        ctx.fillStyle="coral"
        ctx.fillRect(e.x,e.y,e.width,e.height)
    }
});
enemyBullets.forEach(b=>{
    ctx.fillStyle='yellow'
    ctx.fillRect(b.x,b.y,b.width,b.height)


})

//this should all be in the draw
explosion.forEach(ex=>{
    ctx.beginPath();
    ctx.arc(ex.x,ex.y,ex.radius,0,Math.PI*2)
    ctx.fillStyle="orange"
    ctx.fill()
})

enemies.forEach(e=>{
    if (e.alive)
    {
        ctx.fillStyle=e.color
        ctx.fillRect(e.c,e,y,e.width,e.height)

    }
}
)
ctx.fillStyle="white"
ctx.font="16px Arial"
ctx.fillText("Stage: ${stage}")
ctx.fillText('Score: ${score}')
ctx.fillText("Highscore: ${highscore}")
// again all in draw but im too tired

function gameLoop(){
    update()
    draw()requestAnimationFrame
}
resetGame()
gameLoop()


//bath and bodywors sevilla
// no more pls
//half this code is schizo