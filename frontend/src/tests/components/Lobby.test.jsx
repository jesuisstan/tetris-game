import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Lobby from '../../components/Lobby/Lobby.page';

jest.mock('../../components/Lobby/CreateRoomBlock', () => () => <div>CreateRoomBlock</div>);
jest.mock('../../components/Lobby/JoinRoomBlock', () => () => <div>JoinRoomBlock</div>);

describe('Lobby', () => {
  it('renders CreateRoomBlock', () => {
    render(<Lobby />);
    expect(screen.getByText('CreateRoomBlock')).toBeInTheDocument();
  });

  it('renders JoinRoomBlock', () => {
    render(<Lobby />);
    expect(screen.getByText('JoinRoomBlock')).toBeInTheDocument();
  });
});