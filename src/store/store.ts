import { configureStore } from "@reduxjs/toolkit";
import gptSlice from "./slices/gptSlice";

const store = configureStore({
  reducer: {
    gpt: gptSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
