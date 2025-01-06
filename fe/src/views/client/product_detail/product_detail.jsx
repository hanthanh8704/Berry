
//Bản Tiếng Anh
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useEffect, useState } from "react";
import { Row, Col, Carousel, InputNumber, Button, Card, Radio } from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { findByIdSPCT, muaHang, getAllByIdSP, findByMSAndKC, detailSPCT } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import FormatCurrency from "../../utilities/FormatCurrency.jsx";
import { FaShoppingCart, FaTruck, FaCalendarDay, FaUndo, FaTag, FaLock } from 'react-icons/fa';
import { Box, Typography } from '@mui/material';
import { createGioHang } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import '../../client/product_detail/product_detail.css';
import axios from "axios";
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const ProductDetail = () => {


    const [productDetail, setProductDetail] = useState(null);
    const [cart, setCart] = useState(null);
    const [giaBan, setGiaBan] = useState(null);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [mauSac, setMauSac] = useState([]);
    const [kichThuoc, setKichThuoc] = useState([]);
    const [product, setProduct] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const [productDetailList, setProductDetailList] = useState();
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const { id } = useParams(); //ID Sản phẩm 


    //phan goi y san pham
    useEffect(() => {
        getAlllData();
        getSuggestedProducts();
    }, [id]);

    const getAlllData = () => {
        detailSPCT(id)
            .then(response => {
                setProductDetailList(response.data);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
            });
    };

    const getSuggestedProducts = () => {
        axios.get(`http://localhost:8080/api/client/product-details/${id}/suggestions`)
            .then(response => {
                setSuggestedProducts(response.data);
                console.log('hahahahah', response.data);

            })
            .catch(error => {
                console.error('Error fetching suggested products:', error);
            });
    };

    useEffect(() => {
        if (suggestedProducts.length > 0) {
            const defaultAttributes = {};
            suggestedProducts.forEach(product => {
                product.listProductDetails.forEach(spct => {
                    defaultAttributes[spct.id] = {
                        selectedColor: spct.color.id,
                        selectedSize: spct.size.id,
                    };
                });
            });
            setSelectedAttributes(defaultAttributes);
        }
    }, [suggestedProducts]);

    const handleColorChangeSuggest = (productId, value) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], selectedColor: value }
        }));
    };

    const handleSizeChangeSuggest = (productId, value) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], selectedSize: value }
        }));
    };

    ///////
    const location = useLocation(); // Lấy đối tượng location

    const [customerLe, setCustomerLe] = useState(null); // Thêm state cho khách hàng lẻ
    //Lấy dữ liêuuj cho user 
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

    console.log("User sau khi đăng nhập product detail:", user);

    // Kiểm tra nếu `user` đã có dữ liệu thì mới truy xuất `customerId`
    if (user) {
        console.log("Customer ID:", user.customerId);
    } else {
        console.log("User chưa được load");
    }


    // console.log("ID khach hang ", user.customerId);

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
        if (maxQuantity == 0) {
            toast.error('Sản phẩm đã hết hàng!');
        } else {
            const gioHang = {
                quantity: quantity,
                spctId: selectedSPCT.id,
                customerId: user ? user.customerId : null
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
        }
    };


    const [selectedColor, setSelectedColor] = useState(idMauSac || '');
    const [selectedSize, setSelectedSize] = useState(idKichCo || '');
    // const [selectedSPCT, setSelectedSPCT] = useState(null);
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

    const handleColorChange = (newColor) => {
        if (newColor !== null) { // Chỉ cập nhật khi newColor có giá trị hợp lệ
            setSelectedColor(newColor);
        }
    };

    const handleSizeChange = (newSize) => {
        if (newSize !== null) {
            setSelectedSize(newSize);
        }
    };

    useEffect(() => {
        getAllData();
    }, [id]);

    const getAllData = () => {
        detailSPCT(id)
            .then(response => {
                setProductDetailList(response.data); // Set product data
                console.log("Ten san pham mmmmmmmmmmmm", response.data); // Log the category name
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


    const handleMuaNgay = async () => {
        console.log('selectedSPCT qqqqqqqqqqqqqqqq:', selectedSPCT.id);  // 
        console.log('selectedSPCT qqqqqqqqqqqqqqqq:', user.customerId);  // 
        // Giả sử bạn đã có API để kiểm tra tồn kho và lấy thông tin chi tiết sản phẩm
        const gioHangAo = {
            customerId: user ? user.customerId : null, // ID khách hàng
            idGHCT: [],
            spctId: selectedSPCT.id,
            quantity: quantity// Danh sách sản phẩm đã chọn
        };

        // Gọi API để lấy thông tin giỏ hàng và kiểm tra số lượng tồn kho
        const response = await muaHang(gioHangAo);
        console.log('API Response zzzzzzzzzzzzzzzzzzzzzzzzzz:', response);  // In toàn bộ response từ API

        if (response?.data) {
            console.log('Response Data:', response.data);  // In dữ liệu chính từ API

            const gioHangChiTiet = response.data.listCartDetails; // Giả định API trả về thông tin giỏ hàng chi tiết với số lượng mua
            console.log('Giỏ hàng chi tiết:', gioHangChiTiet);  // In chi tiết giỏ hàng

            // Kiểm tra từng sản phẩm trong giỏ hàng chi tiết
            for (let chiTiet of gioHangChiTiet) {
                console.log('Chi tiết sản phẩm:', chiTiet);  // In chi tiết từng sản phẩm

                const soLuongMua = chiTiet.quantity; // Số lượng sản phẩm trong giỏ hàng
                console.log('Số lượng mua:', soLuongMua);  // In số lượng mua

                const soLuongTon = chiTiet.productDetail.quantity;
                console.log('Số lượng tồn:', soLuongTon);  // In số lượng tồn

                if (soLuongMua > soLuongTon) {
                    // Hiển thị modal yêu cầu người dùng giảm số lượng sản phẩm
                    AntdModal.confirm({
                        title: 'Thông báo',
                        content: `Sản phẩm "
                            ${chiTiet.productDetail.product.name} +
                            ${chiTiet.productDetail.brand.name}  +
                            ${chiTiet.productDetail.collar.name} +
                            ${chiTiet.productDetail.sleeve.name} " chỉ còn ${soLuongTon} trong kho. Vui lòng giảm số lượng mua.`,
                        okText: 'OK',
                        onOk: () => {
                            // Điều hướng người dùng về trang giỏ hàng để chỉnh sửa số lượng
                            navigate('/cart');
                        }
                    });
                    return; // Ngừng xử lý nếu có sản phẩm nào vượt số lượng tồn
                }
            }
            // Nếu không có lỗi về số lượng, tiến hành chuyển sang trang checkout
            navigate('/checkout', { state: { gioHangAo: response.data } });
        } else {
            AntdModal.error({
                title: 'Lỗi',
                content: 'Không thể tạo giỏ hàng ảo!',
            });
        }

    };

    const selectedColorName = productDetailList?.listProductDetails
        .find((spct) => spct.color.id === selectedColor)?.color?.name || '';

    const selectedSizeName = productDetailList?.listProductDetails
        .find((spct) => spct.size.id === selectedSize)?.size?.name || '';

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
                            borderRadius: '10px',
                            width: '300px',
                            height: '400px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {selectedSPCT && selectedSPCT.images && selectedSPCT.images.length > 0 ? (
                            selectedSPCT.images.map((anh, index) => (
                                <div key={`${selectedSPCT.id}-${index}`} className="image-container" style={{ marginBottom: '10px' }}>
                                    <div className="ratio" style={{ '--bs-aspect-ratio': '150%' }}>
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

                            productDetailList?.listProductDetails[0].images && productDetailList?.listProductDetails[0].images.length > 0 ? (
                                productDetailList.listProductDetails[0].images.map((anh, index) => (
                                    <div key={index} className="image-container" style={{ marginBottom: '10px' }}>
                                        <div className="ratio" style={{ '--bs-aspect-ratio': '290%' }}>
                                            <div className="d-flex justify-content-center">
                                                <Link
                                                    className="nav-link"
                                                    to={selectedSPCT ? `/product-detail/${selectedSPCT.id}` : '#'} // Kiểm tra xem selectedSPCT có giá trị không
                                                >
                                                    <img
                                                        src={anh.url}
                                                        alt="Product image"
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
                                        {selectedSPCT?.discountPercentage && (
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
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p></p>
                            )
                        )}
                    </Carousel>

                </Box>
                <Box>
                    <div className='my-2'>
                        {selectedSPCT ? (
                            <h3>
                                {`${productDetailList.name} ${selectedSPCT?.brand?.name || ''} 
                                  ${selectedSPCT?.collar?.name || ''} 
                                  ${selectedSPCT?.sleeve?.name || ''}`}
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
                        <b className=''>Màu sắc: {selectedColorName}</b> <br />
                        <ToggleButtonGroup
                            exclusive
                            value={selectedColor} // Giá trị được chọn
                            onChange={(event, newColor) => handleColorChange(newColor)}
                            aria-label="Color selection"
                        >
                            {productDetailList?.listProductDetails
                                .filter((spct, index, self) =>
                                    index === self.findIndex((item) => item.color.id === spct.color.id)
                                )
                                .map((spct) => (
                                    <ToggleButton
                                        key={spct.id}
                                        value={spct.color.id}
                                        style={{
                                            display: 'inline-block',
                                            width: 25,
                                            height: 25,
                                            borderRadius: '50%',
                                            backgroundColor: spct.color.hexCode.startsWith('linear') ? 'transparent' : spct.color.hexCode,
                                            backgroundImage: spct.color.hexCode.startsWith('linear') ? spct.color.hexCode : 'none',
                                            marginRight: 8,
                                            border: '1px solid #ccc',
                                            boxShadow: selectedColor === spct.color.id ? '0 0 0 3px #90caf9' : 'none', // Viền nổi bật khi được chọn
                                            cursor: 'pointer',
                                        }}
                                        aria-label={spct.color.name} // Nhãn trợ năng
                                    />
                                ))}
                        </ToggleButtonGroup>

                    </div>

                    <div className='my-2'>
                        <b className=''>Kích cỡ: {selectedSizeName}</b> <br />
                        <ToggleButtonGroup
                            exclusive
                            value={selectedSize}
                            onChange={(event, newSize) => handleSizeChange(newSize)}
                            aria-label="Size selection"
                        >
                            {productDetailList?.listProductDetails
                                .filter((spct, index, self) =>
                                    index === self.findIndex((item) => item.size.id === spct.size.id)
                                )
                                .map((spct) => (
                                    <ToggleButton
                                        key={spct.id}
                                        value={spct.size.id}
                                        style={{
                                            display: 'inline-block',
                                            padding: '5px 10px',
                                            fontSize: '14px',
                                            width: 'auto',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            border: '1px solid #ccc',
                                            marginRight: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            color: selectedSize === spct.size.id ? 'white' : '#6A0DAD',
                                            backgroundColor: selectedSize === spct.size.id ? '#6A0DAD' : 'white',
                                            boxShadow: selectedSize === spct.size.id ? '0 4px 8px rgba(106, 13, 173, 0.3)' : 'none',
                                        }}
                                    >
                                        {spct.size.name}
                                    </ToggleButton>
                                ))}
                        </ToggleButtonGroup>
                    </div>

                    <div className='quantity-container my-3'>
                        <b className='mb-2'>Số lượng:</b>
                        <div className='d-flex align-items-center my-2'>
                            <Row align="middle" gutter={10}>
                                <Col>
                                    <Button
                                        icon={<MinusOutlined />}
                                        onClick={decrement}
                                        style={{
                                            borderRadius: '50%',
                                            backgroundColor: '#f0f0f0',
                                            color: '#333',
                                            border: 'none',
                                            width: '36px',
                                            height: '36px',
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <InputNumber
                                        min={1}
                                        max={maxQuantity}
                                        value={quantity}
                                        onChange={(value) => {
                                            // Kiểm tra nếu giá trị không phải số thì đặt về 1
                                            setQuantity(typeof value === 'number' && !isNaN(value) ? value : 1);
                                        }}
                                        style={{
                                            width: '60px',
                                            textAlign: 'center',
                                            borderRadius: '8px',
                                            border: '1px solid #d9d9d9',
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <Button
                                        icon={<PlusOutlined />}
                                        onClick={increment}
                                        style={{
                                            borderRadius: '50%',
                                            backgroundColor: '#f0f0f0',
                                            color: '#333',
                                            border: 'none',
                                            width: '36px',
                                            height: '36px',
                                        }}
                                    />
                                </Col>
                            </Row>

                            <p style={{ marginLeft: '10px', color: maxQuantity === 0 ? 'red' : '#333', fontWeight: 'bold' }}>
                                {maxQuantity === 0 ? 'Hết hàng' : `Còn ${maxQuantity} sản phẩm tồn kho`}
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
                                    Mua tiếp
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
                        <button onClick={handleMuaNgay} className='btn rounded' style={{ color: 'white', marginTop: '20px', width: '370px', backgroundColor: '#6A0DAD' }}>
                            Mua ngay
                        </button>


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
                            <li className='my-2'>Màu sắc: {selectedSPCT?.color?.name || 'Không xác định'}</li>
                            <li className='my-2'>Kích cỡ: {selectedSPCT?.size?.name || 'Không xác định'}</li>
                            <li className='my-2'>Chất liệu: {selectedSPCT?.material?.name}</li>
                            <li className='my-2'>Thương hiệu: {selectedSPCT?.brand?.name}</li>
                            <li className='my-2'>Tay áo: {selectedSPCT?.sleeve?.name}</li>
                            <li className='my-2'>Cổ áo: {selectedSPCT?.collar?.name}</li>
                        </ul>
                    </div>
                </Box>
            </Box>
            <div className="suggested-products mt-5">
                <h4>Sản phẩm gợi ý</h4>

                <Row gutter={[16, 16]} className='ml-2 mb-5'>
                    {suggestedProducts.length > 0 ? (
                        suggestedProducts.map((ct, index) => {
                            const selectedProduct = selectedAttributes[ct.listProductDetails[0].id] || {};
                            const selectedColor = selectedProduct.selectedColor || null;
                            const selectedSize = selectedProduct.selectedSize || null;
                            const selectedSPCT = ct.listProductDetails.find(spct => spct.color.id === selectedColor && spct.size.id === selectedSize);

                            return (
                                <Col key={index} span={6}>
                                    <Card
                                        style={{
                                            width: '260px',
                                            height: '630px',
                                        }}
                                        hoverable
                                        cover={
                                            <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false}>
                                                {(selectedSPCT?.images?.length > 0
                                                    ? selectedSPCT.images
                                                    : ct.listProductDetails[0].images || []
                                                ).map((anh, index) => (
                                                    <div key={index} className="image-container">
                                                        <div className="ratio" style={{ '--bs-aspect-ratio': '150%' }}>
                                                            <div className="d-flex justify-content-center">
                                                                <Link className="nav-link" to={`/product-detail/${selectedSPCT?.id}?color=${selectedColor}&size=${selectedSize}`}>
                                                                    <img
                                                                        src={anh.url}
                                                                        alt="images"
                                                                        className="object-fit-contain mh-100 mw-100 card-image"
                                                                    />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        {selectedSPCT?.discountPercentage != 0 && selectedSPCT != null ? (
                                                            <p className="discount-badge" style={{
                                                                position: 'absolute',
                                                                top: '3px',
                                                                right: '2px',
                                                                backgroundColor: 'red',
                                                                color: 'white',
                                                                padding: '5px 10px',
                                                                borderRadius: '50%',
                                                            }}>
                                                                {-selectedSPCT?.discountPercentage}%
                                                            </p>
                                                        ) : ''}
                                                    </div>
                                                ))}
                                            </Carousel>
                                        }
                                    >
                                        <div className='' style={{ width: '220px' }}>
                                            {selectedSPCT ? (
                                                <h5 className="mt-3">
                                                    {`${ct.name} ${selectedSPCT.brand.name}  ${selectedSPCT.sleeve.name} ${selectedSPCT.collar.name}`}
                                                </h5>
                                            ) : (
                                                <h5 className="mt-3">Hết hàng</h5>
                                            )}

                                            {/* Hiển thị giá bán */}
                                            <div className='d-flex text-center'>
                                                {ct.listProductDetails.some(spct => spct.color.id === selectedColor && spct.size.id === selectedSize) ? (
                                                    ct.listProductDetails.map(spct => (
                                                        spct.color.id === selectedColor && spct.size.id === selectedSize && (
                                                            spct.discountPrice !== 0 ? (
                                                                <React.Fragment key={spct.id}>
                                                                    <p className="text-dark fw-semibold text-decoration-line-through">
                                                                        <FormatCurrency value={spct.price} />
                                                                    </p>
                                                                    <p className="text-danger fw-semibold mx-2">
                                                                        <FormatCurrency value={spct.discountPrice} />
                                                                    </p>
                                                                </React.Fragment>
                                                            ) : (
                                                                <p key={spct.id} className="text-dark fw-semibold">
                                                                    <FormatCurrency value={spct.price} />
                                                                </p>
                                                            )
                                                        )
                                                    ))
                                                ) : (
                                                    <h5>0 đ</h5>
                                                )}
                                            </div>

                                            {/* Chọn màu sắc */}
                                            <div className='d-flex'>
                                                <ToggleButtonGroup
                                                    exclusive
                                                    value={selectedColor}
                                                    onChange={(e, newColor) => {
                                                        if (newColor !== null) {
                                                            handleColorChangeSuggest(ct.listProductDetails[0].id, newColor);
                                                        }
                                                    }}
                                                    buttonStyle="solid"
                                                >
                                                    {ct.listProductDetails
                                                        .filter((spct, index, self) =>
                                                            index === self.findIndex((item) => item.color.id === spct.color.id)
                                                        )
                                                        .map((spct) => (
                                                            <ToggleButton
                                                                key={spct.id}
                                                                value={spct.color.id}
                                                                style={{
                                                                    width: 25,
                                                                    height: 25,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: spct.color.name.startsWith('linear') ? 'transparent' : spct.color.name,
                                                                    backgroundImage: spct.color.name.startsWith('linear') ? spct.color.name : 'none',
                                                                    marginRight: 8,
                                                                    boxShadow: selectedColor === spct.color.id ? '0 0 0 3px whitesmoke' : 'none',
                                                                    border: selectedColor === spct.color.id ? '2px solid #000' : '1px solid #ddd',
                                                                    cursor: 'pointer',
                                                                }}
                                                            />
                                                        ))}
                                                </ToggleButtonGroup>
                                            </div>

                                            {/* Chọn kích thước */}
                                            <div className='d-flex my-2'>
                                                <ToggleButtonGroup
                                                    exclusive
                                                    onChange={(e, newSize) => {
                                                        if (newSize !== null) {
                                                            handleSizeChangeSuggest(ct.listProductDetails[0].id, newSize);
                                                        }
                                                    }}
                                                    style={{ gap: '8px' }}
                                                    buttonStyle="solid"
                                                    value={selectedAttributes[ct.listProductDetails[0].id]?.selectedSize}
                                                >
                                                    {ct.listProductDetails
                                                        .filter((spct, index, self) =>
                                                            index === self.findIndex((item) => item.size.id === spct.size.id)
                                                        )
                                                        .map((spct) => (
                                                            <ToggleButton
                                                                key={spct.id}
                                                                value={spct.size.id}
                                                                style={{
                                                                    padding: '5px 10px',
                                                                    fontSize: '14px',
                                                                    borderRadius: '8px',
                                                                    color: selectedAttributes[ct.listProductDetails[0].id]?.selectedSize === spct.size.id ? 'white' : '#6A0DAD',
                                                                    backgroundColor: selectedAttributes[ct.listProductDetails[0].id]?.selectedSize === spct.size.id ? '#6A0DAD' : 'white',
                                                                    border: '1px solid #ccc',
                                                                    boxShadow: selectedAttributes[ct.listProductDetails[0].id]?.selectedSize === spct.size.id ? '0 4px 8px rgba(106, 13, 173, 0.3)' : 'none',
                                                                    transition: 'all 0.3s ease',
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.backgroundColor = '#D8BFD8';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.backgroundColor = selectedAttributes[ct.listProductDetails[0].id]?.selectedSize === spct.size.id ? '#6A0DAD' : 'white';
                                                                }}
                                                            >
                                                                {spct.size.name}
                                                            </ToggleButton>
                                                        ))}
                                                </ToggleButtonGroup>
                                            </div>

                                        </div>
                                    </Card>
                                </Col>
                            );
                        })
                    ) : (
                        <p>Không có sản phẩm nào...</p>
                    )}
                </Row>
            </div>
        </div>

    );
};
export default ProductDetail;

