import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

const initialState: {
  accessToken: string | undefined;
} = {
  accessToken: undefined,
};

const accessStateSlice = createSlice({
  name: "accessState",
  initialState,
  reducers: {
    resetAccessState(state) {
      state.accessToken = undefined;
    },
    setAccessToken(
      state: { accessToken: string | undefined },
      action: {
        payload: {
          accessToken: string | undefined;
        };
      },
    ) {
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const selectAccessToken = (state: RootState) => {
  return state.accessState.accessToken;
};

export default accessStateSlice.reducer;
export const { setAccessToken, resetAccessState } = accessStateSlice.actions;
