import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction, ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth.api";
import { clearAuthToken } from "@/api";
import type {
  LoginPayload,
  RegisterPayload,
  GoogleLoginPayload,
  ApiEnvelope,
  AuthResponseData,
} from "@/interfaces/auth";
import { UserRole } from "@/constants/enums";

export interface AuthState {
  token: string | null;
  id: string | null;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  isVerified: boolean;
  isBlocked: boolean;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  token: null,
  id: null,
  name: null,
  email: null,
  role: null,
  isVerified: false,
  isBlocked: false,
  loading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
};

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object') {
    if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const response = error.response as { data: { message: string } };
      if (response.data?.message) {
        return response.data.message;
      }
    }
    if ('message' in error) {
      return (error as { message: string }).message;
    }
  }
  return fallback;
};

const setAuthData = (state: AuthState, data: AuthResponseData, token?: string) => {
  if (data.isVerified && token && !data.isBlocked) {
    state.token = token;
    state.isAuthenticated = true;
  } else {
    state.token = null;
    state.isAuthenticated = false;
  }
  
  state.id = data.id;
  state.name = data.name;
  state.email = data.email;
  state.role = data.role;
  state.isVerified = data.isVerified;
  state.isBlocked = data.isBlocked;
};
const clearAuthData = (state: AuthState) => {
  state.token = null;
  state.id = null;
  state.name = null;
  state.email = null;
  state.role = null;
  state.isVerified = false;
  state.isBlocked = false;
  state.isAuthenticated = false;
};

const setLoading = (state: AuthState, loading: boolean) => {
  state.loading = loading;
  if (loading) state.error = null;
};

export const loginThunk = createAsyncThunk<
  ApiEnvelope<AuthResponseData>,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    return await authApi.login(payload);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Login failed"));
  }
});

export const adminLoginThunk = createAsyncThunk<
  ApiEnvelope<AuthResponseData>,
  LoginPayload,
  { rejectValue: string }
>("auth/adminLogin", async (payload, { rejectWithValue }) => {
  try {
    return await authApi.adminLogin(payload);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Admin login failed"));
  }
});

export const registerThunk = createAsyncThunk<
  ApiEnvelope<AuthResponseData>,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    return await authApi.register(payload);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Registration failed"));
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  ApiEnvelope<AuthResponseData>,
  string,
  { rejectValue: string }
>("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    return await authApi.forgotPassword(email);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Failed to send password reset email"));
  }
});

export const googleLoginThunk = createAsyncThunk<
  ApiEnvelope<AuthResponseData>,
  GoogleLoginPayload,
  { rejectValue: string }
>("auth/googleLogin", async (payload, { rejectWithValue }) => {
  try {
    return await authApi.googleLogin(payload);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Google login failed"));
  }
});

export const refreshTokenThunk = createAsyncThunk<
  ApiEnvelope<AuthResponseData>,
  void,
  { rejectValue: string }
>("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    return await authApi.refreshToken();
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response: { status: number } }).response;
      if (response.status === 400) {
        return rejectWithValue("No valid refresh token");
      }
    }
    return rejectWithValue(extractErrorMessage(error, "Token refresh failed"));
  }
}); 

export const getCurrentUserThunk = createAsyncThunk<
  ApiEnvelope<AuthResponseData>,
  void,
  { rejectValue: string }
>("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    return await authApi.getCurrentUser();
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response: { status: number } }).response;
      if (response.status === 401) {
        return rejectWithValue("Not authenticated");
      }
    }
    return rejectWithValue(extractErrorMessage(error, "Failed to get current user"));
  }
});

export const initializeAuthThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/initialize", async (_, { dispatch, getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: AuthState };
    const { token } = state.auth;
    
    if (token) {
      const result = await dispatch(getCurrentUserThunk());
      if (result.type.endsWith('/rejected')) {
        const refreshResult = await dispatch(refreshTokenThunk());
        if (refreshResult.type.endsWith('/rejected')) {
          return rejectWithValue("Not authenticated");
        }
      }
    } else {
      const refreshResult = await dispatch(refreshTokenThunk());
      if (refreshResult.type.endsWith('/rejected')) {
        return rejectWithValue("Not authenticated");
      }
    }
  } catch {
    return rejectWithValue("Not authenticated");
  }
});

