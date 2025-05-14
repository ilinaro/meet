import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../models";
import { AppDispatch, RootState } from ".";
import { useDispatch } from "react-redux";

interface UserState {
  userContact: IUser | undefined;
}

const initialState: UserState = {
  userContact: undefined,
};

const userStateSlice = createSlice({
  name: "userContact",
  initialState,
  reducers: {
    setUserContact(state: UserState, action: PayloadAction<IUser | undefined>) {
      state.userContact = action.payload;
    },
  },
});

export const selectUserContact = (state: RootState) => {
  return state.userContact.userContact;
};

export const useSetUserContact = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (userContact: IUser | undefined): void => {
    dispatch(setUserContact(userContact));
  };
};

export default userStateSlice.reducer;
export const { setUserContact } = userStateSlice.actions;
