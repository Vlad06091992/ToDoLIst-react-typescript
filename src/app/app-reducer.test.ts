import {appActions, appReducer} from './app-reducer'

let startState:any;

beforeEach(() => {
	startState = {
		status: 'idle',
		error: null as string | null,
		isInitialized: false
	}
})

test('correct error message should be set', () => {
	const endState = appReducer(startState, appActions.setAppError({error:'some error'}))
	expect(endState.error).toBe('some error');
})

test('correct status should be set', () => {
	const endState = appReducer(startState, appActions.setAppStatus({status:'loading'}))
	expect(endState.status).toBe('loading');
})

