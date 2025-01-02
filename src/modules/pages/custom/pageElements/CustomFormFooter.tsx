import {FormGroup} from "../../../core/forms/custom-forms.ts";
import {useCustomFormButton} from "../hooks/useCustomFormButton.tsx";
import {useCallback, useEffect} from "react";
import {GenericButton} from "../../../core/components/generic-button.tsx";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";

type CustomFormFooterProps = {
    formGroup: FormGroup
}

export function CustomFormFooter({formGroup}: CustomFormFooterProps) {
    console.log(`====== Re-evaluating CustomFormFooter`)

    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });

    const {disabled} = useCustomFormButton(formGroup)

    const onClickHandler = useCallback(() => {
        console.log(formGroup.getValue())
    }, [])


    return <div className="row">
        <div className="col-8"/>
        <div className="col-4 d-flex flex-row-reverse">
            <GenericButton disabled={disabled} onClick={onClickHandler}>
                Click me!
            </GenericButton>
        </div>
    </div>;


}