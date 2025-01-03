import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ReactHookFormHeader} from "./pageElements/ReactHookFormHeader.tsx";
import {ReactHookFormBody} from "./pageElements/ReactHookFormBody.tsx";
import {ReactHookFormFooter} from "./pageElements/ReactHookFormFooter.tsx";
import {useEffect} from "react";
import {reEvaluationEventEmitter} from "../dashboard/components/re-evaluation-event.ts";

const ZodFormSchema = z.object({
    title: z.string().min(1, {message: 'Value is required'}),
    description: z.string()
})

type ReactHookFormData = z.infer<typeof ZodFormSchema>;

export function ReactHookFormPage() {

    const zodForm = useForm<ReactHookFormData>({
        resolver: zodResolver(ZodFormSchema),
    });

    useEffect(() => {
        zodForm.trigger()
    }, []);

    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });

    return <div className="container">
        <ReactHookFormHeader/>
        <ReactHookFormBody zodForm={zodForm}/>
        <ReactHookFormFooter zodForm={zodForm} />
    </div>
}