import {Link, useLocation} from "react-router-dom";
import {ReEvaluationCounter} from "./ReEvaluationCounter.tsx";

export function TopBar() {
    const location = useLocation()

    return <nav className="navbar navbar-expand navbar-light nav-fill bg-light w-100 shadow-sm">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">React adventures</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname.includes('formik') ? 'active ' : ''}`} to={"/ui/formik"}>Formik</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname.includes('rhf') ? 'active ' : ''}`} to={"/ui/rhf"}>RHF</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname.includes('custom') ? 'active ' : ''}`} to={"/ui/custom"}>Custom</Link>
                    </li>
                </ul>
            </div>
            <ReEvaluationCounter/>
        </div>
    </nav>
}