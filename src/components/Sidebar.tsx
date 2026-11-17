import { NavLink } from "react-router-dom"
import "../styles/layout.css"

const LINKS = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/usuarios", label: "Usuários" },
    { to: "/planos", label: "Planos" },
    { to: "/fichas", label: "Fichas" },
    { to: "/meu-plano", label: "Meu plano" },
    { to: "/", label: "Voltar" },
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