export type FieldErrorType = {
    field:string
    error:string
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
    fieldsErrors?: FieldErrorType[]
}