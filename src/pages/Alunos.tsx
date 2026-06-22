import { useEffect, useState } from "react"
import api from "../service/api"

interface Aluno {
    id: number
    nome: string
    email: string
    telefone: string
    dataNascimento: string
    plano: 'MENSAL' | 'TRIMESTRAL' | 'ANUAL'
}

interface AlunoForm {
    nome: string
    email: string
    telefone: string
    dataNascimento: string
    plano: 'MENSAL' | 'TRIMESTRAL' | 'ANUAL'
}

function Alunos() {
    const [alunos, setAlunos] = useState<Aluno[]>([])
    const [form, setForm] = useState<AlunoForm>({nome: '', email: '', telefone: '', dataNascimento: '', plano: 'MENSAL'})
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    useEffect(() => {
        api.get('/alunos').then(response => setAlunos(response.data)).catch(error => console.error('Erro ao buscar alunos: ', error))
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value})
    }

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()

        setError('')
        setSuccess('')

        if (!validadeForm()) return

        api.post('/alunos', form).then(response => {
            setAlunos([...alunos, response.data])
            setForm({nome: '', email: '', telefone: '', dataNascimento: '', plano: 'MENSAL'})

            setSuccess('Aluno cadastrado com sucesso!')

        }).catch(error => {
            setError('Erro ao cadastrar aluno')
            console.error(error)
        })
    }

    function validadeForm() {
        if (!form.nome || !form.email || !form.telefone || !form.dataNascimento) {
            setError('Todos os campos são obrigatórios')
            return false
        }

        return true
    }

    return(
        <div className="page">
            <h1>Alunos</h1>

            <h2>Cadastrar aluno</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'green'}}>{success}</p>}
                <h3>Nome</h3>
                <input name="nome" placeholder="Insira seu nome aqui" value={form.nome} onChange={handleChange} />
                <br/>
                <h3>Email</h3>
                <input name="email" placeholder="Insira seu email aqui" type="email" value={form.email} onChange={handleChange} />
                <br/>
                <h3>Telefone</h3>
                <input name="telefone" placeholder="(xx) xxxx-xxxx" type="tel" value={form.telefone} onChange={handleChange} maxLength={15} />
                <br/>
                <h3>Data de nascimento</h3>
                <input name="dataNascimento" placeholder="Insira sua data de nascimento aqui" type="date" pattern="dd/MM/yyyy" value={form.dataNascimento} onChange={handleChange} />
                <br/>
                <h3>Plano</h3>
                <select name="plano" value={form.plano} onChange={handleChange}>
                    <option value="MENSAL">Mensal</option>
                    <option value="TRIMESTRAL">Trimestral</option>
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
                        <th>Data de nascimento</th>
                        <th>Plano</th>
                    </tr>
                </thead>
                <tbody>
                    {alunos.map((aluno) => (
                        <tr key={aluno.id}>
                            <td>{aluno.nome}</td>
                            <td>{aluno.email}</td>
                            <td>{aluno.telefone}</td>
                            <td>{aluno.dataNascimento}</td>
                            <td>{aluno.plano}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Alunos