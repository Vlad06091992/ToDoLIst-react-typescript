import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authThunks} from "features/auth/auth-reducer";

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
        // debugger
        // builder.addCase(authThunks.login.fulfilled, (state, action) => {
        //     state.status = 'succeeded'
        // })
        builder.addMatcher(
            (value) => {
                return value.type.endsWith('pending')
            },
            (state, action) => {
                state.status = 'loading'
            })
            // .addMatcher(
            //     (value) => {
            //         return value.type.endsWith('rejected')
            //     },
            //     (state, action) => {
            //         state.error = action.payload
            //     })
    },

})


export const {setAppInitialized, setAppStatus, setAppError} = slice.actions
export const appReducer = slice.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

