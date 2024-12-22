import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ZodFormHeader} from "./pageElements/ZodFormHeader.tsx";
import {ZodFormBody} from "./pageElements/ZodFormBody.tsx";
import {ZodFormFooter} from "./pageElements/ZodFormFooter.tsx";

const ZodFormSchema = z.object({
    title: z.string().nonempty(),
    description: z.string()
})

type ZodFormData = z.infer<typeof ZodFormSchema>;

export function ZodFormPage() {

    const zodForm = useForm<ZodFormData>({resolver: zodResolver(ZodFormSchema)});

    return <div className="container">
        <ZodFormHeader/>
        <ZodFormBody zodForm={zodForm}/>
        <ZodFormFooter zodForm={zodForm} />
    </div>
}