import Swal from 'sweetalert2';
import { errorAlert, saveAlert, congratsAlert } from '../../utils/alerts';

jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

describe('Alert functions', () => {
  afterEach(() => {
    // Clear all instances and calls to constructor and all methods:
    Swal.fire.mockClear();
  });

  test('errorAlert should call Swal.fire with correct parameters', () => {
    const text = 'Error occurred!';
    errorAlert(text);
    expect(Swal.fire).toHaveBeenCalledWith({
      showConfirmButton: false,
      icon: 'warning',
      iconColor: 'var(--TETRIS_RED)',
      width: 450,
      title: 'Oops...',
      text: text,
      showCloseButton: true,
      color: 'var(--TETRIS_BLACK)',
      background: 'var(--TETRIS_WHITE)'
    });
  });

  test('saveAlert should call Swal.fire with correct parameters', () => {
    saveAlert();
    expect(Swal.fire).toHaveBeenCalledWith({
      position: 'center',
      width: 'auto',
      color: 'var(--TETRIS_GREEN)',
      background: 'rgba(0, 0, 0, 0)',
      title: 'S A V E D',
      showConfirmButton: false,
      timer: 1000,
      showClass: {
        popup: 'swal2-show',
        backdrop: 'none'
      }
    });
  });

  test('congratsAlert should call Swal.fire with correct parameters', () => {
    congratsAlert();
    expect(Swal.fire).toHaveBeenCalledWith({
      position: 'center',
      width: 'auto',
      color: 'var(--TETRIS_GREEN)',
      background: 'rgba(0, 0, 0, 0)',
      title:
        '<div style="text-align: center; font-size: 12vw;">Y O U &nbsp;&nbsp; W I N</div>',
      showConfirmButton: false,
      timer: 2000,
      showClass: {
        popup: 'swal2-show',
        backdrop: 'none'
      }
    });
  });
});
