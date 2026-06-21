import { useState } from "react"

interface Aluno {
    id: number
    nome: string
    email: string
    telefone: string
    plano: 'MENSAL' | 'TRIMESTRAL' | 'ANUAL'
}

interface AlunoForm {
    nome: string
    email: string
    telefone: string
    plano: 'MENSAL' | 'TRIMESTRAL' | 'ANUAL'
}

function Alunos() {
    const [alunos, setAlunos] = useState<Aluno[]>([])
    const [form, setForm] = useState<AlunoForm>({nome: '', email: '', telefone: '', plano: 'MENSAL'})

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value})
    }

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        console.log("Dados do formulário: ", form)
    }

    return(
        <div className="page">
            <h1>Alunos</h1>

            <h2>Cadastrar aluno</h2>
            <form onSubmit={handleSubmit}>
                <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
                <br/>
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                <br/>
                <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} />
                <br/>
                <select name="plano" value={form.plano} onChange={handleChange}>
                    <option value="MENSAL">Mensal</option>
                    <option value="TRIMENSAL">Trimensal</option>
                    <option value="ANUAL">Anual</option>
                </select>
                <br/>
                <button type="submit">Cadastrar</button>
            </form>

            <h2>Lista de alunos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Plano</th>
                    </tr>
                </thead>
                <tbody>
                    {alunos.map((aluno) => (
                        <tr key={aluno.id}>
                            <td>{aluno.nome}</td>
                            <td>{aluno.email}</td>
                            <td>{aluno.telefone}</td>
                            <td>{aluno.plano}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Alunos