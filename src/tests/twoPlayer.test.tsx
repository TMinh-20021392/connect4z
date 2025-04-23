import { render, screen } from '@testing-library/react';
import TwoPlayer from '../pages/twoPlayer';
import { GameProvider } from '../contexts/gameContext';

describe('TwoPlayer', () => {
  it('should render the two-player page', () => {
    render(
      <GameProvider>
        <TwoPlayer />
      </GameProvider>
    );

    expect(screen.getByText('Two Player Mode')).toBeInTheDocument();
  });
});