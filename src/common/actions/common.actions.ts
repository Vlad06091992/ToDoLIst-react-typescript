import {createAction} from "@reduxjs/toolkit";
import {TasksStateType} from "features/TodolistsList/tasks-reducer";
import {TodolistDomainType} from "features/TodolistsList/todolists-reducer";

export type ClearTasksAndTodolistsType = {
    task:TasksStateType,
    todolists:TodolistDomainType[]
}

export const clearTasksAndTodolists = createAction<ClearTasksAndTodolistsType>('common/clear-tasks-todolists')

// export const cleatTasksAndTodolists = createAction('common/clear-tasks-todolists',(tasks:TasksStateType,todolists:TodolistDomainType[])=>{
//     return{
//         payload:{
//             tasks,
//             todolists
//         }
//     }
// }) //With prepare action