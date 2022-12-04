import React, {KeyboardEvent, useState} from "react";
import './App.css';
import {IconButton, TextField} from "@material-ui/core";
import PlusOneIcon from '@material-ui/icons/PlusOne';


type AddItemFormPropsType = {
    placeholder:string
    addItem:(title: string)=>void

}

export const AddItemForm = (props:AddItemFormPropsType) => {
    let [title, setTitle] = useState<string>('')
    let [error, setError] = useState<string | null>(null)
    const onChangeSetLocalItem = (event: any) => {
        setTitle(event.currentTarget.value)
    }


    const onClickAddItem = () => {
        if (title.trim() != '') {
            props.addItem(title.trim())
            setTitle('')
        } else {
            setError("error")
        }
    }

    const onKeyDownEnterAddItem = (event: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (event.key === "Enter") {
            props.addItem(title.trim())
            setTitle('')

        }
    }



    return(
        <div>

            <div className={"flex"}>
                <TextField label={props.placeholder}
                           value={title}
                           onChange={onChangeSetLocalItem}
                           onKeyDown={onKeyDownEnterAddItem}
                           error={!!error}
                           helperText={error? "Ttile is required" : ""}
                />

                <IconButton onClick={onClickAddItem} >
                  <PlusOneIcon color={"primary"}/>
                </IconButton>

            </div>




        </div>

    )
}