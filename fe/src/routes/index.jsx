// src/routes/index.js

import { createBrowserRouter } from 'react-router-dom';

// Import các route
import MainRoutes from './MainRoutes';
import LoginRoutes from './AuthenticationRoutes';
import LoginClientRoutes from './AuthenticationClientRoutes';
// import LoginClientRoutes from './AuthenticationRoutes';
import ClientRoutes from './ClientRoutes'; // Đã tích hợp các account routes

// ==============================|| ROUTING RENDER ||============================== //
const adminRouter = createBrowserRouter([MainRoutes, LoginRoutes], {
  basename: '/admin'
});

const clientRouter = createBrowserRouter([ClientRoutes, LoginClientRoutes], {
  basename: '/'
});

export { adminRouter, clientRouter };
