import {GenericButton} from "../../../core/components/generic-button.tsx";
import {FormikProps} from "formik";
import {useCallback, useEffect} from "react";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";

type FormikFormFooterProps = {
    formik: FormikProps<any>
}

export function FormikFormFooter({formik}: FormikFormFooterProps) {
    console.log(`====== Re-evaluating FormikFormFooter`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });


    const onClickHandler = useCallback(() => {
        console.log(formik.values)
    }, [])

    return <div className="row">
        <div className="col-8"/>
        <div className="col-4 d-flex flex-row-reverse">
            <GenericButton disabled={!formik.isValid} onClick={onClickHandler}>Click me!</GenericButton>
        </div>
    </div>;


}