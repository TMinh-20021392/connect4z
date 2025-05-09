import { BoardState, Player } from '../contexts/gameContext';

const ROWS = 6;
const COLS = 7;
const MAX_DEPTH = 9;

export const getNextEmptyRow = (board: BoardState, col: number): number => {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return -1;
};

const isWinningMove = (board: BoardState, row: number, col: number, player: Player): boolean => {
  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
  ];

  for (const { dr, dc } of directions) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) break;
      count++;
    }
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

const evaluateBoard = (board: BoardState, aiPlayer: Player): number => {
  let score = 0;
  const centerCol = Math.floor(COLS / 2);
  let centerCount = 0;

  // Give higher bonus for center columns
  for (let r = 0; r < ROWS; r++) {
    if (board[r][centerCol] === aiPlayer) centerCount++;
  }
  // Increase the center column weight
  score += centerCount * 10;
  
  // Also give some weight to columns adjacent to center
  let nearCenterCount = 0;
  for (let r = 0; r < ROWS; r++) {
    if (board[r][centerCol-1] === aiPlayer) nearCenterCount++;
    if (board[r][centerCol+1] === aiPlayer) nearCenterCount++;
  }
  score += nearCenterCount * 3;
  
  return score;
};

const isBoardFull = (board: BoardState): boolean => {
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) return false;
  }
  return true;
};

const minimax = (
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  aiPlayer: Player,
  opponent: Player
): [number, number] => {
  const availableCols: number[] = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) availableCols.push(c);
  }

  // For empty board or near-empty boards, simply bias toward the center
  let isEmpty = true;
  outerLoop: for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== null) {
        isEmpty = false;
        break outerLoop;
      }
    }
  }
  
  if (isEmpty) {
    return [0, Math.floor(COLS / 2)]; // Return center column for empty board
  }

  if (depth === 0 || isBoardFull(board)) {
    return [evaluateBoard(board, aiPlayer), -1];
  }

  // Check if any move results in immediate win
  for (const col of availableCols) {
    const row = getNextEmptyRow(board, col);
    if (row !== -1) {
      if (isWinningMove(board, row, col, maximizingPlayer ? aiPlayer : opponent)) {
        return [maximizingPlayer ? 1000000 : -1000000, col];
      }
    }
  }

  // Use the center column as the default best column if available
  const centerCol = Math.floor(COLS / 2);
  let bestCol = availableCols.includes(centerCol) ? centerCol : 
    availableCols[Math.floor(Math.random() * availableCols.length)];

  if (maximizingPlayer) {
    let value = -Infinity;
    for (const col of availableCols) {
      const row = getNextEmptyRow(board, col);
      if (row !== -1) {
        board[row][col] = aiPlayer;
        const [newScore] = minimax(board, depth - 1, alpha, beta, false, aiPlayer, opponent);
        board[row][col] = null;
        if (newScore > value) {
          value = newScore;
          bestCol = col;
        }
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break; // Beta cut-off
      }
    }
    return [value, bestCol];
  } else {
    let value = Infinity;
    for (const col of availableCols) {
      const row = getNextEmptyRow(board, col);
      if (row !== -1) {
        board[row][col] = opponent;
        const [newScore] = minimax(board, depth - 1, alpha, beta, true, aiPlayer, opponent);
        board[row][col] = null;
        if (newScore < value) {
          value = newScore;
          bestCol = col;
        }
        beta = Math.min(beta, value);
        if (alpha >= beta) break; // Alpha cut-off
      }
    }
    return [value, bestCol];
  }
};

export const calculateAIMove = (board: BoardState, aiPlayer: Player): number | null => {
  // Short-circuit for empty board - always choose center
  if (board.every(row => row.every(cell => cell === null))) {
    return Math.floor(COLS / 2);
  }

  const opponent = aiPlayer === 1 ? 2 : 1;
  const [_, bestCol] = minimax(board, MAX_DEPTH, -Infinity, Infinity, true, aiPlayer, opponent);

  return bestCol;
};