import {UseFormReturn} from "react-hook-form";
import {ZodFormInput} from "../components/zod-form-input.tsx";

type ZodFormBodyProps = {
    zodForm: UseFormReturn<{title: string, description: string}>
}

export function ZodFormBody({zodForm}: ZodFormBodyProps) {
    console.log(`====== Re-evaluating ZodFormBody`)

    return (<div className="container p-0">
        <div className="row">
            <ZodFormInput zodForm={zodForm} label="Title" fieldName="title"/>
        </div>
        <div>
            <ZodFormInput zodForm={zodForm} label="Description" fieldName="description"/>
        </div>
    </div>)
}