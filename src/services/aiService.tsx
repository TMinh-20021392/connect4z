import { BoardState, Player } from '../contexts/gameContext';

// Constants for the board dimensions
const ROWS = 6;
const COLS = 7;

/**
 * Get the next empty row in a column
 */
export const getNextEmptyRow = (board: BoardState, col: number): number => {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return -1;
};

/**
 * Check if placing at (row, col) would win the game
 */
const isWinningMove = (board: BoardState, row: number, col: number, player: Player): boolean => {
  const directions = [
    { dr: 0, dc: 1 },  // horizontal
    { dr: 1, dc: 0 },  // vertical
    { dr: 1, dc: 1 },  // diagonal right down
    { dr: 1, dc: -1 }, // diagonal left down
  ];

  for (const { dr, dc } of directions) {
    let count = 1;

    // Check one direction
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) break;
      count++;
    }

    // Check opposite direction
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) break;
      count++;
    }

    if (count >= 4) return true;
  }

  return false;
};

/**
 * Calculate AI's next move with simple smart strategy
 */
export const calculateAIMove = (board: BoardState, aiPlayer: Player): number | null => {
  const opponent = aiPlayer === 1 ? 2 : 1;

  const availableCols: number[] = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) {
      availableCols.push(c);
    }
  }

  if (availableCols.length === 0) return null;

  // 1. Check if AI can win immediately
  for (const col of availableCols) {
    const row = getNextEmptyRow(board, col);
    if (row !== -1) {
      board[row][col] = aiPlayer;
      const isWin = isWinningMove(board, row, col, aiPlayer);
      board[row][col] = null;
      if (isWin) return col;
    }
  }

  // 2. Block opponent's winning move
  for (const col of availableCols) {
    const row = getNextEmptyRow(board, col);
    if (row !== -1) {
      board[row][col] = opponent;
      const isWin = isWinningMove(board, row, col, opponent);
      board[row][col] = null;
      if (isWin) return col;
    }
  }

  // 3. Prefer center columns
  availableCols.sort((a, b) => Math.abs(COLS / 2 - a) - Math.abs(COLS / 2 - b));

  // 4. Pick the best available
  return availableCols[0];
};
