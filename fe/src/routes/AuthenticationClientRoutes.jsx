// project imports
import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
// login option 3 routing
const AuthLoginClient = Loadable(lazy(() => import('views/client/authentication/authen/LoginClient')));
const AuthRegisterClient = Loadable(lazy(() => import('views/client/authentication/authen/RegisterClient')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //


const AuthenticationClientRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: <AuthLoginClient />
        },
        {
            path: '/sign-in',
            element: <AuthRegisterClient />
        }
    ]
};

export default AuthenticationClientRoutes;
