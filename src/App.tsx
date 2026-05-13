import Header from './components/header/header/Header';
import RouteLayout from './layouts/routeLayout/RouteLayout';
import styles from './App.module.css';
import './global.css';
import {useAuthStore} from "./store/authStore.ts";
import {useProfileStore} from "./store/profileStore.ts";

function App() {
    const user = useAuthStore((state) => state.user);
    const profile =  useProfileStore((state) => state.profile);
    return (
        <div className={styles.structure} style={{backgroundColor: profile?.theme === 'black' ? "black" : "white"}}>
            {user && profile && (
                <Header/>
            )}
            <main>
                <RouteLayout/>
            </main>
        </div>
    );
}

export default App;