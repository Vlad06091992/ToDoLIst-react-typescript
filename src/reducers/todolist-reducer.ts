import {FilterType, TodolistsType, TodolistType} from "../App";
import {v1} from "uuid";

const REMOVE_TODOLIST = 'REMOVE-TODOLIST'
const ADD_TODOLIST = 'ADD-TODOLIST'
const CHANGE_TODOLIST_FILTER = 'CHANGE-TODOLIST-FILTER'
const CHANGE_TODOLIST_TITLE = 'CHANGE-TODOLIST-TITLE'

export type RemoveTodolistAT = {
    type: typeof REMOVE_TODOLIST,
    todolistId: string
}

export type AddTodolistAT = {
    type: typeof ADD_TODOLIST,
    title: string
    todolistId: string
}

type ChangeTodolistFilterAT = {
    type: typeof CHANGE_TODOLIST_FILTER,
    filter: FilterType
    todolistId: string
}

type ChangeTodolistTitleAT = {
    type: typeof CHANGE_TODOLIST_TITLE,
    title: string
    todolistId: string
}

export type TodolistReducerActionType =
    ChangeTodolistTitleAT
    | RemoveTodolistAT
    | AddTodolistAT
    | ChangeTodolistFilterAT

let initialState:TodolistsType = [
    {id: 'todolist1', title: "What to learn", filter: "active"},
    {id: 'todolist2', title: "What to buy", filter: "all"},
]

export const todolistsReducer = (todolists: TodolistsType = initialState, action: TodolistReducerActionType): TodolistsType => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(el => el.id != action.todolistId)
        case "ADD-TODOLIST":
            const newTodolist: TodolistType = {id: action.todolistId, filter: "all", title: action.title}
            return [...todolists, newTodolist]
        case "CHANGE-TODOLIST-FILTER":
            return todolists.map(el => el.id === action.todolistId ? {...el, filter: action.filter} : el)
        case "CHANGE-TODOLIST-TITLE":
            return todolists.map(el => el.id === action.todolistId ? {...el, title: action.title} : el)
        default:
            return todolists

    }
}

export const RemoveTodolistAC = (todolistId: string): RemoveTodolistAT => {
    return {
        type: REMOVE_TODOLIST,
        todolistId: todolistId
    }
}

export const AddTodolistAC = (title: string): AddTodolistAT => {
    return {
        type: ADD_TODOLIST,
        title,
        todolistId: v1()
    }
}

export const ChangeTodolistTitleAC = (title: string, todolistId: string):ChangeTodolistTitleAT => {
    return {
        type: CHANGE_TODOLIST_TITLE,
        todolistId,
        title,
    }
}

export const ChangeTodolistFilterAC = (todolistId: string, filter: FilterType): ChangeTodolistFilterAT => {
    return {
        type: CHANGE_TODOLIST_FILTER,
        todolistId,
        filter
    }
}