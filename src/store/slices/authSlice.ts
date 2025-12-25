import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../apis/membership";
import { localStorageNamespace } from "../../utils/constant";

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token:
    typeof localStorage !== "undefined"
      ? localStorage.getItem(localStorageNamespace)
      : null,
  isLoading: false,
  isAuthenticated:
    typeof localStorage !== "undefined"
      ? !!localStorage.getItem(localStorageNamespace)
      : false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // loginStart: (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: AuthState["user"];
        token: string;
      }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem(localStorageNamespace, action.payload.token);
    },
    // loginFailure: (state, action: PayloadAction<string>) => {
    //   state.isLoading = false;
    //   state.isAuthenticated = false;
    //   state.error = action.payload;
    // },

    // registerStart: (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // },
    // registerSuccess: (
    //   state,
    //   action: PayloadAction<{
    //     user: AuthState["user"];
    //     token: string;
    //   }>
    // ) => {
    //   state.isLoading = false;
    //   state.isAuthenticated = true;
    //   state.user = action.payload.user;
    //   state.token = action.payload.token;
    //   state.error = null;
    //   localStorage.setItem(localStorageNamespace, action.payload.token);
    // },
    // registerFailure: (state, action: PayloadAction<string>) => {
    //   state.isLoading = false;
    //   state.isAuthenticated = false;
    //   state.error = action.payload;
    // },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem(localStorageNamespace);
    },

    updateUserProfile: (state, action: PayloadAction<AuthState["user"]>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    setUserData: (
      state,
      action: PayloadAction<{
        user: AuthState["user"];
      }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    // clearError: (state) => {
    //   state.error = null;
    // },
  },
});

export const {
  //   loginStart,
  loginSuccess,
  //   loginFailure,
  //   registerStart,
  //   registerSuccess,
  //   registerFailure,
  logout,
  updateUserProfile,
  setUserData,
  //   clearError,
} = authSlice.actions;

export default authSlice.reducer;
