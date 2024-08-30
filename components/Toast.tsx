import React from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const toastStyles =
        type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white';

    return (
        <div
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 lg:translate-x-0 lg:left-4 lg:bottom-4 p-4 rounded shadow-lg z-50
            ${toastStyles} 
            w-11/12 lg:w-auto lg:max-w-sm
            `}
            style={{ transition: 'all 0.3s ease-in-out' }}
        >
            <div className="flex items-center justify-between">
                <span>{message}</span>
                <button
                    onClick={onClose}
                    className="ml-4 text-white focus:outline-none"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Toast;
