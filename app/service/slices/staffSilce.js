import { createSlice } from "@reduxjs/toolkit";

const staffSlice = createSlice({
  name: "staff",
  initialState: null,
  reducers: {
    setStaff(state, action) {
      return action.payload;
    },
    removeStaff(state, action) {
      return null;
    },
  },
});

const { actions, reducer } = staffSlice;
export const GetStaff = (state) => state.staff;
export const { setStaff, removeStaff } = actions;
export default reducer;
