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
const BillHistory = Loadable(lazy(() => import('views/pages/bill/billHistory.jsx')));
const changeBill = Loadable(lazy(() => import('views/pages/bill/changeBill.jsx')));
const changeCustomer = Loadable(lazy(() => import('views/pages/bill/changeCustomer.jsx')));

// Dot giam gia của Đức
const DotGiamGia = Loadable(lazy(() => import('views/pages/dotgiamgia/DotGiamGia.jsx')));
const AddDotGiamGia = Loadable(lazy(() => import('views/pages/dotgiamgia/AddDotGiamGia.jsx')));
const DetailDotGiamGia = Loadable(lazy(() => import('views/pages/dotgiamgia/DetailDotGiamGia.jsx')));
const UpdateDotGiamGia = Loadable(lazy(() => import('views/pages/dotgiamgia/UpdateDotGiamGia.jsx')));
const Nhanvien = Loadable(lazy(() => import('views/pages/nhan_vien/nhanvien.jsx')));
const AddNhanVien = Loadable(lazy(() => import('views/pages/nhan_vien/addNhanVien.jsx')));
const NhanVienDetail = Loadable(lazy(() => import('views/pages/nhan_vien/nhanVienDetail.jsx')));

const Voucher = Loadable(lazy(() => import('views/pages/voucher/Voucher.jsx')));
const VoucherDetail = Loadable(lazy(() => import('views/pages/voucher/VoucherDetail.jsx')));
const AddVoucher = Loadable(lazy(() => import('views/pages/voucher/AddVoucher.jsx')));

const Customer = Loadable(lazy(() => import('views/pages/customer/Customer.jsx')));
const AddCustomer = Loadable(lazy(() => import('views/pages/customer/AddCustomer.jsx')));
const DetailCustomer = Loadable(lazy(() => import('views/pages/customer/DetailCustomer.jsx')));


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
      element: <BillDetail />
    },
   
    {
      path: '/export-pdf/:id',
      element: <ExportPdf />
    },
    {
      path: '/voucher',
      children: [
        {
          path: 'dot-giam-gia',
          element: <DotGiamGia />
        },
        {
          path: 'dot-giam-gia/add',
          element: <AddDotGiamGia />
        },
        {
          path: 'dot-giam-gia/detail/:id',
          element: <DetailDotGiamGia />
        },
        {
          path: 'dot-giam-gia/update/:id',
          element: <UpdateDotGiamGia />
        },
        {
          path: 'phieu-giam-gia',
          element: <DashboardDefault />
        }
      ]
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
          element: <Nhanvien/>
        },{
          path:"employee/create",
          element:<AddNhanVien/>
        },
        {
          path:"employee/:id",
          element:<NhanVienDetail/>
        },
      ]
    },

    {
      path: '/api/voucher',
      element: <Voucher />
    },
    {
      path: '/api/voucher/:id',
      element: <VoucherDetail />
    },
    {
      path: '/api/voucher/add',
      element: <AddVoucher />
    },
    {
      path: '/api/customer',
      element: <Customer />
    },
    {
      path: '/api/customer/add',
      element: <AddCustomer />
    },
    {
      path: '/api/customer/:id',
      element: <DetailCustomer />
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
