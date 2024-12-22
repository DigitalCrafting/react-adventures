import {ChangeEvent, forwardRef} from "react";

type GenericInputProps = {
    label: string
    error: string | null,
    id: string,
    value?: any,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
    type: string
}

export const GenericInput = forwardRef<HTMLInputElement, GenericInputProps>(({label, error, id, ...props}, ref) => {
    return <div className="mb-3">
        <label htmlFor={id} className="form-label w-100 text-align-left">{label}</label>
        <input ref={ref} id={id} {...props} className="form-control"/>
        {error ? <p className="error w-100 text-align-left fs-7">{error}</p> : null}
    </div>
});