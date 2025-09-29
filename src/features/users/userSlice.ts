import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User, UserResponse } from "../../types/user";
import {
  getAllUsersApi,
  fetchUsersApi,
  getUserByIdApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "../../api/userApi";
import { createAsyncThunkWrapper } from "../../utils/thunkWrapper";

interface UserState {
  allUsers: User[];
  users: User[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  search: string;
  perPage: number;
}

const initialState: UserState = {
  allUsers: [],
  users: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  search: "",
  perPage: 6,
};

// =====================
// Thunks using wrapper
// =====================
export const getAllUsers = createAsyncThunkWrapper<User[]>("users/getAllUsers", getAllUsersApi);
export const fetchUsers = createAsyncThunkWrapper<UserResponse, { page: number; perPage: number }>(
  "users/fetchUsers",
  ({ page, perPage }) => fetchUsersApi(page, perPage)
);
export const getUserById = createAsyncThunkWrapper<User, number>("users/getUserById", getUserByIdApi);
export const createUser = createAsyncThunkWrapper<User, Partial<User>>("users/createUser", createUserApi);
export const updateUser = createAsyncThunkWrapper<User, User>("users/updateUser", updateUserApi);
export const deleteUser = createAsyncThunkWrapper<number, number>("users/deleteUser", deleteUserApi);

// =====================
// Slice
// =====================
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
      updateUsers(state);
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
      updateUsers(state);
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
      state.page = 1;
      updateUsers(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.allUsers = action.payload;
        updateUsers(state);
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.allUsers.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.allUsers[index] = action.payload;
        else state.allUsers.push(action.payload);
        updateUsers(state, false); // only update pagination if needed
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.allUsers.unshift(action.payload);
        updateUsers(state);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.allUsers.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.allUsers[index] = action.payload;

        const userIndex = state.users.findIndex((u) => u.id === action.payload.id);
        if (userIndex !== -1) state.users[userIndex] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.allUsers = state.allUsers.filter((u) => u.id !== action.payload);
        updateUsers(state);
      });
  },
});

// =====================
// Helpers
// =====================
function updateUsers(state: UserState, recomputeTotal = true) {
  const searchLower = state.search.toLowerCase().trim();

  const filtered = searchLower
    ? state.allUsers.filter(
        (u) =>
          u.email?.toLowerCase().includes(searchLower) ||
          u.first_name?.toLowerCase().includes(searchLower) ||
          u.last_name?.toLowerCase().includes(searchLower)
      )
    : state.allUsers;

  if (recomputeTotal) {
    state.totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));
  }

  const startIndex = (state.page - 1) * state.perPage;
  state.users = filtered.slice(startIndex, startIndex + state.perPage);
}

export const { setSearch, setPage, setPerPage } = userSlice.actions;
export default userSlice.reducer;
