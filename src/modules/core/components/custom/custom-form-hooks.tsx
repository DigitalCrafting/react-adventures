import {FormInputControl} from "../../forms/custom-forms.ts";
import {ChangeEvent, useCallback, useEffect, useState} from "react";

export function useCustomTextInput(fieldName: string, inputControl: FormInputControl) {
    const [inputValue, setInputValue] = useState<string>(inputControl.getValue())
    const [error, setError] = useState(false)
    const [inputId] = useState(`${fieldName}-input`)

    useEffect(() => {
        const sub = inputControl.onValidityChanges((valid: boolean) => {
            // TODO actual error message, `valid` should be inferred from existing error message
            setError(!valid)
        })

        return () => {
            sub.unsubscribe()
        }
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