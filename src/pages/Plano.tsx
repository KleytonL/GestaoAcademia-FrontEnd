import { useEffect, useState } from "react"
import { IMaskInput } from "react-imask"
import { toast } from "react-hot-toast"
import { isAxiosError } from "axios"
import api from "../service/api"
import ConfirmModal from "../components/ConfirmModal"

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
    const [excluindoId, setExcluindoId] = useState<number | null>(null)
    const [filtroAtivo, setFiltroAtivo] = useState<string>('true')
    const [errors, setErrors] = useState<Record<string, string>>({})

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

    function tratarErro(error: unknown, mensagemGeral: string) {
        if (isAxiosError<Record<string, string>>(error)) {
            const data = error.response?.data

            if (error.response?.status === 400 && typeof data === 'object') {
                setErrors(data)
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

        const payload = {
            nome: form.nome,
            valor: valorNumerico,
            duracao: parseInt(form.duracao),
            descricao: form.descricao
        }

        if (editandoId) {
            api.put(`/planos/${editandoId}`, payload).then(() => {
                toast.success('Plano atualizado com sucesso!')
                setEditandoId(null)
                setForm({ nome: '', valor: '', duracao: '', descricao: '' })
                buscarPlanos(filtroAtivo)
            }).catch(error => tratarErro(error, 'Erro ao atualizar plano'))
        } else {
            api.post('/planos', payload).then(() => {
                toast.success('Plano cadastrado com sucesso!')
                setForm({ nome: '', valor: '', duracao: '', descricao: '' })
                buscarPlanos(filtroAtivo)
            }).catch(error => tratarErro(error, 'Erro ao cadastrar plano'))
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
        setErrors({})
    }

    function handleDelete(id: number) {
        api.delete(`/planos/${id}`).then(() => {
            toast.success('Plano excluído com sucesso!')
            buscarPlanos(filtroAtivo)
        }).catch(error => {
            toast.error('Erro ao excluir plano')
            console.error(error)
        }).finally(() => setExcluindoId(null))
    }

    function handleCancelEdit() {
        setEditandoId(null)
        setForm({ nome: '', valor: '', duracao: '', descricao: '' })
        setErrors({})
    }

    function validadeForm() {
        if (!form.nome || !form.valor || !form.duracao) {
            toast.error('Preencha todos os campos obrigatórios')
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
                    <h3>Nome<span className="obrigatorio">*</span></h3>
                    <input
                        name="nome"
                        placeholder="Insira o nome do plano"
                        value={form.nome}
                        maxLength={50}
                        onChange={handleChange}
                        required />
                    {errors.nome && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.nome}</span>}
                    <br />
                    <h3>Valor<span className="obrigatorio">*</span></h3>
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
                    {errors.valor && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.valor}</span>}
                    <br />
                    <h3>Duração (dias)<span className="obrigatorio">*</span></h3>
                    <input
                        name="duracao"
                        placeholder="Insira a duração em dias"
                        type="number"
                        value={form.duracao}
                        onChange={handleChange}
                        required />
                    {errors.duracao && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.duracao}</span>}
                    <br />
                    <h3>Descrição</h3>
                    <textarea
                        name="descricao"
                        placeholder="Insira a descrição do plano"
                        value={form.descricao}
                        maxLength={255}
                        onChange={handleChange}
                        />
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
                                <td className="descricao-wrap" title={plano.descricao}>{plano.descricao}</td>
                                <td>{plano.ativo ? 'Ativo' : 'Inativo'}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', gap: '8px', minHeight: '36px' }}>
                                        {plano.ativo && (
                                            <>
                                                <button onClick={() => handleEdit(plano)}>Editar</button>
                                                <button onClick={() => setExcluindoId(plano.id)}>Excluir</button>
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
                message="Tem certeza que deseja excluir este plano?"
            />
        </div>
    )
}

export default Planos