import React, {useCallback, useEffect} from 'react'
import {Task} from '../Task/Task'
import {TodolistDomainType, todolistsActions, todolistsThunks} from 'features/TodolistsList/Todolist/todolists-reducer'
import {tasksThunks} from 'features/TodolistsList/Task/tasks-reducer'
import {IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {AddItemForm, EditableSpan} from "common/components";
import {TaskStatuses} from "common/enums/enums";
import {useActions} from "hooks/useActions";
import {TaskType} from "features/TodolistsList/Task/tasks-api";
import {FilterTaskButtons} from "features/TodolistsList/Todolist/FilterTaskButtons/FilterTaskButtons";
import {Tasks} from "features/TodolistsList/Todolist/Tasks/Tasks";
import {TodolistTitle} from "features/TodolistsList/Todolist/TodolistTitle/TodolistTitle";

type Props = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist: React.FC<Props> = React.memo(function ({demo = false, todolist, tasks}) {
    const {addTask, fetchTasks} = useActions(tasksThunks)
    useEffect(() => {
        if (demo) {
            return
        }
        fetchTasks(todolist.id)
    }, [])

    const addTaskCallback = useCallback((title: string) => {
        addTask({title, todolistId: todolist.id})
    }, [addTask, todolist.id])


    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
     <TodolistTitle todolistTitle={todolist.title} todolistEntityStatus={todolist.entityStatus} todolistId={todolist.id}/>
        <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'}/>
        <Tasks tasksForTodolist={tasksForTodolist} todolistId={todolist.id}/>
        <div style={{paddingTop: '10px'}}>
            <FilterTaskButtons todolistId={todolist.id} todolistFilter={todolist.filter}/>
        </div>
    </div>
})


