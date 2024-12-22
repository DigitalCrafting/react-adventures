import {FormInputControl} from "../../../core/forms/custom-forms.ts";
import {GenericInput} from "../../../core/components/generic-input.tsx";
import {useCustomTextInput_V2} from "../hooks/useCustomTextInput_V2.tsx";

type CustomFormInputProps = {
    label: string
    fieldName: string,
    inputControl: FormInputControl
}

export function CustomFormInput({label, fieldName, inputControl}: CustomFormInputProps) {
    console.log(`====== Re-evaluating CustomFormInput for field ${fieldName}`)

    const props = useCustomTextInput_V2(fieldName, inputControl)

    return <GenericInput
        label={label}
        {...props}
    />
}