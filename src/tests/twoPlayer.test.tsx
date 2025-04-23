import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TwoPlayer from '../pages/twoPlayer';
import { useGame } from '../contexts/gameContext';
import { useNavigate } from 'zmp-ui';

// Mock dependencies
vi.mock('../contexts/gameContext', async () => {
  const actual = await vi.importActual<any>('../contexts/gameContext');
  return {
    ...actual,
    useGame: vi.fn(),
  };
});

vi.mock('zmp-ui', async () => {
  const actual = await vi.importActual<any>('zmp-ui');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('TwoPlayer', () => {
  const mockResetGame = vi.fn();
  const mockSetGameMode = vi.fn();
  const mockNavigate = vi.fn();

  const baseGameState = {
    isGameOver: false,
    winner: null,
    isDraw: false,
    humanPlayerNumber: 1,
    board: Array(6).fill(Array(7).fill(null)), // <-- add this!
    currentPlayer: 1,
    isAIThinking: false,
  };
  

  beforeEach(() => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: baseGameState,
      resetGame: mockResetGame,
      setGameMode: mockSetGameMode,
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title', () => {
    render(<TwoPlayer />);
    expect(screen.getByText('Two Player Mode')).toBeInTheDocument();
  });

  it('calls setGameMode to "two-player" on mount', () => {
    render(<TwoPlayer />);
    expect(mockSetGameMode).toHaveBeenCalledWith('two-player');
  });

  it('renders the game board', () => {
    render(<TwoPlayer />);
    expect(screen.getByTestId('game-board')).toBeInTheDocument();
  });

  it('renders only Return to Menu button if game is not over', () => {
    render(<TwoPlayer />);
    expect(screen.getByRole('button', { name: /Return to Menu/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Play Again/i })).not.toBeInTheDocument();
  });

  it('resets the game and navigates home when Return to Menu is clicked', () => {
    render(<TwoPlayer />);
    const returnButton = screen.getByRole('button', { name: /Return to Menu/i });
    fireEvent.click(returnButton);
    expect(mockResetGame).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows winning message when player wins the game', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        isGameOver: true,
        winner: 2,
      },
      resetGame: mockResetGame,
      setGameMode: mockSetGameMode,
    });

    render(<TwoPlayer />);
    expect(screen.getByText('Player 2 wins!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play Again/i })).toBeInTheDocument();
  });

  it('shows draw message when game is a draw', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        isGameOver: true,
        isDraw: true,
      },
      resetGame: mockResetGame,
      setGameMode: mockSetGameMode,
    });
  
    render(<TwoPlayer />);
    expect(screen.getByText("It's a draw!")).toBeInTheDocument();
  });
  

  it('resets the game when clicking Play Again', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        isGameOver: true,
      },
      resetGame: mockResetGame,
      setGameMode: mockSetGameMode,
    });

    render(<TwoPlayer />);
    const playAgainButton = screen.getByRole('button', { name: /Play Again/i });
    fireEvent.click(playAgainButton);
    expect(mockResetGame).toHaveBeenCalled();
  });
});
