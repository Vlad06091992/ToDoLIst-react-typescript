import { RequestStatusType, setAppStatus } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists, ClearTasksAndTodolistsType } from "common/actions/common.actions";
import { todolistsApi, TodolistType } from "features/TodolistsList/Todolist/todolists-api";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { ResultCode } from "common/enums/enums";
import { thunkTryCatch } from "common/utils/thunkTryCatch";

const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
  name: "todolists",
  initialState,
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<ChangeTodolistFilterType>) {
      let todolist = state.find((td: TodolistType) => td.id === action.payload.id);
      if (todolist) {
        todolist.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus(state, action: PayloadAction<ChangeTodolistEntityStatus>) {
      let todolist = state.find((td: TodolistType) => td.id === action.payload.todolistId);
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeTodolistTitle.fulfilled, (state, action: PayloadAction<ChangeTodolistTitleType>) => {
        let todolist = state.find((td: TodolistType) => td.id === action.payload.id);
        if (todolist) {
          todolist.title = action.payload.title;
        }
      })

      .addCase(addTodolist.fulfilled, (state, action: PayloadAction<AddTodolistReturnType>) => {
        state.unshift({
          ...action.payload.todolist,
          filter: "all",
          entityStatus: "idle",
        });
      })
      .addCase(removeTodolist.fulfilled, (state, action: PayloadAction<{ todolistId: string }>) => {
        let index = state.findIndex((el) => el.id === action.payload.todolistId);
        if (index > -1) {
          state.splice(index, 1);
        }
      })
      .addCase(fetchTodolists.fulfilled, (state, action: PayloadAction<FetchTodolistsReturnType>) => {
        return action.payload.todolists.map((el) => ({
          ...el,
          filter: "all",
          entityStatus: "idle",
        }));
      })
      .addCase(clearTasksAndTodolists, (state, action) => {
        return [];
      });
  },
});

export const fetchTodolists = createAppAsyncThunk<FetchTodolistsReturnType, FetchTodolistsArgType>(
  "todolists/fetchTodolsits",
  async (arg, thunkAPI) => {
    let res = await todolistsApi.getTodolists();
    return { todolists: res.data };
  }
);

export const removeTodolist = createAppAsyncThunk<RemoveTodolistType, RemoveTodolistType>(
  "todolists/removeTodolist",
  async ({ todolistId }, thunkAPI) => {
    let { dispatch, rejectWithValue } = thunkAPI;
    dispatch(
      todolistsActions.changeTodolistEntityStatus({
        todolistId,
        entityStatus: "loading",
      })
    );
    let res = await todolistsApi.deleteTodolist(todolistId);
    if (res.data.resultCode === ResultCode.success) {
      return { todolistId };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true });
    }
  }
);

const addTodolist = createAppAsyncThunk<AddTodolistReturnType, AddTodolistArgType>(
  "todolists/addTodolist",
  async (arg, { dispatch, rejectWithValue }) => {
    const res = await todolistsApi.createTodolist(arg.title);
    if (res.data.resultCode === ResultCode.success) {
      return { todolist: res.data.data.item };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: false });
    }
  }
);

const changeTodolistTitle = createAppAsyncThunk<ChangeTodolistTitleType, ChangeTodolistTitleType>(
  "todolists/changeTodolists",
  async (arg, { dispatch, rejectWithValue }) => {
    const { id, title } = arg;
    let res = await todolistsApi.updateTodolist(arg.id, arg.title);
    if (res.data.resultCode === ResultCode.success) {
      return { id, title };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true });
    }
  }
);

export type FetchTodolistsArgType = void;
export type FetchTodolistsReturnType = { todolists: Array<TodolistType> };
export type RemoveTodolistType = { todolistId: string };
export type AddTodolistArgType = { title: string };
export type AddTodolistReturnType = { todolist: TodolistType };
export type ChangeTodolistTitleType = { title: string; id: string };
export type ChangeTodolistFilterType = { filter: FilterValuesType; id: string };
export type ChangeTodolistEntityStatus = {
  entityStatus: RequestStatusType;
  todolistId: string;
};

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const todolistsActions = slice.actions;
export const todolistsReducer = slice.reducer;
export const todolistsThunks = {
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
  fetchTodolists,
};