export const logoutThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async () => {
    try {
      await authApi.logout();
    } catch {
      console.log("Logout failed on server, but clearing client auth data anyway.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      clearAuthData(state);
      state.error = null;
      clearAuthToken();
    },
    clearError(state) {
      state.error = null;
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
    clearAuthState(state) {
      clearAuthData(state);
      state.error = null;
    },
    setUser(state, action: PayloadAction<{ data: AuthResponseData; token: string }>) {
      const { data, token } = action.payload;
      setAuthData(state, data, token);
    },
  },
  extraReducers: (builder) => {
    const addAuthHandlers = <T>(
      builder: ActionReducerMapBuilder<AuthState>,
      thunk: AsyncThunk<ApiEnvelope<AuthResponseData>, T, { rejectValue: string }>,
      errorMessage: string,
      shouldSetAuthData = true
    ) => {
      builder
        .addCase(thunk.pending, (state: AuthState) => {
          setLoading(state, true);
        })
        .addCase(thunk.fulfilled, (state: AuthState, action: PayloadAction<ApiEnvelope<AuthResponseData>>) => {
          setLoading(state, false);
          const { data, token } = action.payload;
          if (data && shouldSetAuthData) {
            setAuthData(state, data, token);
          }
        })
        .addCase(thunk.rejected, (state: AuthState, action: { payload?: string }) => {
          setLoading(state, false);
          state.error = action.payload ?? errorMessage;
        });
    };

    addAuthHandlers(builder, loginThunk, "Login failed");
    addAuthHandlers(builder, adminLoginThunk, "Admin login failed");
    addAuthHandlers(builder, registerThunk, "Registration failed");
    addAuthHandlers(builder, forgotPasswordThunk, "Failed to send password reset email", false);
    addAuthHandlers(builder, googleLoginThunk, "Google login failed");

    builder
      .addCase(refreshTokenThunk.pending, (state) => setLoading(state, true))
      .addCase(refreshTokenThunk.fulfilled, (state, action: PayloadAction<ApiEnvelope<AuthResponseData>>) => {
        setLoading(state, false);
        const { data, token } = action.payload;
        if (data) {
          setAuthData(state, data, token);
        }
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        setLoading(state, false);
        const errorMessage = action.payload ?? "Token refresh failed";
        
        if (errorMessage.includes("Invalid refresh token")) {
          state.error = "Your session has expired. Please log in again.";
        } else if (action.payload !== "No valid refresh token") {
          state.error = errorMessage;
        }
        
        clearAuthData(state);
      });

    builder
      .addCase(getCurrentUserThunk.pending, (state) => setLoading(state, true))
      .addCase(getCurrentUserThunk.fulfilled, (state, action: PayloadAction<ApiEnvelope<AuthResponseData>>) => {
        setLoading(state, false);
        const { data, token } = action.payload;
        if (data) {
          setAuthData(state, data, token);
        }
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        setLoading(state, false);
        const errorMessage = action.payload ?? "Failed to get current user";
        
        if (errorMessage.includes("blocked") || errorMessage.includes("Company account is blocked")) {
          state.error = "Your account has been blocked. Please contact support for assistance.";
        } else if (errorMessage.includes("Invalid refresh token")) {
          state.error = "Your session has expired. Please log in again.";
        } else if (action.payload !== "Not authenticated") {
          state.error = errorMessage;
        }
        
        clearAuthData(state);
      });

    builder
      .addCase(initializeAuthThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuthThunk.fulfilled, (state) => {
        state.loading = false;
        state.isInitialized = true;
      })
      .addCase(initializeAuthThunk.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.token = null;
        state.isAuthenticated = false;

        state.error = null;
      });

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        clearAuthData(state);
        state.error = null;
        clearAuthToken();
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.loading = false;
        clearAuthData(state);
        state.error = null;
        clearAuthToken();
      });
  },
});

export const { logout, clearError, setInitialized, clearAuthState, setUser } = authSlice.actions;
export default authSlice.reducer;