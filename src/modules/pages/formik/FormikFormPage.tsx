import {FormikFormHeader} from "././pageElements/FormikFormHeader.tsx";
import {FormikFormBody} from "././pageElements/FormikFormBody.tsx";
import {FormikFormFooter} from "././pageElements/FormikFormFooter.tsx";
import {useFormik} from "formik";
import * as yup from 'yup'
import {useEffect} from "react";
import {reEvaluationEventEmitter} from "../dashboard/components/re-evaluation-event.ts";

interface FormikForm {
    title: string
    description: string
}

export function FormikFormPage() {
    console.log(`====== Re-evaluating FormikFormPage`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });


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