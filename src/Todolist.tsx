import React, {ChangeEvent, useState} from "react";
import {FilterType} from "./App";
import './App.css';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton, List, ListItem, Paper} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

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

    const removeTodoloist = () => {
        props.removeTodolist(props.todolistId)
    }

    const todolistElements = props.tasks.map((el: TaskType) => {
        const changeTaskStatus = (event: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = event.currentTarget.checked
            props.changeTaskStatus(props.todolistId, newIsDoneValue, el.id)
        }
        const changeTaskTitle = (title: string) => {
            props.changeTaskTitle(props.todolistId, el.id, title)
        }
        const removeTask = () => {
            props.removeTask(props.todolistId, el.id)
        }
        return (

                <ListItem style={{padding: "0"}}
                          key={el.id}
                          className={el.isDone ? "is-done" : ""}>
                    <div className={"flex"}>
                        <Checkbox
                            color={"primary"}
                            checked={el.isDone}
                            onChange={changeTaskStatus}
                        />
                        <EditableSpan
                            title={el.title}
                            changeTaskTitle={changeTaskTitle}/>
                        <IconButton size={"small"} onClick={removeTask}>
                            <DeleteIcon/>
                        </IconButton>
                    </div>
                </ListItem>



    )
    })

    return (
        <div>
            <h3>
                {props.title}
                <IconButton onClick={removeTodoloist}>
                    <DeleteForeverIcon/>
                </IconButton>
            </h3>
            <AddItemForm
                placeholder="Add task"
                addItem={addTask}/>
            {props.tasks.length > 0 ? <List>{todolistElements}</List> : <div>This list is empty</div>}
            <div>
                <Button
                    variant={"contained"}
                    color={props.filter == 'all' ? "secondary" : "primary"}
                    onClick={onAllClickHandler}>All
                </Button>
                <Button style={{margin: "10px"}}
                        variant={"contained"}
                        color={props.filter == 'active' ? "secondary" : "primary"}
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button
                    variant={"contained"}
                    color={props.filter == 'complete' ? "secondary" : "primary"}
                    onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    )
}