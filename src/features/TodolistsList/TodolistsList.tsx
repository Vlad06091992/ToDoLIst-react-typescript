import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {todolistsThunks} from 'features/TodolistsList/Todolist/todolists-reducer'

import {Grid, Paper} from '@mui/material'

import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {selectTasks, selectTodolists} from "features/TodolistsList/todolistList-selectors";
import {selectIsLoggedIn} from "features/auth/auth-selectors";
import {AddItemForm} from "common/components";
import {useActions} from "hooks/useActions";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector(selectTodolists)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {
        addTodolist, fetchTodolists
    } = useActions(todolistsThunks)


    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodolists()
    }, [])


    const addTodolistCallback = useCallback((title: string) => {
        addTodolist({title})
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolistCallback}/>
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
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
