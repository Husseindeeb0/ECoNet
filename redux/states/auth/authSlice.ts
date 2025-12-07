import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/types/auth";

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Clear error message
     * Used to reset error state
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase("auth/login/pending" as any, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        "auth/login/fulfilled" as any,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(
        "auth/login/rejected" as any,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Signup
      .addCase("auth/signup/pending" as any, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        "auth/signup/fulfilled" as any,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          // Auto-login after signup
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(
        "auth/signup/rejected" as any,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Logout
      .addCase("auth/logout/pending" as any, (state) => {
        state.loading = true;
      })
      .addCase("auth/logout/fulfilled" as any, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(
        "auth/logout/rejected" as any,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Refresh Token
      .addCase("auth/refreshToken/pending" as any, (state) => {
        // Optional: might not want to show global loading for background refresh
      })
      .addCase(
        "auth/refreshToken/fulfilled" as any,
        (state, action: PayloadAction<any>) => {
          // If refresh token returns new user info/token
        }
      )
      .addCase("auth/refreshToken/rejected" as any, (state) => {
        // If refresh fails, usually means session expired
        state.user = null;
        state.isAuthenticated = false;
      })

      // Check Auth Session
      .addCase("auth/checkSession/pending" as any, (state) => {
        state.loading = true;
      })
      .addCase(
        "auth/checkSession/fulfilled" as any,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase("auth/checkSession/rejected" as any, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const { clearError } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
