import {createAsyncThunk} from "@reduxjs/toolkit";

import {AppDispatch, AppRootStateType} from "app/store";

/**
 * The tool from Redux Toolkit for one-time typing of state,dispatch, extra and rejectValue
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppDispatch
    rejectValue?: null | RejectType
}>()


export type RejectType = {
	data: {};
	messages: string[];
	fieldsErrors: FieldErrorsType[];
	resultCode: number;
}
export type FieldErrorsType = {
	field: string;
	error: string;
}