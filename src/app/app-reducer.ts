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
        builder.addMatcher(
            (value) => {
                return value.type.endsWith('pending')
            },
            (state, action) => {
                state.status = 'loading'
            })
            .addMatcher(
                action => action.type.endsWith('/rejected'),
                (state, action) => {
                    const { payload, error } = action
                    if (payload) {
                        if (payload.showGlobalError) {
                            state.error = payload.data.messages.length ? payload.data.messages[0] : 'Some error occurred'
                        }
                    } else {
                        state.error = error.message ? error.message : 'Some error occurred'
                    }
                    state.status = 'failed'
                }
            )
            .addMatcher(
                action => action.type.endsWith('/fulfilled'),
                state => {
                    state.status = 'succeeded'
                }
            )
            .addMatcher(
                (value) => {
                    return value.type.endsWith('fulfilled')
                },
                (state) => {
                    state.status = 'succeeded'
                })
    },

})


export const {setAppInitialized, setAppStatus, setAppError} = slice.actions
export const appReducer = slice.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

