import {ResponseType} from "common/types";
import {Dispatch} from "redux";
import {setAppError, setAppStatus} from "app/app-reducer";


/**
 * This function handles errors that may occur during interaction with the server
 * @param data - server response in the format ResponseType<D>
 * @param dispatch - function for sending messages to the Redux store
 * @param showError - a flag indicating whether to display an error in the user interface.
 */

export const handleServerAppError =<D> (data:ResponseType<D>, dispatch: Dispatch, showError=true):void => {
    if (data.messages.length && showError) {
        dispatch(setAppError({error:data.messages[0]}))
    } else {
        showError && dispatch(setAppError({error:'Some error occurred'}))
    }
    dispatch(setAppStatus({status:'failed'}))
}