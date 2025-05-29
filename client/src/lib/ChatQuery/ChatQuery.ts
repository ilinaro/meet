import { useMutation, useQuery } from "@tanstack/react-query";
import { useHadlerError } from "../useHadlerError";
import ChatService from "../../services/chat.service";
import { queryClient } from "../../main";
import { useAppSelector } from "../../store/useAppSelect";
import {
  selectUserContact,
  useSetUserContact,
} from "../../store/userContactStateSlice";
import { selectUserMain } from "../../store/userMainStateSlice";

export const useAddChatQuery = () => {
  const userContact = useAppSelector(selectUserContact);
  const userMain = useAppSelector(selectUserMain);

  const setUserContact = useSetUserContact();
  return useMutation({
    mutationFn: async ({ _id }: { _id: string }) =>
      await ChatService.add({ _id, nickname: userMain?.nickname }),
    onSuccess: () => {
      if (userContact) {
        setUserContact({
          ...userContact,
          isInContacts: true,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["userContacts"] });
    },
    onError: (error: any) => {
      console.error("Add chat error", error);
    },
  });
};

export const useGetContacts = () => {
  return useQuery({
    queryKey: ["userContacts"],
    queryFn: async () => {
      const { data } = await ChatService.contacts();
      return data;
    },
  });
};

export const useDeleteChatQuery = () => {
  return useMutation({
    mutationFn: async (id: string) => await ChatService.deleteChat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userContacts"] });
    },
    onError: (error: any) => {
      console.error("Delete chat error", error);
    },
  });
};

export const useChatConnectQuery = () => {
  const userContact = useAppSelector(selectUserContact);
  const setUserContact = useSetUserContact();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await ChatService.startChat(id || "");
      return data;
    },
    onSuccess: (data) => {
      if (userContact && data?.chatId) {
        setUserContact({
          ...userContact,
          chatId: data.chatId,
        });
      }
    },
    onError: (error: any) => {
      useHadlerError(error?.response?.data?.message);
    },
  });
};
