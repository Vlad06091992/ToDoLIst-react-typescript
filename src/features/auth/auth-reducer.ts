import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils/";
import { authAPI, LoginParamsType, securityApi } from "features/auth/auth-api";
import { clearTasksAndTodolists } from "common/actions";
import { setAppInitialized, setAppStatus } from "app/app-reducer";
import { thunkTryCatch } from "common/utils/thunkTryCatch";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";

const initialState: InitialStateType = {
  isLoggedIn: false,
  captchaUrl: null,
};

type InitialStateType = {
  isLoggedIn: boolean;
  captchaUrl: null | string;
};

const slice = createSlice({
  initialState,
  name: "auth",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.captchaUrl = null;
    });
    builder.addCase(initializeApp.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    builder.addCase(getCaptchaUrl.fulfilled, (state, action) => {
      state.captchaUrl = action.payload.captcha;
    });
  },
});

const login = createAppAsyncThunk<AuthThunksReturnType, LoginParamsType>(
  "auth/login",
  async (arg, { dispatch, rejectWithValue }) => {
    const res = await authAPI.login(arg);
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      if (res.data.resultCode === 10) {
        dispatch(getCaptchaUrl());
      }
      const showError = !res.data.fieldsErrors?.length || res.data.resultCode === 10;
      return rejectWithValue({ data: res.data, showGlobalError: showError });
    }
  }
);

const logout = createAsyncThunk<AuthThunksReturnType, void>(
  "auth/logout",
  async (arg, { dispatch, rejectWithValue }: BaseThunkAPI<any, any, any, any>) => {
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(clearTasksAndTodolists());
      dispatch(setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: false };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true });
    }
  }
);

const initializeApp = createAppAsyncThunk<AuthThunksReturnType, void>(
  "app/initialize",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      let res = await authAPI.me();
      if (res.data.resultCode === 0) {
        return { isLoggedIn: true };
      } else {
        return rejectWithValue({ data: res.data, showGlobalError: false });
      }
    } finally {
      dispatch(setAppInitialized({ isInitialized: true }));
    }
  }
);

export const getCaptchaUrl = createAppAsyncThunk<any, void>(
  "auth/getCaptcha",
  async (arg, { dispatch, rejectWithValue }) => {
    let res = await securityApi.getCaptchaUrl();
    return { captcha: res.data.url };
  }
);

// types

type AuthThunksReturnType = { isLoggedIn: boolean };

export const authThunks = { login, logout, initializeAppTC: initializeApp };
export const authReducer = slice.reducer;
