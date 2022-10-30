import React, {ChangeEvent, useState} from "react";
import {TasksArrayType} from "./App";
import {FilterType} from "./App";
import {KeyboardEvent} from "react";
import './App.css';

type TodolistProps = {
    removeTodolist: (todolistId: string) => void
    id: string
    title: string,
    tasks: Array<TaskType>,
    DeleteTask: (todolistId: string, taskId: string) => void
    ChangeFilter: (value: FilterType, taskId: string) => void
    addTasks: (task: string, taskId: string) => void
    changeTaskStatus: (todolistId: string, change: boolean, taskId: string) => void
    filter: FilterType
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export const Todolist = (props: TodolistProps) => {
    let [title, setTitle] = useState<string>('')
    let [error, setError] = useState<string | null>(null)

    const onChangeHandler = (event: any) => {
        setTitle(event.currentTarget.value)
    }
    const addTask = () => {
        if (title.trim() != '') {
            props.addTasks(title.trim(), props.id)
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
        props.ChangeFilter("all", props.id)
    }
    const onActiveClickHandler = () => {
        props.ChangeFilter("active", props.id)
    }
    const onCompletedClickHandler = () => {
        props.ChangeFilter("complete", props.id)
    }


    return (
        <div className="App">
            <div>
                <h3>{props.title}</h3>
                <button onClick={() => props.removeTodolist(props.id)}>x</button>

                <div>
                    <input value={title}
                           onChange={onChangeHandler}
                           onKeyDown={onKeyDownHandler}
                           className={error ? "error" : ""}
                    />
                    <button onClick={addTask}>+</button>
                    {error && <div className={error ? "error-message" : ""}>Title is required</div>}
                </div>
                <ul>
                    {props.tasks.map((el: TaskType) => {
                        const onChangeCheckHandler = (event: ChangeEvent<HTMLInputElement>) => {
                            let newIsDoneValue = event.currentTarget.checked
                            props.changeTaskStatus(props.id, newIsDoneValue, el.id)
                        }
                        return (
                            <li key={el.id} className={el.isDone ? "is-done" : ""}>
                                <input type="checkbox" onChange={onChangeCheckHandler} checked={el.isDone}/>
                                <span>{el.title}</span>
                                <button onClick={() => {
                                    props.DeleteTask(props.id, el.id)
                                }}>x
                                </button>
                            </li>

                        )
                    })}
                </ul>
                <div>
                    <button className={props.filter == 'all' ? "active-filter" : ""} onClick={onAllClickHandler}>All
                    </button>
                    <button className={props.filter == 'active' ? "active-filter" : ""}
                            onClick={onActiveClickHandler}>Active
                    </button>
                    <button className={props.filter == 'complete' ? "active-filter" : ""}
                            onClick={onCompletedClickHandler}>Completed
                    </button>
                </div>
            </div>
        </div>
    )
}