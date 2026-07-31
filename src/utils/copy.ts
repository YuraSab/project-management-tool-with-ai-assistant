import { toast } from "./toaster.ts";

export const copyText = async (text: string) => {
    if (!navigator?.clipboard) {
        console.warn('Your browser doesn`t support Clipboard API or context is not secure.');
        toast.warning('Non supported in this environment!');
        return false;
    }
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Copy error: ', error);
        toast.error('Copy error!')
        return false;
    }
};