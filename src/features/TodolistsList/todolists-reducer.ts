import {RequestStatusType, setAppStatus} from 'app/app-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists, ClearTasksAndTodolistsType} from "common/actions/common.actions";
import {todolistsApi, TodolistType} from "features/TodolistsList/todolists-api";
import {createAppAsyncThunk, handleServerNetworkError} from "common/utils";
import {ResultCode} from "common/enums/enums";


const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<ChangeTodolistFilterType>) {
            let todolist = state.find((td: TodolistType) => td.id === action.payload.id)
            if (todolist) {
                todolist.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus(state, action: PayloadAction<ChangeTodolistEntityStatus>) {
            let todolist = state.find((td: TodolistType) => td.id === action.payload.todolistId)
            if (todolist) {
                todolist.entityStatus = action.payload.entityStatus

            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(changeTodolistTitle.fulfilled, (state, action: PayloadAction<ChangeTodolistTitleType>) => {
            let todolist = state.find((td: TodolistType) => td.id === action.payload.id)
            if (todolist) {
                todolist.title = action.payload.title
            }
        })

            .addCase(addTodolist.fulfilled, (state, action: PayloadAction<AddTodolistReturnType>) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            })
            .addCase(removeTodolist.fulfilled, (state, action: PayloadAction<{ todolistId: string }>) => {
                let index = state.findIndex(el => el.id === action.payload.todolistId)
                if (index > -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(fetchTodolists.fulfilled, (state, action: PayloadAction<FetchTodolistsReturnType>) => {
                return action.payload.todolists.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
            })
            .addCase(clearTasksAndTodolists, (state, action) => {
                return []

            })
    }
})


export const fetchTodolists = createAppAsyncThunk<FetchTodolistsReturnType, FetchTodolistsArgType>('todolists/fetchTodolsits', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        let res = await todolistsApi.getTodolists()
        dispatch(setAppStatus({status: 'succeeded'}))
        return {todolists: res.data}
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(e.message)
    }
})


export const removeTodolist = createAppAsyncThunk<RemoveTodolistType, RemoveTodolistType>('todolists/removeTodolist', async (arg, thunkAPI) => {
    let {dispatch, rejectWithValue} = thunkAPI
    let {todolistId} = arg
    try {
        dispatch(setAppStatus({status: 'loading'}))
        dispatch(changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
        let res = await todolistsApi.deleteTodolist(todolistId)
        if (res.data.resultCode === ResultCode.success) {
            dispatch(setAppStatus({status: "succeeded"}))
            return {todolistId}
        } else {
            handleServerNetworkError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(e.message)
    }
})


const addTodolist = createAppAsyncThunk<AddTodolistReturnType, AddTodolistArgType>('todolists/addTodolist', async (arg, thunkAPI) => {
    let {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        let res = await todolistsApi.createTodolist(arg.title)
        dispatch(setAppStatus({status: "succeeded"}))
        return {todolist: res.data.data.item}
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(e.message)
    }
})


const changeTodolistTitle = createAppAsyncThunk<ChangeTodolistTitleType, ChangeTodolistTitleType>('todolists/changeTodolists', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    const {id, title} = arg
    try {
        dispatch(setAppStatus({status: 'loading'}))
        await todolistsApi.updateTodolist(arg.id, arg.title)
        return {id, title}
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(e.message)
    } finally {
        dispatch(setAppStatus({status: "succeeded"}))
    }
})

export type FetchTodolistsArgType = void
export type FetchTodolistsReturnType = { todolists: Array<TodolistType> }
export type RemoveTodolistType = { todolistId: string }
export type AddTodolistArgType = { title: string }
export type AddTodolistReturnType = { todolist: TodolistType }
export type ChangeTodolistTitleType = { title: string, id: string }
export type ChangeTodolistFilterType = { filter: FilterValuesType, id: string }
export type ChangeTodolistEntityStatus = { entityStatus: RequestStatusType, todolistId: string }

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


export const {changeTodolistFilter, changeTodolistEntityStatus} = slice.actions
export const todolistsReducer = slice.reducer
export const todolistsThunks = {removeTodolist, addTodolist, changeTodolistTitle, fetchTodolists}

