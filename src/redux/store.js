import { configureStore } from "@reduxjs/toolkit";
import complaintsReducer from "./slices/complaintSlice";

const store = configureStore({
  reducer: {
    complaints: complaintsReducer,
  },
});

export default store;
