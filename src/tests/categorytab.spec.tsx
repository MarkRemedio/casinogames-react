import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryTabs } from '../components/categorytabs';
import { useLobbyStore } from '../store/useLobbyStore';

// Mock useLobbyStore
jest.mock('../store/useLobbyStore');

describe('CategoryTabs component', () => {
  const setActiveCategoryMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the return shape of useLobbyStore
    (useLobbyStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        categories: [
          { id: 'all', label: 'All Games' },
          { id: 'slots', label: 'Slots' },
          { id: 'poker', label: 'Poker' },
        ],
        activeCategory: 'slots',
        setActiveCategory: setActiveCategoryMock,
      })
    );
  });

  it('renders all category buttons', () => {
    render(<CategoryTabs />);
    expect(screen.getByText('All Games')).toBeInTheDocument();
    expect(screen.getByText('Slots')).toBeInTheDocument();
    expect(screen.getByText('Poker')).toBeInTheDocument();
  });

  it('highlights the active category', () => {
    render(<CategoryTabs />);
    const activeButton = screen.getByText('Slots');
    expect(activeButton).toHaveStyle(`background: #8DC63F`); // COLORS.green
  });

  it('calls setActiveCategory when a tab is clicked', () => {
    render(<CategoryTabs />);
    fireEvent.click(screen.getByText('Poker'));
    expect(setActiveCategoryMock).toHaveBeenCalledWith('poker');
  });
});
