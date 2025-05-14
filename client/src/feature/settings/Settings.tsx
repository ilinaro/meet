import { useNavigate } from "react-router-dom";
import { Text } from "./../../components";
import styles from "./Settings.module.scss";
import { RouteNames } from "../../routers/routeNames";
import { useGetUserQuery } from "../../lib/UserQuery";

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { data: userData } = useGetUserQuery();

  return (
    <div className={styles.wrapper}>
      <div className={styles.headSettings}>
        <div
          onClick={() => navigate(RouteNames.PROFILE)}
          className={styles.back}
        >
          <Text>Назад</Text>
        </div>
        {!userData?.isActivated && (
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
    </div>
  );
};
