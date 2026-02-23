import { createSlice } from "@reduxjs/toolkit";

const complaintsSlice = createSlice({
  name: "complaints",
  initialState: {
    data: [],
  },
  reducers: {
    setComplaints: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setComplaints } = complaintsSlice.actions;
export default complaintsSlice.reducer;
