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
  id: 'voucher', // ID của nhóm
  type: 'group', // Loại của nhóm (group)
  children: [ // Danh sách các mục con (children)
    {
      id: 'voucher', // ID của mục con
      title: 'Quản Lý Giảm Giá', // Tiêu đề hiển thị của mục con
      type: 'collapse', // Loại của mục con (collapse)
      icon: icons.IconGiftCard,// Biểu tượng cho mục Quản Lý Giảm Giá
      children: [ // Danh sách các mục con của 'Quản Lý Giảm Giá'
        {
          id: 'dot-giam-gia', // ID của mục con
          title: 'Đợt Giảm Giá', // Tiêu đề hiển thị của mục con
          type: 'item', // Loại của mục con (item)
          url: '/promotion', // URL khi nhấn vào mục này
          target: false, // Nếu là false không cho mở tab mới ngược lại
          icon: icons.IconCalendarStats // Biểu tượng cho Đợt Giảm Giá
        },
        {
          id: 'phieu-giam-gia', // ID của mục con
          title: 'Phiếu Giảm Giá', // Tiêu đề hiển thị của mục con
          type: 'item', // Loại của mục con (item)
          url: '/voucher', // URL khi nhấn vào mục này
          target: false, // Nếu là false không cho mở tab mới ngược lại
          icon: icons.IconCreditCardRefund // Biểu tượng cho Phiếu Giảm Giá
        }
      ]
    }
  ]
};
export default voucher;

// const voucher = {
//   id: 'voucher',
//   type: 'group',
//   children: [
//     {
//       id: 'discount-management',
//       title: 'Quản Lý Giảm Giá',
//       type: 'collapse',
//       icon: icons.IconGiftCard, // Sử dụng IconGiftCard cho mục Quản Lý Giảm Giá

//       children: [
//         {
//           id: 'discount-period',
//           title: 'Đợt Giảm Giá',
//           type: 'item',
//           url: '/pages/discount/period',
//           target: true,
//           icon: icons.IconCalendarStats // Sử dụng IconCalendarStats cho Đợt Giảm Giá
//         },
//         {
//           id: 'discount-coupon',
//           title: 'Phiếu Giảm Giá',
//           type: 'item',
//           url: '/pages/discount/coupon',
//           target: true,
//           icon: icons.IconCreditCardRefund // Sử dụng IconCreditCardRefund cho Phiếu Giảm Giá
//         }
//       ]
//     }
//   ]
// };

// export default voucher;
