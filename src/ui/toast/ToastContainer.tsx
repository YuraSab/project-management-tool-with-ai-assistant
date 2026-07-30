import React, {useCallback, useEffect, useState} from "react";
import { createPortal } from "react-dom";
import { nanoid } from "nanoid";
import { _subscribeToast, ToastType } from "../../utils/toaster";
import styles from './ToastContainer.module.css';

interface ToastItem {
    id: string,
    message: string,
    type: ToastType,
    isExiting?: boolean,
}

const TOAST_CONFIG: Record<ToastType, { backgroundColor: string; icon: string }> = {
    success: { backgroundColor: '#10B981', icon: '✓' },
    error: { backgroundColor: '#EF4444', icon: '✕' },
    info: { backgroundColor: '#3B82F6', icon: '🛈' },
    warning: { backgroundColor: '#F59E0B', icon: '⚠' }
};

export const ToastContainer = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const dismissToast = useCallback((id: string) => {
        // 1. First, set the exit status for disappear animation (style).
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
        );
        // 2. After timing delete element from array.
        setTimeout(() =>
            setToasts((prev) => prev.filter((t) => t.id !== id))
        , 300);
    }, []);

    useEffect(() => {
        // 1. SUBSCRIPTION: Pass the manager a function capable of updating the React state.
        const unsubscribe = _subscribeToast((message, type) => {
            const id = nanoid();
            // Add a new toast to the array
            setToasts((prev) => [...prev, {id, message, type}]);
            // After timing delete toast by function
            setTimeout(() =>
                dismissToast(id)
            , 3500);
        });
        return () => {
            unsubscribe();
        };
    }, [dismissToast]);

    return createPortal (
        <div className={styles.toastContainer}>
            {toasts.map((toast) => {
                const config = TOAST_CONFIG[toast.type];
                const cardClassName = `${styles.toastCard} ${toast.isExiting ? styles.slideOut : ''}`;
                return (
                    <div
                        key={toast.id}
                        className={cardClassName}
                        style={{backgroundColor: config.backgroundColor}}
                        onClick={() => dismissToast(toast.id)} // also smooth on click
                    >
                        <span>{config.icon}</span>
                        <span>{toast.message}</span>
                    </div>
                );
            })}
        </div>,
        document.body
    );
};
