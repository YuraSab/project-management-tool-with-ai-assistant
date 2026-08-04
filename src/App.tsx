import {useEffect} from "react";
import Header from './components/header/Header.tsx';
import RouteLayout from './layouts/routeLayout/RouteLayout';
import {useAuthStore} from "./store/authStore.ts";
import {useProfileStore} from "./store/profileStore.ts";
import {ToastContainer} from "./ui/toast/ToastContainer.tsx";
import {Theme} from "./types/user.ts";
import styles from './App.module.css';
import './global.css';

function App() {
    const user = useAuthStore((state) => state.user);
    const profile =  useProfileStore((state) => state.profile);

    useEffect(() => {
        const root = document.body;
        const currentTheme = profile?.theme ?? Theme.White;
        root.classList.remove('light', 'dark');
        if (currentTheme === Theme.White) {
            root.classList.add('light');
            root.classList.remove('dark');
        } else {
            root.classList.add('dark');
            root.classList.remove('light');
        }
    }, [profile?.theme]);

    return (
        <div className={styles.structure}>
            {user && profile && <Header/>}
            <main>
                <RouteLayout/>
                <ToastContainer/>
            </main>
        </div>
    );
}

export default App;