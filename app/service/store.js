import { configureStore } from "@reduxjs/toolkit";
import codeReducer from "./slices/codeSilce";
import orderDetailReducer from "./slices/orderDetailSlice";
import staffSilce from "./slices/staffSilce";
import orderReducer from "./slices/orderSilce";
import loadingSilce from "./slices/loadingSilce";

const store = configureStore({
  reducer: {
    code: codeReducer,
    order: orderReducer,
    loading: loadingSilce,
    staff: staffSilce,
    orderDetail: orderDetailReducer,
  },
});
export default store;
