import {CustomFormButton} from "../components/custom-form-button.tsx";
import {FormGroup} from "../../../core/forms/custom-forms.ts";

type CustomFormFooterProps = {
    formGroup: FormGroup
}

export function CustomFormFooter({formGroup}: CustomFormFooterProps) {
    console.log(`====== Re-evaluating CustomFormFooter`)

    return <div className="row">
        <div className="col-8"/>
        <div className="col-4 d-flex flex-row-reverse">
            <CustomFormButton formGroup={formGroup}/>
        </div>
    </div>;


}