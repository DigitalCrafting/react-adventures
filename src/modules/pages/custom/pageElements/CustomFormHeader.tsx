import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";
import {useEffect} from "react";

export function CustomFormHeader() {
    console.log(`====== Re-evaluating CustomFormHeader`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });

    return <p>Custom form page</p>
}