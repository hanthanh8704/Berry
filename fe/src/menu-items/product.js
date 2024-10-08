// assets
import { IconShirt, IconBulldozer } from '@tabler/icons-react';
import { IconShirtSport, IconCategory2, IconHeartCode } from '@tabler/icons-react';
import { IconPalette, IconArrowsMaximize, IconBrandStocktwits, IconBrandDrupal } from '@tabler/icons-react';


// constant
const icons = {
  IconShirt,
  IconShirtSport,
  IconPalette,
  IconArrowsMaximize,
  IconBrandStocktwits,
  IconBrandDrupal,
  IconCategory2,
  IconBulldozer,
  IconHeartCode

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
          id: 'category',
          title: 'Danh Mục',
          type: 'item',
          url: '/products/category',
          target: false,
          icon: icons.IconCategory2
        },
        {
          id: 'color',
          title: 'Màu Sắc',
          type: 'item',
          url: '/products/color',
          target: false,
          icon: icons.IconPalette
        },
        {
          id: 'size',
          title: 'Kích Cỡ',
          type: 'item',
          url: '/products/size',
          target: false,
          icon: icons.IconArrowsMaximize
        },
        {
          id: 'label',
          title: 'Thương Hiệu',
          type: 'item',
          url: '/products/label',
          target: false,
          icon: icons.IconBrandStocktwits
        },
        {
          id: 'material',
          title: 'Chất Liệu',
          type: 'item',
          url: '/products/material',
          target: false,
          icon: icons.IconBrandDrupal
        },


        {
          id: 'sleeve',
          title: ' Kiểu Tay Áo',
          type: 'item',
          url: '/products/sleeve',
          target: false,
          icon: icons.IconHeartCode
        },


        {
          id: 'collar',
          title: ' Kiểu Cổ Áo',
          type: 'item',
          url: '/products/collar',
          target: false,
          icon: icons.IconBulldozer
        }
      ]
    }
  ]
};

export default product;
