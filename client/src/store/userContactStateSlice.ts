import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../models";
import { AppDispatch, RootState } from ".";
import { useDispatch } from "react-redux";

interface UserState {
  userContact: IUser | undefined;
  isInfoExpanded: boolean;
}

const initialState: UserState = {
  userContact: undefined,
  isInfoExpanded: false,
};

const userStateSlice = createSlice({
  name: "userContact",
  initialState,
  reducers: {
    setUserContact(state: UserState, action: PayloadAction<IUser | undefined>) {
      state.userContact = action.payload;
    },
    toggleInfo(state: UserState, action: PayloadAction<boolean>) {
      state.isInfoExpanded = action.payload;
    },
  },
});

export const selectUserContact = (state: RootState) => {
  return state.userContact.userContact;
};

export const isInfoExpanded = (state: RootState) => {
  return state.userContact.isInfoExpanded;
};

export const useSetUserContact = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (userContact: IUser | undefined): void => {
    dispatch(setUserContact(userContact));
  };
};

export const useToggleInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (isExpanded: boolean): void => {
    dispatch(toggleInfo(isExpanded));
  };
};

export default userStateSlice.reducer;
export const { setUserContact, toggleInfo } = userStateSlice.actions;
