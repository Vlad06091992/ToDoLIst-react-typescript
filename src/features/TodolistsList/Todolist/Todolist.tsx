import React, {useCallback, useEffect} from 'react'
import {Task} from '../Task/Task'
import {
    FilterValuesType,
    TodolistDomainType, todolistsActions, todolistsThunks
} from 'features/TodolistsList/Todolist/todolists-reducer'
import {tasksThunks} from 'features/TodolistsList/Task/tasks-reducer'
import {useAppDispatch} from 'hooks/useAppDispatch';
import {Button, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {AddItemForm, EditableSpan} from "common/components";
import {TaskStatuses} from "common/enums/enums";
import {useActions} from "hooks/useActions";
import {authThunks} from "features/auth/auth-reducer";
import {TaskType} from "features/TodolistsList/Task/tasks-api";

type Props = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist:React.FC<Props> = React.memo(function ({demo = false, todolist,tasks}) {
    const {addTask, fetchTasks} = useActions(tasksThunks)
    const {changeTodolistTitle, removeTodolist} = useActions(todolistsThunks)
    const {changeTodolistFilter} = useActions(todolistsActions)
    useEffect(() => {
        if (demo) {
            return
        }
        fetchTasks(todolist.id)
    }, [])


    const changeFilterCallback = useCallback(function (value: FilterValuesType, todolistId: string) {
        changeTodolistFilter({id: todolistId, filter: value})
    }, [])

    const removeTodolistCallback = useCallback(function () {
        removeTodolist({todolistId: todolist.id})
    }, [])

    const changeTodolistTitleCallback = useCallback(function (title: string) {
        changeTodolistTitle({id: todolist.id, title})
    }, [])

    const addTaskCallback = useCallback((title: string) => {
        addTask({title, todolistId: todolist.id})
    }, [addTask, todolist.id])


    const onAllClickHandler = useCallback(() => changeFilterCallback('all', todolist.id), [todolist.id])
    const onActiveClickHandler = useCallback(() => changeFilterCallback('active', todolist.id), [todolist.id])
    const onCompletedClickHandler = useCallback(() => changeFilterCallback('completed', todolist.id), [todolist.id])


    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitleCallback}/>
            <IconButton onClick={removeTodolistCallback} disabled={todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}/>)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


