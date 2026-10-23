import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { isAxiosError } from "axios"
import api from "../service/api"
import ConfirmModal from "../components/ConfirmModal"

interface Exercicio {
    id: number
    nome: string
    grupo: string
}

interface UsuarioResumo {
    id: number
    nome: string
}

interface FichaExercicio {
    id: number
    exercicioId: number
    exercicioNome: string
    exercicioGrupo: string
    series: number
    repeticoes: number
    carga: number
    descanso: number
}

interface Ficha {
    id: number
    nome: string
    descricao: string
    dataCriacao: string
    usuarioId: number
    usuarioNome: string
    exercicios: FichaExercicio[]
}

interface FichaForm {
    nome: string
    descricao: string
    usuarioId: string
}

interface ItemForm {
    exercicioId: string
    series: string
    repeticoes: string
    carga: string
    descanso: string
}

const FORM_VAZIO: FichaForm = { nome: '', descricao: '', usuarioId: '' }
const ITEM_VAZIO: ItemForm = { exercicioId: '', series: '', repeticoes: '', carga: '', descanso: '' }

function Fichas() {
    const [fichas, setFichas] = useState<Ficha[]>([])
    const [exercicios, setExercicios] = useState<Exercicio[]>([])
    const [usuarios, setUsuarios] = useState<UsuarioResumo[]>([])
    const [form, setForm] = useState<FichaForm>(FORM_VAZIO)
    const [itens, setItens] = useState<ItemForm[]>([{ ...ITEM_VAZIO }])
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [excluindoId, setExcluindoId] = useState<number | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const erroItens = errors.series ?? errors.repeticoes ?? errors.carga ?? errors.descanso

    function buscarFichas() {
        api.get('/fichas').then(response => setFichas(response.data)).catch(error => console.error('Erro ao buscar fichas: ', error))
    }

    useEffect(() => {
        buscarFichas()
        api.get('/exercicios').then(response => setExercicios(response.data)).catch(error => console.error('Erro ao buscar exercícios: ', error))
        api.get('/usuarios', { params: { ativo: true } }).then(response => setUsuarios(response.data)).catch(error => console.error('Erro ao buscar usuários: ', error))
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleItemChange(index: number, campo: keyof ItemForm, valor: string) {
        setItens(itens.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)))
    }

    function adicionarItem() {
        setItens([...itens, { ...ITEM_VAZIO }])
    }

    function removerItem(index: number) {
        setItens(itens.filter((_, i) => i !== index))
    }

    function resetarForm() {
        setEditandoId(null)
        setForm(FORM_VAZIO)
        setItens([{ ...ITEM_VAZIO }])
        setErrors({})
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

    function validadeForm() {
        if (!form.nome || !form.usuarioId) {
            toast.error('Preencha todos os campos obrigatórios')
            return false
        }

        const itemIncompleto = itens.some(i => !i.exercicioId || !i.series || !i.repeticoes || !i.carga || !i.descanso)
        if (itens.length === 0 || itemIncompleto) {
            toast.error('Preencha todos os dados de cada exercício')
            return false
        }

        return true
    }

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        setErrors({})

        if (!validadeForm()) return

        const payload = {
            nome: form.nome,
            descricao: form.descricao,
            usuarioId: Number(form.usuarioId),
            exercicios: itens.map(i => ({
                exercicioId: Number(i.exercicioId),
                series: Number(i.series),
                repeticoes: Number(i.repeticoes),
                carga: Number(i.carga),
                descanso: Number(i.descanso)
            }))
        }

        if (editandoId) {
            api.put(`/fichas/${editandoId}`, payload).then(() => {
                toast.success('Ficha atualizada com sucesso!')
                resetarForm()
                buscarFichas()
            }).catch(error => tratarErro(error, 'Erro ao atualizar ficha'))
        } else {
            api.post('/fichas', payload).then(() => {
                toast.success('Ficha cadastrada com sucesso!')
                resetarForm()
                buscarFichas()
            }).catch(error => tratarErro(error, 'Erro ao cadastrar ficha'))
        }
    }

    function handleEdit(ficha: Ficha) {
        setEditandoId(ficha.id)
        setForm({ nome: ficha.nome, descricao: ficha.descricao ?? '', usuarioId: String(ficha.usuarioId) })
        setItens(ficha.exercicios.map(e => ({
            exercicioId: String(e.exercicioId),
            series: String(e.series),
            repeticoes: String(e.repeticoes),
            carga: String(e.carga),
            descanso: String(e.descanso)
        })))
        setErrors({})
    }

    function handleDelete(id: number) {
        api.delete(`/fichas/${id}`).then(() => {
            toast.success('Ficha excluída com sucesso!')
            buscarFichas()
        }).catch(error => {
            toast.error('Erro ao excluir ficha')
            console.error(error)
        }).finally(() => setExcluindoId(null))
    }

    return (
        <div className="page">
            <div>
                <h1>Fichas</h1>

                <h2>{editandoId ? 'Editar ficha' : 'Cadastrar ficha'}</h2>
                <form onSubmit={handleSubmit}>
                    <h3>Nome da ficha<span className="obrigatorio">*</span></h3>
                    <input
                        name="nome"
                        placeholder="Insira o nome da ficha"
                        value={form.nome}
                        maxLength={50}
                        onChange={handleChange}
                        required />
                    {errors.nome && <span className="erro-campo">{errors.nome}</span>}
                    <br />
                    <h3>Cliente<span className="obrigatorio">*</span></h3>
                    <select
                        name="usuarioId"
                        value={form.usuarioId}
                        onChange={handleChange}
                        disabled={editandoId !== null}
                        required>
                        <option value="">Selecione o cliente</option>
                        {usuarios.map(u => (
                            <option key={u.id} value={u.id}>{u.nome}</option>
                        ))}
                    </select>
                    <br />
                    <h3>Descrição</h3>
                    <textarea
                        name="descricao"
                        placeholder="Insira a descrição da ficha"
                        value={form.descricao}
                        maxLength={255}
                        onChange={handleChange} />
                    {errors.descricao && <span className="erro-campo">{errors.descricao}</span>}
                    <br />
                    <h3>Exercícios<span className="obrigatorio">*</span></h3>
                    {itens.map((item, index) => (
                        <div key={index} className="item-ficha">
                            <select
                                value={item.exercicioId}
                                onChange={(e) => handleItemChange(index, 'exercicioId', e.target.value)}
                                required>
                                <option value="">Exercício</option>
                                {exercicios.map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.nome} ({ex.grupo})</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min="1"
                                placeholder="Séries"
                                value={item.series}
                                onChange={(e) => handleItemChange(index, 'series', e.target.value)}
                                required />
                            <input
                                type="number"
                                min="1"
                                placeholder="Repetições"
                                value={item.repeticoes}
                                onChange={(e) => handleItemChange(index, 'repeticoes', e.target.value)}
                                required />
                            <input
                                type="number"
                                min="0"
                                placeholder="Carga"
                                value={item.carga}
                                onChange={(e) => handleItemChange(index, 'carga', e.target.value)}
                                required />
                            <input
                                type="number"
                                min="0"
                                placeholder="Descanso"
                                value={item.descanso}
                                onChange={(e) => handleItemChange(index, 'descanso', e.target.value)}
                                required />
                            <button type="button" onClick={() => removerItem(index)} disabled={itens.length === 1}>
                                Remover
                            </button>
                        </div>
                    ))}
                    {erroItens && <span className="erro-campo">{erroItens}</span>}
                    <button type="button" onClick={adicionarItem}>Adicionar exercício</button>
                    <br />
                    <div className="acoes-form">
                        <button type="submit">{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
                        {editandoId && (
                            <button type="button" onClick={resetarForm}>Cancelar</button>
                        )}
                    </div>
                </form>
            </div>
            <div>
                <h2>Lista de fichas</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Cliente</th>
                            <th>Criada em</th>
                            <th>Exercícios</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fichas.map((ficha) => (
                            <tr key={ficha.id}>
                                <td>{ficha.nome}</td>
                                <td>{ficha.usuarioNome}</td>
                                <td>{ficha.dataCriacao.split('-').reverse().join('/')}</td>
                                <td>
                                    <ul className="lista-exercicios">
                                        {ficha.exercicios.map(e => (
                                            <li key={e.id}>{e.exercicioNome} ({e.series}x{e.repeticoes})</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <div className="acoes-linha">
                                        <button onClick={() => handleEdit(ficha)}>Editar</button>
                                        <button onClick={() => setExcluindoId(ficha.id)}>Excluir</button>
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
                message="Tem certeza que deseja excluir esta ficha?"
            />
        </div>
    )
}

export default Fichas