import { lazy } from 'react';

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
const DotGiamGia = Loadable(lazy(() => import('views/pages/promotion/DotGiamGia.jsx')));
const AddDotGiamGia = Loadable(lazy(() => import('views/pages/promotion/AddDotGiamGia.jsx')));
const DetailDotGiamGia = Loadable(lazy(() => import('views/pages/promotion/DetailDotGiamGia.jsx')));
const UpdateDotGiamGia = Loadable(lazy(() => import('views/pages/promotion/UpdateDotGiamGia.jsx')));
const Nhanvien = Loadable(lazy(() => import('views/pages/employee/nhanvien.jsx')));
const AddNhanVien = Loadable(lazy(() => import('views/pages/employee/addNhanVien.jsx')));
const NhanVienDetail = Loadable(lazy(() => import('views/pages/employee/nhanVienDetail.jsx')));

const Voucher = Loadable(lazy(() => import('views/pages/voucher/Voucher.jsx')));
const VoucherDetail = Loadable(lazy(() => import('views/pages/voucher/VoucherDetail.jsx')));
const AddVoucher = Loadable(lazy(() => import('views/pages/voucher/AddVoucher.jsx')));

const TraHang = Loadable(lazy(() => import('views/pages/traHang/traHang.jsx')));
const TraHangDetail = Loadable(lazy(() => import('views/pages/traHang/traHangDetail.jsx')));

// const Customer = Loadable(lazy(() => import('views/pages/customer/Customer.jsx')));
// const AddCustomer = Loadable(lazy(() => import('views/pages/customer/AddCustomer.jsx')));
// const DetailCustomer = Loadable(lazy(() => import('views/pages/customer/DetailCustomer.jsx')));


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
      path: '/dashboard',
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
      path: '/tra-hang',
      element: <TraHang />
    },
    {
      path: '/tra-hang/hoa-don/:id',
      element: <TraHangDetail />
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
      path: '/',
      children: [
        {
          path: '/nhan-vien',
          element: <Nhanvien/>
        },{
          path:"/nhan-vien/add",
          element:<AddNhanVien/>
        },
        {
          path:"/nhan-vien/:id",
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
    // {
    //   path: '/api/customer',
    //   element: <Customer />
    // },
    // {
    //   path: '/api/customer/add',
    //   element: <AddCustomer />
    // },
    // {
    //   path: '/api/customer/:id',
    //   element: <DetailCustomer />
    // },
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
