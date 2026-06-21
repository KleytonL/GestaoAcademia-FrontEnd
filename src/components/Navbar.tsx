import { Link } from 'react-router-dom'
function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link> {' '}
            <Link to="/alunos">Alunos</Link> {' '}
            <Link to="/mensalidades">Mensalidades</Link>
        </nav>
    )
}

export default Navbar