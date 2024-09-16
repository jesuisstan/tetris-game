import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../components/Layout/Home.page';
import { TETROMINOES } from '../../utils/tetrominoes';
import Preview from '../../components/Game/Preview';

// Mock static assets
jest.mock('../../assets/powered-by/logo-css.png', () => 'logo-css.png');
jest.mock('../../assets/powered-by/logo-html.png', () => 'logo-html.png');
jest.mock('../../assets/powered-by/logo-js.png', () => 'logo-js.png');
jest.mock(
  '../../assets/powered-by/logo-material-ui.png',
  () => 'logo-material-ui.png'
);
jest.mock('../../assets/powered-by/logo-mongodb.png', () => 'logo-mongodb.png');
jest.mock('../../assets/powered-by/logo-node.png', () => 'logo-node.png');
jest.mock('../../assets/powered-by/logo-react.png', () => 'logo-react.png');
jest.mock('../../assets/powered-by/logo-redux.png', () => 'logo-redux.png');
jest.mock('../../assets/powered-by/logo-jwt.png', () => 'logo-jwt.png');
jest.mock(
  '../../assets/powered-by/logo-socket-io.png',
  () => 'logo-socket-io.png'
);
jest.mock(
  '../../assets/powered-by/logo-sweetalert2.png',
  () => 'logo-sweetalert2.png'
);
jest.mock('../../assets/powered-by/logo-jest.png', () => 'logo-jest.png');

// Mock CSS modules
jest.mock('../../styles/home-page.module.css', () => ({}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));
jest.mock('../../components/Game/Preview', () =>
  jest.fn(() => <div>Preview</div>)
);
jest.mock('../../components/UI/DeviderTetris', () =>
  jest.fn(() => <div>DeviderTetris</div>)
);
jest.mock('../../components/UI/MagicButton', () =>
  jest.fn(({ action }) => <button onClick={action}>MagicButton</button>)
);

describe('Home component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = require('react-router-dom').useNavigate;
    mockNavigate.mockReturnValue(jest.fn()); // Ensure it returns a mock function
  });

  it('should render the Home component', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome to Red Tetris Game!')).toBeInTheDocument();
    expect(screen.getAllByText('Preview')).toHaveLength(7);
    expect(screen.getByText('DeviderTetris')).toBeInTheDocument();
    expect(screen.getByText('MagicButton')).toBeInTheDocument();
  });

  it('should display the correct text for solo play', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Play "solo" to practice your skills offline')
    ).toBeInTheDocument();
  });

  it('should render Preview components with correct tetrominoes', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const previewComponents = screen.getAllByText('Preview');
    expect(previewComponents).toHaveLength(7);

    // Verify that each Preview component was called with the correct props
    expect(Preview).toHaveBeenCalledWith(
      { tetromino: TETROMINOES.J, index: 1 },
      {}
    );
    expect(Preview).toHaveBeenCalledWith(
      { tetromino: TETROMINOES.O, index: 3 },
      {}
    );
    expect(Preview).toHaveBeenCalledWith(
      { tetromino: TETROMINOES.S, index: 5 },
      {}
    );
    expect(Preview).toHaveBeenCalledWith(
      { tetromino: TETROMINOES.I, index: 4 },
      {}
    );
    expect(Preview).toHaveBeenCalledWith(
      { tetromino: TETROMINOES.Z, index: 7 },
      {}
    );
    expect(Preview).toHaveBeenCalledWith(
      { tetromino: TETROMINOES.T, index: 6 },
      {}
    );
    expect(Preview).toHaveBeenCalledWith(
      { tetromino: TETROMINOES.L, index: 2 },
      {}
    );
  });

  it('should navigate to /lobby when MagicButton is clicked', () => {
    const mockNavigateFn = jest.fn();
    mockNavigate.mockReturnValue(mockNavigateFn);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('MagicButton'));
    expect(mockNavigateFn).toHaveBeenCalledWith('/lobby');
  });
});
