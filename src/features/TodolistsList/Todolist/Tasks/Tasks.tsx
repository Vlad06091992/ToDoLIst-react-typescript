import {Task} from "features/TodolistsList/Task/Task";
import React, {FC} from "react";
import {TaskType} from "features/TodolistsList/Task/tasks-api";

type Props = {
    tasksForTodolist: Array<TaskType>
    todolistId: string
}

export const Tasks: FC<Props> = ({tasksForTodolist, todolistId}) => {
    return (
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolistId}/>)
            }
        </div>
    )
}