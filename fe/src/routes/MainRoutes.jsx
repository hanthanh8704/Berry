import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { element } from 'prop-types';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/pages/dashboard')));
const Bill = Loadable(lazy(() => import('views/pages/bill/bill.jsx')));
const BillDetail = Loadable(lazy(() => import('views/pages/bill/billDetail.jsx')));
const ExportPdf = Loadable(lazy(() => import('views/pages/export-pdf/ExportBill.jsx')));
const Customer =  Loadable(lazy(() => import('views/pages/customer/customer.jsx')));
const BillHistory = Loadable(lazy(() => import('views/pages/bill/billHistory.jsx')));
const changeBill = Loadable(lazy(() => import('views/pages/bill/changeBill.jsx')));
const changeCustomer = Loadable(lazy(() => import('views/pages/bill/changeCustomer.jsx')));
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
      path: '/bill/:id',
      element: <BillDetail/>
    },
    {
      path: '/export-pdf/:id',
      element: <ExportPdf/>
    },
    {
      path: '/account',
      children: [
        {
          path: 'customer',
          element: <Customer />
        },
        {
          path: 'employee',
          element: <DashboardDefault />
        }
      ]
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
