import React from 'react';
import { useToastContext } from '../../context/ToastContext';
import Toast from './Toast';
import './Toast.css';

const ToastContainer = () => {
    try {
        const { toasts, removeToast } = useToastContext();

        if (!toasts || toasts.length === 0) return null;

        return (
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        );
    } catch (error) {
        console.error('ToastContainer error:', error);
        return null;
    }
};

export default ToastContainer;
