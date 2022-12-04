import React from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {TaskType} from "./Todolist";
import {useState} from "react";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";


export type TasksArrayType = Array<TaskType>
export type FilterType = "all" | "active" | "complete"

export type changeTaskTitleType = {
    todolistId: string
    taskId: string
    title: string
}


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
        {id: todolist2, title: "What to buy", filter: "all"},
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

    function changeTaskTitle(todolistId: string, taskId: string, title: string) {
        setTask({...tasks, [todolistId]: tasks[todolistId].map(t => t.id == taskId ? {...t, title} : t)})

    }
    function addTodolist(title: string) {
        const newTodolistId = v1()
        const newTodolist: TodolistsType = {id: newTodolistId, title: title, filter: "all"}
        setTodolists([...todolists, newTodolist])
        setTask({...tasks, [newTodolistId]: []})

    }
    function addTask(title: string, todolistId: string) {
        let newTask: TaskType = {id: v1(), title: title, isDone: false,}
        setTask({...tasks, [todolistId]:tasks[todolistId] = [newTask,...tasks[todolistId]]})
    }
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
    function removeTask(todolistId: string, taskId: string) {
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


    return (
        <div className="App">
            <div className={"header"}>
                <div>
                    <h3>Add tasks</h3>
                    <AddItemForm title={"Add Tasks"} addItem={addTodolist}/>
                </div>

            </div>


            <div className={"flex"}>

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
                        changeTaskTitle={changeTaskTitle}
                        key={el.id}
                        todolistId={el.id}
                        title={el.title}
                        filter={el.filter}
                        tasks={tasksForTodoLists}
                        removeTask={removeTask}
                        ChangeFilter={ChangeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodolist={removeTodolist}
                    />
                })}
            </div>


            </div>

    );
};

export default App;
