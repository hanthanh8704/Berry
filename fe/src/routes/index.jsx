import { createBrowserRouter } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './AuthenticationRoutes';
import ClientRoutes from './ClientRoutes';
// ==============================|| ROUTING RENDER ||============================== //
const adminRouter = createBrowserRouter([MainRoutes, LoginRoutes], {
  basename: '/admin'
});

const clientRouter = createBrowserRouter([ClientRoutes], {
  basename: '/'
});

export { adminRouter, clientRouter };
