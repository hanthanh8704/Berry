import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/client/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/client/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationClientRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <AuthLogin3 />
    },
    {
      path: '/sign-up',
      element: <AuthRegister3 />
    }
  ]
};

export default AuthenticationClientRoutes;
