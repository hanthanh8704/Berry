import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const roleId = parseInt(localStorage.getItem('userRoleId'), 10);
  const filteredItems = menuItem.items.filter((item) => {
    if (roleId === 1) {
      return true;
    }
    if (roleId === 3 && (item.id === 'voucher' || item.id === 'account')) {
      return false;
    }

    return true;
  });
  const navItems = filteredItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
