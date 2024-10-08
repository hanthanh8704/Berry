//Bản tiếng Việt
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import React, { useEffect, useState } from "react";
// import { Row, Col, Carousel, InputNumber, Button, Card, Radio } from "antd";
// import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
// import { useParams, useLocation, Link } from 'react-router-dom';
// import { findByIdSPCT, getAllByIdSP, findByMSAndKC, detailSPCT } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import FormatCurrency from "../../utilities/FormatCurrency.jsx";
// import { FaShoppingCart, FaTruck, FaCalendarDay, FaUndo, FaTag, FaLock } from 'react-icons/fa';
// import { Box, Typography } from '@mui/material';
// import { createGioHang } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Modal, Button as BootstrapButton } from 'react-bootstrap';

// const ProductDetail = () => {
//     const [productDetailList, setProductDetailList] = useState();

//     const [productDetail, setProductDetail] = useState(null);
//     const [cart, setCart] = useState(null);
//     const [giaBan, setGiaBan] = useState(null);
//     const [images, setImages] = useState([]);
//     const [error, setError] = useState(null);
//     const [mauSac, setMauSac] = useState([]);
//     const [kichThuoc, setKichThuoc] = useState([]);
//     const [product, setProduct] = useState([]);
//     const [quantity, setQuantity] = useState(1);

//     const { id } = useParams(); //ID Sản phẩm 
//     const location = useLocation(); // Lấy đối tượng location

//     const query = new URLSearchParams(location.search); // Phân tích chuỗi truy vấn
//     const idMauSac = query.get('color'); // Lấy giá trị của tham số color
//     const idKichCo = query.get('size'); // Lấy giá trị của tham số size


//     const [spctIdSPCT, setSpctId] = useState([]);

//     const [showModal, setShowModal] = useState(false); // State để điều khiển hiển thị modal

//     // Hàm mở modal
//     const handleShow = () => setShowModal(true);

//     // Hàm đóng modal
//     const handleClose = () => setShowModal(false);

//     // Hàm thêm vào sản phẩm vào giỏ hàng 
//     const addGioHang = async (e) => {
//         e.preventDefault();

//         const gioHang = {
//             soLuong: quantity,
//             spctId: selectedSPCT.id,
//             khachHang: { id: 2 }
//         };

//         console.log('Data to be sent:', gioHang);

//         try {
//             const response = await createGioHang(gioHang);
//             setCart(response.data);
//             console.log('Cart :', response.data);
//             handleShow(); // Mở modal sau khi thêm sản phẩm thành công
//             toast.success('Đã thêm sản phẩm vào giỏ hàng!');
//         } catch (error) {
//             console.error('Error adding to cart:', error.response ? error.response.data : error);
//             toast.error(error.response ? error.response.data.message : "Có lỗi xảy ra.");
//         }
//     };


//     const [selectedColor, setSelectedColor] = useState(idMauSac || '');
//     const [selectedSize, setSelectedSize] = useState(idKichCo || '');
//     const [selectedSPCT, setSelectedSPCT] = useState(null);

//     // Hàm tự động chọn RadioButton mặc định khi chuyển trang
//     useEffect(() => {
//         if (idMauSac && idKichCo && productDetailList?.listSPCT) {
//             // Tìm sản phẩm chi tiết (SPCT) khớp với idMauSac và idKichCo
//             const matchingSPCT = productDetailList.listSPCT.find(spct =>
//                 spct.idMauSac.id === parseInt(idMauSac) && spct.idKichCo.id === parseInt(idKichCo)
//             );
//             if (matchingSPCT) {
//                 setSelectedColor(parseInt(idMauSac)); // Đặt mặc định cho RadioButton màu sắc
//                 setSelectedSize(parseInt(idKichCo));  // Đặt mặc định cho RadioButton kích cỡ
//                 setSelectedSPCT(matchingSPCT); // Cập nhật sản phẩm chi tiết
//             }
//         }
//     }, [idMauSac, idKichCo, productDetailList]);

