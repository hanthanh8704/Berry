//Bản tiéng việt
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { IconSearch, IconShoppingCart, IconUser } from '@tabler/icons-react';
// import './Menu.css';
// import { getAllDanhMuc, searchSP, finBySanPhamIdDM, getAllGioHang } from '../../../views/utilities/ApiDotGiamGia/DotGiamGiaApi';
// import { Modal as AntdModal, message } from 'antd';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const MenuCustomer = () => {

//     const [cartItemsCount, setCartItemsCount] = useState(0);
//     const [danhMuc, setDanhMuc] = useState([]);
//     const [products, setProducts] = useState([]);

//     const [product, setProduct] = useState([]);

//     const navigate = useNavigate();
//     const [hoveredDanhMucId, setHoveredDanhMucId] = useState(null);
//     const [searchTerm, setSearchTerm] = useState(''); // Lưu từ khóa tìm kiếm

//     const idKH = 2;

//     useEffect(() => {
//         getAllDM();
//     }, []);

//     useEffect(() => {
//         if (hoveredDanhMucId !== null) {
//             fetchProductsByDanhMucId(hoveredDanhMucId);
//         }
//     }, [hoveredDanhMucId]);

//     const getAllDM = () => {
//         getAllDanhMuc()
//             .then((response) => {
//                 setDanhMuc(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching danh muc:', error);
//             });
//     };

//     const fetchProductsByDanhMucId = (id) => {
//         finBySanPhamIdDM(id)
//             .then((response) => {
//                 setProduct(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching products:', error);
//             });
//     };

//     useEffect(() => {
//         const fetchCartItemsCount = () => {
//             getAllGioHang(idKH)
//                 .then((response) => {
//                     // Tính tổng số lượng của tất cả các sản phẩm trong giỏ hàng
//                     const totalItems = response.data.reduce((total, item) => total + item.soLuong, 0);
//                     setCartItemsCount(totalItems);
//                 })
//                 .catch((error) => {
//                     console.error('Error fetching cart items:', error);
//                 });
//         };
//         // Lần đầu tiên gọi để lấy số lượng giỏ hàng
//         fetchCartItemsCount();
//         // Thiết lập interval để cập nhật số lượng giỏ hàng mỗi 3 giây (3000ms)
//         const intervalId = setInterval(fetchCartItemsCount, 3000);
//         // Dọn dẹp interval khi component unmount
//         return () => clearInterval(intervalId);
//     }, []); // Chạy một lần khi component mount



//     const handleDanhMucHover = (id) => {
//         setHoveredDanhMucId(id);
//     };

//     const handleDanhMucLeave = () => {
//         setHoveredDanhMucId(null);
//         setProducts([]);
//     };


//     //Tim kiem 
//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         // Kiểm tra nếu từ khóa tìm kiếm trống
//         if (searchTerm.trim() === '') {
//             toast.error('Vui lòng nhập từ khóa!');
//         } else {
//             // Gọi API tìm kiếm sản phẩm dựa trên từ khóa
//             searchSP(searchTerm)
//                 .then((response) => {
//                     setProduct(response.data);
//                     console.log('response.data:', response.data);
//                     navigate(`/search/${searchTerm}`, { state: { product: response.data } });
//                     // }
//                 })
//                 .catch((error) => {
//                     console.error('Error searching products:', error);
//                 });
//         }
//     }

