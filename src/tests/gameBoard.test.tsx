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

  const baseGameState = {
    board: Array(6).fill(Array(7).fill(null)), // 6 rows, 7 columns
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

  it('renders the game status', () => {
    render(<GameBoard />);
    expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
  });

  it('renders the correct number of cells', () => {
    render(<GameBoard />);
    // 6 rows x 7 columns
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6 * 7);
  });

  it('calls makeMove when clicking a playable column', () => {
    render(<GameBoard />);
    const columnButton = screen.getByLabelText('Column 1');
    fireEvent.click(columnButton);
    expect(mockMakeMove).toHaveBeenCalledWith(0);
  });

  it('does not call makeMove if AI is thinking', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        isAIThinking: true,
      },
      makeMove: mockMakeMove,
    });

    render(<GameBoard />);
    const columnButton = screen.getByLabelText('Column 1');
    fireEvent.click(columnButton);
    expect(mockMakeMove).not.toHaveBeenCalled();
  });

  it('shows winner message when game is over', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        isGameOver: true,
        winner: 2,
      },
      makeMove: mockMakeMove,
    });

    render(<GameBoard />);
    expect(screen.getByText('Player 2 wins!')).toBeInTheDocument();
  });

  it('shows draw message when game is a draw', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        isGameOver: true,
        isDraw: true,
      },
      makeMove: mockMakeMove,
    });

    render(<GameBoard />);
    expect(screen.getByText("It's a draw!")).toBeInTheDocument();
  });
});
