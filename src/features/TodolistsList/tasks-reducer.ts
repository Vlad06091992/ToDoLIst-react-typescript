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
import {setAppStatus} from 'app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

const slice = createSlice({
    name:'tasks',
    initialState,
    reducers:{
        addTaskAC(state,action:PayloadAction<{task:TaskType}>){
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        removeTaskAC(state,action:PayloadAction<{todolistId:string,taskId:string}>){
            let index = state[action.payload.todolistId].findIndex(el=>el.id === action.payload.taskId)
            state[action.payload.todolistId].splice(index,1)
        },

        updateTaskAC(state,action:PayloadAction<{taskId: string, model: UpdateDomainTaskModelType, todolistId: string}>){
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el=>el.id === action.payload.taskId)

            if(index > - 1){
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
            },
        setTasksAC(state,action:PayloadAction<{tasks: Array<TaskType>, todolistId: string}>){
            state[action.payload.todolistId] = action.payload.tasks
        },
    },
    extraReducers:builder => {
        builder
            .addCase(addTodolist,(state,action)=>{
                state[action.payload.todolist.id]= []
            })
            .addCase(removeTodolist,(state,action)=>{
                delete state[action.payload.todolistId]
            })
            .addCase(setTodolists,(state,action)=>{
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })

    }
})

export const tasksReducer = slice.reducer
export const{removeTaskAC,setTasksAC,updateTaskAC,addTaskAC} = slice.actions
// export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
//     switch (action.type) {
//         case 'REMOVE-TASK':
//             return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id != action.taskId)}
//         case 'ADD-TASK':
//             return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
//         case 'UPDATE-TASK':
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId]
//                     .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
//             }
//         case 'todolists/addTodolistAC':
//             return {...state, [action.payload.todolist.id]: []}
//         case 'todolists/removeTodolistAC':
//             const copyState = {...state}
//             delete copyState[action.payload.todolistId]
//             return copyState
//         case 'todolists/setTodolistsAC': {
//             const copyState = {...state}
//             action.payload.todolists.forEach(tl => {
//                 copyState[tl.id] = []
//             })
//             return copyState
//         }
//         case 'SET-TASKS':
//             return {...state, [action.todolistId]: action.tasks}
//         default:
//             return state
//     }
// }
//
// // actions
// export const removeTaskAC = (taskId: string, todolistId: string) =>
//     ({type: 'REMOVE-TASK', taskId, todolistId} as const)
// export const addTaskAC = (task: TaskType) =>
//     ({type: 'ADD-TASK', task} as const)
// export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
//     ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
// export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
//     ({type: 'SET-TASKS', tasks, todolistId} as const)

