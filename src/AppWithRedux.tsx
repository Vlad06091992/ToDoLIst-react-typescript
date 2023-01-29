import React from 'react';
import './App.css';

import {TaskType} from "./Todolist";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {AddTodolistAC,} from "./reducers/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {TodolistWithRedux} from "./TodolistWithRedux";


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

function AppWithRedux() {
    let todolists = useSelector<AppRootStateType, TodolistsType>(state => state.todolists)
    let dispatch = useDispatch()

    function addTodolist(title: string) {
        let action = AddTodolistAC(title)
        dispatch(action)
    }

    const todolistComponents = todolists.map((tl: TodolistType) => {

        return (
            <Grid item key={tl.id}>
                <Paper
                    elevation={5}
                    style={{
                        padding: "10px"
                    }}>
                    <TodolistWithRedux
                       todolist={tl}

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

export default AppWithRedux;
