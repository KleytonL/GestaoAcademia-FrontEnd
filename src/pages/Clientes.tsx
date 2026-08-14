import { useEffect, useState } from "react"
import { IMaskInput } from "react-imask"
import api from "../service/api"

interface Cliente {
    id: number
    nome: string
    email: string
    telefone: string
    cpf: string
    dataNascimento: string
    dataCadastro: string
}

interface ClienteForm {
    nome: string
    email: string
    cpf: string
    telefone: string
    dataNascimento: string
}

function Clientes() {
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [form, setForm] = useState<ClienteForm>({nome: '', email: '', telefone: '', cpf: '', dataNascimento: ''})
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    useEffect(() => {
        api.get('/clientes').then(response => setClientes(response.data)).catch(error => console.error('Erro ao buscar clientes: ', error))
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value})
    }

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()

        setError('')
        setSuccess('')

        if (!validadeForm()) return

        if (editandoId) {

            api.put(`/clientes/${editandoId}`, form).then(() => {
                setSuccess('Cliente atualizado com sucesso!')
                setEditandoId(null)
                setForm({nome: '', email: '', telefone: '', cpf: '', dataNascimento: ''})
                api.get('/clientes').then(response => setClientes(response.data)).catch(error => console.error('Erro ao buscar clientes: ', error))
            }).catch(error => {
                setError('Erro ao atualizar cliente')
                console.error(error)
            })

        } else {
            api.post('/clientes', form).then(response => {
            setClientes([...clientes, response.data])
            setForm({nome: '', email: '', telefone: '', cpf: '', dataNascimento: ''})

            setSuccess('Cliente cadastrado com sucesso!')

        }).catch(error => {
            setError('Erro ao cadastrar cliente')
            console.error(error)
        })
        }
    }

    function handleEdit(cliente: Cliente) {
        setEditandoId(cliente.id)
        setForm({nome: cliente.nome, email: cliente.email, telefone: cliente.telefone, cpf: cliente.cpf, dataNascimento: cliente.dataNascimento.split('/').reverse().join('-')})
        setSuccess('')
        setError('')
    }


    function handleDelete(id: number) {
        if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return

        api.delete(`/clientes/${id}`).then(() => {
            setClientes(clientes.filter(cliente => cliente.id !== id))
            setSuccess('Cliente excluído com sucesso!')
        }).catch(error => {
            setError('Erro ao excluir cliente')
            console.error(error)
        })
    }

    function handleCancelEdit() {
        setEditandoId(null)
        setForm({nome: '', email: '', telefone: '', cpf: '', dataNascimento: ''})
        setSuccess('')
        setError('')
    }

    function validadeForm() {
        if (!form.nome || !form.email || !form.cpf || !form.telefone || !form.dataNascimento) {
            setError('Todos os campos são obrigatórios')
            return false
        }

        return true
    }

    return(
        <div className="page">
            <h1>Clientes</h1>

            <h2>{editandoId ? 'Editar cliente' : 'Cadastrar cliente'}</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'green'}}>{success}</p>}
                <h3>Nome</h3>
                <input name="nome" placeholder="Insira seu nome aqui" value={form.nome} onChange={handleChange} />
                <br/>
                <h3>Email</h3>
                <input name="email" placeholder="Insira seu email aqui" type="email" value={form.email} onChange={handleChange} />
                <br/>
                <h3>CPF</h3>
                <IMaskInput
                    name="cpf"
                    placeholder="Insira seu CPF aqui"
                    value={form.cpf}
                    onChange={handleChange}
                    mask="000.000.000-00"
                />
                <br/>
                <h3>Telefone</h3>
                <IMaskInput
                    name="telefone"
                    placeholder="(xx) xxxx-xxxx"
                    value={form.telefone}
                    onChange={handleChange}
                    mask="(00) 00000-0000"
                />
                <br/>
                <h3>Data de nascimento</h3>
                <input name="dataNascimento" placeholder="Insira sua data de nascimento aqui" type="date" pattern="dd/MM/yyyy" value={form.dataNascimento} onChange={handleChange} />
                <br/>
                <button type="submit">{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
                {editandoId && (
                    <button type="button" onClick={handleCancelEdit}>
                        Cancelar
                    </button>
                )}
            </form>

            <h2>Lista de clientes</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th>Data de nascimento</th>
                        <th>Data de cadastro</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.nome}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.cpf}</td>
                            <td>{cliente.telefone}</td>
                            <td>{cliente.dataNascimento}</td>
                            <td>{cliente.dataCadastro}</td>
                            <td>
                                <button onClick={() => handleEdit(cliente)}>Editar</button>
                                <button onClick={() => handleDelete(cliente.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Clientes