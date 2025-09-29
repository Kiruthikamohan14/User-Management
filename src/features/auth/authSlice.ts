// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginCredentials, User } from "../../types/auth";
import { loginApi, logoutApi } from "../../api/authApi";

// Initialize token from storage if exists
const initialToken =
  localStorage.getItem("token") || sessionStorage.getItem("token");

const initialState: AuthState = {
  token: initialToken,
  user: null,
  loading: false,
  error: null,
};

// ---------------------- Thunks ----------------------

// Login thunk
export const login = createAsyncThunk<
  string,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginApi(credentials);
    // Save email for dynamic user lookup if needed
    if (credentials.remember) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", credentials.email);
    } else {
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("email", credentials.email);
    }
    return data.token;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});

// Logout thunk
export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutApi(); // Backend clears token from cookie
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  sessionStorage.removeItem("token");
  return null;
});

// ---------------------- Slice ----------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      state.loading = false;
      // Clean storage
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      sessionStorage.removeItem("token");
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.error = null;
      });
  },
});

export const { clearAuth, setUser } = authSlice.actions;
export default authSlice.reducer;
