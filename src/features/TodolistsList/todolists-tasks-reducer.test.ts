import {TodolistDomainType, todolistsReducer, todolistsThunks} from 'features/TodolistsList/Todolist/todolists-reducer'
import {tasksReducer, TasksStateType} from 'features/TodolistsList/Task/tasks-reducer'
import {TodolistType} from "features/TodolistsList/Todolist/todolists-api";


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    let todolist: TodolistType = {
        title: 'new todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    }

    const action = todolistsThunks.addTodolist.fulfilled({todolist},"",{title:"new todolist"},"");

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
