import {
    addTodolist,
    AddTodolistActionType,
    removeTodolist,
    RemoveTodolistActionType,
    setTodolists,
    SetTodolistsActionType
} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType, AppThunk} from 'app/store'
import {_handleServerNetworkError, handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {createAsyncThunk, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {ClearTasksAndTodolistsType, cleatTasksAndTodolists} from "commons/actions/common.actions";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";
import { appActions } from 'app/app-reducer'

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
                debugger
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

            .addCase(addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolist, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(setTodolists, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
            .addCase(cleatTasksAndTodolists, (state, action: PayloadAction<ClearTasksAndTodolistsType>) => {
                    // console.log(current(state)) // для логирование стэйта в консоль
                    return action.payload.task
                }
            )

    }
})




const fetchTasks = createAppAsyncThunk<{tasks:TaskType[],todolistId:string},string>('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    const {dispatch,rejectWithValue} = thunkAPI

    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {tasks, todolistId}
    } catch (e:any){
        handleServerNetworkError(e,dispatch)
        return rejectWithValue(e.message)
    }


})

export const addTask = createAppAsyncThunk<{task:TaskType},AddTaskArgType>('tasks/addTask',async (arg, thunkAPI)=>{
    const{rejectWithValue,dispatch} = thunkAPI
    const{todolistId,title} = arg
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        let res = await todolistsAPI.createTask(todolistId, title)
        if (res.data.resultCode === 0) {
            let task = res.data.data.item
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {task}
        } else {
            handleServerNetworkError(res.data,dispatch)
            return rejectWithValue(null)
        }

    } catch (e){
        handleServerNetworkError(e,dispatch)
        return rejectWithValue(null)
    }
})



// export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
//     todolistsAPI.deleteTask(todolistId, taskId)
//         .then(res => {
//             const action = removeTask({taskId, todolistId})
//             // const action = removeTask(taskId, todolistId)
//             dispatch(action)
//         })
// }

export const removeTask = createAppAsyncThunk<RemoveTaskArgType,RemoveTaskArgType>('tasks/removeTask',async (arg, thunkAPI)=>{
    const{dispatch,rejectWithValue} = thunkAPI
    const{todolistId,id} = arg

 let res = await todolistsAPI.deleteTask(todolistId,id)
    if(res.data.resultCode === 0){
        return {id, todolistId}
    } else {
        handleServerNetworkError(res.data,dispatch)
        return rejectWithValue(null)
    }
})




export const updateTask = createAppAsyncThunk<UpdateTaskArgType,UpdateTaskArgType>('tasks/updateTask',async (arg, thunkAPI)=>{
    const{dispatch,getState,rejectWithValue} = thunkAPI
    const{taskId,model,todolistId} = arg
    try {
        const state: AppRootStateType = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId) as UpdateTaskModelType
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')

            const e = {
                message:'task not found in the state'
            }

            handleServerNetworkError(e,dispatch)
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

        let res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
        if(res.data.resultCode === 0){
            return {taskId, model, todolistId}
        } else {
            handleServerNetworkError(res.data,dispatch)
            return rejectWithValue(null)
        }


    } catch (e:any){
        handleServerNetworkError(e,dispatch)
        return rejectWithValue(e.message)
    }

})









// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}



export type AddTaskArgType = {todolistId:string,title:string}
export type RemoveTaskArgType = {todolistId:string,id:string}
export type UpdateTaskArgType = {taskId: string, model: UpdateDomainTaskModelType, todolistId: string}

export const tasksThunks = {fetchTasks,addTask, updateTask, removeTask}
export const tasksReducer = slice.reducer



