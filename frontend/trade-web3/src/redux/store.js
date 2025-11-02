import { configureStore } from "@reduxjs/toolkit";
import contractReducer from "./contractSlice";

export const store = configureStore({
  reducer: {
    contract: contractReducer,
  },
});
