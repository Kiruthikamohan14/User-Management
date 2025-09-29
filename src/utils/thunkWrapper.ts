import { createAsyncThunk } from "@reduxjs/toolkit";

// Generic thunk wrapper
export function createAsyncThunkWrapper<Returned, ThunkArg = void>(
  typePrefix: string,
  apiCall: (arg: ThunkArg) => Promise<Returned>
) {
  return createAsyncThunk<Returned, ThunkArg>(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        return await apiCall(arg);
      } catch (err: any) {
        return rejectWithValue(err.message || "Something went wrong");
      }
    }
  );
}
