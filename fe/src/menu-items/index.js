import pages from './pages';
import dashboard from './dashboard';
import product from './product';
import voucher from './voucher';
import account from './account';
import bill from './bill';
import orders from './orders';
import statistical from './statistical';
import returnOrder from 'menu-items/returnOrder';
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [statistical,orders,returnOrder,product,bill,voucher,account]
};

export default menuItems;
