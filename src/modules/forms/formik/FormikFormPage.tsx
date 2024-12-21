import {FormikFormHeader} from "./components/FormikFormHeader.tsx";
import {FormikFormBody} from "./components/FormikFormBody.tsx";
import {FormikFormFooter} from "./components/FormikFormFooter.tsx";
import {useFormik} from "formik";
import * as yup from 'yup'

interface FormikForm {
    title: string
    description: string
}

export function FormikFormPage() {
    console.log(`====== Re-evaluating FormikFormPage`)

    const formik = useFormik<FormikForm>({
        initialValues: {
            title: '',
            description: ''
        },
        onSubmit: values => console.log(values),
        validationSchema: yup.object({
            title: yup.string().required(),
            description: yup.string()
        }),
        validateOnMount: true
    })

    return <div className="container">
        <FormikFormHeader/>
        <FormikFormBody formik={formik}/>
        <FormikFormFooter formik={formik}/>
    </div>
}