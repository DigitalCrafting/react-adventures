import './App.css'
import {Outlet} from "react-router-dom";
import {DashboardCard} from "./components/DashboardCard.tsx";
import {TopBar} from "./components/TopBar.tsx";

function App() {
    return (
        <div className="container">
            <TopBar/>
            <DashboardCard>
                <Outlet/>
            </DashboardCard>
        </div>
    )
}

export default App
