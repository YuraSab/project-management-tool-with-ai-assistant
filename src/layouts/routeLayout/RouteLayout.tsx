import {Route, Routes} from 'react-router-dom';
import Login from '../../pages/login/Login';
import Register from '../../pages/register/Register';
import People from '../../pages/people/People';
import Projects from '../../pages/projects/Projects';
import ProtectedRoute from '../../hooks/route/ProtectedRoute.tsx';
import Project from '../../pages/project/Project';
import CreateProject from '../../pages/createProject/CreateProject';
import CreateUser from '../../pages/createUser/CreateUser';
import EditUser from '../../pages/editUser/EditUser';
import Personalisation from '../../pages/personalisation/Personalisation';
import React from "react";
import {Role} from "../../types/user.ts";

const ALLOWED_ROLES = {
    ALL: [Role.Admin, Role.Manager, Role.Member],
    NON_MEMBERS: [Role.Admin, Role.Manager],
    ONLY_ADMINS: [Role.Admin]
};

const RouteLayout = () => (
    <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route element={<ProtectedRoute allowedRoles={ALLOWED_ROLES.ALL}/>}>
            <Route path="/" element={<Projects/>}/>
            <Route path="/projects" element={<Projects/>}/>
            <Route path="/projects/:projectId" element={<Project/>}/>
            <Route path="/people" element={<People/>}/>
            <Route path="/personalisation" element={<Personalisation/>}/>
            <Route path="/projects/create" element={<CreateProject/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={ALLOWED_ROLES.NON_MEMBERS}/>}>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={ALLOWED_ROLES.ONLY_ADMINS}/>}>
            <Route path="/create/user" element={<CreateUser/>}/>
            <Route path="/edit/user/:userId" element={<EditUser/>}/>
        </Route>
    </Routes>
);

export default RouteLayout;