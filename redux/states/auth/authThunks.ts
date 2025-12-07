import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginCredentials, SignupData } from "@/types/auth";
import {
  signupUser,
  loginUser,
  logoutUser,
  refreshToken,
  checkAuthSession,
} from "./authAPI";

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response = await signupUser(data);

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);

      if (response.success && response.user) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutUser();

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Logout failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshToken();

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Token refresh failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkAuthSessionThunk = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkAuthSession();

      if (response.success && response.user) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      // Don't clutter console with "No active session" errors
      return rejectWithValue("No active session");
    }
  }
);
