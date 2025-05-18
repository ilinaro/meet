import { Button } from "../Button";
import styles from "./Header.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import img from "../../assets/images/logo.png";
import { useAppSelector } from "../../store/useAppSelect";
import { UserHeader } from "./components";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLogin } = useAppSelector((state) => state.authState);
  const location = useLocation();

  const isHome = location.pathname === "/home";

  return (
    <div className={styles.header}>
      <Link to="/">
        <div className={styles.logo}>
          <img src={img} alt="logo" />
        </div>
      </Link>
      {isLogin && isHome ? <UserHeader /> : null}
      {!isLogin && (
        <div className={styles.btns}>
          <Button onClick={() => navigate("/registration")}>Регистрация</Button>
          <Button onClick={() => navigate("/login")}>Войти</Button>
        </div>
      )}
    </div>
  );
};
