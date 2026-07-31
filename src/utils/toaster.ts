export type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastEvent = (message: string, type: ToastType) => void;
// We will store the function passed to us by the React component here.
let toastListener: ToastEvent | null = null;

// toast hook
export const toast = {
    success: (msg: string) => toastListener?.(msg, 'success'),
    error: (msg: string) => toastListener?.(msg, 'error'),
    info: (msg: string) => toastListener?.(msg, 'info'),
    warning: (msg: string) => toastListener?.(msg, 'warning'),
};

// A function specifically for the React container, so it can "subscribe" to updates
export const _subscribeToast = (listener: ToastEvent) => {
    toastListener = listener;   // store the React component's secret button
    return () => toastListener = null; // Return the "unsubscribe" function to avoid memory leaks.
};