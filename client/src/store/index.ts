import { configureStore } from "@reduxjs/toolkit";
import authStateReducer, { resetAuthState } from "./authStateSlice";
import userContactReducer, {
  resetUserContactState,
} from "./userContactStateSlice";
import userMainStateReducer, { resetUserMainState } from "./userMainStateSlice";
import deviceTypeReducer from "./deviceTypeSlice";
import accessStateReducer, { resetAccessState } from "./accessStateSlice";

const store = configureStore({
  reducer: {
    authState: authStateReducer,
    userContact: userContactReducer,
    userMain: userMainStateReducer,
    isMobile: deviceTypeReducer,
    accessState: accessStateReducer,
  },
});

export const resetAuthAndUser = () => (dispatch: AppDispatch) => {
  dispatch(resetAuthState());
  dispatch(resetUserMainState());
  dispatch(resetUserContactState());
  dispatch(resetAccessState());
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
