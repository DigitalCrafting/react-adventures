import './App.css'
import {Outlet} from "react-router-dom";
import {DashboardCard} from "./DashboardCard.tsx";

function App() {
    return (
        <DashboardCard>
            <Outlet/>
        </DashboardCard>
    )
}

export default App
