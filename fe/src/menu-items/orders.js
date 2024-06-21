// assets
import { IconShoppingCart } from '@tabler/icons-react';

// constant
const icons = { IconShoppingCart };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const orders = {
  id: 'dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Bán Hàng Tại Quầy',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconShoppingCart, // Sử dụng IconShoppingCart thay vì IconDashboard
      breadcrumbs: false
    }
  ]
};

export default orders;
