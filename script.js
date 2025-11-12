const board = document.querySelector('.board');
const BLOCK_SIZE = 50;
const GAP_SIZE = 5;
const blocks = {};
let snake = [{ x: 1, y: 2 }];
let direction = 'right';
let columns = 0;
let rows = 0;
let tickInterval = 400;

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
        justifyContent: 'center'
      });
      block.innerText = `${row}-${col}`;
      board.appendChild(block);
      blocks[`${row}-${col}`] = block;
    }
  }

  renderSnake();
}

function renderSnake() {
  Object.values(blocks).forEach(block => {
    block.style.backgroundColor = '#1f1f1f';
  });

  snake.forEach(({ x, y }) => {
    const key = `${y}-${x}`;
    const segment = blocks[key];
    if (segment) segment.style.backgroundColor = 'limegreen';
    console.log(`Snake segment → x=${x}, y=${y}`);
  });
}

function moveSnake() {
  const head = { ...snake[snake.length - 1] };

  if (direction === 'left') head.x -= 1;
  else if (direction === 'right') head.x += 1;
  else if (direction === 'up') head.y -= 1;
  else if (direction === 'down') head.y += 1;

  // Wrap around edges
  if (head.x < 0) head.x = columns - 1;
  else if (head.x >= columns) head.x = 0;
  if (head.y < 0) head.y = rows - 1;
  else if (head.y >= rows) head.y = 0;

  snake.push(head);
  snake.shift();
}

function render() {
  moveSnake();
  renderGrid();
}

function handleKeydown(event) {
  const key = event.key.toLowerCase();

  if (key === 'arrowup') {
    direction = 'up';
    console.log('⬆️  UP key pressed');
  } else if (key === 'arrowdown') {
    direction = 'down';
    console.log('⬇️  DOWN key pressed');
  } else if (key === 'arrowleft') {
    direction = 'left';
    console.log('⬅️  LEFT key pressed');
  } else if (key === 'arrowright') {
    direction = 'right';
    console.log('➡️  RIGHT key pressed');
  }

  // Instantly move snake when key is pressed
  render();
}

window.addEventListener('resize', renderGrid);
window.addEventListener('keydown', handleKeydown);

renderGrid();
