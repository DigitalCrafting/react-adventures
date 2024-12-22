import {useEffect, useState} from "react";
import {FormElement} from "../../../core/forms/custom-forms.ts";

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