//     useEffect(() => {
//         if (selectedColor && selectedSize && productDetailList?.listSPCT) {
//             const matchingSPCT = productDetailList.listSPCT.find(spct =>
//                 spct.idMauSac.id === selectedColor && spct.idKichCo.id === selectedSize
//             );
//             if (matchingSPCT) {
//                 setSelectedSPCT(matchingSPCT);
//             } else {
//                 setSelectedSPCT(null);
//             }
//         }
//     }, [selectedColor, selectedSize, productDetailList]);

//     const handleColorChange = (e) => {
//         setSelectedColor(e.target.value);
//     };

//     const handleSizeChange = (e) => {
//         setSelectedSize(e.target.value);
//     };

//     useEffect(() => {
//         getAllData();
//     }, [id]);

//     const getAllData = () => {
//         detailSPCT(id)
//             .then(response => {
//                 setProductDetailList(response.data); // Set product data
//                 console.log("Danh muc", response.data.tenDanhMuc); // Log the category name
//             })
//             .catch(error => {
//                 console.error('Error fetching San Pham CT:', error);
//             });
//     };

//     const maxQuantity = selectedSPCT?.soLuong;
//     console.log("SO luong", maxQuantity)
//     const increment = () => {
//         if (quantity < maxQuantity) {
//             setQuantity(quantity + 1);
//         }
//     };

//     const decrement = () => {
//         if (quantity > 1) {
//             setQuantity(quantity - 1);
//         }
//     };

//     return (
//         <div className="container mt-4">
//             <Box className='d-flex'>
//                 <Typography
//                     component={Link}
//                     to="/home"
//                     sx={{ color: 'black', textDecoration: 'none', marginX: 1 }}
//                 >
//                     Trang chủ
//                 </Typography>
//                 <Typography sx={{ color: 'black', marginX: 1 }}>|</Typography>
//                 {/* Check if productDetailList and idDanhMuc exist before accessing ten */}
//                 {productDetailList?.idDanhMuc?.ten && (
//                     <>
//                         <Typography
//                             component={Link}
//                             to={`/home`}
//                             sx={{ color: 'black', textDecoration: 'none', marginX: 1 }}
//                         >
//                             {productDetailList.idDanhMuc.ten}
//                         </Typography>
//                         <Typography sx={{ color: 'black', marginX: 1 }}>|</Typography>
//                     </>
//                 )}
//                 <Typography
//                     component={Link}
//                     to={`/product-detail/${productDetailList?.id}`}
//                     sx={{ color: 'black', textDecoration: 'none', marginX: 1 }}
//                 >
//                     {productDetailList?.ten}
//                 </Typography>
//             </Box>

//             <Box className='d-flex my-5 justify-content-around align-items-start'>
//                 <Box>
//                     <Carousel
//                         autoplay
//                         autoplaySpeed={3000}
//                         dots={false}
//                         arrows={false}
//                         style={{
//                             border: '1px solid black',
//                             borderRadius: '10px',
//                             width: '300px',
//                             height: '400px',
//                             padding: '10px',
//                             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                         }}
//                     >
//                         {selectedSPCT && selectedSPCT.anhList && selectedSPCT.anhList.length > 0 ? (
//                             selectedSPCT.anhList.map((anh, index) => (
//                                 <div key={`${selectedSPCT.id}-${index}`} className="image-container" style={{ marginBottom: '10px' }}>
//                                     <div className="ratio" style={{ '--bs-aspect-ratio': '75%' }}>
//                                         <div className="d-flex justify-content-center">
//                                             <Link className="nav-link" to={`/product-detail/${selectedSPCT.id}`}>
//                                                 <img
//                                                     src={anh.anh}
//                                                     alt="images"
//                                                     className="object-fit-contain mh-100 mw-100"
//                                                     style={{
//                                                         borderRadius: '8px',
//                                                         maxHeight: '500px',
//                                                         objectFit: 'cover',
//                                                     }}
//                                                 />
//                                             </Link>
//                                         </div>
//                                     </div>
//                                     {selectedSPCT.phanTramGiam ? (
//                                         <p
//                                             className="discount-badge"
//                                             style={{
//                                                 position: 'absolute',
//                                                 top: '10px',
//                                                 right: '10px',
//                                                 backgroundColor: 'red',
//                                                 color: 'white',
//                                                 padding: '5px 10px',
//                                                 borderRadius: '50%',
//                                             }}
//                                         >
//                                             {-selectedSPCT.phanTramGiam}%
//                                         </p>
//                                     ) : null}
//                                 </div>
//                             ))
//                         ) : (
//                             <p>Không có sản phẩm</p>
//                         )}
//                     </Carousel>

