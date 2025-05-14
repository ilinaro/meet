import { configureStore } from "@reduxjs/toolkit";
import authStateReducer from "./authStateSlice";
import userContactReducer from "./userContactStateSlice";
import userMainStateReducer from "./userMainStateSlice";
import deviceTypeReducer from "./deviceTypeSlice";

const store = configureStore({
  reducer: {
    authState: authStateReducer,
    userContact: userContactReducer,
    userMain: userMainStateReducer,
    isMobile: deviceTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
