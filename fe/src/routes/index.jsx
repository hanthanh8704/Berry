import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import LoginRoutes from './AuthenticationRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/pages/login/login3" replace />
  },
  LoginRoutes,
  MainRoutes
], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;