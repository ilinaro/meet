import { Text } from "../../../components";
import styles from "../Profile.module.scss"
export const StartMessage: React.FC = () => {
    return (
        <div className={styles.startMessage}>
            <Text size={14} color="gray">
                Выберите пользователя, чтобы начать общение
            </Text>
        </div>
    );
};