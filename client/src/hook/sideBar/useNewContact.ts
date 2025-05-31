import { useEffect } from "react";
import { queryClient } from "../../main";
import { IContact } from "../../models";

interface NewContactProps {
  contactRoom: IContact | undefined;
  contactsData: IContact[];
}

export const useNewContact = ({
  contactRoom,
  contactsData,
}: NewContactProps) => {
  useEffect(() => {
    if (!contactRoom) return;

    let isOldContact =
      contactsData &&
      contactsData.find((contact) => contact.chatId === contactRoom?.chatId);

    if (isOldContact) return;

    queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
      if (!oldData) {
        queryClient.invalidateQueries({ queryKey: ["userContacts"] });
        return [];
      }
      return [...oldData, contactRoom];
    });
  }, [contactRoom]);
};
