const canvas = document.getElementById('myCanvas');

const ctx = canvas.getContext('2d');
//ボールの半径
const ballRadius = 27.5;

//パドル関係
const paddleHeight = 30;
const paddleWidth = 200;
let paddleX = (canvas.width-paddleWidth)/2;
let paddleSppedX = 8;
let minusPaddleSppedX = -8;

let rightPressed = false;
let leftPressed = false;

let randomColor = "#";
for(let i = 0; i < 6; i++) {
    randomColor += (16*Math.random() | 0).toString(16);
}

ctx.lineWidth = 3;

let x = canvas.width/2;
let y = canvas.height-30;
//ボールの初速
let dx = -5
let dy = -5
//ブリック関係
let brickRowCount = 7;
let brickColumnCount = 10;
let brickWidth = 106;
let brickHeight = 30;
let brickPadding = 6;
let brickOffsetTop = 30;
let brickOffsetLeft = 75;

let score = 1;

let lives = 3;

let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
  }

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score *= 2
                    dx *= 1.01;
                    dy *= 1.01;
                    if(score >= (Math.pow(2,70))) {
                        alert("YOU WIN, CONGRATULATIONS! YOUR SCORE WAS " + score + "!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}


const drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.strokeStyle = randomColor
    ctx.stroke();
    ctx.closePath();
}

const drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.strokeStyle = randomColor
    ctx.stroke();
    ctx.closePath();
}

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.strokeStyle = randomColor
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

const drawScore = ()  => {
    ctx.font = "32px Avenir"
    ctx.fillStyle = "blue"
    ctx.fillText("Score: "+score, 10, 40);
}

const drawLives = () => {
    ctx.font = "32px Avenir";
    ctx.fillStyle = "blue";
    ctx.fillText("Lives: "+lives, canvas.width-120, 40);
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

     if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    randomColor = "#";
        for(let i = 0; i < 6; i++) {
            randomColor += (16*Math.random() | 0).toString(16);
        }
    }

    if(y + dy < ballRadius) {
    dy = -dy;
    randomColor = "#";
        for(let i = 0; i < 6; i++) {
            randomColor += (16*Math.random() | 0).toString(16);
        }
    
} 
else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
        dx *= 1.03;
        dy *= 1.03;
        dy = -dy;
        paddleSppedX *= 1.02;
        minusPaddleSppedX *= 1.02;
    }else {
      lives--;
      alert("OOPS!😕")
      if(!lives){
        alert("GAME OVER🤣🤣🤣 YOUR SCORE WAS " + score + "!");
        document.location.reload();
        clearInterval(interval);
     } else {
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 5;
            dy = -5;
            paddleX = (canvas.width-paddleWidth)/2;
     }
     }
}
    
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += paddleSppedX;
    } else if(leftPressed && paddleX > 0){
        paddleX += minusPaddleSppedX;
    }

    x += dx;
    y += dy;
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();
}

const interval = setInterval(draw,10);