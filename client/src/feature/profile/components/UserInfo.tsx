import { Text } from "../../../components";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../../routers/routeNames";
import styles from "../Profile.module.scss";

import { selectUserMain } from "../../../store/userMainStateSlice";
import { useAppSelector } from "../../../store/useAppSelect";

export const UserInfo: React.FC = () => {
  const navigate = useNavigate();
  const userMain = useAppSelector(selectUserMain);

  return (
    <div
      className={styles.profile}
      onClick={() => navigate(RouteNames.SETTINGS)}
    >
      <div className={styles.photo}>
        {!userMain?.isActivated && <div className={styles.warnEmail}></div>}
        <Text size={35} color="white-general">
          {userMain?.nickname?.[0]?.toUpperCase() || "..."}
        </Text>
      </div>
      <div className={styles.username}>
        <Text size={24} color="black-general">
          {userMain ? userMain.nickname : "..."}
        </Text>
      </div>
    </div>
  );
};
