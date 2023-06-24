import {Dispatch} from 'redux'
import {appActions, RequestStatusType} from 'app/app-reducer'
import {AppThunk} from 'app/store';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ClearTasksAndTodolistsType, cleatTasksAndTodolists} from "common/actions/common.actions";
import {logoutTC} from "features/auth/auth-reducer";
import {todolistsApi, TodolistType} from "features/TodolistsList/todolists-api";
import {handleServerNetworkError} from "common/utils";


const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        removeTodolist(state, action: PayloadAction<{ todolistId: string }>) {
            let index = state.findIndex(el => el.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolist(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})

        },
        changeTodolistTitle(state, action: PayloadAction<{ title: string, id: string }>) {
            let todolist = state.find((td: TodolistType) => td.id === action.payload.id)
            if (todolist) {
                todolist.title = action.payload.title
            }
        },
        changeTodolistFilter(state, action: PayloadAction<{ filter: FilterValuesType, id: string }>) {
            let todolist = state.find((td: TodolistType) => td.id === action.payload.id)
            if (todolist) {
                todolist.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ entityStatus: RequestStatusType, todolistId: string }>) {
            let todolist = state.find((td: TodolistType) => td.id === action.payload.todolistId)
            if (todolist) {
                todolist.entityStatus = action.payload.entityStatus

            }
        },
        setTodolists(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(cleatTasksAndTodolists, (state, action: PayloadAction<ClearTasksAndTodolistsType>) => {
                return action.payload.todolists

            })
        builder.addCase(logoutTC.fulfilled, (state, actionaction) => {
            return []
        })
    }
})


export const {
    changeTodolistTitle,
    changeTodolistFilter,
    removeTodolist,
    setTodolists,
    addTodolist,
    changeTodolistEntityStatus
} = slice.actions
export const todolistsReducer = slice.reducer
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsApi.getTodolists()
            .then((res) => {
                dispatch(setTodolists({todolists: res.data}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(appActions.setAppStatus({status: 'loading'}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
        todolistsApi.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolist({todolistId}))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsApi.createTodolist(title)
            .then((res) => {
                dispatch(addTodolist({todolist: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsApi.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitle({id, title}))
            })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolist>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolist>;
export type SetTodolistsActionType = ReturnType<typeof setTodolists>;
type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof changeTodolistFilter>
    | SetTodolistsActionType
    | ReturnType<typeof changeTodolistEntityStatus>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

