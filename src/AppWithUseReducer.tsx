import React, {useReducer} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {TaskType} from "./Todolist";
import {useState} from "react";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
    todolistsReducer
} from "./reducers/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./reducers/task-reducer";


export type TasksArrayType = Array<TaskType>
export type FilterType = "all" | "active" | "complete"
export type TodolistType = {
    id: string
    title: string
    filter: FilterType
}

export type TodolistsType = TodolistType[]

export type TasksStateType = {
    [key: string]: TasksArrayType
}

function AppWithUseReducer() {
    const todolist1 = v1()
    const todolist2 = v1()

    let [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolist1, title: "What to learn", filter: "all"},
        {id: todolist2, title: "What to buy", filter: "all"},
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
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


    function changeTaskStatus(todolistId: string, change: boolean, taskId: string) {
        dispatchToTasks(changeTaskStatusAC(todolistId, change, taskId))
    }

    function changeTaskTitle(todolistId: string, title: string, taskId: string,) {
        dispatchToTasks(changeTaskTitleAC(todolistId, title, taskId))
    }

    function addTask(title: string, todolistId: string) {
        dispatchToTasks(addTaskAC(title, todolistId))
    }

    function removeTask(todolistId: string, taskId: string) {
        dispatchToTasks(removeTaskAC(todolistId, taskId))
    }


    function addTodolist(title: string) {
        let action = AddTodolistAC(title)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    function removeTodolist(todolistId: string) {
        let action = RemoveTodolistAC(todolistId)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    function ChangeTodolistFilter(value: FilterType, todolistId: string) {
        dispatchToTodolists(ChangeTodolistFilterAC(todolistId, value))
    }

    function changeTodolistTitle(title: string, todolistId: string) {

        dispatchToTodolists(ChangeTodolistTitleAC(title, todolistId))
    }

    const todolistComponents = todolists.map((el: TodolistType) => {
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
        return (
            <Grid item key={el.id}>
                <Paper
                    elevation={5}
                    style={{
                        padding: "10px"
                    }}>
                    <Todolist
                        changeTodolistTitle={changeTodolistTitle}
                        changeTaskTitle={changeTaskTitle}
                        key={el.id}
                        todolistId={el.id}
                        title={el.title}
                        filter={el.filter}
                        tasks={tasksForTodoLists}
                        removeTask={removeTask}
                        ChangeFilter={ChangeTodolistFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodolist={removeTodolist}

                    />
                </Paper>
            </Grid>
        )
    })


    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button variant={"outlined"} color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed={true} style={{paddingTop: "20px"}}>
                <Grid container={true}>
                    <AddItemForm placeholder="Add todolist" addItem={addTodolist}/>
                </Grid>
                <Grid container={true}
                      spacing={4}
                      style={{marginTop: "10px"}}
                >{todolistComponents}</Grid>
            </Container>
        </div>
    )
};

export default AppWithUseReducer;
