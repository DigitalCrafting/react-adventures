import {createBrowserRouter, Navigate} from "react-router-dom";
import {FormikFormPage} from "../modules/./pages/formik/FormikFormPage.tsx";
import {ReactHookFormPage} from "../modules/pages/./rhf/ReactHookFormPage.tsx";
import {CustomFormPage} from "../modules/./pages/custom/CustomFormPage.tsx";
import App from "../modules/pages/dashboard/App.tsx";

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
                path: 'rhf',
                element: <ReactHookFormPage/>
            },{
                path: 'custom',
                element: <CustomFormPage/>
            },
        ]
    }
])

export default router