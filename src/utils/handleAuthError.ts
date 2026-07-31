import { FirebaseError } from "firebase/app";

export const handleAuthError = (error: unknown) => {
    if (error instanceof FirebaseError) {
        switch (error.code) {
            case "auth/user-not-found":
                return 'User not found. Check your email address.';
            case "auth/wrong-password":
                return 'Wrong email or password.';
            default:
                return 'Login error!';
        }
    }
    return 'An unexpected error occurred';
};