import { Outlet } from "react-router-dom";
import styles from "./ProfileLayout.module.scss";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../components";
import { Header } from "../components/Header/Header";

type Props = {
  children?: React.ReactNode;
};

export const ProfileLayout: React.FC<Props> = () => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};
