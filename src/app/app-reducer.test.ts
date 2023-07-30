import { appReducer, setAppError, setAppInitialized, setAppStatus } from "./app-reducer";

let startState: any;

beforeEach(() => {
  startState = {
    status: "idle",
    error: null as string | null,
    isInitialized: false,
  };
});

test("correct error message should be set", () => {
  const endState = appReducer(startState, setAppError({ error: "some error" }));
  expect(endState.error).toBe("some error");
});

test("correct status should be set", () => {
  const endState = appReducer(startState, setAppStatus({ status: "loading" }));
  expect(endState.status).toBe("loading");
});

test("the isInitialized field must be modified", () => {
  const endState = appReducer(startState, setAppInitialized({ isInitialized: true }));
  expect(endState.isInitialized).toBeTruthy();
  const endState2 = appReducer(endState, setAppInitialized({ isInitialized: false }));
  expect(endState2.isInitialized).toBeFalsy();
});
