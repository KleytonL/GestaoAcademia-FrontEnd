import { useEffect, useState } from "react"
import { IMaskInput } from "react-imask"
import { toast } from "react-hot-toast"
import { isAxiosError } from "axios"
import api from "../service/api"
import ConfirmModal from "../components/ConfirmModal"

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
    const [excluindoId, setExcluindoId] = useState<number | null>(null)
    const [filtroAtivo, setFiltroAtivo] = useState<string>('true')
    const [errors, setErrors] = useState<Record<string, string>>({})

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

    function tratarErro(error: unknown, mensagemGeral: string) {
        if (isAxiosError<Record<string, string>>(error)) {
            const data = error.response?.data

            if (error.response?.status === 400 && typeof data === 'object') {
                setErrors(data)
            } else if (data?.message?.includes('CPF')) {
                setErrors({ cpf: data.message })
            } else {
                toast.error(mensagemGeral)
            }
        } else {
            toast.error(mensagemGeral)
        }
        console.error(error)
    }

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        setErrors({})

        if (!validadeForm()) return

        if (editandoId) {
            api.put(`/usuarios/${editandoId}`, form).then(() => {
                toast.success('Usuário atualizado com sucesso!')
                setEditandoId(null)
                setForm({ nome: '', telefone: '', cpf: '', dataNascimento: '' })
                buscarUsuarios(filtroAtivo)
            }).catch(error => tratarErro(error, 'Erro ao atualizar usuário'))
        } else {
            api.post('/usuarios', form).then(() => {
                toast.success('Usuário cadastrado com sucesso!')
                setForm({ nome: '', telefone: '', cpf: '', dataNascimento: '' })
                buscarUsuarios(filtroAtivo)
            }).catch(error => tratarErro(error, 'Erro ao cadastrar usuário'))
        }
    }

    function handleEdit(usuario: Usuario) {
        setEditandoId(usuario.id)
        setForm({ nome: usuario.nome, telefone: usuario.telefone, cpf: usuario.cpf, dataNascimento: usuario.dataNascimento.split('/').reverse().join('-') })
        setErrors({})
    }

    function handleDelete(id: number) {
        api.delete(`/usuarios/${id}`).then(() => {
            toast.success('Usuário excluído com sucesso!')
            buscarUsuarios(filtroAtivo)
        }).catch(error => {
            toast.error('Erro ao excluir usuário')
            console.error(error)
        }).finally(() => setExcluindoId(null))
    }

    function handleCancelEdit() {
        setEditandoId(null)
        setForm({ nome: '', telefone: '', cpf: '', dataNascimento: '' })
        setErrors({})
    }

    function validadeForm() {
        if (!form.nome || !form.telefone || !form.cpf || !form.dataNascimento) {
            toast.error('Todos os campos são obrigatórios')
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
                    <h3>Nome<span className="obrigatorio">*</span></h3>
                    <input
                        name="nome"
                        placeholder="Insira seu nome aqui"
                        value={form.nome}
                        maxLength={25}
                        onChange={handleChange}
                        required />
                    {errors.nome && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.nome}</span>}
                    <br />
                    <h3>CPF<span className="obrigatorio">*</span></h3>
                    <IMaskInput
                        name="cpf"
                        placeholder="Insira seu CPF aqui"
                        value={form.cpf}
                        onChange={handleChange}
                        mask="000.000.000-00"
                        required
                    />
                    {errors.cpf && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.cpf}</span>}
                    <br />
                    <h3>Telefone<span className="obrigatorio">*</span></h3>
                    <IMaskInput
                        name="telefone"
                        placeholder="(xx) xxxx-xxxx"
                        value={form.telefone}
                        onChange={handleChange}
                        mask="(00) 00000-0000"
                        required
                    />
                    {errors.telefone && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.telefone}</span>}
                    <br />
                    <h3>Data de nascimento<span className="obrigatorio">*</span></h3>
                    <input
                        name="dataNascimento"
                        placeholder="Insira sua data de nascimento aqui"
                        type="date"
                        pattern="dd/MM/yyyy"
                        max={new Date().toISOString().split('T')[0]}
                        min="1900-01-01"
                        value={form.dataNascimento}
                        onChange={handleChange}
                        required />
                    {errors.dataNascimento && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.dataNascimento}</span>}
                    <br />
                    <div style={{ display: 'grid', gridTemplateColumns: editandoId ? '1fr 1fr' : '1fr', gap: '8px', marginTop: '8px' }}>
                        <button type="submit">{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
                        {editandoId && (
                            <button type="button" onClick={handleCancelEdit}>
                                Cancelar
                            </button>
                        )}
                    </div>
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
                            <tr key={usuario.id} className="linha-item">
                                <td>{usuario.nome}</td>
                                <td>{usuario.cpf}</td>
                                <td>{usuario.telefone}</td>
                                <td>{usuario.dataNascimento}</td>
                                <td>{usuario.ativo ? 'Ativo' : 'Inativo'}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', gap: '8px', minHeight: '36px' }}>
                                        {usuario.ativo && (
                                            <>
                                                <button onClick={() => setExcluindoId(usuario.id)}>Excluir</button>
                                                <button onClick={() => handleEdit(usuario)}>Editar</button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                isOpen={excluindoId !== null}
                onClose={() => setExcluindoId(null)}
                onConfirm={() => handleDelete(excluindoId!)}
                message="Tem certeza que deseja excluir este usuário?"
            />
        </div>
    )
}

export default Usuarios