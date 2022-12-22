import {FilterType, TodolistsType, TodolistType} from "../App";
import {v1} from "uuid";

const REMOVE_TODOLIST = 'REMOVE-TODOLIST'
const ADD_TODOLIST = 'ADD-TODOLIST'
const CHANGE_TODOLIST_FILTER = 'CHANGE-TODOLIST-FILTER'
const CHANGE_TODOLIST_TITLE = 'CHANGE-TODOLIST-TITLE'

type RemoveTodolistAT = {
    type: typeof REMOVE_TODOLIST,
    todolistId: string
}

type AddTodolistAT = {
    type: typeof ADD_TODOLIST,
    title: string
}

type ChangeTodolistFilterAT = {
    type:typeof CHANGE_TODOLIST_FILTER,
    filter:FilterType
    todolistId:string
}

type ChangeTodolistTitleAT = {
    type:typeof CHANGE_TODOLIST_TITLE,
    title:string
    todolistId:string
}

export type TodolistReducerActionType = ChangeTodolistTitleAT | RemoveTodolistAT | AddTodolistAT | ChangeTodolistFilterAT

export const todolistsReducer = (todolists: TodolistsType, action: TodolistReducerActionType) => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(el => el.id != action.todolistId)
        case "ADD-TODOLIST":
            const newTodolist: TodolistType = {id: v1(), filter: "all", title: action.title}
            return [...todolists, newTodolist]
        case "CHANGE-TODOLIST-FILTER":
            return todolists.map(el => el.id === action.todolistId ? {...el,filter:action.filter} : el)
        case "CHANGE-TODOLIST-TITLE":
            return todolists.map(el => el.id === action.todolistId ? {...el,title:action.title} : el)
        default:
            return todolists

    }
}

export const RemoveTodolistAC = (todolistId:string):RemoveTodolistAT => {
    return {
        type:REMOVE_TODOLIST,
        todolistId:todolistId
    }
}

export const AddTodolistAC = (title:string):AddTodolistAT => {
    return {
        type:ADD_TODOLIST,
        title
    }
}

export const ChangeTodolistTitleAC = (todolistId:string,title:string):ChangeTodolistTitleAT => {
    return {
        type:CHANGE_TODOLIST_TITLE,
        todolistId,
        title,
    }
}

export const ChangeTodolistFilterAC = (todolistId:string,filter:FilterType):ChangeTodolistFilterAT => {
    return {
        type:CHANGE_TODOLIST_FILTER,
        todolistId,
        filter
    }
}