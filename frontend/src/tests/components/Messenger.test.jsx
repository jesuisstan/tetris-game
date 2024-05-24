import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import Messenger from '../../components/Game/Messenger';

describe('Messenger Component', () => {
  const roomData = { players: 2, maxPlayers: 4 };

  it('renders no news message when there are no messages', () => {
    render(<Messenger messages={[]} roomData={roomData} />);

    const noNewsMessage = screen.getByText('No news');
    expect(noNewsMessage).toBeInTheDocument();
  });

  it('renders players in the room correctly', () => {
    render(<Messenger messages={[]} roomData={roomData} />);

    const playersInRoom = screen.getByText('Players: 2 / 4');
    expect(playersInRoom).toBeInTheDocument();
  });

  it('applies correct style when room is full', () => {
    const fullRoomData = { players: 4, maxPlayers: 4 };
    render(<Messenger messages={[]} roomData={fullRoomData} />);

    const playersInRoom = screen.getByText('Players: 4 / 4');
    expect(playersInRoom).toHaveStyle('color: var(--TETRIS_GREEN)');
  });

  it('renders messages correctly', () => {
    const messages = [
      { nickname: 'Player1', message: 'Hello!' },
      { nickname: 'Player2', message: 'Hi there!' },
      { message: 'Welcome!' }
    ];

    render(<Messenger messages={messages} roomData={roomData} />);

    const messageElements = screen.getAllByRole('listitem');

    const firstNickname = within(messageElements[0]).getByText('Player1');
    const firstMessage = within(messageElements[0]).getByText('Hello!');
    expect(firstNickname).toBeInTheDocument();
    expect(firstMessage).toBeInTheDocument();

    const secondNickname = within(messageElements[1]).getByText('Player2');
    const secondMessage = within(messageElements[1]).getByText('Hi there!');
    expect(secondNickname).toBeInTheDocument();
    expect(secondMessage).toBeInTheDocument();

    const thirdMessage = within(messageElements[2]).getByText('Welcome!');
    expect(thirdMessage).toBeInTheDocument();
  });

  it('scrolls to the bottom when new messages arrive', () => {
    const messages = [
      { nickname: 'Player1', message: 'Hello!' },
      { nickname: 'Player2', message: 'Hi there!' },
      { message: 'Welcome!' }
    ];

    const { rerender } = render(
      <Messenger messages={[]} roomData={roomData} />
    );

    const container = screen.getByRole('list');
    jest.spyOn(container, 'scrollTop', 'set');

    rerender(<Messenger messages={messages} roomData={roomData} />);

    expect(container.scrollTop).toBe(container.scrollHeight);
  });
});
