import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../modules/dashboard/App.tsx";
import {FormikFormPage} from "../modules/./pages/formik/FormikFormPage.tsx";
import {ZodFormPage} from "../modules/./pages/zod/ZodFormPage.tsx";
import {CustomFormPage} from "../modules/./pages/custom/CustomFormPage.tsx";

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