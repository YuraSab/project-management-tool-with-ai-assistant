export type ToastType = 'success' | 'error' | 'info' | 'warning';
// Описуємо тип функції-слухача (коллбека)
type ToastEvent = (message: string, type: ToastType) => void;
// Сюди ми збережемо функцію, яку нам передасть React-компонент
let toastListener: ToastEvent | null = null;

// Об'єкт, який ми будемо імпортувати у хуки для виклику тостів
export const toast = {
    success: (msg: string) => toastListener && toastListener(msg, 'success'),
    error: (msg: string) => toastListener && toastListener(msg, 'error'),
    info: (msg: string) => toastListener && toastListener(msg, 'info'),
    warning: (msg: string) => toastListener && toastListener(msg, 'warning'),
};

// A function specifically for the React container so it can "subscribe" to updates
export const _subscribeToast = (listener: ToastEvent) => {
    toastListener = listener;   // store the React component's secret button
    return () => toastListener = null; // Return the "unsubscribe" function to avoid memory leaks.
};