import React, {KeyboardEvent, useState} from "react";
import './App.css';


type AddItemFormPropsType = {
    title:string
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
                <input value={title}
                       onChange={onChangeSetLocalItem}
                       onKeyDown={onKeyDownEnterAddItem}
                       className={error ? "error" : ""}
                />
                <button onClick={onClickAddItem}>+</button>


            </div>
            {error && <div className={error ? "error-message" : ""}>Title is required</div>}



        </div>

    )
}