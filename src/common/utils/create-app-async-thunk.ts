import {createAsyncThunk} from "@reduxjs/toolkit";

import {AppDispatch, AppRootStateType} from "app/store";

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