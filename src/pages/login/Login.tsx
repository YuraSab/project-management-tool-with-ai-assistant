import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { handleAuthError } from "../../utils/handleAuthError";
import {toast} from "../../utils/toaster";
import { login } from "../../services/authService";
import FormPasswordInput from "../../ui/input/FormPasswordInput";
import FormTextInput from "../../ui/input/FormTextInput";
import CustomButton from "../../ui/button/CustomButton";
import AuthFormLayout from "../../layouts/authFormLayout/AuthFormLayout";
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "demo.user@example.com",
        password: "password123"
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            await login(formData.email, formData.password);
            navigate('/');
        } catch (error) {
            const message = handleAuthError(error);
            toast.error(`Login error:    ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthFormLayout onSubmit={handleSubmit}>
            <h1 className={styles.caption}>Login</h1>
            <FormTextInput
                name='email' required placeholder='email'
                value={formData.email} onChange={handleChange}
            />
            <FormPasswordInput
                name={'password'} required placeholder={"password"}
                value={formData.password} onChange={handleChange}
                showPassword={showPassword} setShowPassword={setShowPassword}
            />
            <CustomButton disabled={isLoading} type='submit'>
                { isLoading ? 'Logging in...' : 'Login' }
            </CustomButton>
            <Link className={styles.link} to='/register'>or, sign up</Link>
        </AuthFormLayout>
    );
};

export default Login;