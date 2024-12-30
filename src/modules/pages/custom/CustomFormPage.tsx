import {useRef} from "react";
import {FormGroup, FormInputControl} from "../../core/forms/custom-forms.ts";
import {CustomFormHeader} from "././pageElements/CustomFormHeader.tsx";
import {CustomFormFooter} from "././pageElements/CustomFormFooter.tsx";
import {CustomFormBody} from "././pageElements/CustomFormBody.tsx";
import {ValidatorComposers} from "../../core/validators/validators.ts";

export function CustomFormPage() {
    console.log(`====== Re-evaluating CustomFormPage`)
    const formGroup = useRef(
        new FormGroup({
            title: new FormInputControl('', ValidatorComposers.string().required("Value is required")),
            description: new FormInputControl(''),
        })
    )

    return <div className="container">
        <CustomFormHeader/>
        <CustomFormBody formGroup={formGroup.current}/>
        <CustomFormFooter formGroup={formGroup.current}/>
    </div>
}