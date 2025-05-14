import toast from "react-hot-toast";

export const useHadlerError = (msg?: string) => {
  const errorMessage = msg || "An unexpected error occurred.";
  toast.error(errorMessage);
};
