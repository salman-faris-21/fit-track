// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import logsReducer from "./slices/logslice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    logs: logsReducer,
  },
});
