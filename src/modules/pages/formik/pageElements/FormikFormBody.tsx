import {FormikProps} from "formik";
import {FormikFormInput} from "../components/formik-form-input.tsx";

type FormikFormBodyProps = {
    formik: FormikProps<any>
}

export function FormikFormBody({formik}: FormikFormBodyProps) {
    console.log(`====== Re-evaluating FormikFormBody`)

    return (<div className="container p-0">
        <div className="row">
            <FormikFormInput label="Title"
                             fieldName={"title"}
                             formik={formik}
            />
        </div>
        <div>
            <FormikFormInput label="Description"
                             fieldName={"description"}
                             formik={formik}
            />
        </div>
    </div>)
}