import { useState } from "react";
import { useDebounce } from "..";
import { useSearchUsersQuery } from "../../lib/UserQuery";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: searchData, isLoading } = useSearchUsersQuery(debouncedSearchTerm);

  const isStateHeader = debouncedSearchTerm.length >= 2 || isLoading || !!searchData?.length;

  return { searchTerm, setSearchTerm, debouncedSearchTerm, searchData, isLoading, isStateHeader };
};