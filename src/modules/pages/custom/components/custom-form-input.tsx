import {FormInputControl} from "../../../core/forms/custom-forms.ts";
import {GenericInput} from "../../../core/components/generic-input.tsx";
import {useCustomTextInput} from "../../../core/hooks/useCustomTextInput.tsx";

type CustomFormInputProps = {
    label: string
    fieldName: string,
    inputControl: FormInputControl
}

export function CustomFormInput({label, fieldName, inputControl}: CustomFormInputProps) {
    console.log(`====== Re-evaluating CustomFormInput for field ${fieldName}`)

    const props = useCustomTextInput(fieldName, inputControl)

    return <GenericInput
        label={label}
        {...props}
    />
}