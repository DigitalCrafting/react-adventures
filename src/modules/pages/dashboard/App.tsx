import {Outlet} from "react-router-dom";
import {DashboardCard} from "./components/DashboardCard.tsx";
import {TopBar} from "./components/TopBar.tsx";

function App() {
    return (
        <>
            <TopBar/>
            <DashboardCard>
                <Outlet/>
            </DashboardCard>
        </>
    )
}

export default App
