import Swal from 'sweetalert2';

const saveAlert = () => {
  Swal.fire({
    position: 'center',
    width: 'auto',
    color: 'var(--TETRIS_GREEN)',
    background: 'rgba(0, 0, 0, 0)',
    title: 'S A V E D',
    showConfirmButton: false,
    timer: 600,
    showClass: {
      popup: 'swal2-show',
      backdrop: 'none'
    }
  });
};

export default saveAlert;
