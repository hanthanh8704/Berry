// assets
import { IconChartBar } from '@tabler/icons-react';

// constant
const icons = { IconChartBar };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const statistical = {
  id: 'dashboard',
  type: 'group',
  children: [
    {
      id: 'statistical',
      title: 'Thống Kê',
      type: 'item',
      url: '/dashboard/statistical',
      icon: icons.IconChartBar,
      breadcrumbs: false
    }
  ]
};

export default statistical;
