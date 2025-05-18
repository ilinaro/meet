import React from "react";
import clsx from "clsx";
import styles from "./Button.module.scss";
import { Loader } from "@mantine/core";

type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  disabled?: boolean;
  classNames?: string;
  fullWidth?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  type = "button",
  isLoading = false,
  disabled = false,
  classNames = "",
  fullWidth = false,
}) => (
  <button
    type={type}
    className={clsx(styles.button, fullWidth && styles.fullWidth, classNames)}
    onClick={type === "button" ? onClick : undefined}
    disabled={disabled || isLoading}
  >
    {isLoading ? (
      <span className={styles.loading}>
        <Loader size={20} color="white" />
      </span>
    ) : (
      children
    )}
  </button>
);
