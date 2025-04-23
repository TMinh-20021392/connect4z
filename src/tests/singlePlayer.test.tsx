import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SinglePlayer from '../pages/singlePlayer';
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

describe('SinglePlayer', () => {
  const mockResetGame = vi.fn();
  const mockSetGameMode = vi.fn();
  const mockNavigate = vi.fn();

  const baseGameState = {
    isGameOver: false,
    winner: null,
    isDraw: false,
    humanPlayerNumber: 1,
    board: Array(6).fill(Array(7).fill(null)),
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

  it('renders the page title and player info', () => {
    render(<SinglePlayer />);
    expect(screen.getByText('Single Player Mode')).toBeInTheDocument();
    expect(screen.getByText('You are playing as Red (Player 1)')).toBeInTheDocument();
  });

  it('calls setGameMode to "single" on mount', () => {
    render(<SinglePlayer />);
    expect(mockSetGameMode).toHaveBeenCalledWith('single');
  });

  it('renders the game board', () => {
    render(<SinglePlayer />);
    expect(screen.getByTestId('game-board')).toBeInTheDocument();
  });

  it('renders only Return to Menu button if game is not over', () => {
    render(<SinglePlayer />);
    expect(screen.getByRole('button', { name: /Return to Menu/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Play Again/i })).not.toBeInTheDocument();
  });

  it('resets the game and navigates home when Return to Menu is clicked', () => {
    render(<SinglePlayer />);
    const returnButton = screen.getByRole('button', { name: /Return to Menu/i });
    fireEvent.click(returnButton);
    expect(mockResetGame).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows "You win!" when player wins the game', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        isGameOver: true,
        winner: 1,
      },
      resetGame: mockResetGame,
      setGameMode: mockSetGameMode,
    });

    render(<SinglePlayer />);
    expect(screen.getByText('You win! Congratulations!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play Again/i })).toBeInTheDocument();
  });

  it('shows "AI wins!" when AI wins the game', () => {
    (useGame as unknown as jest.Mock).mockReturnValue({
      gameState: {
        ...baseGameState,
        isGameOver: true,
        winner: 2,
      },
      resetGame: mockResetGame,
      setGameMode: mockSetGameMode,
    });

    render(<SinglePlayer />);
    expect(screen.getByText('AI wins! Better luck next time.')).toBeInTheDocument();
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
  
    render(<SinglePlayer />);
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

    render(<SinglePlayer />);
    const playAgainButton = screen.getByRole('button', { name: /Play Again/i });
    fireEvent.click(playAgainButton);
    expect(mockResetGame).toHaveBeenCalled();
  });
});
