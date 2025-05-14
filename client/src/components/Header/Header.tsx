import { Button } from "../Button";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/images/logo.png";
import { useAppSelector } from "../../store/useAppSelect";
import { useLogoutQuery } from "../../lib";
export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLogin } = useAppSelector((state) => state.authState);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutQuery();
  const handleLogout = () => {
    logout();
  };
  return (
    <div className={styles.header}>
      <Link to="/" className={styles.link}>
        <div className={styles.logo}>
          <img src={img} alt="logo" />
        </div>
      </Link>
      <div className={styles.btns}>
        {isLogin ? (
          <Button onClick={handleLogout} disabled={isLoggingOut}>
            Выйти
          </Button>
        ) : (
          <>
            <Button onClick={() => navigate("/registration")}>
              Регистрация
            </Button>
            <Button onClick={() => navigate("/login")}>Войти</Button>
          </>
        )}
      </div>
    </div>
  );
};
