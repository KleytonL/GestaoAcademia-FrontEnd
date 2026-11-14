import { useEffect } from "react"
import type { ReactNode } from "react"
import { createPortal } from "react-dom"
import "../styles/modal.css"

interface ModalProps {
    aberto: boolean
    titulo: string
    onFechar: () => void
    largo?: boolean
    children: ReactNode
}

function Modal({ aberto, titulo, onFechar, largo = false, children }: ModalProps) {
    useEffect(() => {
        if (!aberto) return

        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onFechar()
        }

        document.addEventListener("keydown", onKey)
        return () => document.removeEventListener("keydown", onKey)
    }, [aberto, onFechar])

    if (!aberto) return null

    return createPortal(
        <div className="modal-overlay" onClick={onFechar}>
            <div className={largo ? "modal-box modal-largo" : "modal-box"} onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{titulo}</h2>
                    <button type="button" className="modal-fechar" onClick={onFechar}>×</button>
                </header>
                <div className="modal-body">{children}</div>
            </div>
        </div>,
        document.body
    )
}

export default Modal