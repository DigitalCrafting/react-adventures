import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ZodFormHeader} from "./pageElements/ZodFormHeader.tsx";
import {ZodFormBody} from "./pageElements/ZodFormBody.tsx";
import {ZodFormFooter} from "./pageElements/ZodFormFooter.tsx";
import {useEffect} from "react";
import {reEvaluationEventEmitter} from "../dashboard/components/re-evaluation-event.ts";

const ZodFormSchema = z.object({
    title: z.string().min(1, {message: 'Value is required'}),
    description: z.string()
})

type ZodFormData = z.infer<typeof ZodFormSchema>;

export function ZodFormPage() {

    const zodForm = useForm<ZodFormData>({
        resolver: zodResolver(ZodFormSchema),
    });

    useEffect(() => {
        zodForm.trigger()
    }, []);

    useEffect(() => {
        reEvaluationEventEmitter.emit('register')
    });

    return <div className="container">
        <ZodFormHeader/>
        <ZodFormBody zodForm={zodForm}/>
        <ZodFormFooter zodForm={zodForm} />
    </div>
}