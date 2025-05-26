import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../features/project/projectSlice";
import postReducer from "../features/post/postSlice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    post: postReducer,
  },
});
