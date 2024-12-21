import {GenericButton} from "../../../core/components/generic/generic-button.tsx";
import {FormikProps} from "formik";

type FormikFormFooterProps = {
    formik: FormikProps<any>
}

export function FormikFormFooter({formik}: FormikFormFooterProps) {
    console.log(`====== Re-evaluating FormikFormFooter`)

    return <GenericButton disabled={!formik.isValid} onClick={formik.handleSubmit}>Click me!</GenericButton>;
}