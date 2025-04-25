import { render, screen, fireEvent } from '@testing-library/react';
import HowToPlay from '../pages/howToPlay';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, beforeEach, vi, expect } from 'vitest';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('zmp-ui', async () => {
  const actual = await vi.importActual<any>('zmp-ui');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HowToPlay page', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <HowToPlay />
      </MemoryRouter>
    );
    vi.clearAllMocks();
  });

  it('should render the page title', () => {
    expect(screen.getByText('How to Play')).toBeInTheDocument();
  });

  it('should render all section headings', () => {
    expect(screen.getByText('Game Objective')).toBeInTheDocument();
    expect(screen.getByText('Game Rules')).toBeInTheDocument();
    expect(screen.getByText('Game Modes')).toBeInTheDocument();
    expect(screen.getByText('Tips')).toBeInTheDocument();
  });

  it('should render game objective content', () => {
    const objectiveText = 'Connect Four is a two-player game where the objective is to be the first to form a horizontal, vertical, or diagonal line of four of your own discs.';
    expect(screen.getByText(objectiveText)).toBeInTheDocument();
  });

  it('should render all game rules', () => {
    expect(screen.getByText(/Players take turns dropping colored discs/i)).toBeInTheDocument();
    expect(screen.getByText(/Discs fall to the lowest available position/i)).toBeInTheDocument();
    expect(screen.getByText(/The first player to connect four discs/i)).toBeInTheDocument();
    expect(screen.getByText(/If the grid fills up without a winner/i)).toBeInTheDocument();
  });

  it('should render game modes information', () => {
    expect(screen.getByText('Single Player')).toBeInTheDocument();
    expect(screen.getByText(/Challenge the AI in single-player mode/i)).toBeInTheDocument();
    expect(screen.getByText('Two Player (Coming Soon)')).toBeInTheDocument();
    expect(screen.getByText(/Play against a friend on the same device/i)).toBeInTheDocument();
  });

  it('should render tips for playing', () => {
    expect(screen.getByText(/Try to control the center columns/i)).toBeInTheDocument();
    expect(screen.getByText(/Watch for your opponent's potential winning moves/i)).toBeInTheDocument();
    expect(screen.getByText(/Look for opportunities to create "double threats"/i)).toBeInTheDocument();
  });

  it('should render Return to Menu button', () => {
    expect(screen.getByText('Return to Menu')).toBeInTheDocument();
  });

  it('should navigate to home page when Return to Menu button is clicked', () => {
    const returnButton = screen.getByTestId('return-to-menu-button');
    fireEvent.click(returnButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
