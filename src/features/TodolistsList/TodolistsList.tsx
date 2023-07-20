import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {changeTodolistFilter, FilterValuesType, todolistsThunks} from './todolists-reducer'

import {Grid, Paper} from '@mui/material'

import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {selectTasks, selectTodolists} from "features/TodolistsList/todolistList-selectors";
import {selectIsLoggedIn} from "features/auth/auth-selectors";
import {AddItemForm} from "common/components";
import {tasksThunks} from "features/TodolistsList/tasks-reducer";
import {useActions} from "hooks/useActions";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector(selectTodolists)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const {updateTask, removeTask, addTask, fetchTasks} = useActions(tasksThunks)
    const {
        changeTodolistTitle: changeTodolistTitleThunk,
        removeTodolist,
        addTodolist: AddTodolistThunk,
        fetchTodolists
    } = useActions(todolistsThunks)


    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodolists()
    }, [])

    const deleteTask = useCallback(function (id: string, todolistId: string) {
        removeTask({id, todolistId})
    }, [])

    const createTask = useCallback(function (title: string, todolistId: string) {
        addTask({title, todolistId})
    }, [])

    const changeStatus = useCallback(function (id: string, status: number, todolistId: string) {
     updateTask({taskId: id, model: {status}, todolistId})

    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        updateTask({taskId: id, model: {title: newTitle}, todolistId})
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
     changeTodolistFilter({id: todolistId, filter: value})
    }, [])

    const deleteTodolist = useCallback(function (id: string) {
        removeTodolist({todolistId: id})
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
     changeTodolistTitleThunk({id, title})
    }, [])

    const addTodolist = useCallback((title: string) => {
        AddTodolistThunk({title})
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                deleteTask={deleteTask}
                                changeFilter={changeFilter}
                                createTask={createTask}
                                changeTaskStatus={changeStatus}
                                deleteTodolist={deleteTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
