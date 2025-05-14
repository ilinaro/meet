import React from "react";
import { FallbackProps } from "react-error-boundary";
import styles from "./ErrorFallback.module.scss";

export const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  return (
    <div className={styles.ErrorFallback}>
      <>Something went wrong...</>
      <pre>{error.message}</pre>
    </div>
  );
};
