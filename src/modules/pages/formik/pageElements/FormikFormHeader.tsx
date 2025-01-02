import {useEffect} from "react";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";

export function FormikFormHeader() {
    console.log(`====== Re-evaluating FormikFormHeader`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });


    return <p>Formik form page</p>
}