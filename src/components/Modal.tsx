import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export default function Modal({ aberto, titulo, onFechar, children }) {
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{titulo}</h2>
          <button className="modal-fechar" onClick={onFechar}>×</button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}