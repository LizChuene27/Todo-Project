/* eslint-disable no-unused-vars */
import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

// Private Route
const TodoComponent = lazy(() => import('../pages/todo/index'))
const UserComponent = lazy(() => import('../pages/users/index'))

// Public route
const LoginComponent = lazy(() => import('../pages/auth/Login'))
const SignupComponent = lazy(() => import('../pages/auth/Signup'))

const userRoutes = [
  {
    path: '/todos',
    exact: true,
    element: <TodoComponent />,
  },
  {
    path: '/users',
    exact: true,
    element: <UserComponent />,
  },
];

const authRoutes = [
  {
    path: '/login',
    exact: true,
    element:  <LoginComponent />,
  },
  {
    path: '/signup',
    exact: true,
    element:  <SignupComponent />,
  },
  {
    path: '/',
    exact: true,
    element:  <Navigate to="/login" />,
  }
];

export { userRoutes, authRoutes };
