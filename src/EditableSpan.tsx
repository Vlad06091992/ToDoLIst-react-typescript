import {KeyboardEvent, useState} from "react";
import React from "react";

type EditableSpanPropsType = {
    title: string
    changeTitle: (title: string) => void
}

export const EditableSpan = (props: EditableSpanPropsType) => {
    let [title, setTitle] = useState(props.title)

    let [status, setStatus] = useState<boolean>(false)

    const onChangeEditableSpanHandler = (e: any) => {
        setTitle(e.currentTarget.value)
        console.log(title)
    }

    const onBlurEditableSpanHandler = (title: string) => {
        status && setStatus(false)
        props.changeTitle(title)
    }

    const onKeyDownEnterAddItem = (event: KeyboardEvent<HTMLInputElement>) => {

        if (event.key === "Enter") {
            onBlurEditableSpanHandler(title)
        }
    }

    return (
        <div>
            {!status && <span onDoubleClick={() => setStatus(true)}>{props.title}</span>}
            {status && <input value={title}
                              autoFocus
                              onBlur={() => onBlurEditableSpanHandler(title)}
                              onChange={onChangeEditableSpanHandler}
                              onKeyPress={onKeyDownEnterAddItem}/>}
        </div>

    )
}