import React, { ForwardedRef } from "react";
import styles from "./Input.module.scss";

type InputProps = {
  label?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
  required?: boolean;
  value?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInput?: React.FormEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder = "",
      type = "text",
      required = false,
      value,
      error,
      disabled = false,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      autoFocus = false,
      onInput,
    },
    ref: ForwardedRef<HTMLInputElement>,
  ) => (
    <div
      className={`${styles.inputWrapper} ${error ? styles.errorWrapper : ""}`}
    >
      <label className={styles.inputLabel}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        ref={ref}
        type={type}
        className={`${styles.inputField} ${error ? styles.error : ""} ${disabled ? styles.disabled : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onInput={onInput}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        required={required}
        disabled={disabled}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  ),
);

Input.displayName = "Input";