//                 </Box>
//                 <Box>
//                     <div className='my-2'>
//                         {selectedSPCT ? (
//                             <h3>
//                                 {`${productDetailList.ten}- ${selectedSPCT?.idThuongHieu?.ten || ''} - ${selectedSPCT?.idChatLieu?.ten || ''}`}
//                             </h3>
//                         ) : (
//                             <p>Không có sản phẩm</p>
//                         )}
//                     </div>
//                     <div className='d-flex text-center'>
//                         {selectedSPCT ? (
//                             selectedSPCT.giaMoi !== 0 ? (
//                                 <>
//                                     <h5 className="text-dark fw-semibold text-decoration-line-through">
//                                         <FormatCurrency value={selectedSPCT.giaBan} />
//                                     </h5>
//                                     <h5 className="text-danger fw-semibold mx-2">
//                                         <FormatCurrency value={selectedSPCT.giaMoi} />
//                                     </h5>
//                                 </>
//                             ) : (
//                                 <h5 className="text-dark fw-semibold">
//                                     <FormatCurrency value={selectedSPCT.giaBan} />
//                                 </h5>
//                             )
//                         ) : (
//                             <p>Không có sản phẩm</p>
//                         )}
//                     </div>

//                     <div className='my-2'>
//                         <span className='bg-warning rounded'>Sale ends in 12 hours</span>
//                     </div>
//                     <div className='my-2'>
//                         <b className=''>Màu sắc: {selectedSPCT?.idMauSac?.ten}</b> <br />
//                         <Radio.Group
//                             buttonStyle="solid"
//                             onChange={handleColorChange}
//                             value={selectedColor} // Đặt giá trị mặc định
//                         >
//                             {productDetailList?.listSPCT
//                                 .filter((spct, index, self) =>
//                                     index === self.findIndex((item) => item.idMauSac.id === spct.idMauSac.id)
//                                 )
//                                 .map((spct) => (
//                                     <Radio.Button
//                                         key={spct.id}
//                                         value={spct.idMauSac.id}
//                                         className='my-1'
//                                         style={{
//                                             display: 'inline-block',
//                                             width: 50,
//                                             height: 35,
//                                             borderRadius: '2px',
//                                             backgroundColor: spct.idMauSac.ma.startsWith('linear') ? 'transparent' : spct.idMauSac.ma,
//                                             backgroundImage: spct.idMauSac.ma.startsWith('linear') ? spct.idMauSac.ma : 'none',
//                                             marginRight: 8,
//                                         }}
//                                     />
//                                 ))}
//                         </Radio.Group>
//                     </div>
//                     <div className='my-2'>
//                         <b className=''>Kích cỡ: {selectedSPCT?.idKichCo?.ten}</b> <br />
//                         <Radio.Group
//                             buttonStyle="solid"
//                             onChange={handleSizeChange}
//                             value={selectedSize} // Đặt giá trị mặc định
//                         >
//                             {productDetailList?.listSPCT
//                                 .filter((spct, index, self) =>
//                                     index === self.findIndex((item) => item.idKichCo.id === spct.idKichCo.id)
//                                 )
//                                 .map((spct) => (
//                                     <Radio.Button
//                                         key={spct.id}
//                                         value={spct.idKichCo.id}
//                                         className='my-1'
//                                         style={{
//                                             display: 'inline-block',
//                                             width: 50,
//                                             height: 35,
//                                             marginRight: 8,
//                                             borderRadius: '2px'
//                                         }}
//                                     >
//                                         {spct.idKichCo.ten}
//                                     </Radio.Button>
//                                 ))}
//                         </Radio.Group>
//                     </div>
//                     <div className=''>
//                         <b className='my-3'>Số lượng:</b>
//                         <div className='d-flex align-items-center my-3'>
//                             <Row align="middle">
//                                 <Col>
//                                     <Button icon={<MinusOutlined />} onClick={decrement} />
//                                 </Col>
//                                 <Col>
//                                     <InputNumber
//                                         min={1}
//                                         max={maxQuantity}
//                                         value={quantity}
//                                         onChange={setQuantity}
//                                         style={{ margin: '0 10px' }}
//                                     />
//                                 </Col>
//                                 <Col>
//                                     <Button icon={<PlusOutlined />} onClick={increment} />
//                                 </Col>
//                             </Row>
//                             <p style={{ marginLeft: '10px' }} className='my-1'>
//                                 Còn {maxQuantity} sản phẩm tồn kho
//                             </p>
//                         </div>
//                     </div>
//                     <div>
//                         <button onClick={(e) => addGioHang(e)} className='btn rounded' style={{ color: 'white', marginTop: '20px', width: '370px', backgroundColor: '#6A0DAD' }}>
//                             <FaShoppingCart style={{ marginRight: '10px' }} />
//                             Thêm vào giỏ hàng
//                         </button>
//                         <Modal show={showModal} onHide={handleClose}>
//                             <Modal.Header closeButton>
//                                 <Modal.Title>Sản phẩm đã thêm vào giỏ hàng</Modal.Title>
//                             </Modal.Header>
//                             <Modal.Body>
//                                 {cart ? (
//                                     <div className="d-flex">
//                                         <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: '140px', marginRight: '20px' }}>
//                                             {cart.data.spct.anhList && cart.data.spct.anhList.map((anh, index) => (
//                                                 <div key={index} className="image-container">
//                                                     <div className="ratio" style={{ '--bs-aspect-ratio': '75%' }}>
//                                                         <div className="d-flex justify-content-center">
//                                                             <Link className="nav-link">
//                                                                 <img src={anh.anh} alt="images" className="object-fit-contain mh-100 mw-100" />
//                                                             </Link>
//                                                         </div>
//                                                     </div>
//                                                     {cart.data.spct.phanTramGiam ? (
//                                                         <p className="discount-badge">
//                                                             -{cart.data.spct.phanTramGiam}%
//                                                         </p>
//                                                     ) : null}
//                                                 </div>
//                                             ))}
//                                         </Carousel>
//                                         <div className="flex-grow-1">
//                                             <b>{productDetailList.ten} + [{cart.data.spct.idCoAo.ten},{cart.data.spct.idTayAo.ten}]</b>
//                                             <div className='d-flex align-item-center mt-1'>
//                                                 <b>{cart.data.spct.idMauSac.ten} ,</b>
//                                                 <b className='mx-1'>{cart.data.spct.idKichCo.ten}</b>
//                                             </div>
//                                             <div className='d-flex justify-content-between mt-4 align-item-center'>
//                                                 <b style={{ color: 'red' }}>
//                                                     <FormatCurrency value={cart.data.spct.giaMoi === 0 ? cart.data.spct.giaBan : cart.data.spct.giaMoi} />
//                                                 </b>
//                                                 <b>x{cart.data.soLuong}</b>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <p>Đang tải dữ liệu...</p>
//                                 )}
//                             </Modal.Body>
//                             <Modal.Footer>
//                                 <Button style={{ backgroundColor: '#6A0DAD' }} onClick={handleClose}>
//                                     Mua hàng
//                                 </Button>
//                                 <Link to="/cart" style={{ textDecoration: 'none' }}>

