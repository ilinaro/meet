import styles from "./Start.module.scss";
import { Text } from "./../../components";
import people from "./../../assets/images/people.png";
export const Start: React.FC = () => {
  return (
    <div className={styles.start}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.text}>
            <Text size={40} fw={700}>
              Добро пожаловать в Meet: Свобода общения без границ
            </Text>
            <Text size={30} fw={700}>
              Единая платформа с неограниченными возможностями для человеческого
              общения
            </Text>
            <div className={styles.about}>
              <Text size={26}>
                Meet переосмысливает видеообщение, связывая людей напрямую через
                мощную P2P-технологию. Наше приложение устраняет барьеры
                традиционных платформ, обеспечивая кристально чистое соединение
                без лагов и высокое качество передачи данных даже при
                нестабильном интернете. Присоединяйтесь к новой эре цифровой
                коммуникации, где технологии служат людям, а не наоборот.
              </Text>
            </div>
            <div className={styles.any}>
              <Text size={30} fw={600}>
                Почему Meet — это будущее видеосвязи?
              </Text>
              <br />
              <Text size={30} fw={600}>
                В мире, где каждая секунда на счету, Meet предлагает простое и
                надёжное решение для общения. Забудьте о сложных настройках,
                перегрузке серверов и потере качества.
              </Text>
            </div>
          </div>
        </div>
        <div className={styles.images}>
          <div className={styles.first}>
            <img src={people} alt="people" />
          </div>
        </div>
      </div>
    </div>
  );
};
