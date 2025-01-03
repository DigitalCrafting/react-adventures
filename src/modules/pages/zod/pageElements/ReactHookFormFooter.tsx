import {GenericButton} from "../../../core/components/generic-button.tsx";
import {UseFormReturn} from "react-hook-form";
import {useEffect} from "react";
import {reEvaluationEventEmitter} from "../../dashboard/components/re-evaluation-event.ts";

type ReactHookFormFooterProps = {
    zodForm: UseFormReturn<{title: string, description: string}>
}

export function ReactHookFormFooter({zodForm}: ReactHookFormFooterProps) {
    console.log(`====== Re-evaluating ReactHookFormFooter`)
    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });

    const {
        getValues,
        formState: {
            isValid
        }
    } = zodForm

    const onButtonClicked = () => {
        console.log(getValues())
    }

    return (<div className="row">
        <div className="col-8"/>
        <div className="col-4 d-flex flex-row-reverse">
            <GenericButton disabled={!isValid} onClick={onButtonClicked}>Click me!</GenericButton>
        </div>
    </div>);
}