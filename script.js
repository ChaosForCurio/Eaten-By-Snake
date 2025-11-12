const board = document.querySelector('.board');

const BLOCK_SIZE = 30;
const GAP_SIZE = 2;

function renderGrid() {
  board.innerHTML = '';
  const columns = Math.floor(board.clientWidth / (BLOCK_SIZE + GAP_SIZE));
  const rows = Math.floor(board.clientHeight / (BLOCK_SIZE + GAP_SIZE));

  Object.assign(board.style, {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, ${BLOCK_SIZE}px)`,
    gridTemplateRows: `repeat(${rows}, ${BLOCK_SIZE}px)`,
    gap: `${GAP_SIZE}px`,
    justifyContent: 'center',
    alignContent: 'center',
  });

  const totalBlocks = rows * columns;
  for (let i = 0; i < totalBlocks; i++) {
    const block = document.createElement('div');
    block.classList.add('block');
    board.appendChild(block);
  }
}

window.addEventListener('resize', renderGrid);
renderGrid();