// thunks
export const fetchTasksTC = (todolistId: string):AppThunk => (dispatch) => {
    dispatch(setAppStatus({status:'loading'}))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasksAC({tasks, todolistId}))
            dispatch(setAppStatus({status:'succeeded'}))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            const action = removeTaskAC({taskId, todolistId})
            dispatch(action)
        })
}
export const addTaskTC = (title: string, todolistId: string):AppThunk => (dispatch) => {
    dispatch(setAppStatus({status:'loading'}))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = addTaskAC({task})
                dispatch(action)
                dispatch(setAppStatus({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTaskTC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string):AppThunk =>
    (dispatch, getState: () => AppRootStateType) => {
        const state:AppRootStateType = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId) as UpdateTaskModelType
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
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

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTaskAC({taskId, model, todolistId})
                    dispatch(action)
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
    }

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
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
// type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>


// import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer'
// import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
// import {Dispatch} from 'redux'
// import {AppRootStateType, AppThunk} from '../../app/store'
// import {setAppErrorAC, setAppStatusAC} from '../../app/app-reducer'
// import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
// import {ThunkDispatch} from "redux-thunk";
//
// const initialState: TasksStateType = {}
//
// export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
//     switch (action.type) {
//         case 'REMOVE-TASK':
//             return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id != action.taskId)}
//         case 'ADD-TASK':
//             return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
//         case 'UPDATE-TASK':
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId]
//                     .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
//             }
//         case 'ADD-TODOLIST':
//             return {...state, [action.todolist.id]: []}
//         case 'REMOVE-TODOLIST':
//             const copyState = {...state}
//             delete copyState[action.id]
//             return copyState
//         case 'SET-TODOLISTS': {
//             const copyState = {...state}
//             action.todolists.forEach(tl => {
//                 copyState[tl.id] = []
//             })
//             return copyState
//         }
//         case 'SET-TASKS':
//             return {...state, [action.todolistId]: action.tasks}
//         default:
//             return state
//     }
// }
//
// // actions
// export const removeTaskAC = (taskId: string, todolistId: string) =>
//     ({type: 'REMOVE-TASK', taskId, todolistId} as const)
// export const addTaskAC = (task: TaskType) =>
//     ({type: 'ADD-TASK', task} as const)
// export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
//     ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
// export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
//     ({type: 'SET-TASKS', tasks, todolistId} as const)
//
// // thunks
// export const fetchTasksTC = (todolistId: string):AppThunk => (dispatch) => {
//     dispatch(setAppStatusAC({status:'loading'}))
//     todolistsAPI.getTasks(todolistId)
//         .then((res) => {
//             const tasks = res.data.items
//             dispatch(setTasksAC(tasks, todolistId))
//             dispatch(setAppStatusAC({status:'succeeded'}))
//         })
// }
// export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
//     todolistsAPI.deleteTask(todolistId, taskId)
//         .then(res => {
//             const action = removeTaskAC(taskId, todolistId)
//             dispatch(action)
//         })
// }
// export const addTaskTC = (title: string, todolistId: string):AppThunk => (dispatch) => {
//     dispatch(setAppStatusAC({status:'loading'}))
//     todolistsAPI.createTask(todolistId, title)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 const task = res.data.data.item
//                 const action = addTaskAC(task)
//                 dispatch(action)
//                 dispatch(setAppStatusAC({status:'succeeded'}))
//             } else {
//                 handleServerAppError(res.data, dispatch);
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
// }
// export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string):AppThunk =>
//     (dispatch, getState: () => AppRootStateType) => {
//         const state = getState()
//         const task = state.tasks[todolistId].find(t => t.id === taskId)
//         if (!task) {
//             //throw new Error("task not found in the state");
//             console.warn('task not found in the state')
//             return
//         }
//
//         const apiModel: UpdateTaskModelType = {
//             deadline: task.deadline,
//             description: task.description,
//             priority: task.priority,
//             startDate: task.startDate,
//             title: task.title,
//             status: task.status,
//             ...domainModel
//         }
//
//         todolistsAPI.updateTask(todolistId, taskId, apiModel)
//             .then(res => {
//                 if (res.data.resultCode === 0) {
//                     const action = updateTaskAC(taskId, domainModel, todolistId)
//                     dispatch(action)
//                 } else {
//                     handleServerAppError(res.data, dispatch);
//                 }
//             })
//             .catch((error) => {
//                 handleServerNetworkError(error, dispatch);
//             })
//     }
//
// // types
// export type UpdateDomainTaskModelType = {
//     title?: string
//     description?: string
//     status?: TaskStatuses
//     priority?: TaskPriorities
//     startDate?: string
//     deadline?: string
// }
// export type TasksStateType = {
//     [key: string]: Array<TaskType>
// }
// type ActionsType =
//     | ReturnType<typeof removeTaskAC>
//     | ReturnType<typeof addTaskAC>
//     | ReturnType<typeof updateTaskAC>
//     | AddTodolistActionType
//     | RemoveTodolistActionType
//     | SetTodolistsActionType
//     | ReturnType<typeof setTasksAC>
// // type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>
