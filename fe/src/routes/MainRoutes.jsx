import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';


// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/pages/dashboard')));
const Bill = Loadable(lazy(() => import('views/pages/bill/bill.jsx')));
const DotGiamGia = Loadable(lazy(() => import('views/pages/DotGiamGia/dotgiamgia.jsx')));
const AddDotGiamGia = Loadable(lazy(() => import('views/pages/DotGiamGia/AddDotGiamGia.jsx')));
const DetailDotGiamGia = Loadable(lazy(() => import('views/pages/DotGiamGia/DetailDotGiamGia.jsx')));
const UpdateDotGiamGia = Loadable(lazy(() => import('views/pages/DotGiamGia/UpdateDotGiamGia.jsx')));
const PhieuGiamGia = Loadable(lazy(() => import('views/pages/PhieuGiamGia/phieugiamgia.jsx')));
// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //
//nếu path là đường dẫn này thì hiển thị ra trang này 
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
      path: '/dot-giam-gia',
      element: <DotGiamGia />
    },
    {
      path: '/dot-giam-gia/add',
      element: <AddDotGiamGia />
    },
    {
      path: '/dot-giam-gia/detail/:id',
      element: <DetailDotGiamGia />
    },
    {
      path: '/phieu-giam-gia',
      element: <PhieuGiamGia />
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
    },
  ]
};

export default MainRoutes;
