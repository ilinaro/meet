import { useNavigate } from "react-router-dom";
import { Text, Button } from "../../components";
import styles from "./NoMatch.module.scss";
import { RouteNames } from "../../routers/routeNames";

export const NoMatch: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <Text size={30} fw={600} color="violet">
        Страница не найдена
      </Text>
      <br />
      <Button onClick={() => navigate(RouteNames.START)}>На главную</Button>
    </div>
  );
};
