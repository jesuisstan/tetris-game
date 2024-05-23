import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NotFound from '../../components/NotFound.page';

describe('NotFound component', () => {
  it('should render the NotFound component with "404" and "Not Found" text', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });
});
