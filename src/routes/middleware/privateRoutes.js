import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';
import { getLoginUser } from '../../services/apiService'

const PrivateRoutes = () => {
    const auth = getLoginUser()
    console.log(auth)
    return auth && auth.username ? (
        <MainLayout>
            <Outlet />
        </MainLayout>
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRoutes;
