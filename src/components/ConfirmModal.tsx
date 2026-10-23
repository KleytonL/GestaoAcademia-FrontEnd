interface Props {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    message: string
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }: Props) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="btn-cancel" onClick={onClose}>Cancelar</button>
                    <button className="btn-confirm" onClick={onConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    )
}