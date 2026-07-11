import React, { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../../services/userApi";
import { Role } from "../../types/user";
import FormTextInput from "../../ui/input/FormTextInput";
import FormPasswordInput from "../../ui/input/FormPasswordInput";
import FormSelect from "../../ui/select/FormSelect";
import FormLayout from "../../layouts/formLayout/FormLayout";
import CustomForm from "../../ui/form/CustomForm";
import CustomButton from "../../ui/button/CustomButton.tsx";

type UserFormData = {
    name: string,
    username: string,
    password: string,
    repeatedPassword: string,
    role: Role,
}

const CreateUser = () => {
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        username: "",
        password: "",
        repeatedPassword: "",
        role: "member",
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const { mutation, isPending } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        }
    });

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const { name, username, password ,repeatedPassword, role } = formData;
        if ( !name || !username || !password || !repeatedPassword) {
            alert("Please fill all the fields.");
            return;
        }
        if ( password !== repeatedPassword ) {
            alert("Passwords do not match!");
            return;
        }
        mutation.mutate({ name, username, password, role, reservedMembers: [] });
    };

    return(
        <FormLayout>
            <CustomForm onSubmit={handleSubmit}>
                <label>Name
                    <FormTextInput name={"name"} value={formData.name} onChange={handleChange} required/>
                </label>
                <label>User name (login)
                    <FormTextInput   name={"username"} value={formData.username} onChange={handleChange} required />
                </label>
                <label>Password
                    <FormPasswordInput
                        name={"password"} placeholder={"Password"}
                        value={formData.password} onChange={handleChange}
                        showPassword={showPassword} setShowPassword={setShowPassword}
                        required={true}
                    />
                </label>
                <label>Repeat password
                    <FormPasswordInput
                        name={"repeatedPassword"} placeholder={"Repeat password"}
                        value={formData.repeatedPassword} onChange={handleChange}
                        showPassword={showPassword} setShowPassword={setShowPassword}
                        required={true}
                    />
                </label>
                <label>Status:
                    <FormSelect name={"role"} value={formData.role} onChange={handleChange} options={["member", "manager", "admin"]}/>
                </label>
                <CustomButton children={"Create user"} disabled={isPending} type={'submit'}/>
            </CustomForm>
        </FormLayout>
    )
}

export default CreateUser;