import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  setTodolistsAC,
  SetTodolistsActionType
} from "./todolists-reducer";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType
} from "../../api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "../../app/store";
import {
  setAppErrorAC,
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType
} from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerAppErrorGenerator,
  handleServerNetworkError,
  handleServerNetworkErrorGenerator
} from "../../utils/error-utils";
import { call, put, select, fork } from "redux-saga/effects";

const initialState: TasksStateType = {};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionsType
): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          t => t.id != action.taskId
        )
      };
    case "ADD-TASK":
      return {
        ...state,
        [action.task.todoListId]: [
          action.task,
          ...state[action.task.todoListId]
        ]
      };
    case "UPDATE-TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map(t =>
          t.id === action.taskId ? { ...t, ...action.model } : t
        )
      };
    case "ADD-TODOLIST":
      return { ...state, [action.todolist.id]: [] };
    case "REMOVE-TODOLIST":
      const copyState = { ...state };
      delete copyState[action.id];
      return copyState;
    case "SET-TODOLISTS": {
      const copyState = { ...state };
      action.todolists.forEach(tl => {
        copyState[tl.id] = [];
      });
      return copyState;
    }
    case "SET-TASKS":
      return { ...state, [action.todolistId]: action.tasks };
    default:
      return state;
  }
};

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
  ({ type: "REMOVE-TASK", taskId, todolistId } as const);
export const addTaskAC = (task: TaskType) =>
  ({ type: "ADD-TASK", task } as const);
export const updateTaskAC = (
  taskId: string,
  model: UpdateDomainTaskModelType,
  todolistId: string
) => ({ type: "UPDATE-TASK", model, todolistId, taskId } as const);
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({ type: "SET-TASKS", tasks, todolistId } as const);

export const fetchTasksRequest = (todolistId: string) =>
  ({ type: "fetchTasks", payload: { todolistId } } as const);
export const addTasksRequest = (todolistId: string, title: string) =>
  ({
    type: "createTask",
    payload: { todolistId, title }
  } as const);

export const updateTasksRequest = (
  taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todolistId: string
) =>
  ({
    type: "updateTask",
    payload: { taskId, domainModel, todolistId }
  } as const);

export const deleteTasksRequest = (todolistId: string, taskId: string) =>
  ({
    type: "deleteTask",
    payload: { todolistId, taskId }
  } as const);

type FetchTasksType = ReturnType<typeof fetchTasksRequest>;
type AddTasksType = ReturnType<typeof addTasksRequest>;
type DeleteTasksType = ReturnType<typeof deleteTasksRequest>;
type UpdateTasksType = ReturnType<typeof updateTasksRequest>;

// thunks

export function* fetchTasksWorkerSaga(action: FetchTasksType) {
  // debugger;
  const {
    payload: { todolistId }
  } = action;
  try {
    const {
      data: { items }
    } = yield call(todolistsAPI.getTasks, todolistId);
    console.log(todolistId);

    // yield put(setAppStatusAC("loading"));
    // const {
    //   data: { items }
    // } = yield call(todolistsAPI.getTasks, todolistId);
    // debugger
    yield put(setTasksAC(items, todolistId));
    yield put(setAppStatusAC("succeeded"));
  } catch (error) {
    yield handleServerNetworkErrorGenerator(error);
  }
}

export function* addTaskWorkerSaga(action: AddTasksType) {
  const {
    payload: { todolistId, title }
  } = action;

  console.log(todolistId, title);

  try {
    yield put(setAppStatusAC("loading"));
    const {
      data: {
        data: { item },
        resultCode
      }
    } = yield call(todolistsAPI.createTask, todolistId, title);
    if (resultCode === 0) {
      yield put(addTaskAC(item));
      yield put(setAppStatusAC("succeeded"));
    } else {
    }
  } catch (error) {
    yield handleServerNetworkErrorGenerator(error);
  }
}

export function* deleteTaskWorkeraga(action: DeleteTasksType) {
  const {
    payload: { todolistId, taskId }
  } = action;

  try {
    yield put(setAppStatusAC("loading"));
    const res = yield call(todolistsAPI.deleteTask, todolistId, taskId);
    yield put(removeTaskAC(taskId, todolistId));
    yield put(setAppStatusAC("succeeded"));
  } catch (error) {
    yield handleServerNetworkErrorGenerator(error);
  }
}

export function* changeTaskTitleWorkerSaga(action: UpdateTasksType) {
  const {
    payload: { todolistId, taskId, domainModel }
  } = action;
  const task = yield select(state =>
    state.tasks[todolistId].find((t: TaskType) => t.id === taskId)
  );

  if (!task) {
    //throw new Error("task not found in the state");
    console.warn("task not found in the state");
    return;
  }

  const apiModel: UpdateTaskModelType = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...domainModel
  };

  try {
    yield put(setAppStatusAC("loading"));
    const {
      data: { data, resultCode }
    } = yield call(
      todolistsAPI.updateTask,
      todolistId as string,
      taskId as string,
      apiModel
    );

    if (resultCode === 0) {
      yield put(updateTaskAC(taskId, domainModel, todolistId));
      yield put(setAppStatusAC("succeeded"));
    } else {
      handleServerAppErrorGenerator(data);
    }
  } catch (error) {
    yield handleServerNetworkErrorGenerator(error);
  }
}

export const updateTaskTC = (
  taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todolistId: string
) => (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
  const state = getState();
  const task = state.tasks[todolistId].find(t => t.id === taskId);
  if (!task) {
    //throw new Error("task not found in the state");
    console.warn("task not found in the state");
    return;
  }

  const apiModel: UpdateTaskModelType = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...domainModel
  };

  todolistsAPI
    .updateTask(todolistId, taskId, apiModel)
    .then(res => {
      if (res.data.resultCode === 0) {
        const action = updateTaskAC(taskId, domainModel, todolistId);
        dispatch(action);
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
type ActionsType =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistsActionType
  | ReturnType<typeof setTasksAC>;
type ThunkDispatch = Dispatch<
  ActionsType | SetAppStatusActionType | SetAppErrorActionType
>;
