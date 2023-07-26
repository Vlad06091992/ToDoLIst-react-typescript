import {instance} from "common/api";
import {ResponseType} from "common/types"


export const todolistsApi = {
    getTodolists() {
        return  instance.get<TodolistType[]>('todo-listsddd');
        },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title});
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`);
    },
    updateTodolist(id: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${id}`, {title});
    },

}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}



