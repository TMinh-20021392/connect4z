// GameBoard.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from '../components/gameBoard';
import { useGame } from '../contexts/gameContext';

// Mock useGame
vi.mock('../contexts/gameContext', async () => {
  const actual = await vi.importActual<any>('../contexts/gameContext');
  return {
    ...actual,
    useGame: vi.fn(),
  };
});

describe('GameBoard', () => {
  const mockMakeMove = vi.fn();

  const createEmptyBoard = () => Array(6).fill(null).map(() => Array(7).fill(null));

  const baseGameState = {
    board: createEmptyBoard(), // 6 rows, 7 columns
    currentPlayer: 1,
    isGameOver: false,
    winner: null,
    isDraw: false,
    isAIThinking: false,
  };

  beforeEach(() => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: baseGameState,
      makeMove: mockMakeMove,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the game status with current player', () => {
    render(<GameBoard data-testid="game-board" />);
    expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
  });

  it('renders player 2 status when current player is 2', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        currentPlayer: 2,
      },
      makeMove: mockMakeMove,
    });
    
    render(<GameBoard data-testid="game-board" />);
    expect(screen.getByText("Player 2's turn")).toBeInTheDocument();
  });

  it('shows AI thinking status when AI is thinking', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        isAIThinking: true,
      },
      makeMove: mockMakeMove,
    });
    
    render(<GameBoard data-testid="game-board" />);
    expect(screen.getByText("AI is thinking...")).toBeInTheDocument();
  });

  it('renders the correct number of cells', () => {
    render(<GameBoard data-testid="game-board" />);
    // 6 rows x 7 columns
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(42); // 6 rows x 7 columns = 42 cells
  });

  // Helper function to get a cell by its column and row
  const getCell = (column: number, row: number = 0) => {
    const cells = screen.getAllByLabelText(`Column ${column}`);
    return cells[row]; // Get the cell at specified row in the column
  };

  it('calls makeMove when clicking a playable column', () => {
    render(<GameBoard data-testid="game-board" />);
    // Get the first cell in column 1 (index 0)
    const firstColumn = getCell(1);
    fireEvent.click(firstColumn);
    expect(mockMakeMove).toHaveBeenCalledWith(0);
  });

  it('calls makeMove with correct column index for each column', () => {
    render(<GameBoard data-testid="game-board" />);
    
    // Test clicking on each column
    for (let col = 1; col <= 7; col++) {
      const columnCell = getCell(col);
      fireEvent.click(columnCell);
      expect(mockMakeMove).toHaveBeenLastCalledWith(col - 1);
    }
    
    // Should have been called 7 times total
    expect(mockMakeMove).toHaveBeenCalledTimes(7);
  });

  it('does not call makeMove if AI is thinking', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        isAIThinking: true,
      },
      makeMove: mockMakeMove,
    });

    render(<GameBoard data-testid="game-board" />);
    const columnCell = getCell(1);
    fireEvent.click(columnCell);
    expect(mockMakeMove).not.toHaveBeenCalled();
  });

  it('does not call makeMove if game is over', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        isGameOver: true,
      },
      makeMove: mockMakeMove,
    });

    render(<GameBoard data-testid="game-board" />);
    const columnCell = getCell(1);
    fireEvent.click(columnCell);
    expect(mockMakeMove).not.toHaveBeenCalled();
  });

  it('does not call makeMove if column is full', () => {
    const boardWithFullColumn = createEmptyBoard();
    // Fill the first column
    for (let i = 0; i < 6; i++) {
      boardWithFullColumn[i][0] = i % 2 + 1; // Alternating 1 and 2
    }
    
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        board: boardWithFullColumn,
      },
      makeMove: mockMakeMove,
    });

    render(<GameBoard data-testid="game-board" />);
    const fullColumnCell = getCell(1);
    fireEvent.click(fullColumnCell);
    expect(mockMakeMove).not.toHaveBeenCalled();
  });

  it('renders player tokens with correct colors', () => {
    const boardWithTokens = createEmptyBoard();
    // Add some player tokens
    boardWithTokens[5][0] = 1; // Player 1 at bottom left
    boardWithTokens[5][1] = 2; // Player 2 next to it
    boardWithTokens[4][0] = 1; // Player 1 above player 1
    
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        board: boardWithTokens,
      },
      makeMove: mockMakeMove,
    });

    render(<GameBoard data-testid="game-board" />);
    
    // Get board element
    const board = screen.getByTestId('game-board');
    
    // Count red tokens (player 1)
    const redTokens = board.querySelectorAll('.bg-red-500');
    expect(redTokens).toHaveLength(2);
    
    // Count yellow tokens (player 2)
    const yellowTokens = board.querySelectorAll('.bg-yellow-400');
    expect(yellowTokens).toHaveLength(1);
  });

  it('applies correct accessibility attributes', () => {
    render(<GameBoard data-testid="game-board" />);
    
    // Check data-testid was applied
    expect(screen.getByTestId('game-board')).toBeInTheDocument();
    
    // Check aria-labels for columns
    for (let col = 1; col <= 7; col++) {
      const columnCells = screen.getAllByLabelText(`Column ${col}`);
      expect(columnCells).toHaveLength(6); // 6 cells per column
    }
  });

  it('renders correctly with an empty board', () => {
    render(<GameBoard data-testid="game-board" />);
    // With empty board, no player tokens should be visible
    const boardContainer = screen.getByText("Player 1's turn").parentElement;
    expect(boardContainer).toBeInTheDocument();
    
    // Should not find any colored tokens
    const board = screen.getByTestId('game-board');
    expect(board.querySelector('.bg-red-500')).toBeNull();
    expect(board.querySelector('.bg-yellow-400')).toBeNull();
  });

  it('renders correctly with a partially filled board', () => {
    const partialBoard = createEmptyBoard();
    // Create a diagonal pattern
    partialBoard[5][0] = 1;
    partialBoard[5][1] = 2;
    partialBoard[5][2] = 1;
    partialBoard[4][0] = 2;
    partialBoard[4][1] = 1;
    partialBoard[3][0] = 1;
    
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        board: partialBoard,
      },
      makeMove: mockMakeMove,
    });

    render(<GameBoard data-testid="game-board" />);
    
    // Count player tokens
    const board = screen.getByTestId('game-board');
    const redTokens = board.querySelectorAll('.bg-red-500');
    const yellowTokens = board.querySelectorAll('.bg-yellow-400');
    
    expect(redTokens).toHaveLength(4); // Player 1 (red)
    expect(yellowTokens).toHaveLength(2); // Player 2 (yellow)
  });
});