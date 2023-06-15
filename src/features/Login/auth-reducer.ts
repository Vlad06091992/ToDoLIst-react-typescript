import {Dispatch} from 'redux'

import {authAPI, LoginParamsType} from '../../api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "app/store";
import {cleatTasksAndTodolists} from "commons/actions/common.actions";
import {appActions} from "app/app-reducer";

const initialState: InitialStateType = {
    isLoggedIn: false
}

const slice = createSlice({
    initialState,
    name: 'auth',
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: (builder) => {
        builder.addCase(_loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = true
        })

    },

})


export const authReducer = slice.reducer
export const{setIsLoggedIn} = slice.actions

// thunks
// export const loginTC = (data: LoginParamsType):AppThunk => (dispatch) => {
//     dispatch(setAppStatus({status:'loading'}))
//     authAPI.login(data)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoggedIn({isLoggedIn:true}))
//                 dispatch(setAppStatus({status:'succeeded'}))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
// }

export const _loginTC = createAsyncThunk('auth/login',
    async (arg:LoginParamsType, thunkAPI)=>{
    try {
        const res = await authAPI.login(arg)

    } catch (e){console.log(e)}
})









export const logoutTC = ():AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status:'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn({isLoggedIn:false}))
                dispatch(cleatTasksAndTodolists({task:{},todolists:[]}))
                // dispatch(cleatTasksAndTodolists({},[])) //With prepare callback

                dispatch(appActions.setAppStatus({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })

}

// types

type ActionsType = ReturnType<typeof setIsLoggedIn>
type InitialStateType = {
    isLoggedIn: boolean
}

// type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>


// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'login/SET-IS-LOGGED-IN':
//             return {...state, isLoggedIn: action.value}
//         default:
//             return state
//     }
// }

// actions

// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value} as const)
