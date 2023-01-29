import React, {ChangeEvent, useState} from "react";
import {FilterType} from "./App";
import './App.css';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton, List, ListItem, Paper} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {useDispatch, useSelector} from "react-redux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./reducers/task-reducer";
import {ChangeTodolistFilterAC, ChangeTodolistTitleAC, RemoveTodolistAC} from "./reducers/todolist-reducer";
import {TasksArrayType, TasksStateType, TodolistType} from "./AppWithRedux";
import {AppRootStateType} from "./store";

type TodolistWithReduxProps = {
    todolist:TodolistType
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}


export const TodolistWithRedux = ({todolist}:TodolistWithReduxProps) => {

    let{title,id,filter} = todolist
    let task = useSelector<AppRootStateType, TasksArrayType>(state => state.tasks[id])

    if (filter == "active") task = task.filter(el => !el.isDone)
    if (filter == "complete") task = task.filter(el => el.isDone)

    let dispatch = useDispatch()

    function addTask(title: string) {
        dispatch(addTaskAC(title, id))
    }

    function changeTodolistTitle(title: string) {
        dispatch(ChangeTodolistTitleAC(title, id))
    }

    const onClickHandler = (filter:FilterType) => {
        dispatch(ChangeTodolistFilterAC(id, filter))
    }

    const removeTodoloist = () => {
        dispatch(RemoveTodolistAC(id))
    }

    const todolistElements = task.map((el: TaskType) => {

        console.log(task.length)

        const changeTaskStatus = (event: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = event.currentTarget.checked
            dispatch(changeTaskStatusAC(id, newIsDoneValue, el.id))
        }
        const changeTaskTitle = (title: string) => {
            dispatch(changeTaskTitleAC(id, title, el.id))
        }
        const removeTask = () => {
            dispatch(removeTaskAC(id, el.id))
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
                        changeTitle={changeTaskTitle}/>
                    <IconButton size={"small"} onClick={removeTask}>
                        <DeleteIcon/>
                    </IconButton>
                </div>
            </ListItem>


        )
    })

    return (
        <div>
<div className="flex">
            <EditableSpan title={title} changeTitle={changeTodolistTitle}/>
            <IconButton onClick={removeTodoloist}>
                <DeleteForeverIcon/>
            </IconButton>
</div>
            <AddItemForm
                placeholder="Add task"
                addItem={addTask}/>
            {task.length > 0 ? <List>{todolistElements}</List> : <div>This list is empty</div>}
            <div>
                <Button
                    variant={"contained"}
                    color={filter == 'all' ? "secondary" : "primary"}
                    onClick={()=>onClickHandler('all')}>All
                </Button>
                <Button style={{margin: "10px"}}
                        variant={"contained"}
                        color={filter == 'active' ? "secondary" : "primary"}
                        onClick={()=>onClickHandler('active')}>Active
                </Button>
                <Button
                    variant={"contained"}
                    color={filter == 'complete' ? "secondary" : "primary"}
                    onClick={()=>onClickHandler('complete')}>Completed
                </Button>
            </div>
        </div>
    )
}