import { createBrowserRouter,Navigate } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './AuthenticationRoutes';
// import LoginClientRoutes from './AuthenticationClientRoutes';
import ClientRoutes from './ClientRoutes';
import LoginClientRoutes from './AuthenticationClientRoutes';
// ==============================|| ROUTING RENDER ||============================== //
const adminRouter = createBrowserRouter([MainRoutes, LoginRoutes], {
  basename: '/admin'
});

const clientRouter = createBrowserRouter([ClientRoutes,LoginClientRoutes], {
  basename: '/'
});

export { adminRouter, clientRouter };


const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  LoginRoutes,
  MainRoutes
], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});


export default router;