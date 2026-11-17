import { useEffect, useState } from "react"
import api from "../service/api"
import "../styles/pages.css"
import "../styles/controlarplano.css"

interface Plano {
    id: number
    nome: string
    valor: number
    duracao: number
    descricao: string
    ativo: boolean
}

function ControlarPlano() {
    const [planos, setPlanos] = useState<Plano[]>([])

    useEffect(() => {
        api.get('/planos', { params: { ativo: true } })
            .then(response => setPlanos(response.data))
            .catch(error => console.error('Erro ao buscar planos: ', error))
    }, [])

    return (
        <div className="page">
            <div>
                <h1>Meu plano</h1>
            </div>

            {/* Plano atual */}
            <section className="plano-atual">
                <h2>Plano atual</h2>
                <p>Plano: --</p>
                <p>Status: --</p>
                <p>Vencimento: DD/MM</p>
                <button type="button">Cancelar plano</button>
            </section>

            {/* Planos disponíveis (vindos do banco) */}
            <section>
                <h2>Planos disponíveis</h2>
                <div className="planos-lista">
                    {planos.length === 0 && <p>Nenhum plano disponível</p>}

                    {planos.map(plano => (
                        <div key={plano.id} className="plano-item">
                            <h3>{plano.nome}</h3>
                            <p>R$ {plano.valor.toFixed(2).replace('.', ',')} - {plano.duracao} dias</p>
                            <p>{plano.descricao}</p>
                            {/* TODO: assinar o plano */}
                            <button type="button">Assinar</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Histórico: TODO preencher com as assinaturas do cliente */}
            <section>
                <h2>Histórico</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Plano</th>
                            <th>Início</th>
                            <th>Fim</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={4}>Nenhuma assinatura encontrada</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    )
}

export default ControlarPlano