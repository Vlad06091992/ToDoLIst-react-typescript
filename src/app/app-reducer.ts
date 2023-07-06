import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authThunks} from "features/auth/auth-reducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {authAPI} from "features/auth/auth-api";

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false,

}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authThunks.loginTC.fulfilled, (state, action) => {
            state.status = 'succeeded'
        })
        builder.addCase(initializeAppTC.fulfilled, (state, action) => {
            state.isInitialized = true
        })
        // .addCase(tasksThunks.fetchTasks.rejected, (state, action) => {
        //     state.error = action.payload as string
        // })

    },

})




export const initializeAppTC = createAppAsyncThunk('app/initialize', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        let res = await authAPI.me()
        if (res.data.resultCode === 0) {
debugger
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
})


export const appActions = slice.actions
export const appReducer = slice.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

