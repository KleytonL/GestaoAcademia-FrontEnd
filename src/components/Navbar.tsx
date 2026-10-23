import { Link } from 'react-router-dom'
function Navbar() {
    return (
        <nav>
            <h1>CR TRAINER</h1>
            <Link to="/">Página Inicial</Link> {' '}
            <Link to="/usuarios">Usuarios</Link> {' '}
            <Link to="/planos">Planos</Link> {' '}
            <Link to="/fichas">Fichas</Link>
        </nav>
    )
}

export default Navbar