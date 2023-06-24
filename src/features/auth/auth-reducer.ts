
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {appActions} from "app/app-reducer";
import {handleServerAppError} from "common/utils/";
import {handleServerNetworkError} from "common/utils/";
import {authAPI, LoginParamsType} from "features/auth/auth-api";

const initialState: InitialStateType = {
    isLoggedIn: false
}

const slice = createSlice({
    initialState,
    name: 'auth',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            state.isLoggedIn = false
        })

    },


})


export const authReducer = slice.reducer


export const loginTC = createAsyncThunk<null | undefined, LoginParamsType>('auth/login',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            const res = await authAPI.login(arg)
            if (res.data.resultCode === 0) {

            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }

        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })




export const logoutTC = createAsyncThunk('auth/logout', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI

    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        let res = await authAPI.logout()

        if (res.data.resultCode === 0) {

        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }

    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
    }

})



// types


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

export const authThunks = {loginTC}
