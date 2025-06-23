import { useEffect, useMemo } from "react";
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

  const contactIds = useMemo(
    () => contactsData?.map((contact) => contact._id) || [],
    [contactsData]
  );

  const { data: statusesData } = useGetUserStatuses(contactIds);
  const setUserContact = useSetUserContact();
  const userContact = useAppSelector(selectUserContact);

  useEffect(() => {
    if (!statusesData || !contactsData || !isSuccessContacts) return;

    queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
      if (!oldData) return oldData;

      let updatedUserContact: IContact | null = null;

      const updatedContacts = oldData.map((contact) => {
        const status = statusesData[contact._id];
        if (!status) return contact;

        const updatedContact = {
          ...contact,
          isOnline: status.isOnline,
          lastSeen: status.lastSeen,
        };

        if (contact._id === userContact?._id) {
          updatedUserContact = updatedContact;
        }

        return updatedContact;
      });

      if (updatedUserContact) {
        setUserContact(updatedUserContact);
      }

      return updatedContacts;
    });
  }, [statusesData, isSuccessContacts]);
};
