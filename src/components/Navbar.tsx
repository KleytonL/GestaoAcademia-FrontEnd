import { Link } from 'react-router-dom'
function Navbar() {
    return (
        <nav>
            <h1>CR TRAINER</h1>
            <Link to="/">Home</Link> {' '}
            <Link to="/clientes">Clientes</Link> {' '}
            <Link to="/alunos">Alunos</Link> {' '}
            <Link to="/mensalidades">Mensalidades</Link>
        </nav>
    )
}

export default Navbar