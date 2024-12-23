import {GenericButton} from "../../../core/components/generic-button.tsx";
import {FormikProps} from "formik";

type FormikFormFooterProps = {
    formik: FormikProps<any>
}

export function FormikFormFooter({formik}: FormikFormFooterProps) {
    console.log(`====== Re-evaluating FormikFormFooter`)

    return <div className="row">
        <div className="col-8"/>
        <div className="col-4 d-flex flex-row-reverse">
            <GenericButton disabled={!formik.isValid} onClick={formik.handleSubmit}>Click me!</GenericButton>
        </div>
    </div>;


}