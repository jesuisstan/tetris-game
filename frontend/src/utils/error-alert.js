import Swal from 'sweetalert2';

const errorAlert = (text) => {
  Swal.fire({
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
};

export default errorAlert;