//                                     <Button variant="light">
//                                         Xem giỏ hàng
//                                     </Button>
//                                 </Link>
//                             </Modal.Footer>
//                         </Modal>

//                         <ToastContainer />
//                         <br />
//                         <Link to="/checkout" style={{ textDecoration: 'none' }}>
//                             <button className='btn rounded' style={{ color: 'white', marginTop: '10px', width: '370px', backgroundColor: '#6A0DAD' }}>
//                                 Mua ngay
//                             </button>
//                         </Link>
//                     </div>
//                     <div className='mt-5'>
//                         <div className='d-flex my-3'>
//                             <strong>Miễn phí vận chuyển:</strong>
//                             <p className='mx-2'>Đơn hàng từ 490k</p>
//                         </div>
//                         <div className='d-flex my-3'>

//                             <strong>Giao hàng:</strong>
//                             <p className='mx-2'>Từ 3-5 ngày trên cả nước</p>
//                         </div>
//                         <div className='d-flex my-3'>

//                             <strong>Miễn phí đổi trả:</strong>
//                             <p className='mx-2'>Trong 15 ngày</p>
//                         </div>
//                         <div className='d-flex my-3'>

//                             <p className='mx-2'>Sử dụng mã giảm giá ở bước thanh toán</p>
//                         </div>
//                         <div className='d-flex my-3'>
//                             <p className='mx-2'>Thông tin bảo mật và mã hóa</p>
//                         </div>
//                     </div>
//                     <div>
//                         <strong>Chi tiết</strong>
//                         <ul className='my-2'>
//                             <li>Màu sắc: {selectedSPCT?.idMauSac?.ten || 'Không xác định'}</li>
//                             <li>Kích cỡ: {selectedSPCT?.idKichCo?.ten || 'Không xác định'}</li>
//                             <li>Chất liệu: {selectedSPCT?.idChatLieu?.ten}</li>
//                             <li>Thương hiệu: {selectedSPCT?.idThuongHieu?.ten}</li>
//                             <li>Tay áo: {selectedSPCT?.idTayAo?.ten}</li>
//                             <li>Cổ áo: {selectedSPCT?.idCoAo?.ten}</li>
//                         </ul>
//                     </div>
//                 </Box>
//             </Box>
//         </div>

