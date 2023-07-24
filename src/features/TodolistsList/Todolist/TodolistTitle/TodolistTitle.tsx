import {EditableSpan} from "common/components";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import React, {FC, useCallback} from "react";
import {useActions} from "hooks/useActions";
import {todolistsThunks} from "features/TodolistsList/Todolist/todolists-reducer";

type Props = {
    todolistTitle:string
    todolistEntityStatus:string
    todolistId:string
}

export const TodolistTitle:FC<Props> = ({todolistTitle,todolistId,todolistEntityStatus}) => {

    const {changeTodolistTitle, removeTodolist} = useActions(todolistsThunks)

    const removeTodolistCallback = useCallback(function () {
        removeTodolist({todolistId})
    }, [])

    const changeTodolistTitleCallback = useCallback(function (title: string) {
        changeTodolistTitle({id: todolistId, title})
    }, [])


    return  <h3><EditableSpan value={todolistTitle} onChange={changeTodolistTitleCallback}/>
        <IconButton onClick={removeTodolistCallback} disabled={todolistEntityStatus === 'loading'}>
            <Delete/>
        </IconButton>
    </h3>
}