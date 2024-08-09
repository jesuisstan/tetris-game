import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../../styles/form-input.module.css';

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { label, errorMessage, onChange, id, type, ...inputProps } = props;

  const handleFocus = (event) => {
    setFocused(false); // change to true if error message is desired to be shown onBlur too
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.formInput}>
      <label htmlFor={id} className={styles.label}>
        {label}:
      </label>
      <input
        id={id}
        {...inputProps}
        type={showPassword ? 'text' : type}
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() => setFocused(true)}
        focused={focused.toString()}
        className={styles.input}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={styles.showPasswordButton}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </button>
      )}
      <span className={`${styles.helper} ${errorMessage ? styles.error : ''}`}>
        {errorMessage || '\u00A0'} {/* Invisible placeholder */}
      </span>
    </div>
  );
};

export default FormInput;
