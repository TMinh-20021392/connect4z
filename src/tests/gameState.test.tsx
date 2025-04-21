import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import GameState from '../components/gameState';

describe('GameState Component', () => {
    it('renders the initial game state correctly', () => {
        render(<GameState />);
        expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(42); // 6 rows * 7 columns
    });

    it('allows a player to drop a disc', () => {
        render(<GameState />);
        const firstColumn = screen.getAllByRole('button')[0];
        fireEvent.click(firstColumn);
        expect(firstColumn.firstChild).toHaveClass('bg-red-500'); // Player 1's disc
    });

    it('switches turns between players', () => {
        render(<GameState />);
        const firstColumn = screen.getAllByRole('button')[0];
        fireEvent.click(firstColumn); // Player 1's turn
        fireEvent.click(firstColumn); // Player 2's turn
        expect(firstColumn.firstChild).toHaveClass('bg-yellow-400'); // Player 2's disc
    });

    it('declares a winner when a player connects 4 horizontally', () => {
        render(<GameState />);
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]); // Player 1
        fireEvent.click(buttons[7]); // Player 2
        fireEvent.click(buttons[1]); // Player 1
        fireEvent.click(buttons[8]); // Player 2
        fireEvent.click(buttons[2]); // Player 1
        fireEvent.click(buttons[9]); // Player 2
        fireEvent.click(buttons[3]); // Player 1 wins
        expect(screen.getByText('Player 1 wins!')).toBeInTheDocument();
    });

    it('declares a winner when a player connects 4 vertically', () => {
        render(<GameState />);
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]); // Player 1
        fireEvent.click(buttons[1]); // Player 2
        fireEvent.click(buttons[0]); // Player 1
        fireEvent.click(buttons[1]); // Player 2
        fireEvent.click(buttons[0]); // Player 1
        fireEvent.click(buttons[1]); // Player 2
        fireEvent.click(buttons[0]); // Player 1 wins
        expect(screen.getByText('Player 1 wins!')).toBeInTheDocument();
    });

    it('declares a winner when a player connects 4 diagonally', () => {
        render(<GameState />);
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[3]); // Player 1
        fireEvent.click(buttons[2]); // Player 2
        fireEvent.click(buttons[2]); // Player 1
        fireEvent.click(buttons[1]); // Player 2
        fireEvent.click(buttons[1]); // Player 1
        fireEvent.click(buttons[0]); // Player 2
        fireEvent.click(buttons[1]); // Player 1
        fireEvent.click(buttons[0]); // Player 2
        fireEvent.click(buttons[0]); // Player 1
        fireEvent.click(buttons[0]); // Player 2
        fireEvent.click(buttons[3]); // Player 1 wins diagonally
        expect(screen.getByText('Player 1 wins!')).toBeInTheDocument();
    });

    it('declares a draw when the board is full and no one wins', () => {
        render(<GameState />);
        const buttons = screen.getAllByRole('button');
        // Simulate a full board with no winner
        for (let i = 0; i < buttons.length; i++) {
            fireEvent.click(buttons[i % 7]); // Alternate columns
        }
        expect(screen.getByText("It's a draw!")).toBeInTheDocument();
    });

    it('resets the game when resetTrigger changes', () => {
        const { rerender } = render(<GameState resetTrigger={0} />);
        const firstColumn = screen.getAllByRole('button')[0];
        fireEvent.click(firstColumn); // Player 1 drops a disc
        expect(firstColumn.firstChild).toHaveClass('bg-red-500');
        rerender(<GameState resetTrigger={1} />); // Trigger reset
        expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
        expect(firstColumn.firstChild).toBeNull(); // Board is reset
    });

    it('handles AI moves when aiPlayer is set', () => {
        render(<GameState aiPlayer={2} />);
        const firstColumn = screen.getAllByRole('button')[0];
        fireEvent.click(firstColumn); // Player 1's turn
        expect(screen.getByText("Player 2's turn")).toBeInTheDocument();
        // AI should make a move automatically
        const board = screen.getAllByRole('button');
        const aiMove = board.find(cell => (cell.firstChild as HTMLElement)?.classList.contains('bg-yellow-400'));
        expect(aiMove).toBeDefined();
    });
});
it('finds available columns correctly', () => {
  render(<GameState />);
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[0]); // Player 1 drops a disc in column 0
  fireEvent.click(buttons[1]); // Player 2 drops a disc in column 1
  const availableColumns = buttons.filter(button => button.firstChild === null);
  expect(availableColumns.length).toBe(40); // 42 total cells - 2 filled cells
});

it('calculates the next empty row in a column correctly', () => {
  render(<GameState />);
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[0]); // Player 1 drops a disc in column 0
  fireEvent.click(buttons[0]); // Player 2 drops a disc in column 0
  const firstColumn = buttons.filter((_, index) => index % 7 === 0);
  expect(firstColumn[3].firstChild).toBeNull(); // The third row in column 0 should be empty
});

it('determines the best move for AI to win', () => {
  render(<GameState aiPlayer={2} />);
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[0]); // Player 1
  fireEvent.click(buttons[1]); // AI
  fireEvent.click(buttons[0]); // Player 1
  fireEvent.click(buttons[1]); // AI
  fireEvent.click(buttons[0]); // Player 1
  fireEvent.click(buttons[1]); // AI
  fireEvent.click(buttons[0]); // Player 1
  const aiMove = buttons.find(cell => (cell.firstChild as HTMLElement)?.classList.contains('bg-yellow-400'));
  expect(aiMove).toBeDefined(); // AI should make a winning move
});

it('blocks the opponent from winning', () => {
  render(<GameState aiPlayer={2} />);
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[0]); // Player 1
  fireEvent.click(buttons[1]); // AI
  fireEvent.click(buttons[0]); // Player 1
  fireEvent.click(buttons[1]); // AI
  fireEvent.click(buttons[0]); // Player 1
  fireEvent.click(buttons[1]); // AI
  fireEvent.click(buttons[2]); // Player 1
  const aiMove = buttons.find(cell => (cell.firstChild as HTMLElement)?.classList.contains('bg-yellow-400'));
  expect(aiMove).toBeDefined(); // AI should block Player 1 from winning
});

it('prefers the center column when no immediate win or block is possible', () => {
  render(<GameState aiPlayer={2} />);
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[0]); // Player 1
  fireEvent.click(buttons[6]); // AI
  fireEvent.click(buttons[1]); // Player 1
  fireEvent.click(buttons[5]); // AI
  fireEvent.click(buttons[2]); // Player 1
  const centerColumn = buttons.filter((_, index) => index % 7 === 3);
  const aiMove = centerColumn.find(cell => (cell.firstChild as HTMLElement)?.classList.contains('bg-yellow-400'));
  expect(aiMove).toBeDefined(); // AI should prefer the center column
});