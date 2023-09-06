import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getLoginUser } from '../../services/apiService'

const AuthRoutes = () => {
    const auth = getLoginUser()
    return !(auth || (auth && auth.username)) ? (
        <Outlet />
    ) : (
        <Navigate to="/todos" />
    );
};

export default AuthRoutes;