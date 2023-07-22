import {fetchTodolists, todolistsThunks} from 'features/TodolistsList/Todolist/todolists-reducer'
import {Dispatch} from 'redux'
import {AppRootStateType} from 'app/store'
import {createSlice} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions";

import {setAppStatus} from 'app/app-reducer'
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {ResultCode} from "common/enums/enums";
import {thunkTryCatch} from "common/utils/thunkTryCatch";
import {tasksApi, TaskType, UpdateTaskModelType} from "features/TodolistsList/Task/tasks-api";

type AsyncThunkConfig = {
    state?: unknown
    dispatch?: Dispatch
    extra?: unknown
    rejectValue?: unknown
    serializedErrorType?: unknown
    pendingMeta?: unknown
    fulfilledMeta?: unknown
    rejectedMeta?: unknown
}


const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // removeTask: {
        //     reducer: (state,action:PayloadAction<{todolistId:string,taskId:string}>)=>{
        //         let index = state[action.payload.todolistId].findIndex(el=>el.id === action.payload.taskId)
        //         state[action.payload.todolistId].splice(index,1)
        //     },
        //     prepare: (taskId:string,todolistId:string) => {
        //         return { payload: { taskId, todolistId } }
        //     }}, //With prepare callback
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(el => el.id === action.payload.taskId)

                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model}
                }
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                let index = state[action.payload.todolistId].findIndex(el => el.id === action.payload.id)
                state[action.payload.todolistId].splice(index, 1)
            })

            .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                if(action.payload){
                    action.payload.todolists.forEach(tl => {
                        state[tl.id] = []
                    })
                }

            })
            .addCase(clearTasksAndTodolists, (state, action) => {
                    // console.log(current(state)) // для логирование стэйта в консоль
                    return {}
                }
            )


    }
})



const fetchTasks = createAppAsyncThunk<FetchTaskReturnType, string>('tasks/fetchTasks',  async (todolistId: string, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async ()=>{
        const res = await tasksApi.getTasks(todolistId)
        const tasks = res.data.items
        return {tasks, todolistId}
    })
})

const addTask = createAppAsyncThunk<AddTaskReturnType, AddTaskArgType>('tasks/addTask', async (arg, thunkAPI)=> {
    const {dispatch,rejectWithValue} = thunkAPI
    const {todolistId, title} = arg
    return thunkTryCatch(thunkAPI, async () => {
        let res = await tasksApi.createTask(todolistId, title)
        if (res.data.resultCode === ResultCode.success) {
            let task = res.data.data.item
            return {task}
        }  else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    })

})


const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>('tasks/removeTask', async (arg, thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI
    const {todolistId, id} = arg
    return thunkTryCatch(thunkAPI, async () => {
        let res = await tasksApi.deleteTask(todolistId, id)
        if (res.data.resultCode === ResultCode.success) {
            return {id, todolistId}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    })
})

export const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, getState, rejectWithValue} = thunkAPI
    const {taskId, model, todolistId} = arg
    return thunkTryCatch(thunkAPI,async ()=>{
        const state: AppRootStateType = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId) as UpdateTaskModelType
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')

            const e = {
                message: 'task not found in the state'
            }

            handleServerNetworkError(e, dispatch)
            return rejectWithValue(e.message)
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...model
        }

        let res = await tasksApi.updateTask(todolistId, taskId, apiModel)
        if (res.data.resultCode === ResultCode.success) {
            return {taskId, model, todolistId}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }

    })
})



// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type FetchTaskReturnType = { tasks:TaskType[],todolistId:string }
export type AddTaskReturnType = { task: TaskType }
export type AddTaskArgType = { todolistId: string, title: string }
export type RemoveTaskArgType = { todolistId: string, id: string }
export type UpdateTaskArgType = { taskId: string, model: UpdateDomainTaskModelType, todolistId: string }

export const tasksThunks = {fetchTasks, addTask, updateTask, removeTask}
export const tasksReducer = slice.reducer



