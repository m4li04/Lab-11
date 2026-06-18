
let board         = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver      = false;
let scores        = { X: 0, O: 0 };


const WINS = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8], 
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8], 
  [0, 4, 8], 
  [2, 4, 6], 
];


const cells      = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const statusWrap = document.getElementById('statusWrap');
const scoreX     = document.getElementById('scoreX');
const scoreO     = document.getElementById('scoreO');
const resetBtn   = document.getElementById('resetBtn');
const dotX       = document.getElementById('dotX');
const dotO       = document.getElementById('dotO');
const labelX     = document.getElementById('labelX');
const labelO     = document.getElementById('labelO');



/**
 * Check the board for a winner or draw.
 * @returns {{ winner: string, line?: number[] } | null}
 */
function checkWinner() {
  for (const [a, b, c] of WINS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every(Boolean)) {
    return { winner: 'draw' };
  }
  return null;
}

/**
 * @param {'X'|'O'} player
 */
function updateTurnIndicator(player) {
  if (player === 'X') {
    dotX.className   = 'turn-dot x';
    dotO.className   = 'turn-dot o inactive';
    labelX.className = 'turn-label active x';
    labelO.className = 'turn-label inactive';
  } else {
    dotX.className   = 'turn-dot x inactive';
    dotO.className   = 'turn-dot o';
    labelX.className = 'turn-label inactive';
    labelO.className = 'turn-label active o';
  }
}

/**
 * Update the status bar message and style.
 * @param {string} msg
 * @param {string} cls  — one of: 'x' | 'o' | 'win' | 'draw'
 */
function setStatus(msg, cls) {
  statusText.textContent = msg;
  statusText.className   = `status-text ${cls}`;
}


cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const idx = +cell.dataset.index;

    if (board[idx] || gameOver) return;

    board[idx]       = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken', currentPlayer === 'X' ? 'x-cell' : 'o-cell');

    const result = checkWinner();

    if (result && result.winner !== 'draw') {
      gameOver = true;
      scores[result.winner]++;

      scoreX.textContent = scores.X;
      scoreO.textContent = scores.O;

      result.line.forEach(i => cells[i].classList.add('winning'));

      cells.forEach(c => {
        if (!c.classList.contains('winning')) c.classList.add('game-over');
      });

      statusWrap.classList.add('winner');
      setStatus(`Player ${result.winner} Wins! 🏆`, 'win');

    } else if (result && result.winner === 'draw') {
      gameOver = true;
      cells.forEach(c => c.classList.add('game-over'));
      setStatus("It's a Draw! 🤝", 'draw');

    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateTurnIndicator(currentPlayer);
      setStatus(
        `Player ${currentPlayer} — Make your move`,
        currentPlayer === 'X' ? 'x' : 'o'
      );
    }
  });
});


resetBtn.addEventListener('click', () => {
  
  board         = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver      = false;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className   = 'cell';
  });

  statusWrap.classList.remove('winner');
  updateTurnIndicator('X');
  setStatus('Player X — Make your move', 'x');
});
