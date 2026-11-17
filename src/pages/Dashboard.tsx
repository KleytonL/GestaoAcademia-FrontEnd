import { useEffect, useState } from "react"
import api from "../service/api"
import "../styles/pages.css"
import "../styles/dashboard.css"

interface Usuario {
    id: number
    ativo: boolean
}

interface Plano {
    id: number
    ativo: boolean
}

interface Ficha {
    id: number
}

function Dashboard() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [planos, setPlanos] = useState<Plano[]>([])
    const [fichas, setFichas] = useState<Ficha[]>([])

    useEffect(() => {
        api.get('/usuarios').then(response => setUsuarios(response.data)).catch(error => console.error('Erro ao buscar usuários: ', error))
        api.get('/planos').then(response => setPlanos(response.data)).catch(error => console.error('Erro ao buscar planos: ', error))
        api.get('/fichas').then(response => setFichas(response.data)).catch(error => console.error('Erro ao buscar fichas: ', error))
    }, [])

    const usuariosAtivos = usuarios.filter(u => u.ativo).length
    const usuariosInativos = usuarios.length - usuariosAtivos
    const planosAtivos = planos.filter(p => p.ativo).length

    return (
        <div className="page">
            <div>
                <h1>Dashboard</h1>
            </div>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <p>Usuários ativos</p>
                    <strong>{usuariosAtivos}</strong>
                </div>
                <div className="dashboard-card">
                    <p>Usuários inativos</p>
                    <strong>{usuariosInativos}</strong>
                </div>
                <div className="dashboard-card">
                    <p>Planos ativos</p>
                    <strong>{planosAtivos}</strong>
                </div>
                <div className="dashboard-card">
                    <p>Fichas cadastradas</p>
                    <strong>{fichas.length}</strong>
                </div>
            </div>
        </div>
    )
}

export default Dashboard