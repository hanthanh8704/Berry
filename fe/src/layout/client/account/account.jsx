//Bản Việt
// import 'bootstrap/dist/css/bootstrap.min.css'; 
// import React, { useState, useEffect } from 'react'; 
// import { Avatar, Menu, Button } from 'antd'; 
// import { 
//     UserOutlined, 
//     ProfileOutlined, 
//     EnvironmentOutlined, 
//     ShoppingCartOutlined, 
//     GiftOutlined, 
//     KeyOutlined 
// } from '@ant-design/icons'; 
// import { Box, Typography } from '@mui/material'; 
// import { Link, useLocation, Outlet } from 'react-router-dom'; 
// import { detailKH } from '../../../views/utilities/ApiDotGiamGia/DotGiamGiaApi'; 

// const Account = ({ handleLeftDrawerToggle }) => { 
//     const location = useLocation(); 
//     const [selectedMenu, setSelectedMenu] = useState(''); 
//     const [khachHang, setKhachHang] = useState(''); 

//     useEffect(() => { 
//         const customerId = 2; 
//         detailKHClient(customerId); 
//     }, []); 

//     const detailKHClient = (id) => { 
//         detailKH(id) 
//             .then(response => { 
//                 setKhachHang(response.data); 
//                 console.log("khach hang ddddddd", khachHang); 
//                 console.log("khach hang ddddddd", response.data); 
//             }) 
//             .catch(error => { 
//                 message.error('Đã xảy ra lỗi khi tải thông tin khách hàng.'); 
//             }); 
//     }; 

//     useEffect(() => { 
//         const path = location.pathname; 
//         if (path.includes('/account/profile')) { 
//             setSelectedMenu('profile'); 
//         } else if (path.includes('/account/address')) { 
//             setSelectedMenu('address'); 
//         } else if (path.includes('/account/orders')) { 
//             setSelectedMenu('orders'); 
//         } else if (path.includes('/account/vouchers')) { 
//             setSelectedMenu('vouchers'); 
//         } else if (path.includes('/account/password')) { 
//             setSelectedMenu('password'); 
//         } else { 
//             setSelectedMenu(''); 
//         } 
//     }, [location.pathname]); 

//     // Cấu trúc items cho Menu
//     const menuItems = [
//         {
//             key: 'profile',
//             icon: <ProfileOutlined />,
//             label: <Link to="/account/profile" style={{ textDecoration: 'none', textTransform: 'none' }}>Hồ sơ</Link>,
//         },
//         {
//             key: 'address',
//             icon: <EnvironmentOutlined />,
//             label: <Link to="/account/address" style={{ textDecoration: 'none' }}>Địa chỉ</Link>,
//         },
//         {
//             key: 'orders',
//             icon: <ShoppingCartOutlined />,
//             label: <Link to="/account/orders" style={{ textDecoration: 'none' }}>Đơn mua</Link>,
//         },
//         {
//             key: 'vouchers',
//             icon: <GiftOutlined />,
//             label: <Link to="/account/vouchers" style={{ textDecoration: 'none' }}>Phiếu giảm giá</Link>,
//         },
//         {
//             key: 'password',
//             icon: <KeyOutlined />,
//             label: <Link to="/account/password" style={{ textDecoration: 'none' }}>Đổi mật khẩu</Link>,
//         }
//     ];

//     return ( 
//         <div className="container py-3 px-5" style={{ backgroundColor: 'whitesmoke' }}> 
//             <Box className='d-flex py-3'> 
//                 <Typography 
//                     component={Link} 
//                     to="/home" 
//                     sx={{ color: 'black', textDecoration: 'none', marginX: 1, fontWeight: 'bold' }} 
//                 > 
//                     Trang chủ 
//                 </Typography> 
//                 <Typography sx={{ color: 'black', marginX: 1 }}>|</Typography> 
//                 <Typography 
//                     component={Link} 
//                     to="/account/profile" 
//                     sx={{ color: 'black', textDecoration: 'none', marginX: 1 }} 
//                 > 
//                     Tài khoản của tôi 
//                 </Typography> 
//             </Box> 

//             <div className="row my-5"> 
//                 {/* Left Menu Section */} 
//                 <div className="col-md-4 px-5 py-5" style={{ backgroundColor: 'white', borderRadius: '5px', marginRight: '70px' }}> 
//                     <div className="text-center mb-4"> 
//                         <Avatar size={64} src={khachHang?.anh} alt="Ảnh khách hàng" /> 
//                         <h4 className="mt-2">{khachHang?.hoTen || 'Tên khách hàng'}</h4> 
//                         <Button type="link">Sửa hồ sơ</Button> 
//                     </div> 
//                     <Menu 
//                         mode="inline" 
//                         selectedKeys={[selectedMenu]} 
//                         items={menuItems} // Sử dụng items ở đây
//                     /> 
//                 </div> 
//                 {/* Right Content Section */} 
//                 <div className="col-md-7" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}> 
//                     <Outlet /> 
//                 </div> 
//             </div> 
//         </div> 
//     ); 
// }; 

// export default Account;


//Bản Anh
import 'bootstrap/dist/css/bootstrap.min.css'; 
import React, { useState, useEffect } from 'react'; 
import { Avatar, Menu, Button } from 'antd'; 
import { 
    UserOutlined, 
    ProfileOutlined, 
    EnvironmentOutlined, 
    ShoppingCartOutlined, 
    GiftOutlined, 
    KeyOutlined 
} from '@ant-design/icons'; 
import { Box, Typography } from '@mui/material'; 
import { Link, useLocation, Outlet } from 'react-router-dom'; 
import { detailKH } from '../../../views/utilities/ApiDotGiamGia/DotGiamGiaApi'; 

const Account = ({ handleLeftDrawerToggle }) => { 
    const location = useLocation(); 
    const [selectedMenu, setSelectedMenu] = useState(''); 
    const [khachHang, setKhachHang] = useState(''); 

    useEffect(() => { 
        const customerId = 2; 
        detailKHClient(customerId); 
    }, []); 

    const detailKHClient = (id) => { 
        detailKH(id) 
            .then(response => { 
                setKhachHang(response.data); 
                console.log("khach hang ddddddd", khachHang); 
                console.log("khach hang ddddddd", response.data); 
            }) 
            .catch(error => { 
                message.error('Đã xảy ra lỗi khi tải thông tin khách hàng.'); 
            }); 
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

    // Cấu trúc items cho Menu
    const menuItems = [
        {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: <Link to="/account/profile" style={{ textDecoration: 'none', textTransform: 'none' }}>Hồ sơ</Link>,
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
        }
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
                {/* Left Menu Section */} 
                <div className="col-md-4 px-5 py-5" style={{ backgroundColor: 'white', borderRadius: '5px', marginRight: '70px' }}> 
                    <div className="text-center mb-4"> 
                        <Avatar size={64} src={khachHang?.image} alt="Ảnh khách hàng" /> 
                        <h4 className="mt-2">{khachHang?.code || 'Tên khách hàng'}</h4> 
                        <Button type="link">Sửa hồ sơ</Button> 
                    </div> 
                    <Menu 
                        mode="inline" 
                        selectedKeys={[selectedMenu]} 
                        items={menuItems} // Sử dụng items ở đây
                    /> 
                </div> 
                {/* Right Content Section */} 
                <div className="col-md-7" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}> 
                    <Outlet /> 
                </div> 
            </div> 
        </div> 
    ); 
}; 

export default Account;
