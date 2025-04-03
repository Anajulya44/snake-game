const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const scoreDiv = document.getElementById('score');
const gameOverDiv = document.getElementById('gameOver');

let snake = [{ x: 200, y: 200 }];
let direction = { x: 20, y: 0 };
let food = { x: 100, y: 100 };
let score = 0;
let gameInterval = null;
let isPaused = false;

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(segment.x, segment.y, 20, 20);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(segment.x, segment.y, 20, 20);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDiv.textContent = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    food.y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
}

function checkCollision() {
    const head = snake[0];

    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame();
    }

    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function endGame() {
    clearInterval(gameInterval);
    gameOverDiv.style.display = 'block';
}

function gameLoop() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
        moveSnake();
        checkCollision();
    }
}

function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 20, y: 0 };
    food = { x: 100, y: 100 };
    score = 0;
    scoreDiv.textContent = `Score: ${score}`;
    gameOverDiv.style.display = 'none';
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

function pauseGame() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume Game' : 'Pause Game';
}

function resetGame() {
    clearInterval(gameInterval);
    startGame();
}

function changeDirection(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -20 };
    if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 20 };
    if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -20, y: 0 };
    if (key === 'ArrowRight' && direction.x === 0) direction = { x: 20, y: 0 };
}

document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
resetButton.addEventListener('click', resetGame);

// Initialize game
startGame();