//     );
// };
// export default ProductDetail;






//Bản Tiếng Anh
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useEffect, useState } from "react";
import { Row, Col, Carousel, InputNumber, Button, Card, Radio } from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useParams, useLocation, Link } from 'react-router-dom';
import { findByIdSPCT, getAllByIdSP, findByMSAndKC, detailSPCT } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import FormatCurrency from "../../utilities/FormatCurrency.jsx";
import { FaShoppingCart, FaTruck, FaCalendarDay, FaUndo, FaTag, FaLock } from 'react-icons/fa';
import { Box, Typography } from '@mui/material';
import { createGioHang } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import '../../client/product_detail/product_detail.css';

const ProductDetail = () => {
    const [productDetailList, setProductDetailList] = useState();

    const [productDetail, setProductDetail] = useState(null);
    const [cart, setCart] = useState(null);
    const [giaBan, setGiaBan] = useState(null);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [mauSac, setMauSac] = useState([]);
    const [kichThuoc, setKichThuoc] = useState([]);
    const [product, setProduct] = useState([]);
    const [quantity, setQuantity] = useState(1);

    const { id } = useParams(); //ID Sản phẩm 
    const location = useLocation(); // Lấy đối tượng location

    const query = new URLSearchParams(location.search); // Phân tích chuỗi truy vấn
    const idMauSac = query.get('color'); // Lấy giá trị của tham số color
    const idKichCo = query.get('size'); // Lấy giá trị của tham số size


    const [spctIdSPCT, setSpctId] = useState([]);

    const [showModal, setShowModal] = useState(false); // State để điều khiển hiển thị modal

    // Hàm mở modal
    const handleShow = () => setShowModal(true);

    // Hàm đóng modal
    const handleClose = () => setShowModal(false);

    // Hàm thêm vào sản phẩm vào giỏ hàng 
    const addGioHang = async (e) => {
        e.preventDefault();

        const gioHang = {
            quantity: quantity,
            spctId: selectedSPCT.id,
            customerId: 2
        };

        console.log('Data to be sent:', gioHang);

        try {
            const response = await createGioHang(gioHang);
            setCart(response.data);
            console.log('Cart hhhhhhhhhhhhhhhhhhhhhhhh  :', response.data);
            handleShow(); // Mở modal sau khi thêm sản phẩm thành công
            toast.success('Đã thêm sản phẩm vào giỏ hàng!');
        } catch (error) {
            console.error('Error adding to cart:', error.response ? error.response.data : error);
            toast.error(error.response ? error.response.data.message : "Có lỗi xảy ra.");
        }
    };


    const [selectedColor, setSelectedColor] = useState(idMauSac || '');
    const [selectedSize, setSelectedSize] = useState(idKichCo || '');
    const [selectedSPCT, setSelectedSPCT] = useState(null);

    // Hàm tự động chọn RadioButton mặc định khi chuyển trang 
    useEffect(() => {
        if (idMauSac && idKichCo && productDetailList?.listProductDetails) {
            // Tìm sản phẩm chi tiết (SPCT) khớp với idMauSac và idKichCo
            const matchingSPCT = productDetailList.listProductDetails.find(spct =>
                spct.color.id === parseInt(idMauSac) && spct.size.id === parseInt(idKichCo)
            );
            if (matchingSPCT) {
                setSelectedColor(parseInt(idMauSac)); // Đặt mặc định cho RadioButton màu sắc
                setSelectedSize(parseInt(idKichCo));  // Đặt mặc định cho RadioButton kích cỡ
                setSelectedSPCT(matchingSPCT); // Cập nhật sản phẩm chi tiết
            }
        }
    }, [idMauSac, idKichCo, productDetailList]);

    useEffect(() => {
        if (selectedColor && selectedSize && productDetailList?.listProductDetails) {
            const matchingSPCT = productDetailList.listProductDetails.find(spct =>
                spct.color.id === selectedColor && spct.size.id === selectedSize
            );
            if (matchingSPCT) {
                setSelectedSPCT(matchingSPCT);
            } else {
                setSelectedSPCT(null);
            }
        }
    }, [selectedColor, selectedSize, productDetailList]);

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
    };

    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value);
    };

    useEffect(() => {
        getAllData();
    }, [id]);

    const getAllData = () => {
        detailSPCT(id)
            .then(response => {
                setProductDetailList(response.data); // Set product data
                console.log("Danh muc", response.data.name); // Log the category name
            })
            .catch(error => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const maxQuantity = selectedSPCT?.quantity;
    console.log("SO luong", maxQuantity)
    const increment = () => {
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        }
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div className="container mt-4">
            <Box className='d-flex'>
                <Typography
                    component={Link}
                    to="/home"
                    sx={{ color: 'black', textDecoration: 'none', marginX: 1 }}
                >
                    Trang chủ
                </Typography>
                <Typography sx={{ color: 'black', marginX: 1 }}>|</Typography>
                {/* Check if productDetailList and idDanhMuc exist before accessing ten */}
                {productDetailList?.category?.name && (
                    <>
                        <Typography
                            component={Link}
                            to={`/home`}
                            sx={{ color: 'black', textDecoration: 'none', marginX: 1 }}
                        >
                            {productDetailList.category.name}
                        </Typography>
                        <Typography sx={{ color: 'black', marginX: 1 }}>|</Typography>
                    </>
                )}
                <Typography
                    component={Link}
                    to={`/product-detail/${productDetailList?.id}`}
                    sx={{ color: 'black', textDecoration: 'none', marginX: 1 }}
                >
                    {productDetailList?.name}
                </Typography>
            </Box>

            <Box className='d-flex my-5 justify-content-around align-items-start'>
                <Box>
                    <Carousel
                        autoplay
                        autoplaySpeed={3000}
                        dots={false}
                        arrows={false}
                        style={{
                            border: '1px solid black',
                            borderRadius: '10px',
                            width: '300px',
                            height: '400px',
                            padding: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {selectedSPCT && selectedSPCT.images && selectedSPCT.images.length > 0 ? (
                            selectedSPCT.images.map((anh, index) => (
                                <div key={`${selectedSPCT.id}-${index}`} className="image-container" style={{ marginBottom: '10px' }}>
                                    <div className="ratio" style={{ '--bs-aspect-ratio': '75%' }}>
                                        <div className="d-flex justify-content-center">
                                            <Link className="nav-link" to={`/product-detail/${selectedSPCT.id}`}>
                                                <img
                                                    src={anh.url}
                                                    alt="images"
                                                    className="object-fit-contain mh-100 mw-100"
                                                    style={{
                                                        borderRadius: '8px',
                                                        maxHeight: '500px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                    {selectedSPCT.discountPercentage ? (
                                        <p
                                            className="discount-badge"
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                backgroundColor: 'red',
                                                color: 'white',
                                                padding: '5px 10px',
                                                borderRadius: '50%',
                                            }}
                                        >
                                            {-selectedSPCT.discountPercentage}%
                                        </p>
                                    ) : null}
                                </div>
                            ))
                        ) : (
                            <p>Không có sản phẩm</p>
                        )}
                    </Carousel>

                </Box>
                <Box>
                    <div className='my-2'>
                        {selectedSPCT ? (
                            <h3>
                                {`${productDetailList.name}- ${selectedSPCT?.brand?.name || ''} - ${selectedSPCT?.material?.name || ''}`}
                            </h3>
                        ) : (
                            <p>Không có sản phẩm</p>
                        )}
                    </div>
                    <div className='d-flex text-center'>
                        {selectedSPCT ? (
                            selectedSPCT.discountPrice !== 0 ? (
                                <>
                                    <h5 className="text-dark fw-semibold text-decoration-line-through">
                                        <FormatCurrency value={selectedSPCT.price} />
                                    </h5>
                                    <h5 className="text-danger fw-semibold mx-2">
                                        <FormatCurrency value={selectedSPCT.discountPrice} />
                                    </h5>
                                </>
                            ) : (
                                <h5 className="text-dark fw-semibold">
                                    <FormatCurrency value={selectedSPCT.price} />
                                </h5>
                            )
                        ) : (
                            <p>Không có sản phẩm</p>
                        )}
                    </div>

                    <div className='my-2'>
                        <span className='bg-warning rounded'>Sale ends in 12 hours</span>
                    </div>
                    <div className='my-2'>
                        <b className=''>Màu sắc: {selectedSPCT?.color?.name}</b> <br />
                        <Radio.Group
                            buttonStyle="solid"
                            onChange={handleColorChange}
                            value={selectedColor} // Đặt giá trị mặc định
                        >
                            {productDetailList?.listProductDetails
                                .filter((spct, index, self) =>
                                    index === self.findIndex((item) => item.color.id === spct.color.id)
                                )
                                .map((spct) => (
                                    <Radio.Button
                                        key={spct.id}
                                        value={spct.color.id}
                                        className='my-1'
                                        style={{
                                            display: 'inline-block',
                                            width: 50,
                                            height: 35,
                                            borderRadius: '2px',
                                            backgroundColor: spct.color.hexCode.startsWith('linear') ? 'transparent' : spct.color.hexCode,
                                            backgroundImage: spct.color.hexCode.startsWith('linear') ? spct.color.hexCode : 'none',
                                            marginRight: 8,
                                        }}
                                    />
                                ))}
                        </Radio.Group>
                    </div>
                    <div className='my-2'>
                        <b className=''>Kích cỡ: {selectedSPCT?.size?.name}</b> <br />
                        <Radio.Group
                            buttonStyle="solid"
                            onChange={handleSizeChange}
                            value={selectedSize} // Đặt giá trị mặc định
                        >
                            {productDetailList?.listProductDetails
                                .filter((spct, index, self) =>
                                    index === self.findIndex((item) => item.size.id === spct.size.id)
                                )
                                .map((spct) => (
                                    <Radio.Button
                                        key={spct.id}
                                        value={spct.size.id}
                                        className='my-1'
                                        style={{
                                            display: 'inline-block',
                                            width: 50,
                                            height: 35,
                                            marginRight: 8,
                                            borderRadius: '2px'
                                        }}
                                    >
                                        {spct.size.name}
                                    </Radio.Button>
                                ))}
                        </Radio.Group>
                    </div>
                    <div className=''>
                        <b className='my-3'>Số lượng:</b>
                        <div className='d-flex align-items-center my-3'>
                            <Row align="middle">
                                <Col>
                                    <Button icon={<MinusOutlined />} onClick={decrement} />
                                </Col>
                                <Col>
                                    <InputNumber
                                        min={1}
                                        max={maxQuantity}
                                        value={quantity}
                                        onChange={setQuantity}
                                        style={{ margin: '0 10px' }}
                                    />
                                </Col>
                                <Col>
                                    <Button icon={<PlusOutlined />} onClick={increment} />
                                </Col>
                            </Row>
                            <p style={{ marginLeft: '10px' }} className='my-1'>
                                Còn {maxQuantity} sản phẩm tồn kho
                            </p>
                        </div>
                    </div>
                    <div>
                        <button onClick={(e) => addGioHang(e)} className='btn rounded' style={{ color: 'white', marginTop: '20px', width: '370px', backgroundColor: '#6A0DAD' }}>
                            <FaShoppingCart style={{ marginRight: '10px' }} />
                            Thêm vào giỏ hàng
                        </button>
                        <Modal show={showModal} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Sản phẩm đã thêm vào giỏ hàng</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {cart ? (
                                    <div className="d-flex">
                                        <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: '140px', marginRight: '20px' }}>
                                            {cart.data.spct.images && cart.data.spct.images.map((anh, index) => (
                                                <div key={index} className="image-container">
                                                    <div className="ratio" style={{ '--bs-aspect-ratio': '75%' }}>
                                                        <div className="d-flex justify-content-center">
                                                            <Link className="nav-link">
                                                                <img src={anh.url} alt="images" className="object-fit-contain mh-100 mw-100" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    {cart.data.spct.discountPercentage ? (
                                                        <p className="discount-badge">
                                                            -{cart.data.spct.discountPercentage}%
                                                        </p>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </Carousel>
                                        <div className="flex-grow-1">
                                            <b>{productDetailList.name} + [{cart.data.spct.collar.name},{cart.data.spct.sleeve.name}]</b>
                                            <div className='d-flex align-item-center mt-1'>
                                                <b>{cart.data.spct.color.name} ,</b>
                                                <b className='mx-1'>{cart.data.spct.size.name}</b>
                                            </div>
                                            <div className='d-flex justify-content-between mt-4 align-item-center'>
                                                <b style={{ color: 'red' }}>
                                                    <FormatCurrency value={cart.data.spct.discountPrice === 0 ? cart.data.spct.price : cart.data.spct.discountPrice} />
                                                </b>
                                                <b>x{cart.data.quantity}</b>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p>Đang tải dữ liệu...</p>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button style={{ backgroundColor: '#6A0DAD' }} onClick={handleClose}>
                                    Mua hàng
                                </Button>
                                <Link to="/cart" style={{ textDecoration: 'none' }}>

                                    <Button variant="light">
                                        Xem giỏ hàng
                                    </Button>
                                </Link>
                            </Modal.Footer>
                        </Modal>

                        <ToastContainer />
                        <br />
                        <Link to="/checkout" style={{ textDecoration: 'none' }}>
                            <button className='btn rounded' style={{ color: 'white', marginTop: '10px', width: '370px', backgroundColor: '#6A0DAD' }}>
                                Mua ngay
                            </button>
                        </Link>
                    </div>
                    <div className='mt-5'>
                        <div className='d-flex my-3'>
                            <strong>Miễn phí vận chuyển:</strong>
                            <p className='mx-2'>Đơn hàng từ 490k</p>
                        </div>
                        <div className='d-flex my-3'>

                            <strong>Giao hàng:</strong>
                            <p className='mx-2'>Từ 3-5 ngày trên cả nước</p>
                        </div>
                        <div className='d-flex my-3'>

                            <strong>Miễn phí đổi trả:</strong>
                            <p className='mx-2'>Trong 15 ngày</p>
                        </div>
                        <div className='d-flex my-3'>

                            <p className='mx-2'>Sử dụng mã giảm giá ở bước thanh toán</p>
                        </div>
                        <div className='d-flex my-3'>
                            <p className='mx-2'>Thông tin bảo mật và mã hóa</p>
                        </div>
                    </div>
                    <div>
                        <strong>Chi tiết</strong>
                        <ul className='my-2'>
                            <li>Màu sắc: {selectedSPCT?.color?.name || 'Không xác định'}</li>
                            <li>Kích cỡ: {selectedSPCT?.size?.name || 'Không xác định'}</li>
                            <li>Chất liệu: {selectedSPCT?.material?.name}</li>
                            <li>Thương hiệu: {selectedSPCT?.brand?.name}</li>
                            <li>Tay áo: {selectedSPCT?.sleeve?.name}</li>
                            <li>Cổ áo: {selectedSPCT?.collar?.name}</li>
                        </ul>
                    </div>
                </Box>
            </Box>
        </div>

    );
};
export default ProductDetail;

