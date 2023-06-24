import {Dispatch} from "redux";
import axios, {AxiosError} from "axios";
import { appActions } from "app/app-reducer";

export const handleServerNetworkError = (e:unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError<{error:string}>

    if(axios.isAxiosError(err)){
        const error = err.message ? err.message : 'some error occurred'
        dispatch(appActions.setAppError({error}))
    } else {
        dispatch(appActions.setAppError({error:`native error ${err.message}`}))
    }
    dispatch(appActions.setAppStatus({status:'failed'}))
}
