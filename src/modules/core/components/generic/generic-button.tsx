import {PropsWithChildren} from "react";

type GenericButtonProps = {
    disabled: boolean
    onClick: () => void
}

export function GenericButton({disabled, onClick, children}: PropsWithChildren<GenericButtonProps>) {
    return <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="btn btn-primary">
        {children}
    </button>
}