// assets
import { IconGiftCard, IconCreditCardRefund, IconCalendarStats, IconKey } from '@tabler/icons-react';

// constant
const icons = {
    IconGiftCard,
    IconCreditCardRefund,
    IconCalendarStats,
    IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const voucher = {
  id: 'voucher',
  type: 'group',
  children: [
    {
      id: 'discount-management',
      title: 'Quản Lý Giảm Giá',
      type: 'collapse',
      icon: icons.IconGiftCard, // Sử dụng IconGiftCard cho mục Quản Lý Giảm Giá

      children: [
        {
          id: 'discount-period',
          title: 'Đợt Giảm Giá',
          type: 'item',
          url: '/pages/discount/period',
          target: true,
          icon: icons.IconCalendarStats // Sử dụng IconCalendarStats cho Đợt Giảm Giá
        },
        {
          id: 'discount-coupon',
          title: 'Phiếu Giảm Giá',
          type: 'item',
          url: '/pages/discount/coupon',
          target: true,
          icon: icons.IconCreditCardRefund // Sử dụng IconCreditCardRefund cho Phiếu Giảm Giá
        }
      ]
    }
  ]
};

export default voucher;
