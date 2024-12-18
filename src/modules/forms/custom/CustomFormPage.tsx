import {CustomFormInput} from "../../core/components/custom/custom-form-input.tsx";
import {useEffect, useRef} from "react";
import {FormInputControl} from "../../core/forms/custom-forms.ts";

export function CustomFormPage() {
    console.log(`====== Re-evaluating CustomFormPage`)
    const control = useRef(new FormInputControl<string>("Testing"))

    useEffect(() => {
        const sub = control.current.onValueChanges((value) => {
            console.log(`=== ${value}`)
        })

        return () => {
            sub.unsubscribe()
        }
    }, []);

    return <div className="container col">
        <p>Custom form page</p>
        <CustomFormInput fieldName={"testField"} inputControl={control.current}/>
    </div>
}