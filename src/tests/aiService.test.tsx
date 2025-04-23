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

  it('should block opponent\'s vertical winning move', () => { 
    const board = [...emptyBoard];
    board[5][0] = 1;
    board[4][0] = 1;
    board[3][0] = 1;
    expect(calculateAIMove(board, 2)).toBe(0); // AI should block column 0
  });

  it('should block opponent\'s horizontal winning move', () => {
    const board = [...emptyBoard];
    board[5][0] = 1;
    board[5][1] = 1;
    board[5][2] = 1;
    expect(calculateAIMove(board, 2)).toBe(3); // AI should block column 3
  });

  it('should block opponent\'s diagonal (bottom-left to top-right) winning move', () => {
    const board = [...emptyBoard];
    board[5][0] = 1;
    board[4][1] = 1;
    board[3][2] = 1;
    expect(calculateAIMove(board, 2)).toBe(3); // AI should block column 3
  });

  it('should block opponent\'s diagonal (bottom-right to top-left) winning move', () => {
    const board = [...emptyBoard];
    board[5][3] = 1;
    board[4][2] = 1;
    board[3][1] = 1;
    expect(calculateAIMove(board, 2)).toBe(0); // AI should block column 0
  });

  it('should block potential 3-in-a-row (horizontal with open ends)', () => {
    const board = [...emptyBoard];
    board[5][1] = 1;
    board[5][2] = 1;
    expect(calculateAIMove(board, 2)).toBe(0); // AI should block column 0 or 3
  });

  it('should block potential 3-in-a-row (vertical with open ends)', () => {
    const board = [...emptyBoard];
    board[5][0] = 1;
    board[4][0] = 1;
    expect(calculateAIMove(board, 2)).toBe(0); // AI should block column 0
  });

  it('should block potential diagonal (bottom-left to top-right)', () => {
    const board = [...emptyBoard];
    board[5][0] = 1;
    board[4][1] = 1;
    expect(calculateAIMove(board, 2)).toBe(3); // AI should block column 3
  });

  it('should prefer center columns', () => {
    const board = [...emptyBoard];
    expect(calculateAIMove(board, 1)).toBe(3);
  });
});
