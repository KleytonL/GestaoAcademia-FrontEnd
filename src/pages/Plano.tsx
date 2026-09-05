import { useEffect, useState } from "react"
import { IMaskInput } from "react-imask"
import api from "../service/api"

interface Plano {
    id: number
    nome: string
    valor: number
    duracao: number
    descricao: string
    ativo: boolean
}

interface PlanoForm {
    nome: string
    valor: string
    duracao: string
    descricao: string
}

function Planos() {
    const [planos, setPlanos] = useState<Plano[]>([])
    const [form, setForm] = useState<PlanoForm>({ nome: '', valor: '', duracao: '', descricao: '' })
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [filtroAtivo, setFiltroAtivo] = useState<string>('true')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    const valorNumerico = parseFloat(form.valor.replace('R$ ', '').replace('.', '').replace(',', '.'))

    function buscarPlanos(filtro: string) {
        const params = filtro === 'todos' ? {} : { ativo: filtro }
        api.get('/planos', { params }).then(response => setPlanos(response.data)).catch(error => console.error('Erro ao buscar planos: ', error))
    }

    useEffect(() => {
        buscarPlanos(filtroAtivo)
    }, [filtroAtivo])

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()

        setError('')
        setSuccess('')

        if (!validadeForm()) return

        const payload = {
            nome: form.nome,
            valor: valorNumerico,
            duracao: parseInt(form.duracao),
            descricao: form.descricao
        }

        if (editandoId) {
            api.put(`/planos/${editandoId}`, payload).then(() => {
                setSuccess('Plano atualizado com sucesso!')
                setEditandoId(null)
                setForm({ nome: '', valor: '', duracao: '', descricao: '' })
                buscarPlanos(filtroAtivo)
            }).catch(error => {
                setError('Erro ao atualizar plano')
                console.error(error)
            })

        } else {
            api.post('/planos', payload).then(() => {
                setForm({ nome: '', valor: '', duracao: '', descricao: '' })
                setSuccess('Plano cadastrado com sucesso!')
                buscarPlanos(filtroAtivo)
            }).catch(error => {
                setError('Erro ao cadastrar plano')
                console.error(error)
            })
        }
    }

    function handleEdit(plano: Plano) {
        setEditandoId(plano.id)
        setForm({
            nome: plano.nome,
            valor: plano.valor.toFixed(2).replace('.', ','),
            duracao: String(plano.duracao),
            descricao: plano.descricao
        })
        setSuccess('')
        setError('')
    }

    function handleDelete(id: number) {
        if (!window.confirm('Tem certeza que deseja excluir este plano?')) return

        api.delete(`/planos/${id}`).then(() => {
            setSuccess('Plano excluído com sucesso!')
            buscarPlanos(filtroAtivo)
        }).catch(error => {
            setError('Erro ao excluir plano')
            console.error(error)
        })
    }

    function handleCancelEdit() {
        setEditandoId(null)
        setForm({ nome: '', valor: '', duracao: '', descricao: '' })
        setSuccess('')
        setError('')
    }

    function validadeForm() {
        if (!form.nome || !form.valor || !form.duracao) {
            setError('Nome, valor e duração são obrigatórios')
            return false
        }

        return true
    }

    return (
        <div className="page">
            <div>
                <h1>Planos</h1>

                <h2>{editandoId ? 'Editar plano' : 'Cadastrar plano'}</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <h3>Nome</h3>
                    <input
                        name="nome"
                        placeholder="Insira o nome do plano"
                        value={form.nome}
                        onChange={handleChange} />
                    <br />
                    <h3>Valor</h3>
                    <IMaskInput
                        name="valor"
                        placeholder="R$ 0,00"
                        value={form.valor}
                        onAccept={(value) => setForm({ ...form, valor: value })}
                        mask="R$ num"
                        blocks={{
                            num: {
                                mask: Number,
                                thousandsSeparator: '.',
                                radix: ',',
                                scale: 2,
                                padFractionalZeros: true,
                                normalizeZeros: true,
                            }
                        }}
                    />
                    <br />
                    <h3>Duração (dias)</h3>
                    <input
                        name="duracao"
                        placeholder="Insira a duração em dias"
                        type="number"
                        value={form.duracao}
                        onChange={handleChange} />
                    <br />
                    <h3>Descrição</h3>
                    <textarea
                        name="descricao"
                        placeholder="Insira a descrição do plano"
                        value={form.descricao}
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
                <h2>Lista de planos</h2>
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
                            <th>Valor</th>
                            <th>Duração</th>
                            <th>Descrição</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {planos.map((plano) => (
                            <tr key={plano.id}>
                                <td>{plano.nome}</td>
                                <td>R$ {plano.valor.toFixed(2)}</td>
                                <td>{plano.duracao} dias</td>
                                <td>{plano.descricao}</td>
                                <td>{plano.ativo ? 'Ativo' : 'Inativo'}</td>
                                <td>
                                    <button onClick={() => handleEdit(plano)}>Editar</button>
                                    <button onClick={() => handleDelete(plano.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Planos