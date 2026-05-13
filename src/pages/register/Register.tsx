import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthFormLayout from "../../layouts/authFormLayout/AuthFormLayout";
import FormTextInput from "../../ui/input/FormTextInput";
import FormPasswordInput from "../../ui/input/FormPasswordInput";
import FormButtonSubmit from "../../ui/button/FormButtonSubmit";
import {register} from "../../services/authService.ts";
import {handleAuthError} from "../../utils/handleAuthError.ts";
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

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async () => {
        if ( !formData.name || !formData.email || !formData.password || !formData.repeatedPassword )
            return setError("Please fill all the fields.");
        if ( formData.password !== formData.repeatedPassword )
            return setError("Passwords do not match!");
        try {
            await register(formData.email, formData.password, formData.name);
            navigate('/');
        } catch(error) {
            const message = handleAuthError(error);
            setError(message);
        }
    };

    return (
        <AuthFormLayout onSubmit={handleSubmit}>
            <h1 className={styles.caption}>Register</h1>
            <FormTextInput name={"name"} value={formData.name} onChange={handleChange} placeholder="name" />
            <FormTextInput name={"email"} value={formData.email} onChange={handleChange} placeholder="email" />
            <FormPasswordInput  name={"password"} value={formData.password} onChange={handleChange} required showPassword={showPassword} setShowPassword={setShowPassword} placeholder={"password"} />
            <FormPasswordInput  name={"repeatedPassword"} value={formData.repeatedPassword} onChange={handleChange} required showPassword={showPassword} setShowPassword={setShowPassword} placeholder={"password"} />
            <FormButtonSubmit text={"Register"}/>
            <p className={styles.link} onClick={() => navigate("/login")}>or, you already have account</p>
            <h2 style={{color: 'red'}}>{error}</h2>
        </AuthFormLayout>
    );
}

export default Register;