// assets
import { IconUserCircle, IconUsers, IconUserShield } from '@tabler/icons-react';

// constant
const icons = {
  IconUserCircle,
  IconUsers,
  IconUserShield
};

// ==============================|| ACCOUNT MENU ITEMS ||============================== //

const account = {
  id: 'account',
  type: 'group',
  children: [
    {
      id: 'employee-management',
      title: 'Quản Lý Nhân Viên',
      type: 'collapse',
      icon: icons.IconUsers,

      children: [
        {
          id: 'employee-list',
          title: 'Danh Sách Nhân Viên',
          type: 'item',
          url: '/account/employees',
          target: true,
          icon: icons.IconUsers
        },
        {
          id: 'customer-list',
          title: 'Danh Sách Khách Hàng',
          type: 'item',
          url: '/account/customers',
          target: true,
          icon: icons.IconUserShield
        }
      ]
    }
  ]
};

export default account;
