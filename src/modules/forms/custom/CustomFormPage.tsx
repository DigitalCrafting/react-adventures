import {useRef} from "react";
import {FormGroup, FormInputControl} from "../../core/forms/custom-forms.ts";
import {CustomFormHeader} from "./components/CustomFormHeader.tsx";
import {CustomFormFooter} from "./components/CustomFormFooter.tsx";
import {CustomFormBody} from "./components/CustomFormBody.tsx";

export function CustomFormPage() {
    console.log(`====== Re-evaluating CustomFormPage`)
    const formGroup = useRef(
        new FormGroup({
            title: new FormInputControl<string>('', (value) => {
                return !value ? "Value is required" : null
            }),
            description: new FormInputControl<string>(''),
        })
    )

    return <div className="container">
        <CustomFormHeader/>
        <CustomFormBody formGroup={formGroup.current}/>
        <CustomFormFooter formGroup={formGroup.current}/>
    </div>
}