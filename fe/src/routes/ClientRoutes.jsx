import { lazy } from 'react';


import Loadable from 'ui-component/Loadable';
import MainClient from 'layout/client/index.jsx';
import AccountClient from 'layout/client/account/account';
// dashboard routing
const HomeClient = Loadable(lazy(() => import('views/client/Home')));
const ProductDetail = Loadable(lazy(() => import('views/client/product_detail/product_detail')));
const Product = Loadable(lazy(() => import('views/client/product/product')));
const Cart = Loadable(lazy(() => import('views/client/cart/cart')));
const CheckOut = Loadable(lazy(() => import('views/client/checkout/checkout.jsx')));
const VNPAYMENT = Loadable(lazy(() => import('views/client/vnpay/vnpay')));
const TracKing = Loadable(lazy(() => import('views/client/tracking/tracking.jsx')));
const TracKingDetail = Loadable(lazy(() => import('views/client/tracking/tracking_detai.jsx')));
const Search = Loadable(lazy(() => import('views/client/search/Search.jsx')));

const AccountProfile = Loadable(lazy(() => import('views/client/account/profile')));
const AccountAddress = Loadable(lazy(() => import('views/client/account/address')));
const AccountOrders= Loadable(lazy(() => import('views/client/account/orders')));
const AccountPassword = Loadable(lazy(() => import('views/client/account/password')));
const AccountVouchers = Loadable(lazy(() => import('views/client/account/vouchers')));
// ==============================|| MAIN ROUTING ||============================== //

const ClientRoutes = {
  path: '/',
  element: <MainClient />,
  children: [
    {
      path: '/home',
      element: <HomeClient />
    },
    {
      path: '/products/:id',
      element: <Product />
    },
    {
      path: '/product-detail/:id',
      element: <ProductDetail />
    },
    {
      path: '/account',
      element: <AccountClient />,
      children: [
        {
          path: 'profile',
          element: <AccountProfile />
        },
        {
          path: 'address',
          element: <AccountAddress />
        },
        {
          path: 'orders',
          element: <AccountOrders />
        },
        {
          path: 'vouchers',
          element: <AccountVouchers />
        },
        {
          path: 'password',
          element: <AccountPassword />
        },
      ]
    },
    {
      path: '/cart',
      element: <Cart />
    },
    {
      path: '/checkout',
      element: <CheckOut />
    },
    {
      path: '/vnpay-payment',
      element: <VNPAYMENT />
    },
    {
      path: '/tracking',
      element: <TracKing />
    },
    {
      path: '/tracking/:ma',
      element: <TracKingDetail />
    },
    {
      path: '/search/:key',
      element: <Search />
    },
  ]
};

export default ClientRoutes;
