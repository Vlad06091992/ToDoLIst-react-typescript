import {setAppStatus} from "app/app-reducer";
import {handleServerNetworkError} from "common/utils/handle-server-network-error";
import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AppDispatch, AppRootStateType} from "app/store";

/**
 * An asynchronous function that allows us to eliminate the duplication of try-catch-finally in our thunks
 * @param thunkAPI an object containing all of the parameters that are normally passed to a Redux thunk function, as well as additional options:
 * dispatch: the Redux store dispatch method
 * getState: the Redux store getState method
 * extra: the "extra argument" given to the thunk middleware on setup, if available
 * requestId: a unique string ID value that was automatically generated to identify this request sequence
 * signal: an AbortController.signal object that may be used to see if another part of the app logic has marked this request as needing cancelation.
 * rejectWithValue(value, [meta]): rejectWithValue is a utility function that you can return (or throw) in your action creator to return a rejected response with a defined payload and meta. It will pass whatever value you give it and return it in the payload of the rejected action. If you also pass in a meta, it will be merged with the existing rejectedAction.meta.
 * fulfillWithValue(value, meta): fulfillWithValue is a utility function that you can return in your action creator to fulfill with a value while having the ability of adding to fulfilledAction.meta
 * @param logic - thunk logic
 */

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

