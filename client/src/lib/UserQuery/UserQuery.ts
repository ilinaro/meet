import { useMutation, useQuery } from "@tanstack/react-query";
import UserService from "../../services/user.service";
import { IContact } from "../../models";

export const useGetUserQuery = () => {
  return useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const { data } = await UserService.getUser();
      return data;
    },
  });
};

export const useSearchUsersQuery = (searchTerm: string) => {
  return useQuery<IContact[], Error>({
    queryKey: ["searchUsers", searchTerm],
    queryFn: async () => {
      const response = await UserService.searchUsers(searchTerm);
      return response.data;
    },
    enabled: !!searchTerm.trim() && searchTerm.length >= 2,
    retry: 1,
    staleTime: 1000 * 60,
  });
};

export const useGetUsersIdMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await UserService.getUsersId(id);
      return data;
    },
  });
};
