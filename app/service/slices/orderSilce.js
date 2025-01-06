import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: null,
  reducers: {
    setOrder(state, action) {
      return action.payload;
    },
    removeOrder(state, action) {
      return null;
    },
  },
});

const { actions, reducer } = orderSlice;
export const GetOrder = (state) => state.order;
export const { setOrder, removeOrder } = actions;
export default reducer;
