import { Dispatch } from "redux";
import {
  setAppErrorAC,
  SetAppErrorActionType,
  setAppInitializedAC,
  setAppStatusAC,
  SetAppStatusActionType
} from "../../app/app-reducer";
import { authAPI, LoginParamsType } from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerAppErrorGenerator,
  handleServerNetworkError,
  handleServerNetworkErrorGenerator
} from "../../utils/error-utils";
import { call, put } from "redux-saga/effects";

const initialState: InitialStateType = {
  isLoggedIn: false
};

export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN":
      return { ...state, isLoggedIn: action.value };
    default:
      return state;
  }
};

// actions

export const setIsLoggedInAC = (value: boolean) =>
  ({ type: "login/SET-IS-LOGGED-IN", value } as const);

export const authMe = () => ({ type: "authMe" } as const);

export const login = (payload: LoginParamsType) =>
  ({ type: "login", payload } as const);
export const logout = () => ({ type: "logout" } as const);

type LoginActionType = ReturnType<typeof login>;

export function* fetchLoginWorkerSaga(action: LoginActionType) {
  try {
    const response = yield call(authAPI.login, action.payload);
    if (response.data.resultCode === 0) {
      yield put(setAppStatusAC("succeeded"));
      yield put(setIsLoggedInAC(true));
      yield put(setAppInitializedAC(true));
    } else {
      yield handleServerAppErrorGenerator(response);
    }
  } catch (error) {
    handleServerNetworkErrorGenerator(error);
  }
}

export function* fetchLogoutWorkerSaga(action: LoginActionType) {
  try {
    const response = yield call(authAPI.logout);
    if (response.data.resultCode === 0) {
      yield put(setIsLoggedInAC(false));
      yield put(setAppStatusAC("succeeded"));
    } else {
      yield handleServerAppErrorGenerator(response);
    }
  } catch (error) {
    yield handleServerNetworkErrorGenerator(error);
  }
}

// types

type ActionsType = ReturnType<typeof setIsLoggedInAC>;
type InitialStateType = {
  isLoggedIn: boolean;
};

type ThunkDispatch = Dispatch<
  ActionsType | SetAppStatusActionType | SetAppErrorActionType
>;
