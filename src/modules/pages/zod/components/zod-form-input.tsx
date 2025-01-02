import {UseFormReturn} from "react-hook-form";
import {useEffect} from "react";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";

type ZodFormInputProps = {
    label: string
    fieldName: string
    zodForm: UseFormReturn<{title: string, description: string}>
}

export function ZodFormInput({label, fieldName, zodForm}: ZodFormInputProps) {
    console.log(`====== Re-evaluating ZodFormInput for field ${label}`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });


    const {
        register,
        getFieldState,
    } = zodForm

    // @ts-ignore
    const fieldError = getFieldState(fieldName).error

    return <div className="mb-3">
        <label htmlFor={fieldName} className="form-label w-100 text-align-left">{label}</label>
        {/* @ts-ignore */}
        <input id={fieldName} {...register(fieldName, {required: true})} className="form-control"/>
        {fieldError ? <p className="error w-100 text-align-left fs-7">{fieldError.message}</p> : null}
    </div>
}