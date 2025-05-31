import { useEffect } from "react";
import { queryClient } from "../../main";
import { IContact } from "../../models";
import {
  selectUserContact,
  useSetUserContact,
} from "../../store/userContactStateSlice";
import { useAppSelector } from "../../store/useAppSelect";
import { useGetContacts } from "../../lib/ChatQuery";
import { useGetUserStatuses } from "../../lib/UserQuery";

export const useFirstLoadingContactStatuses = () => {
  const { data: contactsData, isSuccess: isSuccessContacts } = useGetContacts();
  const contactIds = contactsData?.map((contact) => contact._id) || [];
  const { data: statusesData } = useGetUserStatuses(contactIds);
  const setUserContact = useSetUserContact();
  const userContact = useAppSelector(selectUserContact);

  useEffect(() => {
    if (statusesData && contactsData) {
      queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
        if (!oldData) return oldData;

        return oldData.map((contact) => {
          const status = statusesData[contact._id];
          if (status) {
            if (contact._id === userContact?._id) {
              setUserContact({
                ...contact,
                isOnline: status.isOnline,
                lastSeen: status.lastSeen,
              });
            }
            return {
              ...contact,
              isOnline: status.isOnline,
              lastSeen: status.lastSeen,
            };
          }
          return contact;
        });
      });
    }
  }, [statusesData, isSuccessContacts]);
};
