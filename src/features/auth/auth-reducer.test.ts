import { tasksReducer, TasksStateType, tasksThunks } from "features/TodolistsList/Task/tasks-reducer";
import { TaskPriorities, TaskStatuses } from "common/enums";
import { authReducer, authThunks, initialState, InitialStateType } from "features/auth/auth-reducer";
import { string } from "prop-types";

let startState: InitialStateType = {
  isLoggedIn: false,
  captchaUrl: null,
};
beforeEach(() => {
  startState = {
    isLoggedIn: false,
    captchaUrl: null,
  };
});

test("the isLoggedIn field must be modified(login)", () => {
  const action = authThunks.login.fulfilled({ isLoggedIn: true }, "", {
    captcha: "test",
    email: "test",
    password: "test",
    rememberMe: false,
  });
  const endState = authReducer(startState, action);
  expect(endState.isLoggedIn).toBeTruthy();
});

test("the isLoggedIn field must be modified(logout)", () => {
  const action = authThunks.logout.fulfilled({ isLoggedIn: false }, "");
  const endState = authReducer(startState, action);
  expect(endState.isLoggedIn).toBeFalsy();
});

test("the captcha field must be modified", () => {
  const action = authThunks.getCaptchaUrl.fulfilled({ captcha: "CaptchaUrl" }, "");
  const endState = authReducer(startState, action);
  expect(typeof endState.captchaUrl).toBe("string");
  expect(endState.captchaUrl).toBe("CaptchaUrl");
});
