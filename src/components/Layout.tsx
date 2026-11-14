import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import "../styles/layout.css"

function Layout() {
    return (
        <div className="layout">
            <div className="layout-conteudo">
                <Outlet />
            </div>
            <Sidebar />
        </div>
    )
}

export default Layout