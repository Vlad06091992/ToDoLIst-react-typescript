import {v1} from "uuid";
import {TodolistsType} from "../App";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC, ChangeTodolistTitleAC,
    RemoveTodolistAC,
    TodolistReducerActionType,
    todolistsReducer
} from "./todolist-reducer";

let todolist1: string
let todolist2: string
let todolists: TodolistsType

beforeEach(() => {
    todolist1 = v1()
    todolist2 = v1()
    todolists = [
        {id: todolist1, title: "What to learn", filter: "all"},
        {id: todolist2, title: "What to buy", filter: "all"},
    ]
});


test("correct todolist should be removed", () => {
    let action: TodolistReducerActionType = RemoveTodolistAC(todolist1)
    let endState = todolistsReducer(todolists, action)
    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolist2)
    expect(endState[0].filter).toBe('all')
})

test("correct todolist should be added", () => {
    let action: TodolistReducerActionType = AddTodolistAC("New todolist!")
    let endState = todolistsReducer(todolists, action)
    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe('New todolist!')
    expect(endState[2].filter).toBe('all')
})

test("todolist filter should be changed", () => {
    let action = ChangeTodolistFilterAC(todolist1,"active")
    let endState = todolistsReducer(todolists, action)
    expect(endState.length).toBe(2)
    expect(endState[0].filter).toBe('active')
    expect(endState[1].filter).toBe('all')
})

test("todolist title should be changed", () => {
    let action = ChangeTodolistTitleAC(todolist2,'renamed todolist')
    let endState = todolistsReducer(todolists, action)
    expect(endState.length).toBe(2)
    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe('renamed todolist')
})

