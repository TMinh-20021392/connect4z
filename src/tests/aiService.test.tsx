import { calculateAIMove, getNextEmptyRow } from '../services/aiService';

describe('AI Service', () => {
  const emptyBoard = Array(6).fill(null).map(() => Array(7).fill(null));

  it('should return the next empty row in a column', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    board[5][0] = 1;
    expect(getNextEmptyRow(board, 0)).toBe(4);
  });

  it('should return -1 for a full column', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    for (let i = 0; i < 6; i++) {
      board[i][0] = 1;
    }
    expect(getNextEmptyRow(board, 0)).toBe(-1);
  });

  it('should block opponent\'s vertical winning move', () => { 
    const board = JSON.parse(JSON.stringify(emptyBoard));
    board[5][0] = 1;
    board[4][0] = 1;
    board[3][0] = 1;
    expect(calculateAIMove(board, 2)).toBe(0); // AI should block column 0
  });

  it('should block opponent\'s horizontal winning move', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    board[5][0] = 1;
    board[5][1] = 1;
    board[5][2] = 1;
    expect(calculateAIMove(board, 2)).toBe(3); // AI should block column 3
  });

  it('should block opponent\'s diagonal (bottom-left to top-right) winning move', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    board[5][0] = 1; // Bottom piece
    board[5][1] = 2; // Support piece
    board[4][1] = 1; // Second diagonal piece
    board[5][2] = 2; // Support piece
    board[4][2] = 2; // Support piece
    board[3][2] = 1; // Third diagonal piece
    // Now a piece in column 3, row 3 would make a diagonal win
    // But for that, we need supports in column 3
    board[5][3] = 2; // Support piece
    board[4][3] = 2; // Support piece
    board[3][3] = 2; // Support piece
    expect(calculateAIMove(board, 2)).toBe(3);
  });

  it('should block opponent\'s diagonal (bottom-right to top-left) winning move', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    board[5][3] = 1; // Bottom piece
    board[5][2] = 2; // Support piece
    board[4][2] = 1; // Second diagonal piece
    board[5][1] = 2; // Support piece
    board[4][1] = 2; // Support piece
    board[3][1] = 1; // Third diagonal piece
    // Now a piece in column 0, row 2 would make a diagonal win
    // But for that, we need supports in column 0
    board[5][0] = 2; // Support piece
    board[4][0] = 2; // Support piece
    board[3][0] = 2; // Support piece
    expect(calculateAIMove(board, 2)).toBe(0);
  });

  it('should block potential 3-in-a-row (horizontal with open ends)', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    board[5][1] = 1;
    board[5][2] = 1;
    // AI should block either column 0 or 3 to prevent a potential win
    const move = calculateAIMove(board, 2);
    expect([0, 3]).toContain(move); // Accept either blocking column
  });
  
  it('should block potential diagonal (bottom-left to top-right with open ends)', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
  });
  
  it('should block potential diagonal (bottom-right to top-left with open ends)', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
  });

  it('should prefer center columns', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    expect(calculateAIMove(board, 1)).toBe(3);
  });
});
