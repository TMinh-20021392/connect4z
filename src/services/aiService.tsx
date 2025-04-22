import { BoardState, Player } from '../contexts/gameContext';

// Constants for the board dimensions
const ROWS = 6;
const COLS = 7;

/**
 * Find any available column for the AI to make a move
 * @param board Current board state
 * @returns A column index or null if no moves are available
 */
export const findRandomAvailableColumn = (board: BoardState): number | null => {
  const availableCols: number[] = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) {
      availableCols.push(c);
    }
  }
  
  if (availableCols.length === 0) return null;
  
  // Return random available column
  return availableCols[Math.floor(Math.random() * availableCols.length)];
};

/**
 * Get the next empty row in a column
 * @param board Current board state
 * @param col Column to check
 * @returns Row index or -1 if column is full
 */
export const getNextEmptyRow = (board: BoardState, col: number): number => {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return -1; // Column is full
};

/**
 * Calculate AI's next move
 * @param board Current board state
 * @param aiPlayer AI player number
 * @returns The column where AI should place its disc
 */
export const calculateAIMove = (board: BoardState): number | null => {
  // Currently using a simple random strategy
  // This can be expanded with more advanced AI strategies
  return findRandomAvailableColumn(board);
};