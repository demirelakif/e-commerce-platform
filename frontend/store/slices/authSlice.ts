import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "admin" | "customer";
  isEmailVerified: boolean;
  addresses: Array<{
    _id: string;
    type: "shipping" | "billing";
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
  preferences: {
    favoriteCategories: string[];
    newsletterSubscription: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("Login attempt with credentials:", credentials);
      console.log("API base URL:", process.env.NEXT_PUBLIC_API_URL);

      const response = await api.post("/auth/login", credentials);
      console.log("Login response received:", response.data);

      // Check if response has the expected structure
      if (!response.data || !response.data.success || !response.data.data) {
        console.error("Invalid response structure:", response.data);
        return rejectWithValue("Invalid response from server");
      }

      const { user, token } = response.data.data;

      // Validate user and token
      if (!user || !token) {
        console.error("Missing user or token in response:", response.data);
        return rejectWithValue("Invalid response data");
      }

      console.log("Extracted user and token:", { user: user.email, token: token.substring(0, 20) + "..." });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      return { user, token };
    } catch (error: any) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });

      // Better error handling
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      } else if (error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("Login failed");
      }
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { user, token } = response.data.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Registration failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/auth/me");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Failed to get user");
  }
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: { firstName?: string; lastName?: string; phone?: string }, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
