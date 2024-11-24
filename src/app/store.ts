import {
  addTaskWorkerSaga,
  changeTaskTitleWorkerSaga,
  deleteTaskWorkeraga,
  fetchTasksWorkerSaga,
  tasksReducer
} from "../features/TodolistsList/tasks-reducer";
import {
  addTodolistWorkerSaga,
  changeTodolistTitleWorkerSaga,
  deleteTodolistWorkerSaga,
  fetchTodolistsWorkerSaga,
  todolistsReducer
} from "../features/TodolistsList/todolists-reducer";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { appReducer, fetchAuthMeWorkerSaga } from "./app-reducer";
import {
  authReducer,
  fetchLoginWorkerSaga,
  fetchLogoutWorkerSaga
} from "../features/Login/auth-reducer";
import createSagaMiddleware from "redux-saga";
import { takeLatest, takeEvery } from "redux-saga/effects";

const sagaMiddleware = createSagaMiddleware();

export function* tasksWatcherSaga() {
  yield takeEvery("fetchTasks", fetchTasksWorkerSaga);
  yield takeLatest("deleteTask", deleteTaskWorkeraga);
  yield takeLatest("createTask", addTaskWorkerSaga);
  yield takeLatest("updateTask", changeTaskTitleWorkerSaga);
}

function* rootWatcherSaga() {
  yield takeLatest("authMe", fetchAuthMeWorkerSaga);
  yield takeLatest("login", fetchLoginWorkerSaga);
  yield takeLatest("logout", fetchLogoutWorkerSaga);

  yield takeEvery("fetchTodolists", fetchTodolistsWorkerSaga);
  yield takeLatest("deleteTodolist", deleteTodolistWorkerSaga);
  yield takeLatest("createTodolist", addTodolistWorkerSaga);
  yield takeLatest("updateTodolist", changeTodolistTitleWorkerSaga);

  yield tasksWatcherSaga();
}

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer
});
// непосредственно создаём store
export const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware, thunkMiddleware)
);
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;

sagaMiddleware.run(rootWatcherSaga);

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
