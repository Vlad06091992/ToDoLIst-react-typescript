import {Button} from "@mui/material";
import React, {useCallback} from "react";
import {FilterValuesType, todolistsActions} from "features/TodolistsList/Todolist/todolists-reducer";
import {useActions} from "hooks/useActions";

type Props = {
    todolistId: string
    todolistFilter: FilterValuesType
}

export const FilterTaskButtons: React.FC<Props> = ({todolistId, todolistFilter}) => {
    const {changeTodolistFilter} = useActions(todolistsActions)
    const changeFilterTaskHandler = useCallback((value: FilterValuesType) => {
        changeTodolistFilter({id: todolistId, filter: value})
    }, [])

    return (
        <div>
            <Button variant={todolistFilter === 'all' ? 'outlined' : 'text'}
                    onClick={() => changeFilterTaskHandler("all")}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={todolistFilter === 'active' ? 'outlined' : 'text'}
                    onClick={() => changeFilterTaskHandler("active")}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolistFilter === 'completed' ? 'outlined' : 'text'}
                    onClick={() => changeFilterTaskHandler("completed")}
                    color={'secondary'}>Completed
            </Button>
        </div>
    )
}