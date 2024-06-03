import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Layout/Footer';
import useMediaQuery from '@mui/material/useMediaQuery';

// Mock useMediaQuery hook to control screen width
jest.mock('@mui/material/useMediaQuery');

describe('Footer Component', () => {
  beforeEach(() => {
    // Mock useMediaQuery hook to return false (large screen) by default
    useMediaQuery.mockReturnValue(false);
  });

  test('renders the footer component without crashing', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  test('hides the GitHub link on small screens', () => {
    // Mock useMediaQuery hook to return true (small screen)
    useMediaQuery.mockReturnValue(true);
    render(<Footer />);
    const githubLink = screen.queryByText('@github');
    expect(githubLink).not.toBeInTheDocument();
  });

  test('displays the GitHub link on large screens', () => {
    render(<Footer />);
    const githubLink = screen.getByText('@github');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/jesuisstan/tetris-game');
  });

  test('displays the correct creators', () => {
    render(<Footer />);
    const creatorStan = screen.getByText('Stan Krivtsoff');
    expect(creatorStan).toBeInTheDocument();
  });
});
