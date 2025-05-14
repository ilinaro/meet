import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  isMobile: boolean | undefined;
  isTablet: boolean | undefined;
  isPhone: boolean | undefined;
} = {
  isMobile: undefined,
  isTablet: undefined,
  isPhone: undefined,
};

const deviceTypeSlice = createSlice({
  name: "isMobile",
  initialState,
  reducers: {
    toggleDeviceType(
      state: {
        isMobile: boolean | undefined;
        isTablet: boolean | undefined;
        isPhone: boolean | undefined;
      },
      action: {
        payload: {
          isMobile: boolean | undefined;
          isTablet: boolean | undefined;
          isPhone: boolean | undefined;
        };
      },
    ) {
      state.isMobile = action.payload.isMobile;
      state.isTablet = action.payload.isTablet;
      state.isPhone = action.payload.isPhone;
    },
  },
});

export default deviceTypeSlice.reducer;
export const { toggleDeviceType } = deviceTypeSlice.actions;
