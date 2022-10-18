import React from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {TaskType} from "./Todolist";
import {useState} from "react";
import {SetStateAction} from "react";
import {v1} from "uuid";

type SetStateSection = () => void
export type TasksArrayType = Array<TaskType>
export type FilterType = "all" | "active" | "complete"


function App() {
    const title1 = "What to learn 1111"
    const title2 = "What to learn 2222"

    let [tasks, setTask] = useState([
        {id: v1(), title: "HTML&CSS", isDone: true,},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
        {id: v1(), title: "CSS", isDone: true},
        {id: v1(), title: "VueJS", isDone: false},
        {id: v1(), title: "GraphQL", isDone: true},
        {id: v1(), title: "Angular", isDone: true},
        {id: v1(), title: "LESS", isDone: false}
    ])

    function DeleteTask(id: string) {
        setTask(tasks = tasks.filter(el => id != el.id))
    }

    let [filter, setFilter] = useState("all")

    if (filter == "all") {
        tasks = tasks
    }

    if (filter == "complete") {
        tasks = tasks.filter(el => el.isDone == true)
    }

    if (filter == "active") {
        tasks = tasks.filter(el => el.isDone == false)
    }


    function ChangeFilter(value: FilterType) {
        setFilter(value)
    }

    function addTasks(title: string) {
        let newTask: TaskType = {id: v1(), title: title, isDone: false,}
        setTask([newTask, ...tasks])
        console.log(1)
    }

    return (
        <div className="App">
            <Todolist addTasks={addTasks} ChangeFilter={ChangeFilter} DeleteTask={DeleteTask} title={title1}
                      tasks={tasks}/>
        </div>
    );
}

export default App;
