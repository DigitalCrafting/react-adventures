import {ChangeEvent} from "react";

type GenericInputProps = {
    // TODO change to string
    error: boolean,
    id: string,
    value: any,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function GenericInput({error, id, ...props}: GenericInputProps) {
    return <div className="mb-3">
        <label htmlFor={id}></label>
        <input id={id} {...props}/>
        {error ? <p className="error">Error</p> : null}
    </div>
}