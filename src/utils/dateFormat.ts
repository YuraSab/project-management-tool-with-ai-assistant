import { Timestamp } from "firebase/firestore";

export type DateInput = Timestamp | Date | string | number | { toDate: () => Date } | null | undefined;

export const formatDateForInput = (date: DateInput) => {
    if (!date) return "";
    const d = typeof (date as Timestamp).toDate === 'function'
        ? (date as Timestamp).toDate()
        : new Date(date as Date | string | number);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split('T')[0]; // Return "YYYY-MM-DD"
};

export const getTime = (date: DateInput) => {
    if (!date) return 0;
    if (typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
        return date.toDate().getTime();
    }
    if (date instanceof Date) // Date objects
        return date.getTime();
    const parseDate = new Date(date as string | number);
    return isNaN(parseDate.getTime()) ? 0 : parseDate.getTime();
};