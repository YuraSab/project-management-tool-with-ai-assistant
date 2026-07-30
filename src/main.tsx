import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {BrowserRouter} from 'react-router-dom'
import App from './App.tsx'
import {AuthProvider} from './layouts/authProvider/AuthProvider.tsx'
import {ProfileProvider} from "./layouts/profileProvider/ProfileProvider.tsx";
import './styles/variables.css';
import './index.css';

const query = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={query}>
            <BrowserRouter>
                <AuthProvider>
                    <ProfileProvider>
                        <App/>
                    </ProfileProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);
