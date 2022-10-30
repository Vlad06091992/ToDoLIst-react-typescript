import React from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {TaskType} from "./Todolist";
import {useState} from "react";
import {v1} from "uuid";


export type TasksArrayType = Array<TaskType>
export type FilterType = "all" | "active" | "complete"


type TodolistsType = {
    id: string
    title: string
    filter: FilterType
}
type TaskObjType = {
    [key: string]: TasksArrayType
}

function App() {
    const todolist1 = v1()
    const todolist2 = v1()

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolist1, title: "What to learn", filter: "all"},
        {id: todolist2, title: "What to buy", filter: "complete"},
    ])

    let [tasks, setTask] = useState<TaskObjType>({
        [todolist1]: [
            {id: v1(), title: "HTML&CSS", isDone: true,},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "CSS", isDone: true},
            {id: v1(), title: "VueJS", isDone: false},
            {id: v1(), title: "GraphQL", isDone: true},
            {id: v1(), title: "Angular", isDone: true},
            {id: v1(), title: "LESS", isDone: false}
        ],
        [todolist2]: [
            {id: v1(), title: "Milk", isDone: true,},
            {id: v1(), title: "Bread", isDone: true},
            {id: v1(), title: "Beer", isDone: false},
        ]
    })

    function removeTodolist(todolistId: string) {

        setTodolists(todolists.filter(el => el.id != todolistId))
        delete tasks[todolistId]
        setTask({...tasks})
    }

    function changeTaskStatus(todolistId: string, change: boolean, taskId: string) {

        let task = tasks[todolistId].find(el => el.id == taskId)
        if (task) {
            task.isDone = !task.isDone
            setTask({...tasks})
        }
    }

    function DeleteTask(todolistId: string, taskId: string) {
        tasks[todolistId] = tasks[todolistId].filter(el => taskId != el.id)
        setTask({...tasks})
    }

    function ChangeFilter(value: FilterType, taskId: string) {
        let todolist = todolists.find(el => el.id == taskId)
        if (todolist) {
            todolist.filter = value
        }
        setTodolists([...todolists])
    }

    function addTasks(title: string, taskId: string) {
        let newTask: TaskType = {id: v1(), title: title, isDone: false,}
        tasks[taskId] = [newTask, ...tasks[taskId]]
        setTask({...tasks})
    }

    return (
        <div className="App">
            {todolists.map((el: TodolistsType) => {

                let AllCurrentTask = tasks[el.id]    //массив тасок

                let tasksForTodoLists = AllCurrentTask   //массив отфильтрованных тасок

                if (el.filter == "all") {
                    tasksForTodoLists = AllCurrentTask
                }
                if (el.filter == "complete") {
                    tasksForTodoLists = AllCurrentTask.filter(el => el.isDone == true)
                }
                if (el.filter == "active") {
                    tasksForTodoLists = AllCurrentTask.filter(el => el.isDone == false)
                }

                return <Todolist
                    key={el.id}
                    id={el.id}
                    title={el.title}
                    filter={el.filter}
                    tasks={tasksForTodoLists}
                    DeleteTask={DeleteTask}
                    ChangeFilter={ChangeFilter}
                    addTasks={addTasks}
                    changeTaskStatus={changeTaskStatus}
                    removeTodolist={removeTodolist}
                />
            })}
        </div>
    );
}

export default App;
