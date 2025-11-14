// ===== 🎮 ELEMENT REFERENCES =====
const board = document.querySelector('.board');
const startButton = document.getElementById('btn-start');
const restartButton = document.getElementById('btn-restart');
const startModal = document.getElementById('startModal');
const gameOverModal = document.getElementById('gameOverModal');

const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const finalScoreEl = document.getElementById('finalScore');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const timerEl = document.getElementById('timer');
const finalTimeEl = document.getElementById('finalTime');
const gameOverMessage = document.getElementById('gameOverMessage');
const newHighScoreBanner = document.getElementById('newHighScoreBanner');

// ===== ⚙️ GAME CONSTANTS =====
const GRID_SIZE = 20;
const SPEED = 100;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

let snake = [];
let food = {};
let direction = { x: 1, y: 0 };
let score = 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;
let gameRunning = false;
let loop, timerLoop, timeElapsed = 0;

// 👁️ For eye blinking animation
let blinkCounter = 0;
let blinking = false;

highScoreEl.textContent = highScore;

// ===== 🧱 INIT BOARD =====
for (let i = 0; i < CELL_COUNT; i++) {
  const div = document.createElement('div');
  board.appendChild(div);
}
const cells = board.querySelectorAll('div');

// ===== 🔁 RESET GAME =====
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  score = 0;
  timeElapsed = 0;
  scoreEl.textContent = score;
  timerEl.textContent = '0s';
  spawnFood();
  draw();
}

// ===== 🎨 DRAW LOGIC =====
function draw() {
  cells.forEach(c => {
    c.textContent = '';
    c.style.backgroundColor = '#000';
  });

  // Draw snake body
  snake.forEach((part, i) => {
    const index = part.y * GRID_SIZE + part.x;
    const cell = cells[index];
    const snakeColor = score >= 50 ? '#fff' : 'var(--snake-color)';
    cell.style.backgroundColor = snakeColor;

    // Draw eyes on the head
    if (i === 0) drawSnakeEyes(cell);
  });

  // Draw food
  const foodIndex = food.y * GRID_SIZE + food.x;
  cells[foodIndex].textContent = food.type === 'red' ? '🍎' : '🍏';
}

// ===== 🧠 DRAW EYES =====
function drawSnakeEyes(headCell) {
  blinkCounter++;
  if (blinkCounter % 200 === 0) blinking = true;
  if (blinkCounter % 210 === 0) blinking = false;

  const dx = food.x - snake[0].x;
  const dy = food.y - snake[0].y;
  const horizontal = Math.abs(dx) > Math.abs(dy);
  let eyeSymbol = '👀';

  // Simulate slight eye roll/blink variation
  if (blinking) {
    headCell.textContent = Math.random() < 0.5 ? '😑' : '😴';
    return;
  }

  // Direction-based eyes
  if (horizontal) {
    eyeSymbol = dx > 0 ? '👉👀' : '👀👈';
  } else {
    eyeSymbol = dy > 0 ? '👇👀' : '👆👀';
  }

  headCell.textContent = '👀';
}

// ===== 🍎 SPAWN FOOD =====
function spawnFood() {
  const type = Math.random() < 0.7 ? 'red' : 'green';
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
    type,
  };
}

// ===== 🚀 MOVE SNAKE =====
function move() {
  const newHead = {
    x: (snake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
    y: (snake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
  };

  // Check self-collision
  if (snake.some(p => p.x === newHead.x && p.y === newHead.y)) {
    endGame();
    return;
  }

  snake.unshift(newHead);

  // Eating logic
  if (newHead.x === food.x && newHead.y === food.y) {
    score += food.type === 'red' ? 5 : 10;
    scoreEl.textContent = score;
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

// ===== 🕹 START GAME =====
function startGame() {
  gameRunning = true;
  startModal.style.display = 'none';
  gameOverModal.style.display = 'none';
  resetGame();

  clearInterval(loop);
  clearInterval(timerLoop);

  loop = setInterval(move, SPEED);
  timerLoop = setInterval(() => {
    timeElapsed++;
    timerEl.textContent = timeElapsed + 's';
  }, 1000);
}

// ===== 💀 END GAME =====
function endGame() {
  clearInterval(loop);
  clearInterval(timerLoop);
  gameRunning = false;

  const isNewHighScore = score > highScore;
  
  if (isNewHighScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }

  // Update game over display
  finalScoreEl.textContent = score;
  finalTimeEl.textContent = timeElapsed + 's';
  highScoreDisplay.textContent = highScore;
  highScoreEl.textContent = highScore;
  
  // Show/hide new high score banner
  if (isNewHighScore) {
    newHighScoreBanner.style.display = 'block';
  } else {
    newHighScoreBanner.style.display = 'none';
  }
  
  // Dynamic game over messages based on performance
  if (isNewHighScore) {
    gameOverMessage.textContent = "Incredible! You've set a new record! 🏆";
  } else if (score >= highScore * 0.8) {
    gameOverMessage.textContent = "So close! You almost beat your record!";
  } else if (score >= 50) {
    gameOverMessage.textContent = "Great job! Keep practicing!";
  } else if (score >= 20) {
    gameOverMessage.textContent = "Not bad! You're getting better!";
  } else {
    gameOverMessage.textContent = "Better luck next time!";
  }
  
  gameOverModal.style.display = 'flex';
}

// ===== 🎮 CONTROLS =====
window.addEventListener('keydown', e => {
  if (!gameRunning) return;
  switch (e.key) {
    case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
    case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
    case 'ArrowLeft': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
    case 'ArrowRight': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
  }
});

// ===== 🧩 BUTTON EVENTS =====
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
