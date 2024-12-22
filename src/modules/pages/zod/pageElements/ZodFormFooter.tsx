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

    return <GenericButton disabled={!isValid} onClick={onButtonClicked}>Click me!</GenericButton>;
}