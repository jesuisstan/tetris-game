import Swal from 'sweetalert2';

export const errorAlert = (text) => {
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

export const saveAlert = () => {
  Swal.fire({
    position: 'center',
    width: 'auto',
    color: 'var(--TETRIS_GREEN)',
    background: 'rgba(0, 0, 0, 0)',
    title: 'S A V E D',
    showConfirmButton: false,
    timer: 700,
    showClass: {
      popup: 'swal2-show',
      backdrop: 'none'
    }
  });
};

export const congratsAlert = () => {
  Swal.fire({
    position: 'top',
    width: 'auto',
    color: 'var(--TETRIS_GREEN)',
    background: 'rgba(0, 0, 0, 0)',
    //title: 'C O N G R A T S !',
    title: '<div style="margin-top: 84px;">C O N G R A T S ! ! !</div>',
    showConfirmButton: false,
    timer: 2500,
    showClass: {
      popup: 'swal2-show',
      backdrop: 'none'
    }
  });
};
