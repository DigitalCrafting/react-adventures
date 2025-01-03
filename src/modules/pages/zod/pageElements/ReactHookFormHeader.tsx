import {useEffect} from "react";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";

export function ReactHookFormHeader() {
    console.log(`====== Re-evaluating ReactHookFormHeader`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });


    return <p>React hook form page</p>
}