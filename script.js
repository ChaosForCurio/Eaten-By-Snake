const board = document.querySelector('.board');
const startButton = document.querySelector('#btn-start');
const retryButton = document.querySelector('#btn-retry');
const startModal = document.querySelector('#startModal');
const gameOverModal = document.querySelector('#gameOverModal');

const BLOCK_SIZE = 50;
const GAP_SIZE = 5;
const blocks = {};

let snake = [{ x: 1, y: 2 }];
let direction = 'right';
let columns = 0;
let rows = 0;
let tickInterval = 400;
let gameLoop = null;
let food = { x: 0, y: 0 };

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
            Object.assign(block.style, { display: 'flex', alignItems: 'center', justifyContent: 'center' });
            board.appendChild(block);
            blocks[`${row}-${col}`] = block;
        }
    }

    renderSnake();
    renderFood();
}

function renderSnake() {
    Object.values(blocks).forEach(block => block.style.backgroundColor = '#1f1f1f');
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
        clearInterval(gameLoop);
        gameOverModal.style.display = 'flex';
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        snake.push(head);
        generateFood();
    } else {
        snake.push(head);
        snake.shift();
    }
}

function render() {
    moveSnake();
    renderGrid();
}

function handleKeydown(event) {
    const key = event.key.toLowerCase();
    if (key === 'arrowup' && direction !== 'down') direction = 'up';
    else if (key === 'arrowdown' && direction !== 'up') direction = 'down';
    else if (key === 'arrowleft' && direction !== 'right') direction = 'left';
    else if (key === 'arrowright' && direction !== 'left') direction = 'right';
}

function startGame() {
    startModal.style.display = 'none';
    gameOverModal.style.display = 'none';
    snake = [{ x: 1, y: 2 }];
    direction = 'right';
    generateFood();
    renderGrid();
    clearInterval(gameLoop);
    gameLoop = setInterval(render, tickInterval);
}

window.addEventListener('resize', renderGrid);
window.addEventListener('keydown', handleKeydown);
startButton.addEventListener('click', startGame);
retryButton.addEventListener('click', startGame);
