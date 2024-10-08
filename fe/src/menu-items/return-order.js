// assets
import { IconArrowBack } from '@tabler/icons-react'; // Nhập biểu tượng phù hợp

// constant
const icons = { IconArrowBack }; // Cập nhật biểu tượng

const traHang = {
  id: 'traHang',
  type: 'group',
  children: [
    {
      id: 'return_order_item',
      title: 'Trả hàng',
      type: 'item',
      url: '/tra-hang',
      icon: icons.IconArrowBack, // Sử dụng biểu tượng mới
      breadcrumbs: false // Sửa lỗi cú pháp ở đây
    }
  ]
};

export default traHang;
