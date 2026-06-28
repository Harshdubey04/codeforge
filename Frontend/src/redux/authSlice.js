import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({

  name: "auth",

  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    role: null,        // add this
  },

  reducers: {

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.role = action.payload?.role || null;  // add this
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.role = null;   // add this
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    }

  }
});

export const { setUser, logout, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;