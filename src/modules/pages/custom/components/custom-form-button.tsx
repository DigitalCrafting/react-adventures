import {GenericButton} from "../../../core/components/generic-button.tsx";
import {FormGroup} from "../../../core/forms/custom-forms.ts";
import {useCallback} from "react";
import {useCustomFormButton} from "../hooks/useCustomFormButton.tsx";

type CustomFormButtonProps = {
    formGroup: FormGroup
}

export function CustomFormButton({formGroup}: CustomFormButtonProps) {
    console.log(`====== Re-evaluating CustomFormButton`)
    const {disabled} = useCustomFormButton(formGroup)

    const onClickHandler = useCallback(() => {
        console.log(formGroup.getValue())
    }, [])

    return <GenericButton disabled={disabled} onClick={onClickHandler}>
        Click me!
    </GenericButton>
}