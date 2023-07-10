import {setAppStatus} from "app/app-reducer";
import {handleServerNetworkError} from "common/utils/handle-server-network-error";
import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AppDispatch, AppRootStateType} from "app/store";

export const thunkTryCatch = async (thunkAPI: BaseThunkAPI<AppRootStateType, unknown,AppDispatch,unknown>, logic: Function) => {
    const {dispatch, rejectWithValue} = thunkAPI

    try {
        dispatch(setAppStatus({status: 'loading'}))
        return await logic()
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: 'succeeded'}))
    }
}


//

