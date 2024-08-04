const gameBoard = document.getElementById('gameboard');
const context = gameBoard.getContext('2d');
const scoreText = document.getElementById('scoreVal');

const WIDTH = gameBoard.width;
const HEIGHT = gameBoard.height;
const UNIT = 25;

let foodX;
let foodY;
let xVel = 25;
let yVel = 0;
let score = 0;
let active = true; 
let started = false;
let paused = false; 

let snake = [
    {x: UNIT * 3, y: 0},
    {x: UNIT * 2, y: 0},
    {x: UNIT, y: 0},
    {x: 0, y: 0}
];

window.addEventListener('keydown', keyPress);
startGame();

function startGame() {
    context.fillStyle = '#1abc9c ';
    context.fillRect(0, 0, WIDTH, HEIGHT);
    createFood();
    displayFood();
    drawSnake();
}

function clearBoard() {
    context.fillStyle = '#1abc9c ';
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

function createFood() {
    foodX = Math.floor(Math.random() * WIDTH / UNIT) * UNIT;
    foodY = Math.floor(Math.random() * HEIGHT / UNIT) * UNIT;
}

function displayFood() {
    context.fillStyle = '#f3d30d ';
    context.fillRect(foodX, foodY, UNIT, UNIT);
}

function drawSnake() {
    context.fillStyle = 'red ';
    context.strokeStyle = '#1abc9c ';
    snake.forEach((snakePart) => {
        context.fillRect(snakePart.x, snakePart.y, UNIT, UNIT);
        context.strokeRect(snakePart.x, snakePart.y, UNIT, UNIT);
    });
}

function moveSnake() {
    const head = {x: snake[0].x + xVel, y: snake[0].y + yVel};
    snake.unshift(head);
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function nextTick() {
    if (active && !paused) {
        setTimeout(() => {
            clearBoard();
            displayFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 200);
    } else if (!active) {
        clearBoard();
        context.font = "bold 50px serif";
        context.fillStyle = '#6f0721 ';
        context.textAlign = "center";
        context.fillText("Game over!!", WIDTH / 2, HEIGHT / 2);
    } else if (paused) {
        clearBoard();
        context.font = "bold 50px serif";
        context.fillStyle = '#6f0721 ';
        context.textAlign = "center";
        context.fillText("Paused", WIDTH / 2, HEIGHT / 2);
    }
}

function keyPress(event) {
    const SPACE = 32;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    if (event.keyCode === SPACE) {
        togglePause();
    } else if (active && !paused) {
        if (!started) {
            started = true;
            nextTick();
        }
        switch (true) {
            case (event.keyCode === LEFT && xVel !== UNIT):
                xVel = -UNIT;
                yVel = 0;
                break;
            case (event.keyCode === RIGHT && xVel !== -UNIT):
                xVel = UNIT;
                yVel = 0;
                break;
            case (event.keyCode === UP && yVel !== UNIT):
                xVel = 0;
                yVel = -UNIT;
                break;
            case (event.keyCode === DOWN && yVel !== -UNIT):
                xVel = 0;
                yVel = UNIT;
                break;
        }
    }
}

function togglePause() {
    if (started) {
        paused = !paused; 
        if (!paused) {
            nextTick(); 
        } else {
            clearBoard();
            context.font = "bold 50px serif";
            context.fillStyle = '#6f0721 ';
            context.textAlign = "center";
            context.fillText("Paused", WIDTH / 2, HEIGHT / 2);
        }
    }
}

function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
        case (snake[0].x >= WIDTH):
        case (snake[0].y < 0):
        case (snake[0].y >= HEIGHT):
            active = false;
            break;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            active = false;
            break;
        }
    }
}
