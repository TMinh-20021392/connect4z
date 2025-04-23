import { render, screen } from '@testing-library/react';
import HowToPlay from '../pages/howToPlay';

describe('HowToPlay', () => {
  it('should render the How to Play page', () => {
    render(<HowToPlay />);

    expect(screen.getByText('How to Play')).toBeInTheDocument();
    expect(screen.getByText('Game Objective')).toBeInTheDocument();
  });
});