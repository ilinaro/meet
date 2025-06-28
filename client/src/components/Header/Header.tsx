import { Button } from "../Button";
import styles from "./Header.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import img from "../../assets/images/logo.png";
import { useAppSelector } from "../../store/useAppSelect";
import { UserHeader } from "./components";
import clsx from "clsx";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLogin } = useAppSelector((state) => state.authState);
  const location = useLocation();

  const isHome = location.pathname === "/home";

  return (
    <div className={styles.header}>
      <div onClick={!isLogin ? () => navigate("/") : () => navigate("/home")}>
        <div className={clsx(styles.logo, [!isHome && styles.active])}>
          <img src={img} alt="logo" />
        </div>
      </div>
      {!isLogin ? (
        <div className={styles.btns}>
          <Button onClick={() => navigate("/registration")}>Регистрация</Button>
          <Button onClick={() => navigate("/login")}>Войти</Button>
        </div>
      ) : (
        <>{isHome && <UserHeader />}</>
      )}
    </div>
  );
};