//     return (
//         <div>
//             <nav className="bg-light container-fluid" style={{ borderBottom: '1px solid #6A0DAD' }}>
//                 <div className="container d-flex mb-3" style={{ justifyContent: 'space-around', alignItems: 'center' }}>
//                     <div className='imgages d-flex'>
//                         <Link className="navbar-brand d-flex align-items-center" to="/home">
//                             <svg width="97" height="109" viewBox="0 0 46 55" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <g clipPath="url(#clip0)">
//                                     <path d="M19.6667 55C8.82205 55 0 46.2504 0 35.4968C0 24.7431 8.82292 15.9935 19.6667 15.9935C30.5105 15.9935 39.3334 24.7431 39.3334 35.4968C39.3334 46.2504 30.5122 55 19.6667 55ZM19.6667 17.8563C9.8587 17.8563 1.87839 25.7686 1.87839 35.4959C1.87839 45.2233 9.8587 53.1355 19.6667 53.1355C29.4747 53.1355 37.4559 45.2215 37.4559 35.4942C37.4559 25.7668 29.4765 17.8563 19.6667 17.8563Z" fill="#2196F3" />
//                                     <path d="M33.9387 36.3618C33.3269 34.1133 27.7188 33.8706 24.3807 34.6949C22.6326 35.1283 20.846 35.6917 19.0034 36.0159C20.3521 37.2026 21.8005 38.3251 23.879 38.6042C29.0361 39.2942 32.2404 37.6898 33.9387 36.3618Z" fill="#2196F3" />
//                                     <path d="M23.8788 38.6042C21.7959 38.3251 20.3519 37.2026 19.0032 36.016C16.9159 34.1792 15.0594 32.189 11.4154 32.9379C5.62198 34.1289 4.85978 40.9247 9.3333 45.2917C11.254 47.2864 13.7197 48.6822 16.4284 49.3079C19.137 49.9336 21.9709 49.7621 24.5828 48.8144C27.1946 47.8667 29.4709 46.1839 31.1327 43.9724C32.7945 41.7608 33.7696 39.1165 33.9385 36.3635C32.2402 37.6898 29.0358 39.2942 23.8788 38.6042Z" fill="#673AB7" />
//                                     <path d="M26.9105 23.8962C26.1876 25.4331 32.6321 27.1381 33.4031 32.2419C33.7746 27.2178 27.8046 21.9962 26.9105 23.8962Z" fill="#2196F3" />
//                                     <path d="M13.3649 30.3107C14.5267 29.8335 15.0784 28.5126 14.5972 27.3604C14.116 26.2083 12.784 25.6611 11.6222 26.1384C10.4604 26.6156 9.90867 27.9365 10.3899 29.0887C10.8712 30.2408 12.2031 30.7879 13.3649 30.3107Z" fill="#673AB7" />
//                                     <path d="M18.5351 24.1103C19.0786 23.5714 19.0786 22.6977 18.5351 22.1587C17.9917 21.6198 17.1106 21.6198 16.5672 22.1587C16.0238 22.6977 16.0238 23.5714 16.5672 24.1103C17.1106 24.6492 17.9917 24.6492 18.5351 24.1103Z" fill="#2196F3" />
//                                     <path d="M23.4513 15.2376C25.4617 9.3485 24.1103 4.64345 19.9786 2.40881C17.1544 2.97831 15.4779 4.334 14.5444 6.20544C20.0843 5.76077 23.5999 9.1994 23.4513 15.2376Z" fill="#2196F3" />
//                                     <path d="M46.0001 10.0923C36.0487 6.55051 29.7685 7.76491 28.7808 15.8349C34.4841 21.6703 40.2286 18.8774 46.0001 10.0923Z" fill="#2196F3" />
//                                     <path d="M38.0851 6.89635C38.5466 4.94082 38.7861 2.6299 38.8219 0C28.5017 2.27885 23.8473 6.6337 27.3584 13.9782C27.5333 14.0198 27.7011 14.0536 27.8698 14.0883C28.6905 8.34132 32.3031 6.2133 38.0851 6.89635Z" fill="#2196F3" />
//                                 </g>
//                                 <defs>
//                                     <clipPath id="clip0">
//                                         <rect width="46" height="55" fill="white" />
//                                     </clipPath>
//                                 </defs>
//                             </svg>
//                         </Link>
//                     </div>
//                     <div className='search'>
//                         <form onSubmit={handleSearchSubmit}>
//                             <div className="navbar-search d-flex">
//                                 <span className="input-group-text" style={{ backgroundColor: 'white', width: '40px', borderLeft: '1px solid #6A0DAD', borderBottom: '1px solid #6A0DAD', borderTop: '1px solid #6A0DAD', borderRadius: '20px 0px 0px 20px' }}>
//                                     <IconSearch size={24} color="#6A0DAD" />
//                                 </span>
//                                 <input
//                                     style={{ position: 'relative', borderRadius: '0px 20px 20px 0px', width: '500px', height: '44px', borderLeft: '1px solid white', borderTop: '1px solid #6A0DAD', borderBottom: '1px solid #6A0DAD', borderRight: '1px solid #6A0DAD' }}
//                                     className="form-control"
//                                     type="search"
//                                     placeholder="Tìm kiếm..."
//                                     aria-label="Search"
//                                     value={searchTerm} // Giá trị của ô input là searchTerm
//                                     onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm khi người dùng nhập
//                                 />
//                                 <button className="btn" type="submit" style={{ position: 'absolute', backgroundColor: '#6A0DAD', color: 'white', borderRadius: '20px', marginLeft: '455px', height: '44px' }}>
//                                     SEARCH
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                     <div className="navbar-icons d-flex align-items-center">
//                         <Link className="nav-link position-relative me-3" to="/cart" style={{ display: 'flex', alignItems: 'center' }}>
//                             <span
//                                 className="icon-badge position-absolute"
//                                 style={{
//                                     top: '-10px',
//                                     right: '-10px',
//                                     backgroundColor: '#FF0000',
//                                     color: 'white',
//                                     borderRadius: '50%',
//                                     padding: '1px 6px',
//                                     fontSize: '10px'
//                                 }}
//                             >
//                                 {cartItemsCount}
//                             </span>
//                             <IconShoppingCart size={24} color='#6A0DAD' />
//                         </Link>
//                         <Link className="nav-link" to="/account/profile" style={{ display: 'flex', alignItems: 'center' }}>
//                             <IconUser size={24} color='#6A0DAD' />

