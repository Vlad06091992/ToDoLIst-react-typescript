import React, {ChangeEvent, memo, useCallback} from 'react'
import {Checkbox, IconButton} from '@mui/material'
import {EditableSpan} from 'common/components/EditableSpan/EditableSpan'
import {Delete} from '@mui/icons-material'
import {TaskStatuses} from "common/enums/enums";
import {TaskType} from "features/TodolistsList/Task/tasks-api";
import {useActions} from "hooks/useActions";
import {tasksThunks} from "features/TodolistsList/Task/tasks-reducer";
import s from "./styles.module.css"

type Props = {
	task: TaskType
	todolistId: string
}
export const Task:React.FC<Props> = memo(({task,todolistId}) => {

	const{removeTask,updateTask} = useActions(tasksThunks)
	const onClickHandler = useCallback(() => removeTask({id:task.id, todolistId:todolistId}), [task.id, todolistId]);
	const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		updateTask({taskId:task.id, model:{status:e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}, todolistId})
	}, [task.id, todolistId]);

	const onTitleChangeHandler = useCallback((newValue: string) => {
		updateTask({taskId:task.id, model:{title: newValue}, todolistId})
	}, [task.id, todolistId]);

	return <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ''}>
		<Checkbox
			checked={task.status === TaskStatuses.Completed}
			color="primary"
			onChange={onChangeStatusHandler}
		/>

		<EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
		<IconButton onClick={onClickHandler}>
			<Delete/>
		</IconButton>
	</div>
})
