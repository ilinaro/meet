import { Header } from "../components/Header/Header";
import styles from "./PrimaryLayout.module.scss";

type Props = {
  children?: React.ReactNode;
};

export const PrimaryLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.primaryLayout}>
      <Header />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
