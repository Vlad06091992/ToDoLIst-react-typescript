import React, {ChangeEvent, useState} from "react";
import {TasksArrayType} from "./App";
import {FilterType} from "./App";
import {KeyboardEvent} from "react";
import './App.css';

type TodolistProps = {
    title?: string,
    tasks: Array<TaskType>,
    DeleteTask: (id: string) => void
    ChangeFilter: (value: FilterType) => void
    addTasks: (task: string) => void
    changeTaskStatus:(id:string,change:boolean)=>void
    filter:string
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export const Todolist = (props: TodolistProps) => {
    let [title, setTitle] = useState<string>('')
    let[error, setError] = useState<string | null>(null)

    const onChangeHandler = (event: any) => {
        setTitle(event.currentTarget.value)

    }
    const addTask = () => {
if(title != ''){
    props.addTasks(title.trim())
    setTitle('')
} else {
    setError("error")
}

    }
    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (event.key === "Enter") {
            addTask()
        }
    }
    const onAllClickHandler = () => {
        props.ChangeFilter("all")
    }
    const onActiveClickHandler = () => {
        props.ChangeFilter("active")
    }
    const onCompletedClickHandler = () => {
        props.ChangeFilter("complete")
    }


    return (
        <div className="App">
            <div>
                <h3>{props.title}</h3>

                <div>
                    <input value={title}
                           onChange={onChangeHandler}
                           onKeyDown={onKeyDownHandler}
                           className={error?"error":""}
                    />
                    <button onClick={addTask}>+</button>
                    {error && <div className={error? "error-message":""}>Title is required</div>}
                </div>
                <ul>
                    {props.tasks.map((el: TaskType) => {
                        const onChangeCheckHandler = (event:ChangeEvent<HTMLInputElement>)=>{
                            let newIsDoneValue = event.currentTarget.checked
                            props.changeTaskStatus(el.id,newIsDoneValue)
                        }
                        return (
                            <li key={el.id} className={el.isDone ? "is-done" : ""}>
                                <input type="checkbox" onChange={onChangeCheckHandler} checked={el.isDone}/>
                                <span>{el.title}</span>
                                <button onClick={() => {
                                    props.DeleteTask(el.id)
                                }}>x
                                </button>
                            </li>

                        )
                    })}
                </ul>
                <div>
                    <button className={props.filter == 'all' ? "active-filter" :""} onClick={onAllClickHandler}>All</button>
                    <button className={props.filter == 'active' ? "active-filter" :""} onClick={onActiveClickHandler}>Active</button>
                    <button className={props.filter == 'complete' ? "active-filter" :""} onClick={onCompletedClickHandler}>Completed</button>
                </div>
            </div>
        </div>
    )
}