import {FormInputControl} from "../../forms/custom-forms.ts";
import {useCustomTextInput} from "./custom-form-hooks.tsx";
import {GenericInput} from "../generic/generic-input.tsx";

type CustomFormInputProps = {
    fieldName: string,
    inputControl: FormInputControl
}

export function CustomFormInput({fieldName, inputControl}: CustomFormInputProps) {
    console.log(`====== Re-evaluating CustomFormInput for field ${fieldName}`)

    const props = useCustomTextInput(fieldName, inputControl)

    return <GenericInput
        {...props}
    />
}