import {FormInputControl} from "../../../core/forms/custom-forms.ts";
import {GenericInput} from "../../../core/components/generic-input.tsx";
import {useCustomTextInput_V2} from "../hooks/useCustomTextInput_V2.tsx";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";
import {useEffect} from "react";

type CustomFormInputProps = {
    label: string
    fieldName: string,
    inputControl: FormInputControl
}

export function CustomFormInput({label, fieldName, inputControl}: CustomFormInputProps) {
    console.log(`====== Re-evaluating CustomFormInput for field ${fieldName}`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });

    const props = useCustomTextInput_V2(fieldName, inputControl)

    return <GenericInput
        label={label}
        {...props}
    />
}