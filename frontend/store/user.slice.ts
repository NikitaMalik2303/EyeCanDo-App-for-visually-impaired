import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoggedIn: false,
    token: "",
    fallDetectionEnabled: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.token = action.payload.token;

      // Save token to local storage
    },
    update: (state, action) => {
      const prevUser: any = state.user;
      state.user = { ...prevUser, ...action.payload };
    },
    logout: (state, action) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = "";
    },
    enableFallDetection: (state) => {
      state.fallDetectionEnabled = true;
    },
    disableFallDetection: (state) => {
      state.fallDetectionEnabled = false;
    },
  },
});

export const { login, update, logout, enableFallDetection, disableFallDetection } = userSlice.actions;
export default userSlice.reducer;
