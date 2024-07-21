import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; // Đảm bảo đường dẫn import chính xác

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Product from 'views/pages/products/shirt/Product';
import Color from 'views/pages/products/attribute/Color';
import Size from 'views/pages/products/attribute/Size';
import Label from 'views/pages/products/attribute/Label';
import Material from 'views/pages/products/attribute/Material';
import Category from 'views/pages/products/attribute/Category';
import Sleeve from 'views/pages/products/attribute/Sleeve';
import Collar from 'views/pages/products/attribute/Collar';
import ShirtInfo from 'views/pages/products/shirt/ShirtInfo';
import AddShirt from 'views/pages/products/shirt-detail/AddShirt';
import AuthLogin from 'views/pages/authentication/auth-forms/AuthLogin';
import Login from 'views/pages/authentication3/Login3';



// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/pages/dashboard')));
const Bill = Loadable(lazy(() => import('views/pages/bill/bill.jsx')));
// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
  children: [
    {
      path: '/',
      element: <Navigate to="/products" replace />
    },
    // {
    //   path: '/',
    //   element: <Navigate to="/pages/login/login3" replace />
    // },
    {
      path: '/bill',
      element: <Bill />
    },
    {
      path: '/products',
      element: <Product />
    },
    {
      path: '/products/add-shirt',
      element: <AddShirt />
    },
    {
      path: '/products/:id',
      element: <ShirtInfo />
    },
    {
      path: '/products/size',
      element: <Size />
    },
    {
      path: '/products/color',
      element: <Color />
    },
    {
      path: '/products/label',
      element: <Label />
    },
    {
      path: '/products/material',
      element: <Material />
    },
    {
      path: '/products/category',
      element: <Category />
    },
    {
      path: '/products/sleeve',
      element: <Sleeve />
    },
    {
      path: '/products/collar',
      element: <Collar />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
