import { authAPI, todolistsAPI, TodolistType } from "../../api/todolists-api";
import { Dispatch } from "redux";
import {
  RequestStatusType,
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType
} from "../../app/app-reducer";
import {
  handleServerAppErrorGenerator,
  handleServerNetworkError,
  handleServerNetworkErrorGenerator
} from "../../utils/error-utils";
import { call, put } from "redux-saga/effects";

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsType
): Array<TodolistDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter(tl => tl.id != action.id);
    case "ADD-TODOLIST":
      return [
        { ...action.todolist, filter: "all", entityStatus: "idle" },
        ...state
      ];

    case "CHANGE-TODOLIST-TITLE":
      return state.map(tl =>
        tl.id === action.id ? { ...tl, title: action.title } : tl
      );
    case "CHANGE-TODOLIST-FILTER":
      return state.map(tl =>
        tl.id === action.id ? { ...tl, filter: action.filter } : tl
      );
    case "CHANGE-TODOLIST-ENTITY-STATUS":
      return state.map(tl =>
        tl.id === action.id ? { ...tl, entityStatus: action.status } : tl
      );
    case "SET-TODOLISTS":
      return action.todolists.map(tl => ({
        ...tl,
        filter: "all",
        entityStatus: "idle"
      }));
    default:
      return state;
  }
};

// actions
export const removeTodolistAC = (id: string) =>
  ({ type: "REMOVE-TODOLIST", id } as const);
export const addTodolistAC = (todolist: TodolistType) =>
  ({ type: "ADD-TODOLIST", todolist } as const);
export const changeTodolistTitleAC = (id: string, title: string) =>
  ({
    type: "CHANGE-TODOLIST-TITLE",
    id,
    title
  } as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
  ({
    type: "CHANGE-TODOLIST-FILTER",
    id,
    filter
  } as const);
export const changeTodolistEntityStatusAC = (
  id: string,
  status: RequestStatusType
) =>
  ({
    type: "CHANGE-TODOLIST-ENTITY-STATUS",
    id,
    status
  } as const);
export const setTodolistsAC = (todolists: Array<TodolistType>) =>
  ({ type: "SET-TODOLISTS", todolists } as const);

// thunks

export const fetchTodolists = () => ({ type: "fetchTodolists" });
export const deleteTodolist = (todolistId: string) =>
  ({ type: "deleteTodolist", payload: { todolistId } } as const);
export const createTodolist = (title: string) =>
  ({ type: "createTodolist", payload: { title } } as const);

export const updateTodolist = (id: string, title: string) =>
  ({ type: "updateTodolist", payload: { id, title } } as const);

type DeleteTodolistType = ReturnType<typeof deleteTodolist>;
type AddTodolistType = ReturnType<typeof createTodolist>;
type UpdateTodolistType = ReturnType<typeof updateTodolist>;

export function* fetchTodolistsWorkerSaga() {
  try {
    yield put(setAppStatusAC("loading"));
    const { data } = yield call(todolistsAPI.getTodolists);
    yield put(setTodolistsAC(data));
    yield put(setAppStatusAC("succeeded"));
  } catch (error) {
    yield handleServerNetworkErrorGenerator(error);
  }
}

export function* deleteTodolistWorkerSaga(action: DeleteTodolistType) {
  const {
    payload: { todolistId }
  } = action;

  try {
    yield put(setAppStatusAC("loading"));
    yield put(changeTodolistEntityStatusAC(todolistId, "loading"));
    const { data } = yield call(todolistsAPI.deleteTodolist, todolistId);
    yield put(removeTodolistAC(todolistId));
    yield put(setAppStatusAC("succeeded"));
  } catch (error) {
    yield handleServerNetworkErrorGenerator(error);
  }
}

export function* addTodolistWorkerSaga(action: AddTodolistType) {
  const {
    payload: { title }
  } = action;

  try {
    yield put(setAppStatusAC("loading"));
    const { data } = yield call(todolistsAPI.createTodolist, title);
    yield put(addTodolistAC(data.data.item));
    yield put(setAppStatusAC("succeeded"));
  } catch (error) {
    yield handleServerNetworkErrorGenerator(error);
  }
}

export function* changeTodolistTitleWorkerSaga(action: UpdateTodolistType) {
  const {
    payload: { title, id }
  } = action;

  try {
    yield call(todolistsAPI.updateTodolist, id, title);
    yield put(changeTodolistTitleAC(id, title));
  } catch (error) {
    yield handleServerNetworkErrorGenerator(error);
  }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(id, title).then(res => {
      dispatch(changeTodolistTitleAC(id, title));
    });
  };
};

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodolistsActionType
  | ReturnType<typeof changeTodolistEntityStatusAC>;
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
type ThunkDispatch = Dispatch<
  ActionsType | SetAppStatusActionType | SetAppErrorActionType
>;
