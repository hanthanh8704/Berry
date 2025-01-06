
//Bản tiếng Anh
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Box, Typography } from '@mui/material';
import { getAllGioHang, detailKH, muaHang, deleteGH, updateSoLuong } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, Pagination
} from '@mui/material';
import { Col, Row, InputNumber, Carousel } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
import './cart.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Modal as BootstrapModal, Button as BootstrapButton } from 'react-bootstrap';
import { Modal as AntdModal, message } from 'antd';
// import { ToastContainer, toast } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { borderRadius } from '@mui/system';


const configApiShip = {
    headers: {
        "Content-Type": "application/json",
        Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694", // Sử dụng token hợp lệ
        ShopId: 192796
    },
};

const Cart = () => {

    const [user, setUser] = useState(null);
    const isAuthenticated = localStorage.getItem('isAuthenticated');

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
            console.log("Using existing customer dddddddddd:", { customerId, customerName });
        }
    }, []);

    const [selectedIds, setSelectedIds] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null); // Sản phẩm hiện tại được chọn để hiển thị trong modal
    const navigate = useNavigate();

    //Call api phí vận chuyển 
    const [gioHang, setGioHang] = useState([]);
    const [shippingFee, setShippingFee] = useState(null);
    const [tongTien, setTongTien] = useState(0);
    const [tongTienThanhToan, setTongTienThanhToan] = useState(0);

    const [weightTong, setWeightTong] = useState(0);

    const [khachHang, setKhachHang] = useState(null);
    const [huyen, setHuyen] = useState(null);


    useEffect(() => {
        let totalWeight = 0;
        console.log("gioHangmmmmmmmmmmmm:", gioHang); // Log cart data

        // Check if there are products in the cart
        if (gioHang.length > 0) {
            const firstItemId = gioHang[0].cart?.customer?.id; // Get id from the first product
            if (firstItemId) {
                detail(firstItemId);  // Call detail if product id exists
            }
        }

        // Cộng dồn cân nặng
        gioHang.forEach(item => {
            const weight = item.productDetail?.weight;
            console.log("Weight:", weight);
            if (weight) {
                totalWeight += weight * item.quantity; // Cộng dồn cân nặng
            }
        });
        // Cập nhật state
        setWeightTong(totalWeight);

    }, [gioHang]);
    // Gọi API phí vận chuyển
    useEffect(() => {
        const fetchShippingFee = async () => {
            try {
                if (tongTien >= 1000000) {
                    // Đơn hàng trên 1 triệu -> free ship
                    setShippingFee(0);
                    return;
                }

                if (!huyen || !phuong) {
                    console.warn("Huyện hoặc phường không được xác định");
                    return;
                }

                // Dữ liệu gửi đến API
                const data = {
                    service_type_id: 2,
                    insurance_value: tongTien,
                    from_district_id: 1482, // ID quận/huyện gửi hàng
                    to_district_id: Number(huyen), // ID quận/huyện nhận hàng
                    to_ward_code: phuong, // Mã phường/xã nhận hàng
                    height: 50, // Chiều cao gói hàng (cm)
                    length: 20, // Chiều dài gói hàng (cm)
                    weight: 300, // Cân nặng gói hàng (gram)
                    width: 20, // Chiều rộng gói hàng (cm)
                    cod_failed_amount: 2000, // Tiền COD nếu giao thất bại
                    insurance_value: 10000, // Giá trị bảo hiểm hàng hóa
                    coupon: null, // Mã giảm giá (nếu có)
                };

                console.log('Data being sent to API:', data);

                const response = await axios.post(
                    "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                    data,
                    configApiShip
                );

                if (response.data && response.data.data) {
                    setShippingFee(response.data.data.total); // Cập nhật phí vận chuyển
                    console.log("Shipping fee:", response.data.data.total);
                } else {
                    console.error('Invalid shipping fee data:', response.data);
                }
            } catch (error) {
                console.error('Error fetching shipping fee:', error);
            }
        };

        fetchShippingFee();
    }, [huyen, tongTien, weightTong]);



    //Detail KH 
    const detail = (id) => {
        console.log("Gio hang ID dcm: ", id);  // Kiểm tra id của giỏ hàng
        detailKH(id)
            .then(response => {
                setKhachHang(response.data); // Set data của khách hàng
                console.log("Khach hang ddd: ", response.data);
                if (response.data.listAddress && response.data.listAddress.length > 0) {
                    // Tìm địa chỉ có diaChiMacDinh = 1
                    const diaChiMacDinh = response.data.listAddress.find(diaChi => diaChi.defaultAddress === true);
                    if (diaChiMacDinh) {
                        setHuyen(diaChiMacDinh.district);
                        console.log("Huyen:  ,,,,,,,,,,,,,,,,,,,,", diaChiMacDinh.district);
                        console.log("Huyen: ", huyen);
                    } else {
                        console.log("Không có địa chỉ mặc định nào!");
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching Khách Hàng chi tiết:', error);
            });
    };


    const handleShow = (product) => {
        setCurrentProduct(product);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleDelete = (id) => {
        AntdModal.confirm({
            title: 'Xác nhận',
            maskClosable: true,
            content: 'Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                deleteGH(id)
                    .then((response) => {
                        toast.success('Xóa thành công sản phẩm!');
                        console.log('Đã xóa thành công:', response);
                        fetchGioHang();
                    })
                    .catch((error) => {
                        console.error('Lỗi khi xóa:', error);
                    });
            },
        });
    };

    const customerId = user ? user.customerId : null;
    console.log("User sau khi đăng nhập product detail:", user);

    // Kiểm tra nếu `user` đã có dữ liệu thì mới truy xuất `customerId`
    if (user) {
        console.log("Customer ID:", customerId);
    } else {
        console.log("User chưa được load");
    }

    useEffect(() => {
        fetchGioHang();
    }, [customerId]);

    const fetchGioHang = async () => {
        try {
            const response = await getAllGioHang(customerId);
            const data = response.data;

            if (data && Array.isArray(data)) {
                setGioHang(data);
                console.log('Gio han theo iKH dddddddddddddddddddzzzzzzzzzzzz', gioHang);
                const total = data.reduce((acc, item) => {
                    const gia = item.price;
                    return acc + (gia * item.quantity); // Tính tổng dựa trên giá trị giảm giá nếu có
                }, 0);
                setTongTien(total);
            } else {
                console.error('Dữ liệu không đúng định dạng:', data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
        }
    };



    // Tự động chọn tất cả sản phẩm khi vào trang giỏ hàng
    useEffect(() => {
        const allIds = gioHang.map(gh => gh.id); // Giả định id của sản phẩm là idSanPham.id
        setSelectedIds(allIds);
        calculateTotalPrice(allIds); // Tính tổng tiền khi tất cả sản phẩm được chọn
    }, [gioHang]); // Chỉ chạy khi giỏ hàng thay đổi

    const calculateTotalPrice = (selectedIds) => {
        console.log('Các sản phẩm đã chọn (IDs):', selectedIds);

        const total = gioHang
            .filter(gh => selectedIds.includes(gh.id)) // Lọc các sản phẩm đã được chọn
            .reduce((sum, gh) => {
                const gia = gh.price;
                console.log(`Sản phẩm ${gh.productDetail.id} - Giá: ${gia}, Số lượng: ${gh.quantity}`);
                return sum + gia * gh.quantity;
            }, 0);

        setTongTien(total);
        console.log("Tổng giá trị sau khi tính toán lại:", total);
    };


    // Hàm chọn/bỏ chọn tất cả sản phẩm
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allIds = gioHang.map(gh => gh.id);
            setSelectedIds(allIds);
            calculateTotalPrice(allIds); // Tính tổng tiền khi chọn tất cả
        } else {
            setSelectedIds([]);
            setTongTien(0); // Không chọn gì thì tổng tiền bằng 0
        }
    };

    // Hàm chọn/bỏ chọn từng sản phẩm
    const handleCheckboxChange = (id) => {
        let newSelectedIds;
        if (selectedIds.includes(id)) {
            newSelectedIds = selectedIds.filter(selectedId => selectedId !== id);
        } else {
            newSelectedIds = [...selectedIds, id];
        }
        setSelectedIds(newSelectedIds);
        calculateTotalPrice(newSelectedIds); // Tính lại tổng tiền khi danh sách chọn thay đổi
    };

    const handleMuaHang = async () => {
        if (selectedIds.length === 0) {
            AntdModal.confirm({
                title: 'Thông báo',
                content: 'Bạn chưa chọn sản phẩm nào!',
                okText: 'OK',
                cancelText: 'Hủy',
            });
        } else {
            // Giả sử bạn đã có API để kiểm tra tồn kho và lấy thông tin chi tiết sản phẩm
            const gioHangAo = {
                customerId: user.customerId,  // ID khách hàng
                idGHCT: selectedIds    // Danh sách sản phẩm đã chọn
            };

            // Gọi API để lấy thông tin giỏ hàng và kiểm tra số lượng tồn kho
            const response = await muaHang(gioHangAo);
            console.log('API Response:', response);  // In toàn bộ response từ API

            if (response?.data) {
                console.log('Response Data zzzzzzzzzzzzzzzzzzzzz:', response.data);  // In dữ liệu chính từ API

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

        }
    };

    //Phan trang 
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(2);

    // Hàm thay đổi trang
    const handleChangePage = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize); // Đảm bảo cập nhật pageSize
    };

    // Kiểm tra nếu `gioHang`
    const cartItems = gioHang;

    // Tính toán tổng số mục trong giỏ hàng
    const totalItems = cartItems.length;

    // Lấy danh sách sản phẩm theo phân trang
    const paginatedCart = cartItems.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Nếu giỏ hàng trống, hiển thị thông báo
    if (totalItems === 0) {
        return <div>Giỏ hàng của bạn hiện đang trống.</div>;
    }

    return (
        <div className="container py-2" style={{ backgroundColor: 'whitesmoke' }}>
            <Box className='d-flex ' style={{ backgroundColor: 'white', borderRadius: '8px' }}>
                <Typography
                    component={Link}
                    to="/home"
                    sx={{ color: 'black', textDecoration: 'none', marginX: 1, marginY: 2 }}
                >
                    Trang chủ
                </Typography>
                <Typography sx={{ color: 'black', marginX: 1, marginY: 2 }}>|</Typography>
                <Typography
                    component={Link}
                    to={`/cart`}
                    sx={{ color: 'black', textDecoration: 'none', marginX: 1, marginY: 2 }}
                >
                    Shopping Cart
                </Typography>
            </Box>
            <Box className="d-flex">
                {/* Bảng đầu tiên chiếm 60% */}
                <TableContainer component={Paper} className='my-3' style={{ backgroundColor: '#FFFFFF', flex: '4', borderRadius: '8px' }}> {/* trắng tinh khiết */}
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.length === gioHang.length}
                                        onChange={handleSelectAll}
                                        inputProps={{ 'aria-label': 'Chọn tất cả' }}
                                    />
                                </TableCell>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Giá bán</TableCell>
                                <TableCell>Thành tiền</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedCart && paginatedCart.length > 0 ? (
                                paginatedCart.map((gh) => ( //BỎ index để chánh lỗi 
                                    <TableRow key={gh.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(gh.id)}
                                                onChange={() => handleCheckboxChange(gh.id)}
                                                inputProps={{ 'aria-label': `Chọn ${gh.name}` }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box className="d-flex align-items-center">
                                                <Carousel
                                                    autoplay
                                                    autoplaySpeed={3000}
                                                    dots={false}
                                                    arrows={false}
                                                    style={{
                                                        width: '60px',
                                                        height: '50px',
                                                        marginBottom: '50px',

                                                    }}
                                                >

                                                    {gh.productDetail.images?.map((anh, index) => (
                                                        <div key={index} className="image-container" style={{ marginBottom: '10px' }}>
                                                            <div className="ratio" style={{ '--bs-aspect-ratio': '150%' }}>
                                                                <div className="d-flex justify-content-center">
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
                                                                </div>
                                                            </div>
                                                            {gh.productDetail.discountPercentage ? (
                                                                <p className="discount-badge">
                                                                    {-gh.productDetail.discountPercentage}%
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    ))
                                                    }
                                                </Carousel>
                                                <Typography variant="body1" sx={{ marginLeft: 2, marginRight: 2 }}>
                                                    {gh.productDetail.product.name}, {gh.productDetail.brand.name}, {gh.productDetail.sleeve.name}
                                                </Typography>
                                                {/* <button onClick={() => handleShow(gh)} className='btn rounded' style={{ backgroundColor: '#6A0DAD' }}>
                                                    Sửa
                                                </button> */}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Row>
                                                <Col>
                                                    <InputNumber
                                                        min={1}
                                                        max={gh.productDetail.quantity}
                                                        defaultValue={gh.quantity}
                                                        onChange={(value) => {
                                                            if (value === gh.quantity) {
                                                                return; // Không cần cập nhật nếu giá trị không thay đổi
                                                            }
                                                            // console.log(`Số lượng cho ${gh.productDetail.product.name}: ${value}`);
                                                            console.log(`ID gio hang chi tiet wwwwwwwwwwwwwwwww ${gh.quantity}`);
                                                            updateSoLuong(gh.id, value)
                                                                .then(response => {
                                                                    console.log("Cập nhật số lượng thành công", response.data);
                                                                    fetchGioHang(); // Làm mới giỏ hàng nếu cần
                                                                })
                                                                .catch(error => {
                                                                    console.error('Lỗi khi cập nhật số lượng:', error);
                                                                });
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </TableCell>
                                        <TableCell>
                                            {gh.productDetail.discountPercentage !== 0 ? (
                                                <>
                                                    <span style={{
                                                        color: 'black',
                                                        textDecoration: 'line-through',
                                                        fontSize: '10px',
                                                        marginLeft: '20px', // Khoảng cách với giá mới
                                                        verticalAlign: 'top' // Căn chỉnh lên trên
                                                    }}>
                                                        <FormatCurrency value={gh.productDetail.price} />
                                                    </span>
                                                    <span style={{
                                                        color: 'red',

                                                        marginBottom: '25px',
                                                        display: 'inline-block',
                                                        verticalAlign: 'top' // Căn chỉnh lên trên
                                                    }}>
                                                        <FormatCurrency value={gh.productDetail.price * (1 - gh.productDetail.discountPercentage / 100)} />
                                                    </span>

                                                </>
                                            ) : (
                                                <FormatCurrency value={gh.productDetail.price} />
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <FormatCurrency value={gh.price * gh.quantity} />
                                        </TableCell>

                                        <TableCell>
                                            <IconButton color="error" onClick={() => handleDelete(gh.id)}>
                                                <DeleteIcon />
                                            </IconButton>

                                        </TableCell>
                                    </TableRow>

                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6}>Không có dữ liệu</TableCell>
                                </TableRow>
                            )}

                            {/* Phân trang */}
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Pagination
                                        style={{ marginLeft: '350px' }}
                                        count={Math.ceil(totalItems / pageSize)} // Tính số trang
                                        page={currentPage}
                                        onChange={(event, page) => handleChangePage(page, pageSize)}
                                        color="primary"
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>

                    </Table>
                </TableContainer>
                {/* Bảng thứ hai chiếm 40% */}
                <Box className='my-3 ' style={{ height: '400px', marginLeft: '40px', flex: '2', backgroundColor: 'white', borderRadius: '8px' }}>
                    <Typography
                        className='mx-4 my-4'
                        variant="h2"
                        sx={{ color: '#6A0DAD', textDecoration: 'none', marginBottom: 2 }}
                    >
                        Chi tiết đơn hàng
                    </Typography>
                    <div className='d-flex justify-content-between align-items-center mx-4 my-4'>
                        <Typography
                            variant="body1"
                            sx={{ color: 'black', textDecoration: 'none', marginBottom: 0 }}
                        >
                            Tổng giá trị sản phẩm
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: 'black', textDecoration: 'none', marginBottom: 0 }}
                        >
                            <FormatCurrency value={tongTien} />
                        </Typography>
                    </div>
                    <div className="d-flex justify-content-between my-1 mx-4">
                        <Typography>Phí vận chuyển:</Typography>

                        {/* Kiểm tra nếu người dùng chưa đăng nhập */}
                        {isAuthenticated == null ? (
                            <small style={{ color: 'red' }}> Phí vận chuyển được <br /> tính phí khi mua hàng</small>
                        ) : (
                            <>
                                {/* {shippingFee !== null ? (
                                    <>
                                        {tongTien >= 1000000 ? (
                                            <p className="text-end">
                                                Miễn phí vận chuyển <br />
                                                <small style={{ color: 'green' }}>
                                                    Áp dụng với những đơn hàng trên 1 triệu đồng
                                                </small>
                                            </p>
                                        ) : (
                                            <p><FormatCurrency value={shippingFee} /></p>
                                        )}
                                    </>
                                ) : (
                                    <p>Đang tính phí vận chuyển...</p>
                                )} */}
                                <small style={{ color: 'red' }}> Phí vận chuyển được <br /> tính phí khi mua hàng</small>
                            </>
                        )}
                    </div>

                    <hr className='mx-4'></hr>
                    <div className='d-flex justify-content-between align-items-center mx-4 '>
                        <Typography

                            variant="h5"
                            sx={{ color: 'black', textDecoration: 'none', marginBottom: 2 }}
                        >
                            Tổng thanh toán
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{ color: 'black', textDecoration: 'none', marginBottom: 0 }}
                        >
                            <FormatCurrency value={tongTien} />
                        </Typography>
                    </div>
                    <Typography
                        className='text-end mx-4'
                        variant="body1"
                        sx={{ color: 'red', textDecoration: 'none', marginBottom: 0 }}
                    >
                    </Typography>
                    <div className='d-flex justify-content-center mx-4 my-4'>
                        <Button
                            // component={Link}
                            // to="/checkout"
                            variant="contained"
                            style={{ width: '250px', backgroundColor: '#6A0DAD', color: 'white' }}
                            size="large"
                            onClick={handleMuaHang} // Thêm sự kiện onClick
                        >
                            Mua hàng
                        </Button>
                    </div>
                </Box>
            </Box>

            <BootstrapModal show={showModal} onHide={handleClose}>
                <BootstrapModal.Header closeButton>
                    <BootstrapModal.Title>Chi tiết sản phẩm</BootstrapModal.Title>
                </BootstrapModal.Header>
                <BootstrapModal.Body>
                    {currentProduct ? (
                        <div className="d-flex">
                            <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: '140px', marginRight: '20px' }}>
                                {currentProduct.productDetail.images && currentProduct.productDetail.images.map((anh, index) => (
                                    <div key={index} className="image-container">
                                        <img src={anh.url} alt="images" className="object-fit-cover" />
                                    </div>
                                ))}
                            </Carousel>

                            <div>
                                <Typography variant="h4">{currentProduct.productDetail.product.name}</Typography>
                                <div className='d-flex my-2'>
                                    <Typography variant="body2" className='text-danger '>
                                        {currentProduct.productDetail.discountPrice == 0 ? <FormatCurrency value={currentProduct.productDetail.price} /> : <FormatCurrency value={currentProduct.productDetail.discountPrice} />}
                                    </Typography>
                                    <Typography variant="body2" className='mx-2 text-decoration-line-through'>
                                        {currentProduct.productDetail.discountPrice == 0 ? null : <FormatCurrency value={currentProduct.productDetail.price} />}
                                    </Typography>
                                </div>
                                <Typography className=' my-2' variant="body2" sx={{ fontStyle: 'italic' }}>
                                    {currentProduct.productDetail.collar.name}, {currentProduct.productDetail.sleeve.name}
                                </Typography>
                                <div className='d-flex my-2 align-items-center '>
                                    <Typography variant="body2" style={{ marginRight: '150px' }}>
                                        Số lượng
                                    </Typography>
                                    <Row >
                                        <Col>
                                            <InputNumber
                                                min={1}
                                                max={currentProduct.productDetail.quantity} // Sử dụng soLuong từ sản phẩm hiện tại
                                                defaultValue={currentProduct.quantity} // Giá trị mặc định là 1
                                                onChange={(value) => {
                                                    console.log(`Số lượng cho ${currentProduct.productDetail.product.namea}: ${value}`);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <Typography>Không có sản phẩm nào để hiển thị.</Typography>
                    )}
                </BootstrapModal.Body>
                <BootstrapModal.Footer>
                    <BootstrapButton variant="secondary" onClick={handleClose}>
                        Đóng
                    </BootstrapButton>
                    <BootstrapButton variant="primary" c>
                        Lưu thay đổi
                    </BootstrapButton>
                </BootstrapModal.Footer>
            </BootstrapModal>
            <ToastContainer />
        </div>
    );
};

export default Cart;
