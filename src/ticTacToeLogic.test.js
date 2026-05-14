import { checkWinner, findWinningMove, pickBotMove } from './ticTacToeLogic';

describe('checkWinner', () => {
  test('returns null for an empty board', () => {
    expect(checkWinner(Array(9).fill(null))).toBeNull();
  });

  test('detects a row win', () => {
    const board = [
      'X', 'X', 'X',
      null, 'O', null,
      'O', null, null,
    ];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects a column win', () => {
    const board = [
      'O', 'X', null,
      'O', 'X', null,
      null, 'X', null,
    ];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects a diagonal win', () => {
    const board = [
      'O', 'X', null,
      'X', 'O', null,
      null, 'X', 'O',
    ];
    expect(checkWinner(board)).toBe('O');
  });

  test('returns "Draw" when the board is full with no winner', () => {
    const board = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    expect(checkWinner(board)).toBe('Draw');
  });
});

describe('findWinningMove', () => {
  test('finds the completing index in a row', () => {
    const board = [
      'X', 'X', null,
      null, null, null,
      null, null, null,
    ];
    expect(findWinningMove(board, 'X')).toBe(2);
  });

  test('returns -1 when no winning move exists', () => {
    const board = [
      'X', null, null,
      null, null, null,
      null, null, null,
    ];
    expect(findWinningMove(board, 'X')).toBe(-1);
  });
});

describe('pickBotMove', () => {
  test('takes the winning move when available', () => {
    const board = [
      'O', 'O', null,
      'X', 'X', null,
      null, null, null,
    ];
    // Bot is O, can win at index 2.
    expect(pickBotMove(board, 'O', 'X')).toBe(2);
  });

  test('blocks the player from winning', () => {
    const board = [
      'X', 'X', null,
      'O', null, null,
      null, null, null,
    ];
    // Bot is O, must block X at index 2.
    expect(pickBotMove(board, 'O', 'X')).toBe(2);
  });

  test('prefers center on an empty board', () => {
    expect(pickBotMove(Array(9).fill(null), 'O', 'X')).toBe(4);
  });

  test('picks a corner when center is taken', () => {
    const board = [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ];
    const move = pickBotMove(board, 'O', 'X');
    expect([0, 2, 6, 8]).toContain(move);
  });

  test('prioritises winning over blocking', () => {
    const board = [
      'O', 'O', null,  // bot can win at 2
      'X', 'X', null,  // player threatens at 5
      null, null, null,
    ];
    expect(pickBotMove(board, 'O', 'X')).toBe(2);
  });
});
