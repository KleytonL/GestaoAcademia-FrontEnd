import { Link } from "react-router-dom"
import "../styles/auth.css"

function Login() {
    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        // TODO: autenticar o usuário
    }

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Entrar</h1>

                <h3>E-mail<span className="obrigatorio">*</span></h3>
                <input
                    name="email"
                    type="email"
                    placeholder="Insira seu e-mail"
                    required />

                <h3>Senha<span className="obrigatorio">*</span></h3>
                <input
                    name="senha"
                    type="password"
                    placeholder="Insira sua senha"
                    required />

                <button type="submit">Entrar</button>

                <p className="auth-link">
                    Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
                </p>
            </form>
        </div>
    )
}

export default Login