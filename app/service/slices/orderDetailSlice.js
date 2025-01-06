import { createSlice } from "@reduxjs/toolkit";

const orderDetailSlice = createSlice({
  name: "orderDetail",
  initialState: [],
  reducers: {
    setOrderDetailSlice: (state, action) => {
      // Trả về một mảng mới thay vì thay đổi trực tiếp state
      return action.payload;
    },
    removeOrderDetailSlice: (state) => {
      return [];
    },
  },
});

export const { setOrderDetailSlice, removeOrderDetailSlice } =
  orderDetailSlice.actions;
export const selectOrderDetailSlice = (state) => state.orderDetail; // Lưu ý thay đổi tên selector
export default orderDetailSlice.reducer;
