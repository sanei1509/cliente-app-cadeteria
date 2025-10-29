import { useEffect } from 'react';

/**
 * Componente Modal reutilizable
 *
 * Props:
 * - isOpen (boolean): Controla si el modal está visible o no
 * - onClose (function): Función que se ejecuta al cerrar el modal
 * - children (ReactNode): Contenido que se renderiza dentro del modal
 *
 * Ejemplo de uso:
 * <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
 *   <h2>Mi título</h2>
 *   <form>...</form>
 * </Modal>
 */
const Modal = ({ isOpen, onClose, children }) => {
    // Bloquear el scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup: restaurar scroll al desmontar
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // No renderizar nada si el modal está cerrado
    if (!isOpen) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onClose} // Cerrar al hacer clic fuera del contenido
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999
            }}
        >
            {/* Contenido del modal */}
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()} // Evitar que clicks dentro cierren el modal
                style={{
                    position: 'relative',
                    zIndex: 100000
                }}
            >
                {/* Botón X para cerrar */}
                <button className="modal-close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>

                {/* Aquí se renderiza el contenido pasado como children */}
                {children}
            </div>
        </div>
    );
};

export default Modal;
