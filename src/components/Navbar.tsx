import { Link } from 'react-router-dom'
function Navbar() {
    return (
        <nav>
            <h1>CR TRAINER</h1>
            <Link to="/">Home</Link> {' '}
            <Link to="/usuarios">Usuarios</Link> {' '}
            <Link to="/planos">Planos</Link>
        </nav>
    )
}

export default Navbar