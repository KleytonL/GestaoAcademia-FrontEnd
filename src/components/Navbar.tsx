import { Link, useLocation } from "react-router-dom"
import "../styles/navbar.css"

function Navbar() {
    const { pathname } = useLocation()
    const naHome = pathname === "/"

    return (
        <nav className="navbar">
            <h1>CR Trainer</h1>

            {naHome && (
                <>
                    <Link to="/usuarios">Usuários</Link>
                    <Link to="/planos">Planos</Link>
                    <Link to="/fichas">Fichas</Link>
                </>
            )}
        </nav>
    )
}

export default Navbar