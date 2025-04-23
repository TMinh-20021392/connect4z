import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from '../components/gameBoard';
import { GameProvider } from '../contexts/gameContext';

describe('GameBoard', () => {
  it('should render the game board', () => {
    render(
      <GameProvider>
        <GameBoard />
      </GameProvider>
    );

    expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(42); // 6 rows x 7 columns
  });

  it('should allow making a move', () => {
    render(
      <GameProvider>
        <GameBoard />
      </GameProvider>
    );

    const firstColumn = screen.getAllByRole('button')[0];
    fireEvent.click(firstColumn);

    expect(firstColumn.querySelector('.bg-red-500')).toBeInTheDocument();
  });
});