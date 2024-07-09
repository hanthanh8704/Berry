import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { element } from 'prop-types';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/pages/dashboard')));
const Bill = Loadable(lazy(() => import('views/pages/bill/bill.jsx')));
const Nhanvien = Loadable(lazy(() => import('views/pages/nhan_vien/nhanvien.jsx')));
const AddCustomer = Loadable(lazy(() => import('views/pages/nhan_vien/addNhanVien.jsx')));
const NhanVienDetail = Loadable(lazy(() => import('views/pages/nhan_vien/nhanVienDetail.jsx')));

const Khachhang = Loadable(lazy(() => import('views/pages/khach_hang/khachhang.jsx')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/bill',
      element: <Bill />
    },
     {
      path: '/nhan-vien',
      element: <Nhanvien />
    }, 
    {
      path:"/nhan-vien/add",
      element:<AddCustomer/>
    },
    {
      path:"/nhan-vien/:id",
      element:<NhanVienDetail/>
    },
    {
      path: '/khach-hang',
      element: <Khachhang />
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
