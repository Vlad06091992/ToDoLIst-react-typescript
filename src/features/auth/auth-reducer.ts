import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils/";
import {authAPI, LoginParamsType} from "features/auth/auth-api";
import {clearTasksAndTodolists} from "common/actions";
import {setAppInitialized, setAppStatus} from "app/app-reducer";
import {thunkTryCatch} from "common/utils/thunkTryCatch";
import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";

const initialState: InitialStateType = {
    isLoggedIn: false
}

type InitialStateType = {
    isLoggedIn: boolean
}

const slice = createSlice({
    initialState,
    name: 'auth',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        builder.addCase(logout.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        builder.addCase(initializeAppTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })

    },


})




const login = createAppAsyncThunk<AuthThunksReturnType,LoginParamsType>('auth/login',async (arg, {dispatch, rejectWithValue})=>{
    const res = await authAPI.login(arg);
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}));
            return {isLoggedIn: true};
        } else {
            const showError = !res.data.fieldsErrors?.length;
            return rejectWithValue({data:res.data, showGlobalError:showError});
        }

})


const logout = createAsyncThunk<AuthThunksReturnType, void>('auth/logout', async (arg, {dispatch, rejectWithValue}:BaseThunkAPI<any, any,any,any>) => {
    const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(clearTasksAndTodolists())
            dispatch(setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: false}
        } else {
            return rejectWithValue({data:res.data, showGlobalError:true});
        }


})


 const initializeAppTC = createAppAsyncThunk<AuthThunksReturnType,void>('app/initialize', async (arg, {dispatch, rejectWithValue}) => {
    try {
        let res = await authAPI.me()
        if (res.data.resultCode === 0) {
            return {isLoggedIn: true}
        } else {
            return rejectWithValue({data:res.data, showGlobalError:false});
        }
    }  finally {
        dispatch(setAppInitialized({isInitialized: true}))
    }
})

// types

type AuthThunksReturnType = {isLoggedIn:boolean}

export const authThunks = {login, logout,initializeAppTC}
export const authReducer = slice.reducer


