import {CustomFormButton} from "../../../core/components/custom/custom-form-button.tsx";
import {FormGroup} from "../../../core/forms/custom-forms.ts";

type CustomFormFooterProps = {
    formGroup: FormGroup
}

export function CustomFormFooter({formGroup}: CustomFormFooterProps) {
    console.log(`====== Re-evaluating CustomFormFooter`)

    return <CustomFormButton formGroup={formGroup}/>;
}