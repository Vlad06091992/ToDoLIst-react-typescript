import React, {useState} from "react";
import {TasksArrayType} from "./App";
import {FilterType} from "./App";
import {KeyboardEvent} from "react";

type TodolistProps = {
    title?: string,
    tasks: Array<TaskType>,
    DeleteTask: (id: string) => void
    ChangeFilter: (value: FilterType) => void
    addTasks: (task: string) => void
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export const Todolist = (props: TodolistProps) => {
    let [title, setTitle] = useState<string>('')

    const onChangeHandler = (event: any) => {
        setTitle(event.currentTarget.value)
    }
    const addTask = () => {
        props.addTasks(title)
        setTitle('')
    }
    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
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
                    />
                    <button onClick={addTask}>+</button>
                </div>
                <ul>
                    {props.tasks.map((el: TaskType) => {
                        return (
                            <li key={el.id}>
                                <input type="checkbox" defaultChecked={el.isDone}/>
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
                    <button onClick={onAllClickHandler}>All</button>
                    <button onClick={onActiveClickHandler}>Active</button>
                    <button onClick={onCompletedClickHandler}>Completed</button>
                </div>
            </div>
        </div>
    )
}