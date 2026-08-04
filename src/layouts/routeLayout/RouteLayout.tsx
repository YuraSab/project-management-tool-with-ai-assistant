import {Route, Routes} from 'react-router-dom';
import ProtectedRoute from '../../hooks/route/ProtectedRoute';
import Login from '../../pages/login/Login';
import Register from '../../pages/register/Register';
import People from '../../pages/people/People';
import Project from '../../pages/project/Project';
import Projects from '../../pages/projects/Projects';
import CreateProject from '../../pages/createProject/CreateProject';
import Profile from "../../pages/profile/Profile";
import {Role} from "../../types/user";

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
            <Route path="/projects/create" element={<CreateProject/>}/>
            <Route path="/profile" element={<Profile/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={ALLOWED_ROLES.NON_MEMBERS}/>}>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={ALLOWED_ROLES.ONLY_ADMINS}/>}>
        </Route>
    </Routes>
);

export default RouteLayout;