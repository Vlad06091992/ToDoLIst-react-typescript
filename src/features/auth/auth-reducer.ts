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




const login = createAppAsyncThunk<AuthThunksReturnType,LoginParamsType>('auth/login',(arg, thunkAPI)=>{
    return thunkTryCatch(thunkAPI, async () => {
        const {dispatch, rejectWithValue} = thunkAPI;
        const res = await authAPI.login(arg);
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}));
            return {isLoggedIn: true};
        } else {
            const showError = !res.data.fieldsErrors?.length;
            handleServerAppError(res.data, dispatch, showError);
            return rejectWithValue(res.data);
        }
    });
})


const logout = createAsyncThunk<AuthThunksReturnType, void>('auth/logout', async (arg, thunkAPI:BaseThunkAPI<any, any,any,any>) => {
    return thunkTryCatch(thunkAPI,async ()=>{
        const{dispatch,rejectWithValue} = thunkAPI
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(clearTasksAndTodolists())
            dispatch(setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: false}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    })

})


 const initializeAppTC = createAppAsyncThunk<AuthThunksReturnType,void>('app/initialize', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        let res = await authAPI.me()
        if (res.data.resultCode === 0) {
            return {isLoggedIn: true}
        } else {
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppInitialized({isInitialized: true}))
    }
})

// types

type AuthThunksReturnType = {isLoggedIn:boolean}

export const authThunks = {login, logout,initializeAppTC}
export const authReducer = slice.reducer


