import {GenericInput} from "../../../core/components/generic-input.tsx";
import {FormikProps} from "formik";
import {useEffect} from "react";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";

type FormikFormInputProps = {
    label: string
    fieldName: string
    formik: FormikProps<any>
}

export function FormikFormInput({label, fieldName, formik}: FormikFormInputProps) {
    console.log(`====== Re-evaluating FormikFormInput for field ${label}`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });

    return <GenericInput
        label={label}
        id={fieldName}
        value={formik.values[fieldName]}
        onChange={formik.handleChange}
        type="text"
        error={formik.errors[fieldName] as any}
    />
}