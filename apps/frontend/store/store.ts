import { configureStore } from "@reduxjs/toolkit";
import usercontextReducer from "./reducers/user-context";
import usersReducer from "./reducers/users.api";

export const createStore = () => configureStore({
  reducer: {
    userContext: usercontextReducer,
    users: usersReducer,
  },
});

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
