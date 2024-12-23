import {GenericButton} from "../../../core/components/generic-button.tsx";
import {UseFormReturn} from "react-hook-form";

type ZodFormFooterProps = {
    zodForm: UseFormReturn<{title: string, description: string}>
}

export function ZodFormFooter({zodForm}: ZodFormFooterProps) {
    console.log(`====== Re-evaluating ZodFormFooter`)

    const {
        getValues,
        formState: {
            isValid
        }
    } = zodForm

    const onButtonClicked = () => {
        console.log(getValues())
    }

    return <div className="row">
        <div className="col-8"/>
        <div className="col-4 d-flex flex-row-reverse">
            <GenericButton disabled={!isValid} onClick={onButtonClicked}>Click me!</GenericButton>
        </div>
    </div>;
}