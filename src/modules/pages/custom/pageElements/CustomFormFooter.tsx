import {FormGroup} from "../../../core/forms/custom-forms.ts";
import {useCustomFormButton} from "../hooks/useCustomFormButton.tsx";
import {useCallback} from "react";
import {GenericButton} from "../../../core/components/generic-button.tsx";

type CustomFormFooterProps = {
    formGroup: FormGroup
}

export function CustomFormFooter({formGroup}: CustomFormFooterProps) {
    console.log(`====== Re-evaluating CustomFormFooter`)

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