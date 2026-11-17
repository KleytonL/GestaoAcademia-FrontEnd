import { Link, useLocation } from "react-router-dom"
import "../styles/navbar.css"

function Navbar() {
    const { pathname } = useLocation()
    const naHome = pathname === "/"

    return (
        <nav className="navbar">
            <h1>
                <Link to="/">CR Trainer</Link>
            </h1>

            {naHome && <Link to="/dashboard">Dashboard</Link>}

            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Cadastrar</Link>
        </nav>
    )
}

export default Navbar