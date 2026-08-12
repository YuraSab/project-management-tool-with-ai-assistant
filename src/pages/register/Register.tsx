import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleAuthError } from "../../utils/handleAuthError";
import { register } from "../../services/authService";
import { FormTextInput, FormPasswordInput, CustomButton } from '../../ui';
import AuthFormLayout from "../../layouts/authFormLayout/AuthFormLayout";
import styles from './Register.module.css';

const INITIAL_FORM_DATA = {
    name: "",
    email: "",
    password: "",
    repeatedPassword: "",
};

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async () => {
        if ( !formData.name || !formData.email || !formData.password || !formData.repeatedPassword )
            return setError("Please fill all the fields.");
        if ( formData.password !== formData.repeatedPassword )
            return setError("Passwords do not match!");
        try {
            setIsLoading(true);
            await register(formData.email, formData.password, formData.name);
            navigate('/');
        } catch(error) {
            const message = handleAuthError(error);
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthFormLayout onSubmit={handleSubmit}>
            <h1 className={styles.caption}>Register</h1>
            <FormTextInput
                name="name" placeholder="name"
                value={formData.name} onChange={handleChange}
            />
            <FormTextInput
                name="email" placeholder="email"
                value={formData.email} onChange={handleChange}
            />
            <FormPasswordInput
                name="password" required placeholder="password"
                value={formData.password} onChange={handleChange}
                showPassword={showPassword} setShowPassword={setShowPassword}
            />
            <FormPasswordInput
                name="repeatedPassword" required placeholder="password"
                value={formData.repeatedPassword} onChange={handleChange}
                showPassword={showPassword} setShowPassword={setShowPassword}
            />
            <CustomButton type='submit' disabled={isLoading}>
                { isLoading ? 'Creating account...' : 'Register' }
            </CustomButton>
            <Link to='/login' className={styles.link}>
                or, you already have account
            </Link>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </AuthFormLayout>
    );
};

export default Register;