//                         </Link>
//                     </div>
//                 </div>
//                 <ToastContainer />
//                 <nav className="navbar navbar-expand-lg bg-body-tertiary">
//                     <div className="container-fluid">
//                         <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
//                             <ul className="navbar-nav">
//                                 <li className="nav-item">
//                                     <Link className="nav-link active px-5" to="/home" style={{ textTransform: 'uppercase', fontSize: '15px' }}>
//                                         Trang chủ
//                                     </Link>
//                                 </li>
//                                 {danhMuc.map((dm, index) => (
//                                     <li className="nav-item" key={index}>
//                                         <Link className="nav-link active px-5" to={`/products/${dm.id}`} style={{ textTransform: 'uppercase', fontSize: '15px' }}>
//                                             {dm.ten}
//                                         </Link>
//                                     </li>
//                                 ))}
//                                 <li className="nav-item">
//                                     <Link className="nav-link active px-5" to="/tracking" style={{ textTransform: 'uppercase', fontSize: '15px' }}>
//                                         Tra cứu
//                                     </Link>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                 </nav>

//             </nav>
//         </div>
//     );
// };
// export default MenuCustomer;



//Bản tiếng Anh

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconSearch, IconShoppingCart, IconUser } from '@tabler/icons-react';
import './Menu.css';
import { getAllDanhMuc, searchSP, finBySanPhamIdDM, getAllGioHang } from '../../../views/utilities/ApiDotGiamGia/DotGiamGiaApi';
import { Modal as AntdModal, message } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MenuCustomer = () => {

    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [danhMuc, setDanhMuc] = useState([]);
    const [products, setProducts] = useState([]);

    const [product, setProduct] = useState([]);

    const navigate = useNavigate();
    const [hoveredDanhMucId, setHoveredDanhMucId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Lưu từ khóa tìm kiếm

    const idKH = 2;

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
        const fetchCartItemsCount = () => {
            getAllGioHang(idKH)
                .then((response) => {
                    // Tính tổng số lượng của tất cả các sản phẩm trong giỏ hàng
                    const totalItems = response.data.reduce((total, item) => total + item.quantity, 0);
                    setCartItemsCount(totalItems);
                })
                .catch((error) => {
                    console.error('Error fetching cart items:', error);
                });
        };
        // Lần đầu tiên gọi để lấy số lượng giỏ hàng
        fetchCartItemsCount();
        // Thiết lập interval để cập nhật số lượng giỏ hàng mỗi 3 giây (3000ms)
        const intervalId = setInterval(fetchCartItemsCount, 3000);
        // Dọn dẹp interval khi component unmount
        return () => clearInterval(intervalId);
    }, []); // Chạy một lần khi component mount



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

    return (
        <div>
            <nav className="bg-light container-fluid" style={{ borderBottom: '1px solid #6A0DAD' }}>
                <div className="container d-flex mb-3" style={{ justifyContent: 'space-around', alignItems: 'center' }}>
                    <div className='imgages d-flex'>
                        <Link className="navbar-brand d-flex align-items-center" to="/home">
                            <svg width="97" height="109" viewBox="0 0 46 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0)">
                                    <path d="M19.6667 55C8.82205 55 0 46.2504 0 35.4968C0 24.7431 8.82292 15.9935 19.6667 15.9935C30.5105 15.9935 39.3334 24.7431 39.3334 35.4968C39.3334 46.2504 30.5122 55 19.6667 55ZM19.6667 17.8563C9.8587 17.8563 1.87839 25.7686 1.87839 35.4959C1.87839 45.2233 9.8587 53.1355 19.6667 53.1355C29.4747 53.1355 37.4559 45.2215 37.4559 35.4942C37.4559 25.7668 29.4765 17.8563 19.6667 17.8563Z" fill="#2196F3" />
                                    <path d="M33.9387 36.3618C33.3269 34.1133 27.7188 33.8706 24.3807 34.6949C22.6326 35.1283 20.846 35.6917 19.0034 36.0159C20.3521 37.2026 21.8005 38.3251 23.879 38.6042C29.0361 39.2942 32.2404 37.6898 33.9387 36.3618Z" fill="#2196F3" />
                                    <path d="M23.8788 38.6042C21.7959 38.3251 20.3519 37.2026 19.0032 36.016C16.9159 34.1792 15.0594 32.189 11.4154 32.9379C5.62198 34.1289 4.85978 40.9247 9.3333 45.2917C11.254 47.2864 13.7197 48.6822 16.4284 49.3079C19.137 49.9336 21.9709 49.7621 24.5828 48.8144C27.1946 47.8667 29.4709 46.1839 31.1327 43.9724C32.7945 41.7608 33.7696 39.1165 33.9385 36.3635C32.2402 37.6898 29.0358 39.2942 23.8788 38.6042Z" fill="#673AB7" />
                                    <path d="M26.9105 23.8962C26.1876 25.4331 32.6321 27.1381 33.4031 32.2419C33.7746 27.2178 27.8046 21.9962 26.9105 23.8962Z" fill="#2196F3" />
                                    <path d="M13.3649 30.3107C14.5267 29.8335 15.0784 28.5126 14.5972 27.3604C14.116 26.2083 12.784 25.6611 11.6222 26.1384C10.4604 26.6156 9.90867 27.9365 10.3899 29.0887C10.8712 30.2408 12.2031 30.7879 13.3649 30.3107Z" fill="#673AB7" />
                                    <path d="M18.5351 24.1103C19.0786 23.5714 19.0786 22.6977 18.5351 22.1587C17.9917 21.6198 17.1106 21.6198 16.5672 22.1587C16.0238 22.6977 16.0238 23.5714 16.5672 24.1103C17.1106 24.6492 17.9917 24.6492 18.5351 24.1103Z" fill="#2196F3" />
                                    <path d="M23.4513 15.2376C25.4617 9.3485 24.1103 4.64345 19.9786 2.40881C17.1544 2.97831 15.4779 4.334 14.5444 6.20544C20.0843 5.76077 23.5999 9.1994 23.4513 15.2376Z" fill="#2196F3" />
                                    <path d="M46.0001 10.0923C36.0487 6.55051 29.7685 7.76491 28.7808 15.8349C34.4841 21.6703 40.2286 18.8774 46.0001 10.0923Z" fill="#2196F3" />
                                    <path d="M38.0851 6.89635C38.5466 4.94082 38.7861 2.6299 38.8219 0C28.5017 2.27885 23.8473 6.6337 27.3584 13.9782C27.5333 14.0198 27.7011 14.0536 27.8698 14.0883C28.6905 8.34132 32.3031 6.2133 38.0851 6.89635Z" fill="#2196F3" />
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="46" height="55" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </Link>
                    </div>
                    <div className='search'>
                        <form onSubmit={handleSearchSubmit}>
                            <div className="navbar-search d-flex">
                                <span className="input-group-text" style={{ backgroundColor: 'white', width: '40px', borderLeft: '1px solid #6A0DAD', borderBottom: '1px solid #6A0DAD', borderTop: '1px solid #6A0DAD', borderRadius: '20px 0px 0px 20px' }}>
                                    <IconSearch size={24} color="#6A0DAD" />
                                </span>
                                <input
                                    style={{ position: 'relative', borderRadius: '0px 20px 20px 0px', width: '500px', height: '44px', borderLeft: '1px solid white', borderTop: '1px solid #6A0DAD', borderBottom: '1px solid #6A0DAD', borderRight: '1px solid #6A0DAD' }}
                                    className="form-control"
                                    type="search"
                                    placeholder="Tìm kiếm..."
                                    aria-label="Search"
                                    value={searchTerm} // Giá trị của ô input là searchTerm
                                    onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm khi người dùng nhập
                                />
                                <button className="btn" type="submit" style={{ position: 'absolute', backgroundColor: '#6A0DAD', color: 'white', borderRadius: '20px', marginLeft: '455px', height: '44px' }}>
                                    SEARCH
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="navbar-icons d-flex align-items-center">
                        <Link className="nav-link position-relative me-3" to="/cart" style={{ display: 'flex', alignItems: 'center' }}>
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
                        <Link className="nav-link" to="/account/profile" style={{ display: 'flex', alignItems: 'center' }}>
                            <IconUser size={24} color='#6A0DAD' />

                        </Link>
                    </div>
                </div>
                <ToastContainer />
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link active px-5" to="/home" style={{ textTransform: 'uppercase', fontSize: '15px' }}>
                                        Trang chủ
                                    </Link>
                                </li>
                                {danhMuc.map((dm, index) => (
                                    <li className="nav-item" key={index}>
                                        <Link className="nav-link active px-5" to={`/products/${dm.id}`} style={{ textTransform: 'uppercase', fontSize: '15px' }}>
                                            {dm.name}
                                        </Link>
                                    </li>
                                ))}
                                <li className="nav-item">
                                    <Link className="nav-link active px-5" to="/tracking" style={{ textTransform: 'uppercase', fontSize: '15px' }}>
                                        Tra cứu
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

            </nav>
        </div>
    );
};
export default MenuCustomer;
