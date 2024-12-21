import {FormElement} from "../forms/custom-forms.ts";
import {useEffect, useState} from "react";

export function useCustomFormButton(formElement: FormElement) {
    const [disabled, setDisabled] = useState(!formElement.getIsValid())

    useEffect(() => {
        const sub = formElement.onValidityChanges((valid) => {
            setDisabled(!valid)
        })

        return () => {
            sub.unsubscribe()
        }
    }, []);

    return {
        disabled
    }
}
