import Swal from 'sweetalert2';
import * as colors from '../styles/mapColors';

const errorAlert = (text: string) => {
  Swal.fire({
    showConfirmButton: false,
    icon: 'warning',
    iconColor: colors.MAP_ORANGE,
    width: 450,
    title: 'Oops...',
    text: text,
    showCloseButton: true,
    color: colors.MAP_BLACK,
    background: colors.MAP_WHITE
  });
};

export default errorAlert;
