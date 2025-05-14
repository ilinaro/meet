import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../models";
import { AppDispatch, RootState } from ".";
import { useDispatch } from "react-redux";

interface UserState {
  userMain: IUser | undefined;
}

const initialState: UserState = {
  userMain: undefined,
};

const userStateSlice = createSlice({
  name: "userMain",
  initialState,
  reducers: {
    setUserMain(state: UserState, action: PayloadAction<IUser | undefined>) {
      state.userMain = action.payload;
    },
  },
});

export const selectUserMain = (state: RootState) => {
  return state.userMain.userMain;
};

export const useSetUserMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (userMain: IUser | undefined): void => {
    dispatch(setUserMain(userMain));
  };
};

export default userStateSlice.reducer;
export const { setUserMain } = userStateSlice.actions;
