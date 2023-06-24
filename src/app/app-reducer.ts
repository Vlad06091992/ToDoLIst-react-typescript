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
// export type InitialStateType = {
//     // происходит ли сейчас взаимодействие с сервером
//     status: RequestStatusType
//     // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
//     error: string | null
//     // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
//     isInitialized: boolean
// }

// export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
// export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
//
//
// type ActionsType =
//     | SetAppErrorActionType
//     | SetAppStatusActionType
//     | ReturnType<typeof setAppInitializedAC>

// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case 'APP/SET-IS-INITIALIED':
//             return {...state, isInitialized: action.value}
//         default:
//             return {...state}
//     }
// }
//
//
//
// export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
// export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
// export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET-IS-INITIALIED', value} as const)
