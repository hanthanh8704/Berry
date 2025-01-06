import { configureStore } from "@reduxjs/toolkit";
import BillReducer from "./reducer/Bill.reducer";
export const store = configureStore({
  reducer: {
    bill: BillReducer
  },
});

export const dispatch = store.dispatch;
export const getState = store.getState;
