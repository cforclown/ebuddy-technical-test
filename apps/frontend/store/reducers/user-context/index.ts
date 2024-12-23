/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/lib/entities/user";

export const USER_CONTEXT_STORAGE_KEY = "user-context";

export interface IUserContextState {
  user?: User
}

const initialState: IUserContextState = {};

const userContextSlice = createSlice({
  name: "user-context",
  initialState,
  reducers: {
    setUserContext(state, action) {
      state.user = action.payload;
    },
  },
});

export const { 
  setUserContext, 
} = userContextSlice.actions;

export default userContextSlice.reducer;
