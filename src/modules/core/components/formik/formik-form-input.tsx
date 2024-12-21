import {GenericInput} from "../generic/generic-input.tsx";
import {FormikProps} from "formik";

type FormikFormInputProps = {
    label: string
    fieldName: string
    formik: FormikProps<any>
}

export function FormikFormInput({label, fieldName, formik}: FormikFormInputProps) {
    console.log(`====== Re-evaluating FormikFormInput for field ${label}`)

    return <GenericInput
        label={label}
        id={fieldName}
        value={formik.values[fieldName]}
        onChange={formik.handleChange}
        type="text"
        error={formik.errors[fieldName] as any}
    />
}