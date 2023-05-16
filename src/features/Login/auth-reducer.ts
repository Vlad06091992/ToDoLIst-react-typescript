import {Dispatch} from 'redux'
import { setAppStatus} from 'app/app-reducer'
import {authAPI, LoginParamsType} from '../../api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "app/store";
import {cleatTasksAndTodolists} from "commons/actions/common.actions";

const initialState: InitialStateType = {
    isLoggedIn: false
}

const slice = createSlice({
    initialState,
    name:'auth',
    reducers:{
        setIsLoggedIn(state,action: PayloadAction<{isLoggedIn:boolean}>){
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }

})

export const authReducer = slice.reducer
export const{setIsLoggedIn} = slice.actions

// thunks
export const loginTC = (data: LoginParamsType):AppThunk => (dispatch) => {
    dispatch(setAppStatus({status:'loading'}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn({isLoggedIn:true}))
                dispatch(setAppStatus({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = ():AppThunk => (dispatch) => {
    dispatch(setAppStatus({status:'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn({isLoggedIn:false}))
                dispatch(cleatTasksAndTodolists({task:{},todolists:[]}))
                // dispatch(cleatTasksAndTodolists({},[])) //With prepare callback

                dispatch(setAppStatus({status:'succeeded'}))
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
