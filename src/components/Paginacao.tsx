import "../styles/paginacao.css"

interface PaginacaoProps {
    pagina: number
    totalPaginas: number
    onMudar: (pagina: number) => void
}

function Paginacao({ pagina, totalPaginas, onMudar }: PaginacaoProps) {
    if (totalPaginas <= 1) return null

    const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)

    return (
        <div className="paginacao">
            <button type="button" onClick={() => onMudar(pagina - 1)} disabled={pagina === 1}>
                Anterior
            </button>
            {paginas.map(p => (
                <button
                    key={p}
                    type="button"
                    className={p === pagina ? "pagina-ativa" : ""}
                    onClick={() => onMudar(p)}>
                    {p}
                </button>
            ))}
            <button type="button" onClick={() => onMudar(pagina + 1)} disabled={pagina === totalPaginas}>
                Próxima
            </button>
        </div>
    )
}

export default Paginacao