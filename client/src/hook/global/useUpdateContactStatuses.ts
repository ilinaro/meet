import { useEffect } from "react";
import { queryClient } from "../../main";
import { IContact, UserStatus } from "../../models";
import {
  selectUserContact,
  useSetUserContact,
} from "../../store/userContactStateSlice";
import { useAppSelector } from "../../store/useAppSelect";

interface ContactStatusesHandlerProps {
  updateContactStatus?: UserStatus;
}

export const useUpdateContactStatuses = ({
  updateContactStatus,
}: ContactStatusesHandlerProps) => {
  const setUserContact = useSetUserContact();
  const userContact = useAppSelector(selectUserContact);

  useEffect(() => {
    if (!updateContactStatus?.userId) return;

    queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
      if (!oldData) return oldData;

      const targetUserId = updateContactStatus.userId;

      const isCurrentUser = targetUserId === userContact?._id;

      let updatedUserContact: IContact | null = null;

      const updatedContacts = oldData.map((contact) => {
        console.log(contact._id,  targetUserId)
        if (contact._id !== targetUserId) return contact;

        const updatedContact = {
          ...contact,
          isOnline: updateContactStatus.isOnline,
          lastSeen: updateContactStatus.lastSeen ?? null,
        };

        if (isCurrentUser) {
          updatedUserContact = updatedContact;
        }

        return updatedContact;
      });

      if (updatedUserContact) {
        setUserContact(updatedUserContact);
      }

      return updatedContacts;
    });
  }, [updateContactStatus]);
};
