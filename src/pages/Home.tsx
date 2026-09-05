import { useEffect, useState } from "react"
import academiaImg from '../assets/academia.jpg'
import api from "../service/api"

interface Plano {
    id: number
    nome: string
    valor: number
    duracao: number
    descricao: string
}

function Home() {
    const [planos, setPlanos] = useState<Plano[]>([])
    const [totalUsuarios, setTotalUsuarios] = useState<number>(0)

    useEffect(() => {
        api.get('/planos', { params: { ativo: true } })
            .then(response => setPlanos(response.data.slice(0, 3)))
            .catch(error => console.error('Erro ao buscar planos: ', error))

        api.get('/usuarios', { params: { ativo: true } })
            .then(response => setTotalUsuarios(response.data.length))
            .catch(error => console.error('Erro ao buscar usuários: ', error))
    }, [])

    return (
        <>
            <section className="hero" style={{ backgroundImage: `linear-gradient(to right, #F56C23, #F56C2300), url(${academiaImg})` }}>
                <div className="overlay">
                    <h1>VIVA A ADRENALINA!<br />SINTA A MUDANÇA!</h1>
                    <p>Bem-vindo ao sistema de gerenciamento de alunos e planos</p>
                </div>
            </section>

            <section className="planos-destaque">
                <h2>Nossos Planos</h2>
                <div className="cards-planos">
                    {planos.map(plano => (
                        <div className="card-plano" key={plano.id}>
                            <h3>{plano.nome}</h3>
                            <p className="card-valor">R$ {plano.valor.toFixed(2)}</p>
                            <p className="card-duracao">{plano.duracao} dias</p>
                            <p className="card-descricao">{plano.descricao}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="stats" style={{ backgroundImage: `linear-gradient(to left, #2A2A2A, #2A2A2AFA, #2A2A2A00), url(${academiaImg})` }}>
                <div className="stats-overlay">
                    <h2>{totalUsuarios}+ alunos já treinam com a gente</h2>
                    <p>Junte-se à nossa comunidade e comece sua transformação hoje mesmo.</p>
                </div>
            </section>
        </>
    )
}

export default Home