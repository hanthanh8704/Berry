import { createSlice } from "@reduxjs/toolkit";

const codeSlice = createSlice({
  name: "code",
  initialState: null,
  reducers: {
    setCode(state, action) {
      return action.payload;
    },
    removeCode(state, action) {
      return null;
    },
  },
});

const { actions, reducer } = codeSlice;
export const GetCode = (state) => state.code;
export const { setCode, removeCode } = actions;
export default reducer;
