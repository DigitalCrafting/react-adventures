import {UseFormReturn} from "react-hook-form";
import {ReactHookFormInput} from "../components/react-hook-form-input.tsx";
import {useEffect} from "react";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";

type ReactHookFormBodyProps = {
    zodForm: UseFormReturn<{title: string, description: string}>
}

export function ReactHookFormBody({zodForm}: ReactHookFormBodyProps) {
    console.log(`====== Re-evaluating ReactHookFormBody`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });


    return (<div className="container p-0">
        <div className="row">
            <ReactHookFormInput zodForm={zodForm} label="Title" fieldName="title"/>
        </div>
        <div>
            <ReactHookFormInput zodForm={zodForm} label="Description" fieldName="description"/>
        </div>
    </div>)
}