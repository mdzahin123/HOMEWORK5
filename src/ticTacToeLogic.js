// Pure game logic for Tic-Tac-Toe, kept separate from the React component
// so it can be unit-tested without rendering.

export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

export function checkWinner(board) {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (!board.includes(null)) return 'Draw';
  return null;
}

// Returns the cell index where placing `symbol` would complete a line,
// or -1 if no such cell exists.
export function findWinningMove(board, symbol) {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const line = [board[a], board[b], board[c]];
    const symbolCount = line.filter(v => v === symbol).length;
    const emptyCount = line.filter(v => v === null).length;
    if (symbolCount === 2 && emptyCount === 1) {
      return [a, b, c][line.indexOf(null)];
    }
  }
  return -1;
}

// Pick a move for the bot. Strategy: win if possible, block if necessary,
// take center, then a random corner, then any empty square.
export function pickBotMove(board, botSymbol, playerSymbol) {
  const winMove = findWinningMove(board, botSymbol);
  if (winMove !== -1) return winMove;

  const blockMove = findWinningMove(board, playerSymbol);
  if (blockMove !== -1) return blockMove;

  if (board[4] === null) return 4;

  const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  const empties = board
    .map((v, i) => (v === null ? i : null))
    .filter(i => i !== null);
  return empties[Math.floor(Math.random() * empties.length)];
}
