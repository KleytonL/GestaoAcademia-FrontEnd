import { Link } from "react-router-dom"
import { IMaskInput } from "react-imask"
import "../styles/auth.css"

function Cadastro() {
    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        // TODO: validar e cadastrar o usuário
    }

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Criar conta</h1>

                <h3>Nome<span className="obrigatorio">*</span></h3>
                <input
                    name="nome"
                    placeholder="Insira seu nome"
                    maxLength={25}
                    required />

                <h3>CPF<span className="obrigatorio">*</span></h3>
                <IMaskInput
                    name="cpf"
                    placeholder="Insira seu CPF"
                    mask="000.000.000-00"
                    required />

                <h3>Telefone<span className="obrigatorio">*</span></h3>
                <IMaskInput
                    name="telefone"
                    placeholder="(xx) xxxxx-xxxx"
                    mask="(00) 00000-0000"
                    required />

                <h3>Data de nascimento<span className="obrigatorio">*</span></h3>
                <input
                    name="dataNascimento"
                    type="date"
                    min="1900-01-01"
                    max={new Date().toISOString().split('T')[0]}
                    required />

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
                    placeholder="Crie uma senha"
                    required />

                <h3>Confirmar senha<span className="obrigatorio">*</span></h3>
                <input
                    name="confirmarSenha"
                    type="password"
                    placeholder="Repita a senha"
                    required />

                <button type="submit">Cadastrar</button>

                <p className="auth-link">
                    Já tem conta? <Link to="/login">Entrar</Link>
                </p>
            </form>
        </div>
    )
}

export default Cadastro