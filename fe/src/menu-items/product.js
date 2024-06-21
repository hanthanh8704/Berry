// assets
import { IconShirtSport } from '@tabler/icons-react';

// constant
const icons = {
  IconShirtSport
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const product = {
  id: 'product',
  type: 'group',
  children: [
    {
      id: 'product-management',
      title: 'Quản Lý Sản Phẩm',
      type: 'collapse',
      icon: icons.IconShirtSport,

      children: [
        {
          id: 'color',
          title: 'Màu Sắc',
          type: 'item',
          url: '/products/color',
          target: true
        },
        {
          id: 'size',
          title: 'Kích Thước',
          type: 'item',
          url: '/products/size',
          target: true
        },
        {
          id: 'label',
          title: 'Nhãn Hiệu',
          type: 'item',
          url: '/products/label',
          target: true
        },
        {
          id: 'style',
          title: 'Dáng Áo',
          type: 'item',
          url: '/products/style',
          target: true
        },
        {
          id: 'sleeve',
          title: 'Tay Áo',
          type: 'item',
          url: '/products/sleeve',
          target: true
        },
        {
          id: 'pattern',
          title: 'Họa Tiết',
          type: 'item',
          url: '/products/pattern',
          target: true
        },
        {
          id: 'material',
          title: 'Chất Liệu',
          type: 'item',
          url: '/products/material',
          target: true
        },
        {
          id: 'collar',
          title: 'Cổ Áo',
          type: 'item',
          url: '/products/collar',
          target: true
        }
      ]
    }
  ]
};

export default product;
