import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../modules/dashboard/App.tsx";
import {VanillaFormPage} from "../modules/forms/vanilla/VanillaFormPage.tsx";
import {FormikFormPage} from "../modules/forms/formik/FormikFormPage.tsx";
import {ZodFormPage} from "../modules/forms/zod/ZodFormPage.tsx";
import {CustomFormPage} from "../modules/forms/custom/CustomFormPage.tsx";

const router = createBrowserRouter([
    {
        path: '',
        element: <Navigate to="/ui/custom"/>
    },
    {
        path: 'ui',
        element: <App/>,
        children: [
            {
                path: '',
                element: <Navigate to="/ui/custom"/>
            },{
                path: 'vanilla',
                element: <VanillaFormPage/>
            },{
                path: 'formik',
                element: <FormikFormPage/>
            },{
                path: 'zod',
                element: <ZodFormPage/>
            },{
                path: 'custom',
                element: <CustomFormPage/>
            },
        ]
    }
])

export default router