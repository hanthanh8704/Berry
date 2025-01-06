import React, { useState, useEffect } from 'react';
import './Header.css';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IconShoppingCart, IconUser } from '@tabler/icons-react';
import logos from 'assets/images/hh.png';
import { getAllGioHang } from '../../../views/utilities/ApiDotGiamGia/DotGiamGiaApi';

const Header = () => {
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [user, setUser] = useState(null);

  const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const loadUserData = () => {
      if (isLoggedIn) {
        setUser({
          role: localStorage.getItem('userRole'),
          email: localStorage.getItem('userEmail'),
          username: localStorage.getItem('username'),
          customerId: localStorage.getItem('customerId'),
          customerName: localStorage.getItem('customerName'),
          customerEmail: localStorage.getItem('customerEmail'),
          customerPhoneNumber: localStorage.getItem('customerPhoneNumber'),
        });
      } else {
        setUser({
          customerId: localStorage.getItem('customerId'),
          customerName: localStorage.getItem('customerName'),
        });
      }
    };

    loadUserData();
  }, [isLoggedIn]);

  // Cập nhật số lượng giỏ hàng
  useEffect(() => {
    const fetchCartItemsCount = async () => {
      try {
        if (user?.customerId) {
          const response = await getAllGioHang(user.customerId);
          const totalItems = response.data.reduce((total, item) => total + item.quantity, 0);
          setCartItemsCount(totalItems);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItemsCount();

    const intervalId = setInterval(fetchCartItemsCount, 3000);
    return () => clearInterval(intervalId);
  }, [user]);

  // Xử lý khi người dùng nhấn vào tài khoản
  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/account/profile');
    } else {
      alert('Vui lòng đăng nhập để xem tài khoản!');
    }
  };

  return (
    <AppBar position="static" className="app-bar">
      <Toolbar>
        {/* Logo */}
        <div className="logo-container">
          <Link to="/home" style={{ pointerEvents: 'none' }}>
            <img src={logos} alt="Berry" width="150" />
          </Link>
        </div>

        {/* Nội dung bên phải */}
        <Box display="flex" justifyContent="space-between" width="100%">
          {/* Hiển thị đăng nhập/đăng ký nếu chưa đăng nhập */}
          {!isLoggedIn ? (
            <div className="nav-links user-info">
              <Link to="/login" className="nav-link">
                ĐĂNG NHẬP
              </Link>
              <span className="nav-divider">|</span>
              <Link to="/sign-in" className="nav-link">
                ĐĂNG KÝ
              </Link>
            </div>
          ) : (
            <Box display="flex" alignItems="center" className="user-info ">
              {/* Hiển thị "Xin chào, {user.customerName}" khi đã đăng nhập */}

              <Typography variant="body1">Xin chào, {user?.customerName || 'User'}!</Typography>
            </Box>
          )}
          <div className="navbar-icons d-flex align-items-center">
            <Link className="nav-link position-relative mx-2" to="/cart" style={{ display: 'flex', alignItems: 'center' }}>
              <span
                className="icon-badge position-absolute"
                style={{
                  top: '-10px',
                  right: '-10px',
                  backgroundColor: '#FF0000',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '1px 6px',
                  fontSize: '10px'
                }}
              >
                {cartItemsCount}
              </span>
              <IconShoppingCart size={24} color='#6A0DAD' />
            </Link>
            {isLoggedIn ? (
              <Link className="nav-link position-relative me-3" to="/account/profile" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="nav-link" onClick={handleAccountClick} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <IconUser size={24} color='#6A0DAD' />
                </div>
              </Link>
            ) : ""}
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
