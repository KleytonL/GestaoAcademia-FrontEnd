import { NavLink } from "react-router-dom"
import "../styles/layout.css"

const LINKS = [
    { to: "/", label: "Início" },
    { to: "/usuarios", label: "Usuários" },
    { to: "/planos", label: "Planos" },
    { to: "/fichas", label: "Fichas" },
]

function Sidebar() {
    return (
        <aside className="sidebar">
            <nav>
                {LINKS.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === "/"}
                        className={({ isActive }) => isActive ? "sidebar-link ativo" : "sidebar-link"}>
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar