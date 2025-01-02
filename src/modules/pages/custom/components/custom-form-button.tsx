import {GenericButton} from "../../../core/components/generic-button.tsx";
import {FormGroup} from "../../../core/forms/custom-forms.ts";
import {useCallback, useEffect} from "react";
import {useCustomFormButton} from "../hooks/useCustomFormButton.tsx";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";

type CustomFormButtonProps = {
    formGroup: FormGroup
}

export function CustomFormButton({formGroup}: CustomFormButtonProps) {
    console.log(`====== Re-evaluating CustomFormButton`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });
    const {disabled} = useCustomFormButton(formGroup)

    const onClickHandler = useCallback(() => {
        console.log(formGroup.getValue())
    }, [])

    return <GenericButton disabled={disabled} onClick={onClickHandler}>
        Click me!
    </GenericButton>
}