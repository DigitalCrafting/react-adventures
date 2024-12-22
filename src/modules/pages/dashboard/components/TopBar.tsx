import {Link} from "react-router-dom";

export function TopBar() {
    return <nav className="navbar navbar-expand-lg navbar-light bg-light w-100">
            <a className="navbar-brand" href="#">React adventures</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to={"/ui/formik"}>Formik</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/ui/zod"}>Zod</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/ui/custom"}>Custom</Link>
                    </li>
                </ul>
            </div>
        </nav>
}