import { lazy } from 'react';

// project imports
// import MainLayout from 'layout/MainLayout';

import Loadable from 'ui-component/Loadable';
import MainClient from 'layout/client/index.jsx';

// dashboard routing
const HomeClient = Loadable(lazy(() => import('views/client/Home')));
// ==============================|| MAIN ROUTING ||============================== //

const ClientRoutes = {
  path: '/',
  element: <MainClient />,
  children: [
    {
      path: '/home',
      element: <HomeClient />
    },
  ]
};

export default ClientRoutes;
