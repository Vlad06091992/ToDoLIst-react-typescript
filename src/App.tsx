import React from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {TaskType} from "./Todolist";
import {useState} from "react";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";


export type TasksArrayType = Array<TaskType>
export type FilterType = "all" | "active" | "complete"
export type TodolistType = {
    id: string
    title: string
    filter: FilterType
}

export type TodolistsType = TodolistType[]

type TaskObjType = {
    [key: string]: TasksArrayType
}

function App() {
    const todolist1 = v1()
    const todolist2 = v1()

    let [todolists, setTodolists] = useState<TodolistsType>([
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


    function changeTaskStatus(todolistId: string, change: boolean, taskId: string) {

        let task = tasks[todolistId].find(el => el.id == taskId)
        if (task) {
            task.isDone = !task.isDone
            setTask({...tasks})
        }
    }
    function changeTaskTitle(todolistId: string, taskId: string, title: string) {
        setTask({...tasks, [todolistId]: tasks[todolistId].map(t => t.id == taskId ? {...t, title} : t)})

    }
    function addTask(title: string, todolistId: string) {
        let newTask: TaskType = {id: v1(), title: title, isDone: false,}
        setTask({...tasks, [todolistId]: tasks[todolistId] = [newTask, ...tasks[todolistId]]})
    }
    function removeTask(todolistId: string, taskId: string) {
        tasks[todolistId] = tasks[todolistId].filter(el => taskId != el.id)
        setTask({...tasks})
    }


    function addTodolist(title: string) {
        const newTodolistId = v1()
        const newTodolist: TodolistType = {id: newTodolistId, title: title, filter: "all"}
        setTodolists([...todolists, newTodolist])
        setTask({...tasks, [newTodolistId]: []})

    }
    function removeTodolist(todolistId: string) {
        setTodolists(todolists.filter(el => el.id != todolistId))
        delete tasks[todolistId]
        setTask({...tasks})
    }
    function ChangeTodolistFilter(value: FilterType, todolistId: string) {
        let todolist = todolists.find(el => el.id == todolistId)
        if (todolist) {
            todolist.filter = value
        }
        setTodolists([...todolists])
    }
    function changeTodolistTitle(title:string,todolistId:string){
        setTodolists(todolists.map(el => el.id === todolistId ? {...el, title:title}: el))
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

export default App;
