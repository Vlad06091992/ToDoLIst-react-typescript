import {TasksStateType, TodolistsType, TodolistType} from "../App";
import {v1} from "uuid";
import {TaskType} from "../Todolist";
import {AddTodolistAT, RemoveTodolistAT} from "./todolist-reducer";

let initialState = {
    ['todolist1']: [
        {id: v1(), title: "HTML&CSS", isDone: true,},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
        {id: v1(), title: "CSS", isDone: true},
        {id: v1(), title: "VueJS", isDone: false},
        {id: v1(), title: "GraphQL", isDone: true},
        {id: v1(), title: "Angular", isDone: true},
        {id: v1(), title: "LESS", isDone: false}
    ],
    ['todolist2']: [
        {id: v1(), title: "Milk", isDone: true,},
        {id: v1(), title: "Bread", isDone: true},
        {id: v1(), title: "Beer", isDone: false},
    ]
}

export type TasksReducerActionType = RemoveTaskAT | AddTaskAT | ChangeTaskStatusAT | ChangeTaskTitleAT | AddTodolistAT | RemoveTodolistAT
export const tasksReducer = (state: TasksStateType = initialState, action: TasksReducerActionType) => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(el => el.id !== action.taskId)}
        case "ADD-TASK":
            const newTask:TaskType = {id:v1(),isDone:false,title:action.title}
            return {...state, [action.todolistId]:[newTask,...state[action.todolistId]]}
        case "CHANGE-TASK-STATUS":
            console.log(state[action.todolistId])
            let res = {...state,[action.todolistId]: state[action.todolistId].map(el=> el.id === action.taskId ? {...el, isDone:action.status} : el)}


            return res
        case "CHANGE-TASK-TITLE":
            debugger

            return {...state,[action.todolistId]: state[action.todolistId].map(el=> el.id === action.taskId ? {...el, title:action.title} : el)}
        case "ADD-TODOLIST":
            return {...state, [action.todolistId]:[]}
        case "REMOVE-TODOLIST":
            let{[action.todolistId]:[],...rest} = {...state}
            return rest
        default:
            return state

    }
}

export const removeTaskAC = (todolistId:string, taskId:string) =>{
    return {
        type: 'REMOVE-TASK',
        taskId,
        todolistId
    } as const
}

export const addTaskAC = (title:string,todolistId:string) =>{
    return {
        type: 'ADD-TASK',
        title,
        todolistId
    } as const
}

export const changeTaskStatusAC = (todolistId:string,status:boolean, taskId:string) =>{
    return {
        type: 'CHANGE-TASK-STATUS',
        status,
        todolistId,
        taskId
    } as const
}

export const changeTaskTitleAC = (todolistId:string,title:string, taskId:string,) =>{
    return {
        type: 'CHANGE-TASK-TITLE',
        title,
        todolistId,
        taskId
    } as const
}

type RemoveTaskAT = ReturnType <typeof removeTaskAC>
type AddTaskAT = ReturnType <typeof addTaskAC>
type ChangeTaskStatusAT = ReturnType <typeof changeTaskStatusAC>
type ChangeTaskTitleAT = ReturnType <typeof changeTaskTitleAC>
