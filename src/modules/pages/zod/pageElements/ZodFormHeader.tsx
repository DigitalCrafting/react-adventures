import {useEffect} from "react";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";

export function ZodFormHeader() {
    console.log(`====== Re-evaluating ZodFormHeader`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });


    return <p>Zod form page</p>
}