// assets
import { IconFileInvoice } from '@tabler/icons-react';

// constant
const icons = {
    IconFileInvoice
};

// ==============================|| BILL MENU ITEMS ||============================== //

const bill = {
  id: 'bill',
  type: 'group',
  children: [
    {
        id: 'bill-list',
        title: 'Danh Sách Hóa Đơn',
        type: 'item',
        url: '/bill',
        target: false,
        icon: icons.IconFileInvoice
    }
  ]
};

export default bill;
