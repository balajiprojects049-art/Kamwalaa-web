import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <FiCheckCircle />,
        error: <FiAlertCircle />,
        warning: <FiAlertCircle />,
        info: <FiInfo />
    };

    return (
        <div className={`toast toast-${type} animate-fade-in-up`}>
            <div className="toast-icon">{icons[type]}</div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={onClose} aria-label="Close">
                <FiX />
            </button>
        </div>
    );
};

export default Toast;
