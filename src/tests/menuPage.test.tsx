import { render, screen } from '@testing-library/react';
import MenuPage from '../pages/menuPage';

describe('MenuPage', () => {
  it('should render the menu page', () => {
    render(<MenuPage />);

    expect(screen.getByText('Connect4Z')).toBeInTheDocument();
    expect(screen.getByText('Single Player')).toBeInTheDocument();
    expect(screen.getByText('Two Player')).toBeInTheDocument();
    expect(screen.getByText('How to Play')).toBeInTheDocument();
  });
});