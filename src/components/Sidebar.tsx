import { Link } from "react-router-dom";

function Sidebar() {
    return(
        <div className="sidebar">
            <Link to="/">Página Inicial</Link> {' '}
            <Link to="/usuarios">Usuarios</Link> {' '}
            <Link to="/planos">Planos</Link>
        </div>
    )
}

export default Sidebar