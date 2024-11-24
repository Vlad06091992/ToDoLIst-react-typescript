import { authAPI } from "../api/todolists-api";
import { setIsLoggedInAC } from "../features/Login/auth-reducer";
import { call, put } from "redux-saga/effects";

const initialState: InitialStateType = {
  status: "idle",
  error: null,
  isInitialized: false
};

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    case "APP/SET-IS-INITIALIED":
      return { ...state, isInitialized: action.value };
    default:
      return { ...state };
  }
};

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType;
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null;
  // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
  isInitialized: boolean;
};

export const setAppErrorAC = (error: string | null) => {
  return { type: "APP/SET-ERROR", error } as const;
};
export const setAppStatusAC = (status: RequestStatusType) =>
  ({ type: "APP/SET-STATUS", status } as const);
export const setAppInitializedAC = (value: boolean) => {
  return { type: "APP/SET-IS-INITIALIED", value } as const;
};

export function* fetchAuthMeWorkerSaga() {
  try {
    const response = yield call(authAPI.me);
    if (response.data.resultCode === 0) {
      yield put(setAppStatusAC("succeeded"));
      yield put(setIsLoggedInAC(true));
      yield put(setAppInitializedAC(true));
    } else {
      yield put(setAppStatusAC("succeeded"));
      yield put(setIsLoggedInAC(false));
      yield put(setAppInitializedAC(true));
    }
  } catch (e) {
    yield put(setAppInitializedAC(true));
  }
}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;

type ActionsType =
  | SetAppErrorActionType
  | SetAppStatusActionType
  | ReturnType<typeof setAppInitializedAC>
  | ReturnType<typeof setIsLoggedInAC>;
