import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Avatar, Menu, Button, message, Modal } from 'antd';
import {
    ProfileOutlined,
    EnvironmentOutlined,
    ShoppingCartOutlined,
    GiftOutlined,
    KeyOutlined
} from '@ant-design/icons';
import { Box, Typography } from '@mui/material';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { detailKH } from '../../../views/utilities/ApiDotGiamGia/DotGiamGiaApi';
import { FaSignOutAlt } from 'react-icons/fa'; // Thêm icon đăng xuất
import axios from "axios"
import { toast } from 'react-toastify';
const Account = ({ handleLeftDrawerToggle }) => {
    const location = useLocation();
    const [selectedMenu, setSelectedMenu] = useState('');
    const [khachHang, setKhachHang] = useState(null);

    const [user, setUser] = useState(null);
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            const userInfo = {
                role: localStorage.getItem('userRole'),
                email: localStorage.getItem('userEmail'),
                username: localStorage.getItem('username'),
                customerId: localStorage.getItem('customerId'),
                customerName: localStorage.getItem('customerName'),
                customerEmail: localStorage.getItem('customerEmail'),
                customerPhoneNumber: localStorage.getItem('customerPhoneNumber'),
            };
            setUser(userInfo);
        }
    }, []);

    console.log("User sau khi đăng nhập User:", user);
    // Kiểm tra và lấy customerId từ user
    const customerId = user ? user.customerId : null;

    // Gọi hàm lấy chi tiết khách hàng khi user đã có
    useEffect(() => {
        if (customerId) {
            detailKHClient(customerId);
        }
    }, [customerId]); // Chạy lại khi customerId thay đổi

    const detailKHClient = async (id) => {
        try {
            const response = await detailKH(id); // Giả sử bạn đã định nghĩa hàm này
            setKhachHang(response.data);
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tải thông tin khách hàng.');
            console.error(error);
        }
    };

    const handleUpdateSuccess = (newImageUrl) => {
        setKhachHang(prev => ({
            ...prev,
            imageStr: newImageUrl // Cập nhật URL ảnh mới
        }));
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/account/profile')) {
            setSelectedMenu('profile');
        } else if (path.includes('/account/address')) {
            setSelectedMenu('address');
        } else if (path.includes('/account/orders')) {
            setSelectedMenu('orders');
        } else if (path.includes('/account/vouchers')) {
            setSelectedMenu('vouchers');
        } else if (path.includes('/account/password')) {
            setSelectedMenu('password');
        } else {
            setSelectedMenu('');
        }
    }, [location.pathname]);
    const twelveHours = 12 * 60 * 60 * 1000; // 12 tiếng tính bằng mili giây

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
    
        if (!isAuthenticated) {
            const createdTime = localStorage.getItem('customerLeCreatedTime');
            const currentTime = Date.now();
            
            if (!createdTime || currentTime - createdTime > twelveHours) {
                axios.post(`http://localhost:8080/api/gio-hang/auto-create-customerLe`)
                    .then((response) => {
                        setCustomerLe(response.data);
                        console.log("Khách hàng lẻ được tạo:", response.data);
    
                        localStorage.setItem('customerLeCreatedTime', currentTime);
                        localStorage.setItem('customerId', response.data.id);
                        localStorage.setItem('customerName', response.data.fullName);
                        setUser({
                            customerId: response.data.id,
                            customerName: response.data.fullName,
                        });
                    })
                    .catch((e) => {
                        console.error("Lỗi khi tạo khách hàng lẻ:", e);
                    });
            } else {
                setUser({
                    customerId: localStorage.getItem('customerId'),
                    customerName: localStorage.getItem('customerName'),
                });
                console.log("Using existing customer:", {
                    customerId: localStorage.getItem('customerId'),
                    customerName: localStorage.getItem('customerName')
                });
            }
        }
    }, []);
    
    const handleSubmitLogout = () => {
        Modal.confirm({
            title: 'Xác nhận',
            maskClosable: true,
            content: 'Bạn có chắc chắn muốn đăng xuất?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await axios.post('http://localhost:8080/api/client/auth/logout');
                    toast.success("Đăng xuất thành công!");
                    localStorage.clear();
    
                    const createdTime = localStorage.getItem('customerLeCreatedTime');
                    const currentTime = Date.now();
    
                    if (!createdTime || currentTime - createdTime > twelveHours) {
                        const response = await axios.post('http://localhost:8080/api/gio-hang/auto-create-customerLe');
                        localStorage.setItem('customerLeCreatedTime', currentTime);
                        localStorage.setItem('customerId', response.data.id);
                        localStorage.setItem('customerName', response.data.fullName);
    
                        setUser({
                            customerId: response.data.id,
                            customerName: response.data.fullName,
                        });
                        console.log("Khách hàng lẻ được tạo sau khi đăng xuất:", response.data);
                    }
                    window.location.href = '/home';
                } catch (e) {
                    console.error("Lỗi khi không thể đăng xuất:", e);
                    toast.error("Đã có lỗi xảy ra trong quá trình đăng xuất.");
                }
            },
        });
    };
    

    const menuItems = [
        {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: <Link to="/account/profile" style={{ textDecoration: 'none' }}>Hồ sơ</Link>,
        },
        {
            key: 'address',
            icon: <EnvironmentOutlined />,
            label: <Link to="/account/address" style={{ textDecoration: 'none' }}>Địa chỉ</Link>,
        },
        {
            key: 'orders',
            icon: <ShoppingCartOutlined />,
            label: <Link to="/account/orders" style={{ textDecoration: 'none' }}>Đơn mua</Link>,
        },
        {
            key: 'vouchers',
            icon: <GiftOutlined />,
            label: <Link to="/account/vouchers" style={{ textDecoration: 'none' }}>Phiếu giảm giá</Link>,
        },
        {
            key: 'password',
            icon: <KeyOutlined />,
            label: <Link to="/account/password" style={{ textDecoration: 'none' }}>Đổi mật khẩu</Link>,
        },
        {
            key: 'logout',
            icon: <FaSignOutAlt />, // Icon đăng xuất
            label: <Typography>Đăng xuất</Typography>,
            onClick: handleSubmitLogout, // Gọi hàm handleSubmitLogout khi click
        },
    ];

    return (
        <div className="container py-3 px-5" style={{ backgroundColor: 'whitesmoke' }}>
            <Box className='d-flex py-3'>
                <Typography
                    component={Link}
                    to="/home"
                    sx={{ color: 'black', textDecoration: 'none', marginX: 1, fontWeight: 'bold' }}
                >
                    Trang chủ
                </Typography>
                <Typography sx={{ color: 'black', marginX: 1 }}>|</Typography>
                <Typography
                    component={Link}
                    to="/account/profile"
                    sx={{ color: 'black', textDecoration: 'none', marginX: 1 }}
                >
                    Tài khoản của tôi
                </Typography>
            </Box>

            <div className="row my-5">
                <div className="col-md-4 px-5 py-5" style={{ backgroundColor: 'white', borderRadius: '5px', marginRight: '70px' }}>
                    <div className="text-center mb-4">
                        <Avatar size={64} src={khachHang?.imageStr} alt="Ảnh khách hàng" />
                        <h4 className="mt-2">{khachHang?.fullName || 'Tên khách hàng'}</h4>
                    </div>
                    {/* <User onSuccess={handleUpdateSuccess} />  */}
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedMenu]}
                        items={menuItems}
                    />

                </div>

                <div className="col-md-7" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Account;
