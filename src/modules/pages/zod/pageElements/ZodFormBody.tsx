import {UseFormReturn} from "react-hook-form";
import {ZodFormInput} from "../components/zod-form-input.tsx";
import {useEffect} from "react";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";

type ZodFormBodyProps = {
    zodForm: UseFormReturn<{title: string, description: string}>
}

export function ZodFormBody({zodForm}: ZodFormBodyProps) {
    console.log(`====== Re-evaluating ZodFormBody`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });


    return (<div className="container p-0">
        <div className="row">
            <ZodFormInput zodForm={zodForm} label="Title" fieldName="title"/>
        </div>
        <div>
            <ZodFormInput zodForm={zodForm} label="Description" fieldName="description"/>
        </div>
    </div>)
}