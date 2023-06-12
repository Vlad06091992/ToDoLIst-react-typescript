import {Dispatch} from 'redux'
import {authAPI} from 'api/todolists-api'
import {setIsLoggedIn} from 'features/Login/auth-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false,

}

const slice = createSlice({
    name:'app',
    initialState,
    reducers:{
        setAppError(state,action:PayloadAction<{error: string | null}>){
            state.error = action.payload.error
        },
        setAppStatus(state,action:PayloadAction<{status: RequestStatusType}>){
            state.status = action.payload.status
        },
        setAppInitialized(state,action:PayloadAction<{isInitialized: boolean}>){
            state.isInitialized = action.payload.isInitialized
        }
}
})


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn({isLoggedIn:true}));
        } else {

        }

        dispatch(setAppInitialized({isInitialized:true}));
    })
}

export const{setAppInitialized,setAppStatus,setAppError} = slice.actions
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
