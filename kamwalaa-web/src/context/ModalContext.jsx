import React, { createContext, useContext, useState, useCallback } from 'react';
import './Modal.css';

const ModalContext = createContext();

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState(null);

    const showModal = useCallback((options) => {
        setModal(options);
    }, []);

    const hideModal = useCallback(() => {
        setModal(null);
    }, []);

    const confirm = useCallback((title, message, onConfirm) => {
        showModal({
            type: 'confirm',
            title,
            message,
            onConfirm: () => {
                onConfirm?.();
                hideModal();
            },
            onCancel: hideModal
        });
    }, [showModal, hideModal]);

    const alert = useCallback((title, message, onClose) => {
        showModal({
            type: 'alert',
            title,
            message,
            onClose: () => {
                onClose?.();
                hideModal();
            }
        });
    }, [showModal, hideModal]);

    return (
        <ModalContext.Provider value={{ showModal, hideModal, confirm, alert }}>
            {children}
            {modal && <CustomModal {...modal} onClose={hideModal} />}
        </ModalContext.Provider>
    );
};

const CustomModal = ({ type, title, message, onConfirm, onCancel, onClose }) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div className="custom-modal-backdrop" onClick={handleBackdropClick}>
            <div className="custom-modal">
                <div className="custom-modal-header">
                    <h3 className="custom-modal-title">{title}</h3>
                    <button
                        className="custom-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="custom-modal-body">
                    <p className="custom-modal-message">{message}</p>
                </div>

                <div className="custom-modal-footer">
                    {type === 'confirm' ? (
                        <>
                            <button
                                className="custom-modal-btn custom-modal-btn-secondary"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="custom-modal-btn custom-modal-btn-primary"
                                onClick={onConfirm}
                            >
                                Confirm
                            </button>
                        </>
                    ) : (
                        <button
                            className="custom-modal-btn custom-modal-btn-primary"
                            onClick={onClose}
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
