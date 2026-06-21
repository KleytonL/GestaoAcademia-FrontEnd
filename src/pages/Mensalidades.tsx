import { useState } from "react"

interface Mensalidade {
    id: number
    alunoId: number
    alunoNome: string
    mesAno: string
    valor: number
    status: 'PAGO' | 'PENDENTE' | 'VENCIDO'
}

function Mensalidades() {
    const [mensalidades, setMensalidades] = useState<Mensalidade[]>([])


    return(
        <div className="page">
            <h1>Mensalidades</h1>
            <table>
                <thead>
                    <tr>
                        <th>Aluno</th>
                        <th>Mês/Ano</th>
                        <th>Valor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {mensalidades.map((mensalidade) => (
                        <tr key={mensalidade.id}>
                            <td>{mensalidade.alunoNome}</td>
                            <td>{mensalidade.mesAno}</td>
                            <td>{mensalidade.valor.toFixed(2)}</td>
                            <td>{mensalidade.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Mensalidades