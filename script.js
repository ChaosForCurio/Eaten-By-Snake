const board = document.querySelector('.board');
const startButton = document.querySelector('#btn-start');
const retryButton = document.querySelector('#btn-retry');
const startModal = document.querySelector('#startModal');
const gameOverModal = document.querySelector('#gameOverModal');
const timeDisplay = document.querySelector('#time');
const scoreDisplay = document.querySelector('#current-Score');
const highScoreDisplay = document.querySelector('#high-Score');

const BLOCK_SIZE = 50;
const GAP_SIZE = 5;
const MOVE_INTERVAL = 150; // Snake moves every 150ms (~6.6 moves/sec)
const FPS = 60;
const blocks = {};

let snake = [{ x: 1, y: 2 }];
let direction = 'right';
let columns = 0;
let rows = 0;
let lastMoveTime = 0;
let gameRunning = false;
let food = { x: 0, y: 0 };
let score = 0;
let highScore = 0;
let seconds = 0;
let minutes = 0;
let timerLoop = null;

function generateFood() {
  food = {
    x: Math.floor(Math.random() * columns),
    y: Math.floor(Math.random() * rows)
  };
}

function renderGrid() {
  board.innerHTML = '';
  columns = Math.floor(board.clientWidth / (BLOCK_SIZE + GAP_SIZE));
  rows = Math.floor(board.clientHeight / (BLOCK_SIZE + GAP_SIZE));

  Object.assign(board.style, {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, ${BLOCK_SIZE}px)`,
    gridTemplateRows: `repeat(${rows}, ${BLOCK_SIZE}px)`,
    gap: `${GAP_SIZE}px`,
    justifyContent: 'center',
    alignContent: 'center'
  });

  Object.keys(blocks).forEach(key => delete blocks[key]);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const block = document.createElement('div');
      block.classList.add('block');
      Object.assign(block.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f1f1f',
      });
      board.appendChild(block);
      blocks[`${row}-${col}`] = block;
    }
  }

  renderSnake();
  renderFood();
}

function renderSnake() {
  snake.forEach(({ x, y }) => {
    const key = `${y}-${x}`;
    if (blocks[key]) blocks[key].style.backgroundColor = 'limegreen';
  });
}

function renderFood() {
  const key = `${food.y}-${food.x}`;
  if (blocks[key]) blocks[key].style.backgroundColor = 'red';
}

function moveSnake() {
  const head = { ...snake[snake.length - 1] };
  if (direction === 'left') head.x -= 1;
  else if (direction === 'right') head.x += 1;
  else if (direction === 'up') head.y -= 1;
  else if (direction === 'down') head.y += 1;

  if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
    endGame();
    return;
  }

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    snake.push(head);
    score += 5;
    updateScore();
    generateFood();
  } else {
    snake.push(head);
    snake.shift();
  }
}

function gameLoop(timestamp) {
  if (!gameRunning) return;

  if (timestamp - lastMoveTime >= MOVE_INTERVAL) {
    lastMoveTime = timestamp;
    moveSnake();
  }

  Object.values(blocks).forEach(block => block.style.backgroundColor = '#1f1f1f');
  renderSnake();
  renderFood();

  requestAnimationFrame(gameLoop);
}

function handleKeydown(event) {
  const key = event.key.toLowerCase();
  if (key === 'arrowup' && direction !== 'down') direction = 'up';
  else if (key === 'arrowdown' && direction !== 'up') direction = 'down';
  else if (key === 'arrowleft' && direction !== 'right') direction = 'left';
  else if (key === 'arrowright' && direction !== 'left') direction = 'right';
}

function updateTimer() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  timeDisplay.textContent = formattedTime;
}

function resetTimer() {
  clearInterval(timerLoop);
  seconds = 0;
  minutes = 0;
  timeDisplay.textContent = '00:00';
}

function updateScore() {
  scoreDisplay.textContent = score;
  if (score > highScore) {
    highScore = score;
    highScoreDisplay.textContent = highScore;
  }
}

function resetScore() {
  score = 0;
  scoreDisplay.textContent = '0';
}

function endGame() {
  gameRunning = false;
  clearInterval(timerLoop);
  gameOverModal.style.display = 'flex';
}

function startGame() {
  startModal.style.display = 'none';
  gameOverModal.style.display = 'none';
  snake = [{ x: 1, y: 2 }];
  direction = 'right';
  generateFood();
  renderGrid();
  resetTimer();
  resetScore();
  clearInterval(timerLoop);
  timerLoop = setInterval(updateTimer, 1000);
  gameRunning = true;
  lastMoveTime = 0;
  requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', renderGrid);
window.addEventListener('keydown', handleKeydown);
startButton.addEventListener('click', startGame);
retryButton.addEventListener('click', startGame);
