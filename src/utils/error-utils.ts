import {
  setAppErrorAC,
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType
} from "../app/app-reducer";
import { ResponseType } from "../api/todolists-api";
import { Dispatch } from "redux";
import { put } from "redux-saga/effects";

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>
) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC(data.messages[0]));
  } else {
    dispatch(setAppErrorAC("Some error occurred"));
  }
  dispatch(setAppStatusAC("failed"));
};

export function* handleServerAppErrorGenerator<
  D extends { messages: Array<string> }
>(response: ResponseType<D>) {
  if (response.data.messages.length) {
    yield put(setAppErrorAC(response.data.messages[0]));
  } else {
    yield put(setAppErrorAC("Some error occurred"));
  }
  yield put(setAppStatusAC("failed"));
}

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>
) => {
  dispatch(
    setAppErrorAC(error.message ? error.message : "Some error occurred")
  );
  dispatch(setAppStatusAC("failed"));
};

export function* handleServerNetworkErrorGenerator(error: { message: string }) {
  yield put(
    setAppErrorAC(error.message ? error.message : "Some error occurred")
  );
  yield put(setAppStatusAC("failed"));
}
