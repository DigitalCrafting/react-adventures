import {FormInputControl} from "../forms/custom-forms.ts";
import {ChangeEvent, useCallback, useEffect, useState} from "react";

export function useCustomTextInput(fieldName: string, inputControl: FormInputControl) {
    const [inputValue, setInputValue] = useState<string>(inputControl.getValue())
    const [error, setError] = useState<string | null>(inputControl.getError())
    const [inputId] = useState(`${fieldName}-input`)

    useEffect(() => {
        const sub = inputControl.onValidityChanges(() => {
            setError(inputControl.getError())
        })

        return () => sub.unsubscribe()
    }, []);

    const onInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
        inputControl.setValue(event.target.value)
    }, [])

    return {
        error,
        id: inputId,
        value: inputValue,
        onChange: onInputChange,
        type: "text"
    }
}