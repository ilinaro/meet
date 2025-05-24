import { useNavigate } from "react-router-dom";
import { Button, Text } from "./../../components";
import { RouteNames } from "../../routers/routeNames";
import { useLogoutQuery } from "../../lib";
import styles from "./Settings.module.scss";
import { useAppSelector } from "../../store/useAppSelect";
import { selectUserMain } from "../../store/userMainStateSlice";

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const userMain = useAppSelector(selectUserMain);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutQuery();
  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headSettings}>
        <div
          onClick={() => navigate(RouteNames.PROFILE)}
           className={styles.back}
        >
          <Text>Назад</Text>
        </div>
        {!userMain?.isActivated && (
          <div className={styles.warnEmail}>
            <Text size={25} fw={600} color={"white-general"}>
              Пожалуйста, подтвердите ваш email
            </Text>
          </div>
        )}
      </div>
      <div className={styles.header}>
        <Text size={30} fw={600}>
          Настройки
        </Text>
      </div>
      <Button onClick={handleLogout} disabled={isLoggingOut}>
        Выйти
      </Button>
    </div>
  );
};
 