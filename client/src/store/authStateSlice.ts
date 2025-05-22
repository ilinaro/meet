import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  isLogin: boolean | undefined;
} = {
  isLogin: undefined,
};

const authStateSlice = createSlice({
  name: "authState",
  initialState,
  reducers: {
    resetAuthState(state) {
      state.isLogin = false;
    },
    toggleAuthState(
      state: { isLogin: boolean | undefined },
      action: {
        payload: {
          isLogin: boolean | undefined;
        };
      }
    ) {
      state.isLogin = action.payload.isLogin;
    },
  },
});

export default authStateSlice.reducer;
export const { toggleAuthState, resetAuthState } = authStateSlice.actions;
