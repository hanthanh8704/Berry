import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';

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
import Payment from 'views/pages/payment/Payment';
import { element } from 'prop-types';
import { margin } from '@mui/system';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/pages/dashboard')));

// Bill
const Bill = Loadable(lazy(() => import('views/pages/bill/bill.jsx')));
const FormSearch = Loadable(lazy(() => import('views/pages/bill/formSearch.jsx')));
const BillDetail = Loadable(lazy(() => import('views/pages/bill/billDetail.jsx')));
const ExportPdf = Loadable(lazy(() => import('views/pages/export-pdf/ExportBill.jsx')));
const BillHistory = Loadable(lazy(() => import('views/pages/bill/billHistory.jsx')));

// Orders
const Orders = Loadable(lazy(() => import('views/pages/order/newOder.jsx')));

// Promotions
const DotGiamGia = Loadable(lazy(() => import('views/pages/promotion/DotGiamGia.jsx')));
const AddDotGiamGia = Loadable(lazy(() => import('views/pages/promotion/AddDotGiamGia.jsx')));
const UpdateDotGiamGia = Loadable(lazy(() => import('views/pages/promotion/UpdateDotGiamGia.jsx')));

// Employee
const Nhanvien = Loadable(lazy(() => import('views/pages/employee/nhanvien.jsx')));
const AddNhanVien = Loadable(lazy(() => import('views/pages/employee/addNhanVien.jsx')));
const NhanVienDetail = Loadable(lazy(() => import('views/pages/employee/nhanVienDetail.jsx')));

// Voucher
const Voucher = Loadable(lazy(() => import('views/pages/voucher/Voucher.jsx')));
const VoucherDetail = Loadable(lazy(() => import('views/pages/voucher/VoucherDetail.jsx')));
const AddVoucher = Loadable(lazy(() => import('views/pages/voucher/AddVoucher.jsx')));

// Customer
const Customer = Loadable(lazy(() => import('views/pages/customer/Customer.jsx')));
const AddCustomer = Loadable(lazy(() => import('views/pages/customer/AddCustomer.jsx')));
const DetailCustomer = Loadable(lazy(() => import('views/pages/customer/DetailCustomer.jsx')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// Statitiscal
const Statitiscal = Loadable(lazy(() => import('views/pages/statisticall/statistical.jsx')));

// Return order
const TraHang = Loadable(lazy(() => import('views/pages/return-order/returnOrder')));
const TraHangDetail = Loadable(lazy(() => import('views/pages/return-order/returnOrderDetail')));

const roleId = parseInt(localStorage.getItem('userRoleId'), 10);

// Helper function to check access
const checkAccess = (path) => {
  if (roleId === 1) return true;
  if (roleId === 3) {
    const restrictedPaths = ['/voucher', '/voucher/promotion', '/customer', '/employee'];
    return !restrictedPaths.some((restrictedPath) => path.startsWith(restrictedPath));
  }
  return true; // default access
};

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    // Bill
    {
      path: '/orders',
      element: checkAccess('/orders') ? <Orders /> : <div>Access Denied</div>
    },
    {
      path: '/vnpay-payment',
      element: <Payment />
    },
    {
      path: '/bill',
      element: checkAccess('/bill') ? <Bill /> : <div>Access Denied</div>
    },
    {
      path: '/dashboard',
      element: <Statitiscal />
    },
    {
      path: '/bill/:id',
      element: checkAccess('/bill/:id') ? <BillDetail /> : <div>Access Denied</div>
    },
    {
      path: '/return-order',
      element: checkAccess('/return-order') ? <TraHang /> : <div>Access Denied</div>
    },
    {
      path: '/return-order/:id',
      element: checkAccess('/return-order/:id') ? <TraHangDetail /> : <div>Access Denied</div>
    },
    // Product
    {
      path: '/products',
      element: checkAccess('/products') ? <Product /> : <div>Access Denied</div>
    },
    {
      path: '/products/add-shirt',
      element: checkAccess('/products/add-shirt') ? <AddShirt /> : <div>Access Denied</div>
    },
    {
      path: '/products/:id',
      element: checkAccess('/products/:id') ? <ShirtInfo /> : <div>Access Denied</div>
    },
    {
      path: '/products/size',
      element: checkAccess('/products/size') ? <Size /> : <div>Access Denied</div>
    },
    {
      path: '/products/color',
      element: checkAccess('/products/color') ? <Color /> : <div>Access Denied</div>
    },
    {
      path: '/products/label',
      element: checkAccess('/products/label') ? <Label /> : <div>Access Denied</div>
    },
    {
      path: '/products/material',
      element: checkAccess('/products/material') ? <Material /> : <div>Access Denied</div>
    },
    {
      path: '/products/category',
      element: checkAccess('/products/category') ? <Category /> : <div>Access Denied</div>
    },
    {
      path: '/products/sleeve',
      element: checkAccess('/products/sleeve') ? <Sleeve /> : <div>Access Denied</div>
    },
    {
      path: '/products/collar',
      element: checkAccess('/products/collar') ? <Collar /> : <div>Access Denied</div>
    },
    {
      path: '/export-pdf/:id',
      element: checkAccess('/export-pdf/:id') ? <ExportPdf /> : <div>Access Denied</div>
    },

    // Promotion

    {
      path: 'promotion',
      element: checkAccess('/promotion') ? (
        <DotGiamGia />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },
    {
      path: 'promotion/add',
      element: checkAccess('/promotion/add') ? (
        <AddDotGiamGia />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },
    {
      path: 'promotion/update/:id',
      element: checkAccess('/promotion/update/:id') ? (
        <UpdateDotGiamGia />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },

    // Employee
    {
      path: '/employee',
      element: checkAccess('/employee') ? (
        <Nhanvien />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },
    {
      path: '/employee/add',
      element: checkAccess('/employee/add') ? (
        <AddNhanVien />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },
    {
      path: '/employee/:id',
      element: checkAccess('/employee/:id') ? (
        <NhanVienDetail />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },

    // Voucher
    {
      path: '/voucher',
      element: checkAccess('/voucher') ? (
        <Voucher />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },
    {
      path: '/voucher/:id',
      element: checkAccess('/voucher/:id') ? (
        <VoucherDetail />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },
    {
      path: '/voucher/add',
      element: checkAccess('/voucher/add') ? (
        <AddVoucher />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },

    // Customer
    {
      path: '/customer',
      element: checkAccess('/customer') ? (
        <Customer />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },
    {
      path: '/customer/add',
      element: checkAccess('/customer/add') ? (
        <AddCustomer />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },
    {
      path: '/customer/:id',
      element: checkAccess('/customer/:id') ? (
        <DetailCustomer />
      ) : (
        <div className=" m-5 fs-4 text-danger fw-bold mt-5">
          Bạn không có quyền truy cập vào đây. Vui lòng liên hệ với ADMIN để được cập quyền truy cập!!
        </div>
      )
    },

    {
      path: '/utils/typography',
      element: <UtilsTypography />
    },
    {
      path: '/utils/color',
      element: <UtilsColor />
    },
    {
      path: '/utils/shadow',
      element: <UtilsShadow />
    }
  ]
};

export default MainRoutes;
