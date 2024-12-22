import {useCallback, useEffect, useRef, useState} from "react";
import {FormInputControl} from "../../../core/forms/custom-forms.ts";

export function useCustomTextInput_V2(fieldName: string, inputControl: FormInputControl) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(inputControl.getError())
    const [inputId] = useState(`${fieldName}-input`)

    const inputEventListener = useCallback((event: Event)=> {
            // @ts-ignore
            inputControl.setValue(event.target.value)
    }, [])

    useEffect(() => {
        if (inputRef.current) {
            const input = inputRef.current
            input.value = inputControl.getValue()
            input.addEventListener('input', inputEventListener)

            return () => {
                input.removeEventListener('input', inputEventListener)
            }
        }

    }, [inputRef.current]);


    useEffect(() => {
        const sub = inputControl.onValidityChanges(() => {
            setError(inputControl.getError())
        })

        return () => sub.unsubscribe()
    }, []);

    return {
        error,
        ref: inputRef,
        id: inputId,
        type: "text"
    }
}