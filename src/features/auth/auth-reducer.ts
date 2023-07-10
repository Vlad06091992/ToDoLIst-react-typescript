import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils/";
import {authAPI, LoginParamsType} from "features/auth/auth-api";
import {clearTasksAndTodolists} from "common/actions";
import {setAppInitialized, setAppStatus} from "app/app-reducer";

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




 const login = createAppAsyncThunk<AuthThunksReturnType, LoginParamsType>('auth/login',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const res = await authAPI.login(arg)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                return {isLoggedIn: true}
            } else {

                console.log(res)

                const showError = !res.data.fieldsErrors?.length

                handleServerAppError(res.data, dispatch, showError)
                return rejectWithValue(res.data)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })


const logout = createAsyncThunk<AuthThunksReturnType, void>('auth/logout', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(setAppStatus({status: 'loading'}))
    try {
        let res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(clearTasksAndTodolists())
            dispatch(setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: false}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: 'succeeded'}))
    }

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


