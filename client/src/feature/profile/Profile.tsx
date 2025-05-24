import { useAppSelector } from "../../store/useAppSelect";
import { selectUserContact } from "../../store/userContactStateSlice";
import { StartMessage, UserMessage } from "./components";
import { SideBar } from "./components/SideBar";
import styles from "./Profile.module.scss";

export const Profile: React.FC = () => {
  const userContact = useAppSelector(selectUserContact);

  return (
    <div className={styles.content}>
      <SideBar />
      {userContact ? <UserMessage /> : <StartMessage />}
    </div>
  );
};
