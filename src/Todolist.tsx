import React, {ChangeEvent, useState} from "react";
import {TasksArrayType} from "./App";
import {FilterType} from "./App";
import {KeyboardEvent} from "react";
import './App.css';
import {AddItemForm} from "./AddItemForm";
import {v1} from "uuid";
import {EditableSpan} from "./EditableSpan";

type TodolistProps = {
    removeTodolist: (todolistId: string) => void
    todolistId: string
    title: string,
    tasks: Array<TaskType>,
    removeTask: (todolistId: string, taskId: string) => void
    ChangeFilter: (value: FilterType, taskId: string) => void
    addTask: (task: string, taskId: string) => void
    changeTaskStatus: (todolistId: string, change: boolean, taskId: string) => void
    changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
    filter: FilterType
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}


export const Todolist = (props: TodolistProps) => {
    function addTask(title: string) {
        props.addTask(title, props.todolistId)
    }

    const onAllClickHandler = () => {
        props.ChangeFilter("all", props.todolistId)
    }
    const onActiveClickHandler = () => {
        props.ChangeFilter("active", props.todolistId)
    }
    const onCompletedClickHandler = () => {
        props.ChangeFilter("complete", props.todolistId)
    }

    const todolistElements = props.tasks.map((el: TaskType) => {
        const changeTaskStatus = (event: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = event.currentTarget.checked
            props.changeTaskStatus(props.todolistId, newIsDoneValue, el.id)
        }
        const changeTaskTitle = (title: string) => {
            props.changeTaskTitle(props.todolistId, el.id, title)
        }
        const removeTask = () =>{
            props.removeTask(props.todolistId,el.id)
        }
        return (
            <li key={el.id} className={el.isDone ? "is-done" : ""}>
                <div className={"flex"}>
                    <input type="checkbox" onChange={changeTaskStatus} checked={el.isDone}/>
                    <EditableSpan
                        title={el.title}
                        changeTaskTitle={changeTaskTitle}/>
                    <button onClick={() => {
                        removeTask()
                    }}>x
                    </button>
                </div>
            </li>

        )
    })

    return (
        <div className="App">
            <div>
                <h3>
                    {props.title}
                    <button onClick={() => props.removeTodolist(props.todolistId)}>x</button>
                </h3>
                <AddItemForm title={props.title}
                             addItem={addTask}/>

                {props.tasks.length > 0 ? <ul>{todolistElements}</ul> : <div>This list is empty</div>}
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