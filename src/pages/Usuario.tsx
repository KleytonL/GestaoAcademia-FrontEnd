import { useEffect, useState } from "react"
import { IMaskInput } from "react-imask"
import api from "../service/api"

interface Usuario {
    id: number
    nome: string
    telefone: string
    cpf: string
    dataNascimento: string
    ativo: boolean
}

interface UsuarioForm {
    nome: string
    cpf: string
    telefone: string
    dataNascimento: string
}

function Usuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [form, setForm] = useState<UsuarioForm>({ nome: '', telefone: '', cpf: '', dataNascimento: '' })
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [filtroAtivo, setFiltroAtivo] = useState<string>('true')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    function buscarUsuarios(filtro: string) {
        const params = filtro === 'todos' ? {} : { ativo: filtro }
        api.get('/usuarios', { params }).then(response => setUsuarios(response.data)).catch(error => console.error('Erro ao buscar usuários: ', error))
    }

    useEffect(() => {
        buscarUsuarios(filtroAtivo)
    }, [filtroAtivo])

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()

        setError('')
        setSuccess('')

        if (!validadeForm()) return

        if (editandoId) {

            api.put(`/usuarios/${editandoId}`, form).then(() => {
                setSuccess('Usuário atualizado com sucesso!')
                setEditandoId(null)
                setForm({ nome: '', telefone: '', cpf: '', dataNascimento: '' })
                buscarUsuarios(filtroAtivo)
            }).catch(error => {
                setError('Erro ao atualizar usuário')
                console.error(error)
            })

        } else {
            api.post('/usuarios', form).then(() => {
                setForm({ nome: '', telefone: '', cpf: '', dataNascimento: '' })
                setSuccess('Usuário cadastrado com sucesso!')
                buscarUsuarios(filtroAtivo)
            }).catch(error => {
                setError('Erro ao cadastrar usuário')
                console.error(error)
            })
        }
    }

    function handleEdit(usuario: Usuario) {
        setEditandoId(usuario.id)
        setForm({ nome: usuario.nome, telefone: usuario.telefone, cpf: usuario.cpf, dataNascimento: usuario.dataNascimento.split('/').reverse().join('-') })
        setSuccess('')
        setError('')
    }


    function handleDelete(id: number) {
        if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return

        api.delete(`/usuarios/${id}`).then(() => {
            setSuccess('Usuário excluído com sucesso!')
            buscarUsuarios(filtroAtivo)
        }).catch(error => {
            setError('Erro ao excluir usuário')
            console.error(error)
        })
    }

    function handleCancelEdit() {
        setEditandoId(null)
        setForm({ nome: '', telefone: '', cpf: '', dataNascimento: '' })
        setSuccess('')
        setError('')
    }

    function validadeForm() {
        if (!form.nome || !form.telefone || !form.cpf || !form.dataNascimento) {
            setError('Todos os campos são obrigatórios')
            return false
        }
        if (new Date(form.dataNascimento) > new Date()) {
            setError('A data de nascimento não pode passar da data atual')
            return false
        }
        return true
    }

    return (
        <div className="page">
            <div>
                <h1>Usuários</h1>

                <h2>{editandoId ? 'Editar usuário' : 'Cadastrar usuário'}</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <h3>Nome</h3>
                    <input
                        name="nome"
                        placeholder="Insira seu nome aqui"
                        value={form.nome}
                        onChange={handleChange} />
                    <br />
                    <h3>CPF</h3>
                    <IMaskInput
                        name="cpf"
                        placeholder="Insira seu CPF aqui"
                        value={form.cpf}
                        onChange={handleChange}
                        mask="000.000.000-00"
                    />
                    <br />
                    <h3>Telefone</h3>
                    <IMaskInput
                        name="telefone"
                        placeholder="(xx) xxxx-xxxx"
                        value={form.telefone}
                        onChange={handleChange}
                        mask="(00) 00000-0000"
                    />
                    <br />
                    <h3>Data de nascimento</h3>
                    <input
                        name="dataNascimento"
                        placeholder="Insira sua data de nascimento aqui"
                        type="date"
                        pattern="dd/MM/yyyy"
                        value={form.dataNascimento}
                        onChange={handleChange} />
                    <br />
                    <button type="submit">{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
                    {editandoId && (
                        <button type="button" onClick={handleCancelEdit}>
                            Cancelar
                        </button>
                    )}
                </form>
            </div>
            <div>
                <h2>Lista de usuários</h2>
                <label>
                    Filtrar:
                    <select value={filtroAtivo} onChange={(e) => setFiltroAtivo(e.target.value)}>
                        <option value="true">Ativos</option>
                        <option value="false">Inativos</option>
                        <option value="todos">Todos</option>
                    </select>
                </label>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Telefone</th>
                            <th>Data de nascimento</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.nome}</td>
                                <td>{usuario.cpf}</td>
                                <td>{usuario.telefone}</td>
                                <td>{usuario.dataNascimento}</td>
                                <td>{usuario.ativo ? 'Ativo' : 'Inativo'}</td>
                                <td>
                                    <button onClick={() => handleEdit(usuario)}>Editar</button>
                                    <button onClick={() => handleDelete(usuario.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Usuarios