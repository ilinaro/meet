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
    queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
      
      if (!oldData) return oldData;
      
      return oldData.map((contact) => {
        if (contact._id === updateContactStatus?.userId) {
          if (contact._id === userContact?._id) {
            setUserContact({
              ...contact,
              isOnline: updateContactStatus?.isOnline,
              lastSeen: updateContactStatus?.lastSeen ?? null,
            });
          }
          return {
            ...contact,
            isOnline: updateContactStatus?.isOnline,
            lastSeen: updateContactStatus?.lastSeen ?? null,
          };
        }
        return contact;
      });
    });
  }, [updateContactStatus]);
};
