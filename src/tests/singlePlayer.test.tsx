import { render, screen } from '@testing-library/react';
import SinglePlayer from '../pages/singlePlayer';
import { GameProvider } from '../contexts/gameContext';

describe('SinglePlayer', () => {
  it('should render the single-player page', () => {
    render(
      <GameProvider>
        <SinglePlayer />
      </GameProvider>
    );

    expect(screen.getByText('Single Player Mode')).toBeInTheDocument();
    expect(screen.getByText('You are playing as Red (Player 1)')).toBeInTheDocument();
  });
});