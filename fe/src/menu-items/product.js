// assets
import { IconShirt } from '@tabler/icons-react';

// constant
const icons = {
  IconShirt
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
      icon: icons.IconShirt,

      children: [
        {
          id: 'product',
          title: 'Sản Phẩm',
          type: 'item',
          icon: icons.IconShirtSport,
          url: '/products',
          target: false
        },
        {
          id: 'color',
          title: 'Màu Sắc',
          type: 'item',
          url: '/products/color',
          target: false
        },
        {
          id: 'size',
          title: 'Kích Thước',
          type: 'item',
          url: '/products/size',
          target: false
        },
        {
          id: 'label',
          title: 'Thương Hiệu',
          type: 'item',
          url: '/products/label',
          target: false
        },
        {
          id: 'material',
          title: 'Chất Liệu',
          type: 'item',
          url: '/products/material',
          target: false
        },

        {
          id: 'sleeve',
          title: ' Kiểu Tay Áo',
          type: 'item',
          url: '/products/sleeve',
          target: false
        },


        {
          id: 'collar',
          title: ' Kiểu Cổ Áo',
          type: 'item',
          url: '/products/collar',
          target: false
        }
      ]
    }
  ]
};

export default product;
