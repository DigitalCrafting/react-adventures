import {CustomFormInput} from "../components/custom-form-input.tsx";
import {FormGroup, FormInputControl} from "../../../core/forms/custom-forms.ts";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";
import {useEffect} from "react";

type CustomFormBodyProps = {
    formGroup: FormGroup
}

export function CustomFormBody({formGroup}: CustomFormBodyProps) {
    console.log(`====== Re-evaluating CustomFormBody`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });

    return (<div className="container p-0">
        <div className="row">
            <CustomFormInput label="Title"
                             fieldName={"title"}
                             inputControl={formGroup.getElement('title') as FormInputControl}
            />
        </div>
        <div>
            <CustomFormInput label="Description"
                             fieldName={"description"}
                             inputControl={formGroup.getElement('description') as FormInputControl}
            />
        </div>
    </div>)
}