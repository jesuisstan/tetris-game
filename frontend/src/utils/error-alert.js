import Swal from 'sweetalert2';
import * as colors from '../styles/tetris-colors';

const errorAlert = (text: string) => {
  Swal.fire({
    showConfirmButton: false,
    icon: 'warning',
    iconColor: colors.TETRIS_ORANGE,
    width: 450,
    title: 'Oops...',
    text: text,
    showCloseButton: true,
    color: colors.TETRIS_BLACK,
    background: colors.TETRIS_WHITE
  });
};

export default errorAlert;
