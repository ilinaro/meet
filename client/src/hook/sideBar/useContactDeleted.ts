import { useEffect } from "react";
import { queryClient } from "../../main";
import { IContact } from "../../models";
import {
  selectUserContact,
  useSetUserContact,
} from "../../store/userContactStateSlice";
import { useAppSelector } from "../../store/useAppSelect";

interface ContactDeletedProps {
  contactDeleted: string;
  setContactDeleted: (id: string) => void;
}

export const useContactDeleted = ({
  contactDeleted,
  setContactDeleted,
}: ContactDeletedProps) => {
  const setUserContact = useSetUserContact();
  const userContact = useAppSelector(selectUserContact);

  useEffect(() => {
    if (!contactDeleted) return;

    queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
      if (!oldData) return [];

      let nextData = oldData.filter(
        (contact) => contact._id !== contactDeleted,
      );
      if (userContact?._id === contactDeleted) {
        setUserContact(undefined);
      }
      setContactDeleted("");
      return nextData;
    });
  }, [contactDeleted]);
};
