import {FormikFormHeader} from "././pageElements/FormikFormHeader.tsx";
import {FormikFormBody} from "././pageElements/FormikFormBody.tsx";
import {FormikFormFooter} from "././pageElements/FormikFormFooter.tsx";
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
        onSubmit: () => {},
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