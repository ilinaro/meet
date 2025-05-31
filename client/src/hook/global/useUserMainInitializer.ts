import { useEffect } from "react";
import { useSetUserMain } from "../../store/userMainStateSlice";
import { useGetUserQuery } from "../../lib/UserQuery";
import { queryClient } from "../../main";

export const useUserMainInitializer = () => {
  const { data: userData, isSuccess, isError, isLoading } = useGetUserQuery();
  const setUserMain = useSetUserMain();

  useEffect(() => {
    if (userData && isSuccess) {
      setUserMain(userData);
    }
    if (isError && !userData && !isLoading) {
      queryClient.refetchQueries({ queryKey: ["userData"] });
    }
  }, [userData, isSuccess, isError]);
};
