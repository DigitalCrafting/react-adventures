import {ReactNode} from "react";

interface Props {
    children: ReactNode
}
export function DashboardCard({children} : Props) {
    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-2"></div>
                <div className="col-8">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2"></div>
            </div>
        </div>
    );
}