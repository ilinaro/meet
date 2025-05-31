import { Loader } from "@mantine/core";
import styles from "./../ProfileLayout.module.scss";
import { Text } from "../../components";
type Props = {
    errorConnect?: boolean
};

export const LoaderAndConnect: React.FC<Props> = ({ errorConnect }) => {
    return (
        <div className={styles.loaderContainer}>
            {errorConnect ? (
                <Text size={25} fw={500} color={"red-warn"}>
                    {"Ошибка подключения, попробуйте перезагрузить страницу"}
                </Text>
            ) : (
                <>
                    <Loader size={20} color="gray" />
                    <Text size={20} fw={500} color={"gray"}>
                        Подключение...
                    </Text>
                </>
            )}
        </div>
    );
};