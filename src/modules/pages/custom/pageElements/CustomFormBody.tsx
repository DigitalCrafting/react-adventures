import {CustomFormInput} from "../components/custom-form-input.tsx";
import {FormGroup, FormInputControl} from "../../../core/forms/custom-forms.ts";

type CustomFormBodyProps = {
    formGroup: FormGroup
}

export function CustomFormBody({formGroup}: CustomFormBodyProps) {
    console.log(`====== Re-evaluating CustomFormBody`)

    return (<div className="container w-50">
        <div className="row">
            <CustomFormInput label="Title"
                             fieldName={"title"}
                             inputControl={formGroup.getFormElement('title') as FormInputControl}
            />
        </div>
        <div>
            <CustomFormInput label="Description"
                             fieldName={"description"}
                             inputControl={formGroup.getFormElement('description') as FormInputControl}
            />
        </div>
    </div>)
}