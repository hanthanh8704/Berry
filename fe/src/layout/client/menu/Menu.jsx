
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconSearch, IconShoppingCart, IconUser } from '@tabler/icons-react';
import './Menu.css';
import { getAllDanhMuc, searchSP, finBySanPhamIdDM, getAllGioHang } from '../../../views/utilities/ApiDotGiamGia/DotGiamGiaApi';
import { Modal as AntdModal, message } from 'antd';
import { toast } from 'react-toastify';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const MenuCustomer = () => {
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
        } else {
            const customerId = localStorage.getItem('customerId');
            const customerName = localStorage.getItem('customerName');
            setUser({
                customerId: customerId,
                customerName: customerName,
            });
            console.log("Using existing customer:", { customerId, customerName });
        }
    }, []);
    // Kiểm tra và lấy customerId từ user
    const customerId = user ? user.customerId : null;

    // console.log("User sau khi đăng nhập product detail:", user);

    // Kiểm tra nếu `user` đã có dữ liệu thì mới truy xuất `customerId`
    if (user) {
        // console.log("Customer ID:", customerId);
    } else {
        console.log("User chưa được load");
    }

    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [danhMuc, setDanhMuc] = useState([]);
    const [products, setProducts] = useState([]);

    const [product, setProduct] = useState([]);

    const navigate = useNavigate();
    const [hoveredDanhMucId, setHoveredDanhMucId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Lưu từ khóa tìm kiếm

    useEffect(() => {
        getAllDM();
    }, []);

    useEffect(() => {
        if (hoveredDanhMucId !== null) {
            fetchProductsByDanhMucId(hoveredDanhMucId);
        }
    }, [hoveredDanhMucId]);

    const getAllDM = () => {
        getAllDanhMuc()
            .then((response) => {
                setDanhMuc(response.data);
                console.log("Danh muc dddddddd", danhMuc)
            })
            .catch((error) => {
                console.error('Error fetching danh muc:', error);
            });
    };

    const fetchProductsByDanhMucId = (id) => {
        finBySanPhamIdDM(id)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    useEffect(() => {
        const fetchCartItemsCount = async () => {
            try {
                if (customerId) {
                    const response = await getAllGioHang(customerId);
                    const totalItems = response.data.reduce((total, item) => total + item.quantity, 0);
                    setCartItemsCount(totalItems);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItemsCount(); // Gọi khi component load lần đầu

        const intervalId = setInterval(fetchCartItemsCount, 3000); // Tự động chạy mỗi 3 giây

        return () => clearInterval(intervalId); // Dọn dẹp interval khi component unmount
    }, [customerId]); // Mỗi khi customerId thay đổi




    const handleDanhMucHover = (id) => {
        setHoveredDanhMucId(id);
    };

    const handleDanhMucLeave = () => {
        setHoveredDanhMucId(null);
        setProducts([]);
    };


    //Tim kiem 
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Kiểm tra nếu từ khóa tìm kiếm trống
        if (searchTerm.trim() === '') {
            toast.error('Vui lòng nhập từ khóa!');
        } else {
            // Gọi API tìm kiếm sản phẩm dựa trên từ khóa
            searchSP(searchTerm)
                .then((response) => {
                    setProduct(response.data);
                    console.log('response.data:', response.data);
                    navigate(`/search/${searchTerm}`, { state: { product: response.data } });
                    // }
                })
                .catch((error) => {
                    console.error('Error searching products:', error);
                });
        }
    }

    const handleAccountClick = () => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            navigate("/account/profile");
        } else {
            toast.error('Vui lòng đăng nhập để xem tài khoản!');

        }
    };
    const [selectedDanhMuc, setSelectedDanhMuc] = useState(null);
    
 
    return (
        <div>
            <nav className="menuItem bg-light container-fluid mb-2">
                <div className="container d-flex mb-3" style={{ justifyContent: 'space-between', alignItems: 'center' }}>

                    {/* Menu Links */}
                    <div className="menu-links">
                        <nav className="navbar navbar-expand-lg bg-body-tertiary">
                            <div className="container-fluid">
                                <div className="collapse navbar-collapse justify-content-start" id="navbarNav">
                                    <ul className="navbar-nav">
                                        <li className="nav-item" style={{ padding: '5px 10px', margin: '0 5px' }}>
                                            <Link
                                                className="nav-link active"
                                                to="/home"
                                                onClick={() => setSelectedDanhMuc('home')}
                                                style={{
                                                    textTransform: 'uppercase',
                                                    fontSize: '14px',
                                                    borderBottom: selectedDanhMuc === 'home' ? '1px solid black' : 'none',
                                                    padding: '5px 0',
                                                }}
                                            >
                                                Trang chủ
                                            </Link>
                                        </li>
                                        {danhMuc.map((dm, index) => (
                                            <li className="nav-item" key={index} style={{ padding: '5px 10px', margin: '0 5px' }}>
                                                <Link
                                                    className="nav-link active"
                                                    to={`/products/${dm.id}`}
                                                    onClick={() => setSelectedDanhMuc(dm.id)}
                                                    style={{
                                                        textTransform: 'uppercase',
                                                        fontSize: '14px',
                                                        borderBottom: selectedDanhMuc === dm.id ? '1px solid black' : 'none',
                                                        padding: '5px 0',
                                                    }}
                                                >
                                                    {dm.name}
                                                </Link>
                                            </li>
                                        ))}
                                        <li className="nav-item" style={{ padding: '5px 10px', margin: '0 5px' }}>
                                            <Link
                                                className="nav-link active"
                                                to="/tracking"
                                                onClick={() => setSelectedDanhMuc('tracking')}
                                                style={{
                                                    textTransform: 'uppercase',
                                                    fontSize: '14px',
                                                    borderBottom: selectedDanhMuc === 'tracking' ? '1px solid black' : 'none',
                                                    padding: '5px 0',
                                                }}
                                            >
                                                Tra cứu
                                            </Link>
                                        </li>
                                        <li className="nav-item" style={{ padding: '5px 10px', margin: '0 5px' }}>
                                    <Link
                                        className="nav-link active"
                                        to="/chinh-sach"        
                                        onClick={() => setSelectedDanhMuc('chinhSach')}
                                        style={{
                                            textTransform: 'uppercase',
                                            fontSize: '14px',
                                            borderBottom: selectedDanhMuc === 'chinhSach' ? '1px solid black' : 'none',
                                            padding: '5px 0',
                                        }}                              
                                    >
                                        Chính sách
                                    </Link>
                                </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>

                    {/* Search Bar */}
                    <div className="search">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="navbar-search d-flex">
                                <Input
                                    style={{
                                        borderRadius: '20px',
                                        width: '500px',
                                        height: '44px',
                                    }}
                                    className="search-input"
                                    placeholder="Tìm kiếm theo tên sản phẩm.."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    prefix={<SearchOutlined />}
                                    allowClear
                                    enterButton="Search"
                                    onSearch={handleSearchSubmit}
                                />
                            </div>
                        </form>
                    </div>

                </div>
            </nav>
        </div>
    );
};
export default MenuCustomer;
