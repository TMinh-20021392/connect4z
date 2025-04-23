import { calculateAIMove, getNextEmptyRow } from '../services/aiService';

describe('AI Service', () => {
  const emptyBoard = Array(6).fill(null).map(() => Array(7).fill(null));

  it('should return the next empty row in a column', () => {
    const board = [...emptyBoard];
    board[5][0] = 1;
    expect(getNextEmptyRow(board, 0)).toBe(4);
  });

  it('should return -1 for a full column', () => {
    const board = [...emptyBoard];
    for (let i = 0; i < 6; i++) {
      board[i][0] = 1;
    }
    expect(getNextEmptyRow(board, 0)).toBe(-1);
  });

  it('should block opponent\'s winning move', () => {
    const board = [...emptyBoard];
    board[5][0] = 1;
    board[4][0] = 1;
    board[3][0] = 1;
    expect(calculateAIMove(board, 2)).toBe(0);
  });

  it('should prefer center columns', () => {
    const board = [...emptyBoard];
    expect(calculateAIMove(board, 1)).toBe(3);
  });
});