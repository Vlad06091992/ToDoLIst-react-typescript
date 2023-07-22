import {createAction} from "@reduxjs/toolkit";
import {TasksStateType} from "features/TodolistsList/Task/tasks-reducer";
import {TodolistDomainType} from "features/TodolistsList/Todolist/todolists-reducer";

export type ClearTasksAndTodolistsType = {
    task:TasksStateType,
    todolists:TodolistDomainType[]
}

export const clearTasksAndTodolists = createAction<void>('common/clear-tasks-todolists')

// export const cleatTasksAndTodolists = createAction('common/clear-tasks-todolists',(tasks:TasksStateType,todolists:TodolistDomainType[])=>{
//     return{
//         payload:{
//             tasks,
//             todolists
//         }
//     }
// }) //With prepare action