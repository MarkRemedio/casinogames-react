import { render, screen } from '@testing-library/react';
import { useLobbyStore } from '../store/useLobbyStore';
import { GameCard } from '../components/gamecard';
import type { Game } from '../types';

jest.mock('../store/useLobbyStore');

const mockGame: Game = {
  id: 'test-game',
  name: 'Test Game',
  image: 'test-image.jpg',
  categories: ['slots']
};

describe('GameCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useLobbyStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({
        jackpots: {},
        activeCategory: 'all'
      });
    });
  });

  it('renders game name and image', () => {
    render(<GameCard game={mockGame} />);
    
    expect(screen.getByAltText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  });

  it('shows NEW ribbon when game has "new" category', () => {
    const newGame = { ...mockGame, categories: ['new', 'slots'] };
    render(<GameCard game={newGame} />);
    
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('shows TOP ribbon when game has "top" category', () => {
    const topGame = { ...mockGame, categories: ['top', 'slots'] };
    render(<GameCard game={topGame} />);
    
    expect(screen.getByText('TOP')).toBeInTheDocument();
  });

  it('does not show NEW ribbon when active category is "new"', () => {
    (useLobbyStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({
        jackpots: {},
        activeCategory: 'new'
      });
    });
    
    const newGame = { ...mockGame, categories: ['new', 'slots'] };
    render(<GameCard game={newGame} />);
    
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('displays jackpot amount when available', () => {
    (useLobbyStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({
        jackpots: { 'test-game': 1000000 },
        activeCategory: 'all'
      });
    });
    
    render(<GameCard game={mockGame} />);
    
    expect(screen.getByText('£1,000,000')).toBeInTheDocument();
  });

  it('does not display jackpot when not available', () => {
    render(<GameCard game={mockGame} />);
    
    expect(screen.queryByTestId('jackpot-badge')).not.toBeInTheDocument();
  });
});