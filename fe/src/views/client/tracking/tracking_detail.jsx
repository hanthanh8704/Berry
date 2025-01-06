
//Bản tiếng Anh

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Thêm dòng này
import { message, InputNumber, Col, Button, Form, Modal, Table, Space, Select, Input, Alert } from 'antd';
import { detailHoaDon, detailKH } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { Card, Typography, Row, Carousel } from 'antd';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
const { Title, Text } = Typography;
import './tracking_detail.css';
import FormatDate from 'views/utilities/FormatDate';
import { FaRegFileAlt, FaTruck, FaTruckLoading } from 'react-icons/fa'; // FontAwesome icons
import { MdOutlineConfirmationNumber, MdPayment, MdOutlineCancelPresentation, MdOutlineReplayCircleFilled, MdOutlineChangeCircle, MdCancel } from 'react-icons/md'; // Material Design icons
import { GiConfirmed } from 'react-icons/gi'; // Game Icons
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
import TextArea from 'antd/es/input/TextArea';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { margin } from "@mui/system";
const { Search } = Input;
const { Option } = Select;
import { findAllChatLieu, findAllThuongHieu, findAllMauSac, findAllKichCo } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { SearchOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from "antd";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import * as request from 'views/utilities/httpRequest';
const listStatus = [
    { id: 0, name: "Tạo hóa đơn", status: "TAO_HOA_DON", color: "#007BFF", title: "Tạo hóa đơn", icon: FaRegFileAlt }, // Xanh dương nhạt (thông tin)
    { id: 1, name: "Chờ xác nhận", status: "CHO_XAC_NHAN", color: "#FFC107", title: "Chờ xác nhận", icon: FaRegFileAlt }, // Vàng (cảnh báo)
    { id: 2, name: "Xác nhận", status: "XAC_NHAN", color: "#17A2B8", title: "Xác nhận", icon: MdOutlineConfirmationNumber }, // Xanh dương lục (hành động)
    { id: 3, name: "Chờ vận chuyển", status: "CHO_VAN_CHUYEN", color: "#FD7E14", title: "Chờ vận chuyển", icon: MdPayment }, // Cam (tiến trình)
    { id: 4, name: "Vận chuyển", status: "VAN_CHUYEN", color: "#28A745", title: "Vận chuyển", icon: FaTruck }, // Xanh lá (thành công)
    { id: 5, name: "Đã thanh toán", status: "DA_THANH_TOAN", color: "#20C997", title: "Đã thanh toán", icon: FaTruckLoading }, // Xanh lục sáng (hoàn thành)
    { id: 6, name: "Thành công", status: "THANH_CONG", color: "#218838", title: "Thành công", icon: GiConfirmed }, // Xanh lá đậm (hoàn tất)
    { id: 7, name: "Đã hủy", status: "DA_HUY", color: "#DC3545", title: "Đã hủy", icon: MdOutlineCancelPresentation }, // Đỏ (hủy)
    { id: 10, name: "Trả hàng", status: "TRA_HANG", color: "#138496", title: "Trả hàng", icon: MdOutlineChangeCircle }, // Xanh dương đậm (xử lý)
    { id: 8, name: "Yêu cầu hủy", status: "YEU_CAU_HUY", color: "#FF4500", title: "Yêu cầu hủy", icon: MdCancel }, // Đỏ cam (yêu cầu)
    { id: 9, name: "Thay đổi", status: "THAY_DOI", color: "#6A5ACD", title: "Thay đổi", icon: MdOutlineReplayCircleFilled } // Tím xanh (đặt lại)
];

const listStatusPayMent = [
    { name: "Đã thanh toán", status: "DA_THANH_TOAN", color: "#28a745" }, // Màu xanh lá nhạt - Đã hoàn tất
    { name: "Chưa thanh toán", status: "CHUA_THANH_TOAN", color: "#dc3545" }, // Màu đỏ - Cảnh báo chưa thanh toán
    { name: "Trả sau", status: "TRA_SAU", color: "#ffc107" }, // Màu vàng - Cần chú ý
    { name: "Thanh toán", status: "THANH_TOAN", color: "#007bff" }, // Màu xanh dương - Đang xử lý
    { name: "Hoàn tiền", status: "HOAN_TIEN", color: "#17a2b8" }, // Màu xanh cyan - Tích cực, đã hoàn tiền
];

const listMethodPayMent = [
    { name: "Tiền mặt", status: "TIEN_MAT", color: "#6c757d" }, // Màu xám - Hình thức truyền thống
    { name: "Chuyển khoản", status: "CHUYEN_KHOAN", color: "#20c997" }, // Màu xanh lá nhạt - Giao dịch hiện đại
];



const TrackingDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [hoaDon, setHoaDon] = useState();
    const [hoaDonDetail, setHoaDonDetail] = useState([]);
    const [billHistory, setBillHistory] = useState([]);
    const [payments, setPayments] = useState([]);

    const [productDetail, setProductDetail] = useState([]);
    const { ma } = useParams(); // ID sản phẩm
    const totalPayment = hoaDon?.totalMoney + hoaDon?.shippingFee - hoaDon?.discountAmount;
    const statusPresent = hoaDon?.invoiceStatus;
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [thuongHieu, setThuongHieu] = useState([]);
    const [selectedThuongHieu, setSelectedThuongHieu] = useState('All');

    const [chatLieu, setChatLieu] = useState([]);
    const [selectedChatLieu, setSelectedChatLieu] = useState('All');

    const [kichCo, setKichCo] = useState([]);
    const [selectedKichCo, setSelectedKichCo] = useState('All');

    const [mauSac, setMauSac] = useState([]);
    const [selectedMauSac, setSelectedMauSac] = useState('All');

    const [searchValueSCT, setSearchValueSCT] = useState('');
    const [filterPrice, setFilterPrice] = useState('All');

    const [tongTienDatLai, setTongTienDatLai] = useState(0);

    const [voucherNew, setVoucherNew] = useState(0);

    const [hoTen, setHoTen] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [diaChiCuThe, setDiaChiCuThe] = useState('');
    const [khachHang, setKhachHang] = useState(null);
    const [thanhPho, setThanhPho] = useState(null);
    const [huyen, setHuyen] = useState(null);
    const [phuong, setPhuong] = useState(null);


    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const [errors, setErrors] = useState({
        hoTen: '',
        soDienThoai: '',
        diaChiCuThe: '',
    });

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


    useEffect(() => {
        loadProductDetail();
    }, []);  // Mảng phụ thuộc trống để chỉ chạy một lần khi component mount

    const loadProductDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/shirt-detail/index`);
            if (Array.isArray(response.data)) {
                setProductDetail(response.data);  // Đảm bảo rằng productDetail là mảng
                console.log('Produc td detail  ddddddd:', response.data);
            } else {
                setProductDetail([]);  // Nếu không phải mảng, gán mảng rỗng
            }
        } catch (error) {
            console.error(error);
            setProductDetail([]);  // Xử lý lỗi và đảm bảo mảng trống khi có lỗi
        }
    };


    useEffect(() => {
        console.log("Current ma:", ma); // Log giá trị ma để kiểm tra
        DetailHoaDon();
    }, [ma]);

    const DetailHoaDon = () => {
        detailHoaDon(ma)
            .then(response => {
                console.log("API response dddddddddddddmmmmmm:", response.data); // Log toàn bộ response để kiểm tra
                setHoaDon(response.data); // Set product 
                setHoaDonDetail(response.data.billDetails); // Set product 
                setBillHistory(response.data.billHistory); // Set product data
                setPayments(response.data.payments)
                console.log('Error fetching Hoa Don Detail zzzzzzzzzzzzzzzzzzz:', response.data.billHistory);
                console.log('Hoa Don Detail ddddddddddddddddd:', response.data.billDetails);
                console.log('Hoa Don  ddddddddddddddddd:', response.data);
                console.log('Pay m ent   ddddddddddddddddd:', response.data.payments);
            })
            .catch(error => {
                console.error('Error fetching Hoa Don Detail:', error);
            });
    };
    console.log("statusPresent", statusPresent);

    //Nút hủy 

    //Modal của huỷ hóa đơn
    const [isModalCancelBill, setIsModalCanCelBill] = useState(false);

    const showModalCancelBill = (isCancel) => {
        setIsModalCanCelBill(true);
    };

    const handleCancelBill = () => {
        setIsModalCanCelBill(false);
    };


    //Modal của đặt lại
    const [isModalResetOrder, setIsModalResetOrder] = useState(false);

    const showModalCResetOrder = (isCancel) => {
        setIsModalResetOrder(true);
    };

    const handleCancelResetOrder = () => {
        setIsModalResetOrder(false);
    };

    const handleCancelBillStatus = (data) => {
        const requestData = {
            description: data.note,
        };

        // Gửi request PUT tới server
        request
            .put(`/tra-cuu/cancel-status/${hoaDon.id}`, requestData)
            .then(() => {

                toast.success("Yêu cầu hủy đơn hàng thành công!");
                DetailHoaDon(); // Load lại chi tiết hóa đơn
            })
            .catch((error) => {
                console.error("Chỉ có admin mới có thể hủy hóa đơn:", error);
            })
            .finally(() => {
                setIsModalCanCelBill(false); // Đóng modal trong mọi trường hợp
            });
    };




    const formatNote = (note) => {
        const maxLength = 20; // Độ dài tối đa cho mỗi dòng
        if (note.length > maxLength) {
            return note
                .match(new RegExp(`.{1,${maxLength}}`, 'g')) // Chia chuỗi thành từng đoạn nhỏ
                .map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ));
        }
        return note;
    };

    //Modal của thêm sản phẩm
    // Xử lý khi thay đổi giá trị tìm kiếm
    const handleSearchChange = (e) => {
        setSearchValueSCT(e.target.value);
    };

    // Loc theo thuong hieu
    const handleThuongHieu = (value) => {
        setSelectedThuongHieu(value); // Cập nhật giá trị chọn lọc
    };

    // Loc theo MS
    const handleMauSac = (value) => {
        setSelectedMauSac(value); // Cập nhật giá trị chọn lọc
    };

    // Loc theo KT
    const handleKichCo = (value) => {
        setSelectedKichCo(value); // Cập nhật giá trị chọn lọc
    };

    // Loc theo TH
    const handleChatLieu = (value) => {
        setSelectedChatLieu(value); // Cập nhật giá trị chọn lọc
    };


    const handlePriceChange = (value) => {
        setFilterPrice(value);
    };

    useEffect(() => {
        getAllTH();
        getAllCL();
        getAllKC();
        getAllMS();
    }, []);


    function getAllTH() {
        findAllThuongHieu()
            .then((response) => {
                setThuongHieu(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }


    function getAllCL() {
        findAllChatLieu()
            .then((response) => {
                setChatLieu(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function getAllMS() {
        findAllMauSac()
            .then((response) => {
                setMauSac(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }


    function getAllKC() {
        findAllKichCo()
            .then((response) => {
                setKichCo(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }


    const searchSPCT = productDetail.filter((ct) => {
        const isStatusTH = selectedThuongHieu === 'All' || ct.brand.id === selectedThuongHieu;
        const isStatusMS = selectedMauSac === 'All' || ct.color.id === selectedMauSac;
        const isStatusKC = selectedKichCo === 'All' || ct.size.id === selectedKichCo;
        const isStatusCL = selectedChatLieu === 'All' || ct.material.id === selectedChatLieu;

        const isNameOrCodeMatch = !searchValueSCT || (ct.product && ct.product.name.toLowerCase().includes(searchValueSCT.toLowerCase()));

        let priceMatch = true;
        if (filterPrice !== 'All') {
            const priceRange = filterPrice.split('-');
            const minPrice = parseFloat(priceRange[0]);
            const maxPrice = parseFloat(priceRange[1]);
            const giaBan = parseFloat(ct.price);
            priceMatch = giaBan >= minPrice && giaBan <= maxPrice;
        }

        return isNameOrCodeMatch && isStatusCL && isStatusTH && isStatusMS && isStatusKC && priceMatch;
    });

    //Modal của thêm product 
    const [isModalProduct, setIsModalProduct] = useState(false);

    const showModalProduct = (isCancel) => {
        setIsModalProduct(true);
    };

    const handleCancelProduct = () => {
        setIsModalProduct(false);
    };

    //Modal của địa chir 
    const [isModalAdress, setIsModalAdress] = useState(false);

    const showModalAdress = (isCancel) => {
        setIsModalAdress(true);
    };

    const handleCancelAdress = () => {
        setIsModalAdress(false);
    };
    const configApi = {
        headers: {
            "Content-Type": "application/json",
            Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694",
            ShopId: 192796,
        },
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
                    configApi
                );
                console.log('Provinces Response:', response); // Log toàn bộ response từ API
                if (Array.isArray(response.data.data)) {
                    setProvinces(response.data.data); // Nếu API trả về dữ liệu đúng
                } else {
                    console.error('Invalid provinces data:', response.data);
                }
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    // Hàm lấy quận/huyện
    const fetchDistricts = async (provinceId) => {
        try {
            const response = await axios.get(
                `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
                configApi
            );
            if (Array.isArray(response.data.data)) {
                setDistricts(response.data.data);
            } else {
                console.error('Invalid districts data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    // Hàm lấy phường/xã
    const fetchWards = async (districtId) => {
        try {
            const response = await axios.get(
                `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
                configApi
            );
            if (Array.isArray(response.data.data)) {
                setWards(response.data.data);
            } else {
                console.error('Invalid wards data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    useEffect(() => {
        const selectedProvinceId = thanhPho;
        const selectedDistrictsId = huyen;
        if (selectedProvinceId) {
            fetchDistricts(selectedProvinceId, (data) => {
                setDistricts(data);
            });
            fetchWards(selectedDistrictsId, (data) => {
                setWards(data);
            });
        }
    }, [thanhPho]);

    const handleProvinceChange = (provinceCode) => {
        setThanhPho(provinceCode);
        setHuyen(null);
        setPhuong(null);
        setSelectedDistrict(null)
        fetchDistricts(provinceCode, setDistricts);
    };

    const handleDistrictChange = (districtCode) => {
        setHuyen(districtCode);
        setPhuong(null);

        fetchWards(districtCode, setWards);
    };

    const handleWardChange = (wardCode) => {
        setPhuong(wardCode);
    };


    //Call api phí vận chuyển 
    const [shippingFee, setShippingFee] = useState(null);
    const [shippingFeeNew, setShippingFeeNew] = useState(null);
    const [weightTong, setWeightTong] = useState(0);

    useEffect(() => {
        let totalWeight = 0;

        hoaDon?.billDetails?.forEach(item => {
            const weight = item.productDetail?.weight;
            if (weight) {
                totalWeight += weight * item.quantity;
            }
        });

        setWeightTong(totalWeight);
    }, [hoaDon?.billDetails]);

    // Gọi API phí vận chuyển

    useEffect(() => {
        const fetchShippingFee = async () => {
            try {
                if (hoaDon?.totalMoney >= 2000000) {
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
                    from_district_id: 1485, // ID quận/huyện gửi hàng
                    to_district_id: Number(huyen), // ID quận/huyện nhận hàng
                    to_ward_code: phuong, // Mã phường/xã nhận hàng
                    height: 50, // Chiều cao gói hàng (cm)
                    length: 20, // Chiều dài gói hàng (cm)
                    weight: weightTong, // Cân nặng gói hàng (gram)
                    width: 20, // Chiều rộng gói hàng (cm)
                    cod_failed_amount: 2000, // Tiền COD nếu giao thất bại
                    insurance_value: 10000, // Giá trị bảo hiểm hàng hóa
                    coupon: null // Mã giảm giá (nếu có)
                };

                console.log('Data being sent to API:', data);

                // Gửi request đến API GHN
                const response = await axios.post(
                    "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Token: '693d8a79-3a3d-11ef-8e53-0a00184fe694',
                            ShopId: '192796'
                        }
                    }
                );

                // Cập nhật phí vận chuyển từ response
                console.log("Phí vận chuyển chi tiết:");
                console.log("Phí dịch vụ:", response.data.data.service_fee);
                console.log("Tổng phí vận chuyển:", response.data.data.total);
                setShippingFee(response.data.data.total);

            } catch (error) {
                // setShippingFee(0);

                console.error("Lỗi khi gọi API phí vận chuyển:", error);
            }
        };

        fetchShippingFee();
    }, [huyen, hoaDon?.totalMoney, weightTong, phuong]);

    // Gọi API phí vận chuyển
    useEffect(() => {
        const fetchShippingFeeNew = async () => {
            try {
                if (tongTienDatLai >= 2000000) {
                    // Đơn hàng trên 1 triệu -> free ship
                    setShippingFeeNew(0);
                    return;
                }

                if (!huyen || !phuong) {
                    console.warn("Huyện hoặc phường không được xác định");
                    return;
                }

                // Dữ liệu gửi đến API
                const data = {
                    service_type_id: 2,
                    from_district_id: 1482, // ID quận/huyện gửi hàng
                    to_district_id: Number(huyen), // ID quận/huyện nhận hàng
                    to_ward_code: phuong, // Mã phường/xã nhận hàng
                    height: 50, // Chiều cao gói hàng (cm)
                    length: 20, // Chiều dài gói hàng (cm)
                    weight: weightTong,
                    width: 20, // Chiều rộng gói hàng (cm)
                    cod_failed_amount: 2000, // Tiền COD nếu giao thất bại
                    insurance_value: 10000, // Giá trị bảo hiểm hàng hóa
                    coupon: null, // Mã giảm giá (nếu có)
                };

                console.log('Data being sent to API:', data);

                const response = await axios.post(
                    "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Token: '693d8a79-3a3d-11ef-8e53-0a00184fe694',
                            ShopId: '192796'
                        }
                    }
                );

                // Cập nhật phí vận chuyển từ response
                console.log("Phí vận chuyển chi tiết:");
                console.log("Phí dịch vụ:", response.data.data.service_fee);
                console.log("Tổng phí vận chuyển:", response.data.data.total);
                setShippingFeeNew(response.data.data.total);

            } catch (error) {
                // setShippingFee(0);

                console.error("Lỗi khi gọi API phí vận chuyển:", error);
            }
        };

        fetchShippingFeeNew();
    }, [huyen, tongTienDatLai, weightTong, phuong]);


    const detail = async () => {
        try {
            const response = await detailKH(customerId);
            setKhachHang(response.data);
            if (response.data.listAddress && response.data.listAddress.length > 0) {
                const diaChiMacDinh = response.data.listAddress.find(diaChi => diaChi.defaultAddress === true);
                console.log("Dia chi mac dinh ddddddddd!", diaChiMacDinh);
                if (diaChiMacDinh) {
                    setThanhPho(diaChiMacDinh.city)
                    setPhuong(diaChiMacDinh.ward)
                    setHuyen(diaChiMacDinh.district)

                    setDiaChiCuThe(diaChiMacDinh.detailedAddress)
                    setHoTen(diaChiMacDinh.fullName)
                    setSoDienThoai(diaChiMacDinh.phoneNumber)
                } else {
                    console.log("Không có địa chỉ mặc định nào!");
                }
            }
        } catch (error) {
            console.error('Error fetching Khách Hàng chi tiết:', error);
        }
    };

    useEffect(() => {
        detail();
    }, [customerId]);
    useEffect(() => {
        console.log("thanhPho state: ", thanhPho);
        console.log("huyen state: ", huyen);
        console.log("phuong state: ", phuong);
        console.log("provinces list: ", provinces);
        console.log("districts list: ", districts);
        console.log("wards list: ", wards);

        // Xử lý thành phố
        if (thanhPho && provinces.length > 0) {
            const selectedProvince = provinces.find(province => province.ProvinceID === Number(thanhPho));
            if (selectedProvince) {
                setSelectedProvince(selectedProvince.ProvinceName);
            }
        }

        // Xử lý huyện
        if (huyen && districts.length > 0) {
            const selectedDistrict = districts.find(district => district.DistrictID === Number(huyen));
            if (selectedDistrict) {
                setSelectedDistrict(selectedDistrict.DistrictName);
            }
        }

        // Xử lý phường
        if (phuong && wards.length > 0) {
            const selectedWard = wards.find(ward => ward.WardCode === String(phuong));
            if (selectedWard) {
                setSelectedWard(selectedWard.WardName);
            }
        }
    }, [thanhPho, huyen, phuong, provinces, districts, wards]);


    //Modal của chọn sản phẩm  
    const [isModalClickProduct, setIsModalClickProduct] = useState(false);

    const showModalClickProduct = (isCancel) => {
        setIsModalClickProduct(true);
    };

    const handleCancelClickProduct = () => {
        setIsModalClickProduct(false);
    };

    const [idSPCT, setIdSPCT] = useState();

    const columns = [
        {
            title: 'STT',
            dataIndex: 'indexs',
            key: 'indexs',
            width: 40, // Đặt độ rộng cố định cho cột
            render: (text, record, index) => (
                (currentPage - 1) * pageSize + index + 1
            ),
        },
        {
            title: 'Ảnh',
            dataIndex: 'images', // Chỉ định cột lấy từ "images"
            key: 'images',
            width: 40, // Đặt độ rộng cố định cho cột
            render: (images, record) => (
                <Carousel
                    autoplay
                    autoplaySpeed={3000}
                    dots={false}
                    arrows={false}
                    style={{ height: '150px', width: '90px' }}
                >
                    {images &&
                        images.map((anh, index) => (
                            <div key={index} className="image-container">
                                <img
                                    src={anh.url}
                                    alt="images"
                                    className="object-fit-cover"
                                    style={{ borderRadius: '10px' }}
                                />
                                {/* Lấy discountPercentage từ record */}
                                {record.discountPercentage !== 0 && (
                                    <p className="discount-badge">
                                        {`-${record.discountPercentage}%`}
                                    </p>
                                )}
                            </div>
                        ))}
                </Carousel>
            ),
        },

        {
            title: 'Tên',
            dataIndex: 'product',
            key: 'product',
            width: 50,
            render: (product, record) => (
                <div>
                    {record.product?.name}
                </div>

            ),
        },
        {
            title: 'Màu sắc',
            dataIndex: 'color',
            key: 'color',
            width: 50,
            render: (color, record) => (
                <div>
                    {record.color?.name}
                </div>

            ),
        },
        {
            title: 'Kích cỡ',
            dataIndex: 'size',
            key: 'size',
            width: 50,
            render: (size, record) => (
                <div>
                    {record.size?.name}
                </div>

            ),
        },
        {
            title: 'Chất liệu',
            dataIndex: 'material',
            key: 'material',
            width: 50,
            render: (material, record) => (
                <div>
                    {record.material?.name}
                </div>

            ),
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'brand',
            key: 'brand',
            width: 50,
            render: (brand, record) => (
                <div>
                    {record.brand?.name}
                </div>

            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 50,
            render: (quantity, record) => (
                <div>
                    {record.quantity}
                </div>

            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: 50,
            render: (price, record) => (
                record.discountPercentage !== 0 ? (
                    <>
                        <span style={{
                            color: 'black',
                            textDecoration: 'line-through',
                            fontSize: '10px',
                            marginLeft: '20px', // Khoảng cách với giá mới
                            verticalAlign: 'top' // Căn chỉnh lên trên
                        }}>
                            <FormatCurrency value={record.price} />
                        </span>
                        <span style={{
                            color: 'red',

                            marginBottom: '25px',
                            display: 'inline-block',
                            verticalAlign: 'top' // Căn chỉnh lên trên
                        }}>
                            <FormatCurrency value={record.price * (1 - record.discountPercentage / 100)} />
                        </span>

                    </>
                ) : (
                    <FormatCurrency value={record.price} />
                )
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'action',
            width: 40,
            render: (id, record) => (
                <Space size="middle">
                    <Button onClick={() => {
                        setIdSPCT(record.id); // Gán idSPCT khi chọn sản phẩm
                        showModalClickProduct(); // Hiển thị modal
                    }}
                        type="primary"
                    >
                        Chọn
                    </Button>
                </Space>
            ),
        }

    ];


    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
        setCurrentPage(1); // Đặt trang hiện tại về 1 khi thay đổi kích thước trang
    };

    const handleSubmitProduct = (data) => {
        console.log("Khách hàng sau khi đổi", hoaDon.id);
        console.log("Khách hàng sau khi đổi", idSPCT);
        let quantity = form.getFieldValue('quantity');

        // Chuyển đổi quantity sang kiểu số nguyên
        quantity = parseInt(quantity, 10);
        console.log("Khách hàng sau khi đổi", quantity);
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            toast.error("Vui lòng nhập số lượng hợp lệ");
        } else {
            Modal.confirm({
                title: 'Xác nhận',
                maskClosable: true,
                content: 'Bạn có chắc chắn muốn chọn sản phẩm này?',
                okText: 'Xác nhận',
                cancelText: 'Hủy',
                onOk: async () => {
                    const requestData = {
                        billDetailRequest: {
                            idBill: hoaDon.id,
                            IdChiTietSanPham: idSPCT,
                            quantity: quantity,  // Truyền giá trị quantity vào body
                        },
                        sanPhamMoi: hoaDonDetail,  // Truyền danh sách sản phẩm cũ
                    };

                    console.log("Hoa don detail sssssssssssssssssss  ", hoaDonDetail);
                    try {
                        // Gửi request POST tới server
                        const response = await axios.post('http://localhost:8080/api/tra-cuu/selected-product', requestData);
                        form.resetFields(); // Reset lại form sau khi gửi
                        const billDetails = response.data.data.billDetails;

                        setHoaDonDetail(billDetails); // Set danh sách sản phẩm
                        console.log("SẢN PHẨM ĐÃ ĐƯỢC THÊM VÀO con mẹ nó", billDetails);

                        // Tính tổng tiền của tất cả bản ghi  các bản ghi sản phẩm
                        // Tính tổng tiền của tất cả bản ghi sản phẩm
                        const tongTienSauDatLai = billDetails.reduce((total, item) => {
                            const gia = item.promotion === 0
                                ? item.price * item.quantity // Nếu không có khuyến mãi, tính giá gốc
                                : (item.price * (1 - item.promotion / 100)) * item.quantity; // Nếu có khuyến mãi, giảm theo phần trăm
                            return total + gia; // Cộng dồn giá trị vào tổng
                        }, 0);

                        setTongTienDatLai(tongTienSauDatLai); // Set tổng tiền sau khi đặt lại
                        toast.success("Chọn thành công sản phẩm");
                        setIsModalClickProduct(false); // Đóng modal
                        setIsModalProduct(false);
                    } catch (error) {
                        const errorMessage = error.response?.data?.data || 'Lỗi khi tìm kiếm hóa đơn';
                        toast.error(errorMessage);
                    }

                },
            });
        }
    };

    //Nút đặt lại
    const handleResetBill = async () => {
        

        const voucherId = voucherNew?.id || null; // Kiểm tra null an toàn
        const discountAmount = voucherNew
            ? voucherNew.discountMethod === "PHAN_TRAM"
                ? (tongTienDatLai * voucherNew.discountValue) / 100
                : voucherNew.discountValue
            : 0; // Không có voucher thì giảm giá là 0

        Modal.confirm({
            title: 'Xác nhận',
            maskClosable: false,
            content: 'Bạn có chắc chắn muốn thay đổi đơn hàng không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                const requestData = {
                    sanPhamMoi: hoaDonDetail,
                    billRequest: {
                        voucherId: voucherId, // Nếu null sẽ được gửi là null
                        id: hoaDon.id,
                        discountAmount: discountAmount,
                        shippingFee: shippingFeeNew,
                        totalMoney: tongTienDatLai,
                    },
                };

                try {
                    const response = await axios.post(
                        `http://localhost:8080/api/tra-cuu/reset-order`,
                        requestData
                    );
                    toast.success("Xác nhận đơn lại hàng thành công!");
                    toast.success("Với những đơn hàng đặt lại sẽ được tính tiền khi nhận hàng");
                    setIsModalResetOrder(false);
                    DetailHoaDon()
                    loadProductDetail()
                    // setTimeout(() => {
                    //     navigate(`/tracking/${hoaDon.code}`);
                    // }, 3000); // Chờ 3 giây (3000 ms)
                } catch (error) {
                    console.error(error);
                    toast.error("Đặt lại hàng thất bại!");
                }
            },
        });
    };



    //hàm dùng để update số lượng 
    // Hàm để xử lý khi thay đổi số lượng của sản phẩm
    const handleQuantityChange = (value, index) => {
        // Kiểm tra nếu giá trị trong khoảng min và max
        const updatedHoaDonDetail = hoaDonDetail.map((chiTiet, idx) => {
            if (idx === index) {
                // Cập nhật số lượng sản phẩm tại vị trí index
                return { ...chiTiet, quantity: value };
            }
            return chiTiet;
        });

        // Cập nhật lại danh sách hoaDonDetail sau khi thay đổi
        setHoaDonDetail(updatedHoaDonDetail);
        // Tính lại tổng tiền đặt lại
        const newTongTienDatLai = updatedHoaDonDetail.reduce((total, chiTiet) => {
            // Tính tiền từng chi tiết: giá sản phẩm * số lượng
            const itemTotal = chiTiet.promotion === 0
                ? chiTiet.price * chiTiet.quantity
                : (chiTiet.price * (1 - chiTiet.promotion / 100)) * chiTiet.quantity;
            return total + itemTotal;
        }, 0);

        // Cập nhật giá trị tổng tiền đặt lại
        setTongTienDatLai(newTongTienDatLai);
    };

    const handleDeleteItem = (index) => {
        // Kiểm tra nếu danh sách chỉ có 1 sản phẩm thì không thực hiện xóa
        if (hoaDonDetail.length === 1) {
            return; // Không làm gì nếu danh sách chỉ có 1 sản phẩm
        }

        // Tạo danh sách mới sau khi xóa sản phẩm tại vị trí `index`
        const updatedHoaDonDetail = hoaDonDetail.filter((_, idx) => idx !== index);

        // Cập nhật lại danh sách hoaDonDetail
        setHoaDonDetail(updatedHoaDonDetail);

        // Tính lại tổng tiền đặt lại
        const newTongTienDatLai = updatedHoaDonDetail.reduce((total, chiTiet) => {
            // Tính tiền từng chi tiết: giá sản phẩm * số lượng
            const itemTotal = chiTiet.promotion === 0
                ? chiTiet.price * chiTiet.quantity
                : (chiTiet.price * (1 - chiTiet.promotion / 100)) * chiTiet.quantity;
            return total + itemTotal;
        }, 0);

        // Cập nhật giá trị tổng tiền đặt lại
        setTongTienDatLai(newTongTienDatLai);
    };

    //Tự động chọn voucher mới siêu ngon cho khách uu tiên voucher giảm phần trăm nha 

    useEffect(() => {
        GetAllPhieuGiamGia(); // Gọi API nếu customerId tồn tại
    }, [tongTienDatLai]); // Theo dõi customerId để gọi lại nếu giá trị thay đổi

    const GetAllPhieuGiamGia = () => {
        axios
            .get(`http://localhost:8080/api/gio-hang/auto/select/voucher`, {
                params: {
                    price: tongTienDatLai, // Truyền idNhanVien nếu có, nếu không thì null
                    idKH: customerId,
                },
            })
            .then((response) => {
                setVoucherNew(response.data); // Cập nhật state với dữ liệu từ API
                console.log('Fetched Vouchers ddddddddddddd:', response.data); // Log dữ liệu từ API\
            })
            .catch((error) => {
                console.error('Error fetching Phieu Giam Gia:', error.response?.data || error.message); // Log lỗi nếu có
            });
    };

    function validateFormCreteDC() {
        let valid = true;
        const errorsCopy = { ...errors };

        // Validate họ tên
        if (!hoTen.trim()) {
            errorsCopy.hoTen = 'Họ tên không được để trống!';
            valid = false;
        } else if (hoTen.length > 50) {
            errorsCopy.hoTen = 'Tên không được vượt quá 50 kí tự!';
            valid = false;
        } else {
            errorsCopy.hoTen = '';
        }

        // Pattern kiểm tra số điện thoại bắt đầu với số 0 và có từ 9 đến 10 chữ số
        const phonePattern = /^0[1-9]\d{8,9}$/;

        // Validate số điện thoại
        if (!soDienThoai.trim()) {
            errorsCopy.soDienThoai = 'Số điện thoại không được để trống!';
            valid = false;
        } else if (!phonePattern.test(soDienThoai)) {
            errorsCopy.soDienThoai = 'Số điện thoại không đúng định dạng!';
            valid = false;
        } else {
            errorsCopy.soDienThoai = '';
        }


        // Validate địa chỉ cụ thể
        if (!diaChiCuThe.trim()) {
            errorsCopy.diaChiCuThe = 'Địa chỉ cụ thể không được để trống!';
            valid = false;
        } else if (diaChiCuThe.length > 50) {
            errorsCopy.diaChiCuThe = 'Địa chỉ cụ thể không được vượt quá 50 kí tự!';
            valid = false;
        } else {
            errorsCopy.diaChiCuThe = '';
        }

        // Cập nhật state với các lỗi
        setErrors(errorsCopy);
        return valid;
    }

    const updateDiaChi = () => {
        if (validateFormCreteDC()) {
            Modal.confirm({
                title: 'Xác nhận',
                maskClosable: true,
                content: 'Bạn có chắc chắn muốn thêm địa chỉ này?',
                okText: 'Xác nhận',
                cancelText: 'Hủy',
                onOk: async () => {

                    const diaCHi = {
                        id: hoaDon.id,
                        recipientName: hoTen,
                        recipientPhone: soDienThoai,
                        shippingFee: 36500,
                        detailAddress: `${diaChiCuThe}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`,
                    };

                    console.log("Shipingffffffffffffff", shippingFee)

                    axios
                        .post(`http://localhost:8080/api/tra-cuu/update-address`, diaCHi) // Thêm `diaCHi` làm body
                        .then((response) => {
                            toast.success("Thay đổi địa chỉ thành công!");
                            DetailHoaDon();
                            setIsModalAdress(false)
                        })
                        .catch((error) => {
                            console.error(
                                'Sai:',
                                error.response?.data || error.message
                            ); // Log lỗi nếu có
                        });
                },
            });
        } else {
            toast.error('Vui lòng kiểm tra lại thông tin!');
        }
    };

    //Modal của payment 
    const [isModalPayments, setIsModalPayments] = useState(false);

    const showModalPayments = (isCancel) => {
        setIsModalPayments(true);
    };

    const handleCancelPayments = () => {
        setIsModalPayments(false);
    };



    const columnsPayments = [
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                // Tìm trạng thái trong danh sách
                const statusItem = listStatusPayMent.find(item => item.status === status);

                return statusItem ? (
                    <Tag color={statusItem.color}>
                        <Tooltip title={statusItem.name}>
                            {statusItem.name}
                        </Tooltip>
                    </Tag>
                ) : (
                    <Tag color="default">
                        <Tooltip title="Trạng thái không xác định">
                            Không xác định
                        </Tooltip>
                    </Tag>
                );
            },
        },

        {
            title: "Hình thức thanh toán",
            dataIndex: "method",
            key: "method",
            render: (method) => {
                // Tìm hình thức thanh toán trong danh sách
                const methodItem = listMethodPayMent.find(item => item.status === method);

                return methodItem ? (
                    <Tag color={methodItem.color}>
                        <Tooltip title={methodItem.name}>
                            {methodItem.name}
                        </Tooltip>
                    </Tag>
                ) : (
                    <Tag color="default">
                        <Tooltip title="Hình thức không xác định">
                            Không xác định
                        </Tooltip>
                    </Tag>
                );
            },
        },


        {
            title: "Mã giao dịch",
            dataIndex: "transactionNo",
            key: "transactionNo",
            render: (transactionNo) => transactionNo || "Không có",
        },
        {
            title: "Ngày giao dịch",
            dataIndex: "transactionDate",
            key: "transactionDate",
            render: (transactionDate) => transactionDate ? new Date(transactionDate).toLocaleString() : "Không có",
        },

        {
            title: "Tổng tiền",
            dataIndex: "totalMoney",
            key: "totalMoney",
            render: (totalMoney, record) => (
                <div>
                    <FormatCurrency value={record.totalMoney} />
                </div>

            ),
        },
        {
            title: "Nhân viên tiếp nhận",
            dataIndex: "employee",
            key: "employee",
            render: (employee, record) => {
                // Kiểm tra xem đối tượng employee có tồn tại hay không
                if (employee && employee.name && record.status == "HOAN_TIEN") {
                    // Nếu tồn tại và có tên, hiển thị tên nhân viên và "Chuyển khoản"
                    return `${employee.name}`;
                } else if (employee && employee.name && record.status == "TRA_SAU") {
                    // Nếu tồn tại và có tên, hiển thị tên nhân viên và "Chuyển khoản"
                    return `${employee.name}`;
                }
                else {
                    // Nếu không có nhân viên, hiển thị "Không có"
                    return "Không có";
                }
            },
        }

    ];


    //Hàm tính lại số tiền được trả và cần trả 
    const traSauTotal = payments
        .filter((payment) => payment.status === 'TRA_SAU')
        .reduce((sum, payment) => sum + payment.totalMoney, 0);

    const hoanTienTotal = payments
        .slice(1) // Loại bỏ khoản đầu tiên khỏi danh sách
        .filter((payment) => payment.status === 'HOAN_TIEN')
        .reduce((sum, payment) => sum + payment.totalMoney, 0);

    const chenhLech = traSauTotal - hoanTienTotal;

    return (
        <div style={{ padding: '20px' }}>
            <Card style={{ backgroundColor: 'whitesmoke' }}>
                <Row className="d-flex" style={{ marginBottom: '10px' }}>
                    <Typography.Text strong>
                        <Link to="/home" style={{ color: 'black', textDecoration: 'none', marginRight: 10 }}>
                            Trang chủ
                        </Link>
                    </Typography.Text>
                    <Typography.Text style={{ color: 'black', marginRight: 10 }}>|</Typography.Text>
                    <Typography.Text strong>
                        <Link to="/tracking" style={{ color: 'black', textDecoration: 'none', marginRight: 10 }}>
                            Tra cứu
                        </Link>
                    </Typography.Text>
                    <Typography.Text style={{ color: 'black', marginRight: 10 }}>|</Typography.Text>
                    <Typography.Text>
                        {hoaDon ? (
                            <Link to={`/tracking/${hoaDon.code}`} style={{ color: 'black', textDecoration: 'none', marginRight: 10 }}>
                                {hoaDon.code}
                            </Link>
                        ) : (
                            <Text>Loading...</Text>
                        )}
                    </Typography.Text>
                </Row>
                <Card style={{ marginTop: '20px', backgroundColor: 'white' }}>
                    <Title level={5}>Lịch sử đơn hàng</Title>

                    {/* Kiểm tra hoaDonDetail trước khi truyền props cho TimeLine */}

                    <div className="container overflow-x-auto mb-3">
                        <Timeline
                            minEvents={8}
                            placeholder
                            maxEvents={billHistory.length}
                            style={{ height: "400px" }}
                        >
                            {billHistory.map((item, index) => (
                                <TimelineEvent
                                    key={index}

                                    icon={
                                        // Gọi icon dưới dạng component
                                        listStatus.find(status => status.status === item.status)?.icon || ""
                                    }

                                    color={
                                        // Lấy color từ listStatus
                                        listStatus.find(status => status.status === item.status)?.color || ""
                                    }
                                    title={
                                        // Lấy title từ listStatus
                                        <h6 className="mt-2">
                                            {listStatus.find(status => status.status === item.status)?.title || "Không xác định"}
                                        </h6>
                                    }
                                    subtitle={
                                        <>

                                            {formatNote(item.actionDescription)}
                                            <div className="mt-2">
                                                < FormatDate date={item.createdAt} />
                                            </div>
                                        </>
                                    }
                                />
                            ))}
                        </Timeline>
                    </div>
                </Card>
                <div className="d-flex" style={{ justifyContent: 'flex-end' }}>
                    {hoaDon?.invoiceStatus != 'TAO_HOA_DON' && (
                        <div className="text-end mt-3 mb-2 mx-2 ">
                            <Button
                                type="default"
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #d9d9d9',
                                    backgroundColor: 'blue',
                                    color: 'white',
                                    padding: '5px 20px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                                onClick={() => showModalPayments(true)}
                            >
                                Lịch sử
                            </Button>
                        </div>
                    )}

                    {hoaDon?.invoiceStatus == 'CHO_XAC_NHAN' && (
                        <div className="text-end mt-3 mb-2 ">
                            <Button
                                type="default"
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #d9d9d9',
                                    backgroundColor: 'blue',
                                    color: 'white',
                                    padding: '5px 20px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                                onClick={() => showModalAdress(true)}
                            >
                                Thay đổi địa chỉ
                            </Button>
                        </div>
                    )}
                </div>
                <Card style={{ marginTop: '10px', backgroundColor: 'white' }}>
                    <Title level={5}>ĐỊA CHỈ NHẬN HÀNG</Title>
                    <Text>Tên người nhận : {hoaDon?.recipientName}</Text>
                    <br />
                    <Text>Số điện thoại: {hoaDon?.recipientPhone}</Text>
                    <br />
                    <Text>Địa chỉ nhận hàng :{hoaDon?.address}</Text>
                    <br />

                </Card>
                {hoaDon?.invoiceStatus == 'CHO_XAC_NHAN' && (
                    <div className="text-end mt-3 mb-2 ">
                        <Button
                            type="default"
                            style={{
                                borderRadius: '8px',
                                border: '1px solid #d9d9d9',
                                backgroundColor: 'blue',
                                color: 'white',
                                padding: '5px 20px',
                                fontSize: '14px',
                                fontWeight: '500',
                                textAlign: 'center',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            onClick={() => showModalProduct(true)}
                        >
                            Thêm sản phẩm
                        </Button>
                    </div>
                )}
                <Card style={{ backgroundColor: 'white' }}>
                    {hoaDon ? (
                        <div>
                            {hoaDonDetail.map((chiTiet, index) => (
                                <div key={index} className="d-flex align-items-center justify-content-between" style={{ marginBottom: '70px' }}>
                                    <div className="d-flex">
                                        {/* Carousel cho hình ảnh sản phẩm */}
                                        <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ height: '100px', width: '100px' }}>
                                            {chiTiet?.productDetail?.images?.map((anh, subIndex) => (
                                                <div key={`${index}-${subIndex}`} className="image-container" >
                                                    <img src={anh.url} alt="images" className="object-fit-cover" style={{ borderRadius: '10px' }} />
                                                    {chiTiet?.promotion !== 0 ? (
                                                        <p className="discount-badge">
                                                            {-chiTiet?.promotion}%
                                                        </p>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </Carousel>

                                        <div className="mx-4">
                                            <Text strong style={{ fontSize: '18px' }}>
                                                {chiTiet?.productDetail?.product?.name}{" "}
                                                {chiTiet?.productDetail?.brand?.name}{" "}
                                                "{chiTiet?.productDetail?.collar?.name}"{" "}
                                                "{chiTiet?.productDetail?.sleeve?.name}"
                                            </Text>
                                            <br />
                                            <Text style={{ fontSize: '14px' }}>
                                                Phân loại hàng: {chiTiet?.productDetail?.color?.name}{", "}
                                                {chiTiet?.productDetail?.size?.name}{" "}
                                            </Text> <br />
                                            <Text style={{ fontSize: '14px' }}>
                                                {chiTiet.promotion !== 0 ? (
                                                    <>
                                                        <span style={{
                                                            color: 'red',
                                                            fontWeight: 'bold',
                                                            fontSize: '16px',
                                                            display: 'inline-block',
                                                            verticalAlign: 'top' // Căn chỉnh lên trên
                                                        }}>
                                                            <FormatCurrency value={chiTiet.price * (1 - chiTiet.promotion / 100)} />
                                                        </span>
                                                        <span style={{
                                                            color: 'black',
                                                            textDecoration: 'line-through',
                                                            fontSize: '12px',
                                                            marginLeft: '5px', // Khoảng cách với giá mới
                                                            verticalAlign: 'top' // Căn chỉnh lên trên
                                                        }}>
                                                            <FormatCurrency value={chiTiet.price} />
                                                        </span>
                                                    </>
                                                ) : (
                                                    <FormatCurrency value={chiTiet.price} />
                                                )}
                                            </Text>
                                            <br />
                                            <Text style={{ fontSize: '14px' }}>
                                                X{chiTiet?.quantity}
                                            </Text>


                                        </div>
                                    </div>
                                    <div>
                                        <Row>
                                            <Col>
                                                <InputNumber
                                                    min={1} // Số lượng tối thiểu là 1
                                                    max={chiTiet.productDetail?.quantity} // Giới hạn số lượng tối đa
                                                    value={chiTiet.quantity} // Giá trị hiện tại
                                                    onChange={(value) => handleQuantityChange(value, index)} // Cập nhật số lượng
                                                    disabled={hoaDon?.invoiceStatus !== 'CHO_XAC_NHAN'} // Vô hiệu hóa khi không phải 'CHO_XAC_NHAN'
                                                />
                                            </Col>
                                        </Row>


                                    </div>
                                    <div>
                                        <Text style={{ fontSize: '14px' }}>
                                            {chiTiet.promotion !== 0 ? (
                                                <>
                                                    <span style={{
                                                        color: 'red',
                                                        fontWeight: 'bold',
                                                        fontSize: '16px',
                                                        display: 'inline-block',
                                                        verticalAlign: 'top' // Căn chỉnh lên trên
                                                    }}>
                                                        <FormatCurrency value={chiTiet.price * (1 - chiTiet.promotion / 100)} />
                                                    </span>
                                                    <span style={{
                                                        color: 'black',
                                                        textDecoration: 'line-through',
                                                        fontSize: '12px',
                                                        marginLeft: '5px', // Khoảng cách với giá mới
                                                        verticalAlign: 'top' // Căn chỉnh lên trên
                                                    }}>
                                                        <FormatCurrency value={chiTiet.price} />
                                                    </span>
                                                </>
                                            ) : (
                                                <FormatCurrency value={chiTiet.price} />
                                            )}
                                        </Text>
                                    </div>

                                    <div>
                                        <Col>
                                            {hoaDonDetail.length > 1 && ( // Hiển thị nút xóa nếu danh sách có nhiều hơn 1 sản phẩm
                                                <IconButton color="error" onClick={() => handleDeleteItem(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Col>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Đang tải dữ liệu...</p>
                    )}

                    <hr />
                    <Alert
                        type="warning"
                        showIcon
                        message={
                            <Row>
                                <Col>
                                    <Text>
                                        {payments.length === 1 && payments[0].status === 'TRA_SAU' && payments[0].method === 'TIEN_MAT' ? (
                                            <>
                                                Trả  sau <Text style={{ color: "red" }} strong>
                                                    <FormatCurrency value={payments[0].totalMoney} />
                                                </Text> bằng tiền mặt
                                            </>
                                        ) : payments.length > 1 && payments[0].status === 'TRA_SAU' && payments[0].method === 'TIEN_MAT' ? (
                                            <>
                                                Trả  sau<Text style={{ color: "red" }} strong>
                                                    <FormatCurrency value={payments[0].totalMoney} />
                                                </Text> bằng tiền mặt
                                            </>
                                        ) : payments.length > 1 && payments[0].status === 'DA_THANH_TOAN' && payments[0].method === 'CHUYEN_KHOAN' ? (
                                            <>
                                                <Text>
                                                    Đã trả <Text style={{ color: "red" }} strong>
                                                        <FormatCurrency value={payments[0].totalMoney} />
                                                    </Text> bằng phí VNPay,
                                                    {chenhLech > 0 && (
                                                        <> và trả thêm <Text style={{ color: "red" }} strong>
                                                            <FormatCurrency value={chenhLech} />
                                                        </Text> bằng tiền mặt </>
                                                    )}
                                                    {chenhLech < 0 && (
                                                        <> và được hoàn trả <Text style={{ color: "red" }} strong>
                                                            <FormatCurrency value={Math.abs(chenhLech)} />
                                                        </Text> bằng phí VNPay </>
                                                    )}

                                                </Text>
                                            </>
                                        ) : payments.length === 1 && payments[0].status === 'DA_THANH_TOAN' && payments[0].method === 'CHUYEN_KHOAN' ? (
                                            <>
                                                Đã trả <Text style={{ color: "red" }} strong>
                                                    <FormatCurrency value={payments[0].totalMoney} />
                                                </Text> bằng phí VNPay
                                            </>
                                        ) : null}
                                    </Text>
                                </Col>
                            </Row>
                        }
                        style={{
                            backgroundColor: '#fff9f0', // Màu nền nhạt
                            border: '1px solid #ffe58f', // Màu viền nhẹ
                            borderRadius: '8px', // Bo góc
                            padding: '12px',
                            fontSize: '14px',
                        }}
                    />
                    <div className="text-end my-5">
                        <Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>Thông tin đơn hàng</Title>

                        <Row gutter={16} style={{ marginBottom: '10px' }}>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Tổng tiền hàng:</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'left' }}>
                                <Text strong><FormatCurrency value={hoaDon?.totalMoney} /></Text>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginBottom: '10px' }}>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Phí Ship:</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'left' }}>
                                <Text strong><FormatCurrency value={hoaDon?.shippingFee} /></Text>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginBottom: '10px' }}>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Voucher:</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'left' }}>
                                <Text strong>
                                    {hoaDon?.voucher?.discountMethod === 'PHAN_TRAM' ? (
                                        `${hoaDon?.voucher?.discountValue}%`
                                    ) : (
                                        <FormatCurrency value={hoaDon?.voucher?.discountValue} />
                                    )}
                                </Text>
                            </Col>

                        </Row>

                        <Row gutter={16} style={{ marginBottom: '10px' }}>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Tổng thanh toán:</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'left' }}>
                                <Text strong>
                                    <FormatCurrency value={hoaDon?.totalMoney + hoaDon?.shippingFee - hoaDon?.discountAmount} />
                                </Text>
                            </Col>

                        </Row>
                    </div>

                    <div className="text-center">
                        {(hoaDon?.invoiceStatus == 'CHO_XAC_NHAN' || hoaDon?.invoiceStatus == 'XAC_NHAN'
                            || hoaDon?.invoiceStatus == 'CHO_VAN_CHUYEN') && (
                                <Button
                                    type="default"
                                    style={{
                                        borderRadius: '8px',
                                        border: '1px solid #d9d9d9',
                                        backgroundColor: 'blue',
                                        color: 'white',
                                        padding: '5px 20px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        textAlign: 'center',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onClick={() => showModalCancelBill(true)}
                                >
                                    Hủy đơn
                                </Button>
                            )}


                        {hoaDon?.invoiceStatus == 'CHO_XAC_NHAN' && (
                            <Button
                                type="default"
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #d9d9d9',
                                    backgroundColor: 'blue',
                                    color: 'white',
                                    marginLeft: '15px',
                                    padding: '5px 20px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                                onClick={() => showModalCResetOrder(true)}

                            >
                                Xác nhận
                            </Button>
                        )}

                    </div>
                    
                    {/* Modal của đặt lại */}
                    <Modal
                        title={
                            "Thông tin đơn hàng đặt lại"
                        }
                        open={isModalResetOrder}
                        onCancel={handleCancelResetOrder}
                        footer={
                            <Button onClick={handleResetBill} form="formNote" type="primary" htmlType="submit">
                                Xác nhận
                            </Button>
                        }
                    >
                        <Form
                            id="formNote"
                            form={form}
                         
                            layout="vertical"
                            style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                        >
                            <Row gutter={[16, 16]}>
                                {/* Tổng tiền hàng */}
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text style={{ fontSize: '16px' }}>Tổng tiền hàng gốc:</Text>
                                </Col>
                                <Col span={12} style={{ textAlign: 'left' }}>
                                    <Text strong style={{ fontSize: '16px' }}>
                                        <FormatCurrency value={hoaDon?.totalMoney} />
                                    </Text>
                                </Col>

                                {/* Phí Ship */}
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text style={{ fontSize: '16px' }}>Phí Ship:</Text>
                                </Col>
                                <Col span={12} style={{ textAlign: 'left' }}>
                                    <Text strong style={{ fontSize: '16px' }}>
                                        <FormatCurrency value={hoaDon?.shippingFee} />
                                    </Text>
                                </Col>

                                {/* Giảm giá */}
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text style={{ fontSize: '16px' }}>Voucher áp dụng:</Text>
                                </Col>
                                <Col span={12} style={{ textAlign: 'left' }}>
                                    <Text strong style={{ fontSize: '16px' }}>
                                        {hoaDon?.voucher?.discountMethod === 'PHAN_TRAM' ? (
                                            `${hoaDon?.voucher?.discountValue}%`
                                        ) : (
                                            <FormatCurrency value={hoaDon?.voucher?.discountValue} />
                                        )}

                                    </Text>
                                </Col>

                                {/* Tổng thanh toán */}
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text style={{ fontSize: '16px' }}>Tổng tiền thanh toán:</Text>
                                </Col>
                                <Col span={12} style={{ textAlign: 'left' }}>
                                    <Text strong style={{ fontSize: '18px' }}>
                                        <FormatCurrency value={hoaDon?.totalMoney + hoaDon?.shippingFee - hoaDon?.discountAmount} />

                                    </Text>
                                </Col>

                                {/* Tổng số tiền   */}
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text style={{ fontSize: '16px' }}>Tổng tiền gốc sau đặt lại:</Text>
                                </Col>
                                <Col span={12} style={{ textAlign: 'left' }}>
                                    <Text strong style={{ fontSize: '18px' }}>
                                        <FormatCurrency value={tongTienDatLai} />
                                    </Text>
                                </Col>

                                {/* Phí ship mới  */}
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text style={{ fontSize: '16px' }}>Phí ship mới:</Text>
                                </Col>
                                <Col span={12} style={{ textAlign: 'left' }}>
                                    <Text strong style={{ fontSize: '18px' }}>
                                        <FormatCurrency value={shippingFeeNew} />
                                    </Text>
                                </Col>


                                {/* Vochẻr mới áp dụng cho khách  */}
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text style={{ fontSize: '16px' }}>Voucher mới ưu đãi:</Text>
                                </Col>
                                <Col span={12} style={{ textAlign: 'left' }}>
                                    <Text strong style={{ fontSize: '18px' }}>
                                        {
                                            //Tjh 1 voucher cũ tồn tại và vẫn áp dụng được cho tongTienSau Dạt thì dùng nó luôn
                                            hoaDon?.voucher != null && tongTienDatLai > hoaDon?.voucher.minOrderValue && tongTienDatLai < hoaDon?.voucher.maxDiscountValue ?

                                                hoaDon?.voucher.discountMethod === 'PHAN_TRAM' ? (
                                                    `${hoaDon?.voucher.discountValue}%`
                                                ) : (
                                                    <FormatCurrency value={hoaDon?.voucher.discountValue} />
                                                )
                                                : voucherNew.discountMethod === 'PHAN_TRAM' ? (
                                                    `${voucherNew.discountValue}%`
                                                ) : (
                                                    <FormatCurrency value={voucherNew.discountValue} />
                                                )
                                        }

                                    </Text>
                                </Col>


                                {/* Tổng tiền thanh toán mới sau khi áp dụng voucher */}
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>Tổng tiền thanh toán mới</Text>
                                </Col>

                                <Col span={12} style={{ textAlign: 'left' }}>
                                    <Text strong style={{ fontSize: '18px' }}>

                                        {
                                            tongTienDatLai != 0 && hoaDon?.voucher != null && tongTienDatLai > hoaDon?.voucher.minOrderValue && tongTienDatLai < hoaDon?.voucher.maxDiscountValue ?


                                                hoaDon?.voucher.discountMethod === 'PHAN_TRAM' ? (
                                                    <FormatCurrency value={tongTienDatLai + shippingFeeNew - (tongTienDatLai * (hoaDon?.voucher.discountValue / 100))} />
                                                ) : (
                                                    <FormatCurrency value={tongTienDatLai + shippingFeeNew - hoaDon?.voucher.discountValue} />
                                                )
                                                :
                                                voucherNew.discountMethod === 'PHAN_TRAM' ? (
                                                    <FormatCurrency value={tongTienDatLai + shippingFeeNew - (tongTienDatLai * (voucherNew.discountValue / 100))} />
                                                ) : (
                                                    <FormatCurrency value={tongTienDatLai + shippingFeeNew - voucherNew.discountValue} />
                                                )
                                        }
                                    </Text>
                                </Col>
                            </Row>
                        </Form>

                    </Modal>

                    {/* Modal của hủy hóa đơn  */}
                    <Modal
                        title={
                            "Hủy hóa đơn"
                        }
                        open={isModalCancelBill}
                        onCancel={handleCancelBill}
                        footer={
                            <Button form="formNote" type="primary" htmlType="submit">
                                Xác nhận
                            </Button>
                        }
                    >
                        <Form
                            id="formNote"
                            onFinish={handleCancelBillStatus}
                            form={form}
                            layout="vertical" // Điều chỉnh layout cho đẹp hơn
                        >
                            <Form.Item
                                name="note"
                                label="Lí do"
                                rules={[
                                    { required: true, message: "Ghi chú không được để trống!" },
                                    { min: 20, message: "Ghi chú phải có ít nhất 20 ký tự!" }, // Thêm quy tắc kiểm tra độ dài
                                ]}
                            >
                                <TextArea placeholder="Nhập lí do..." rows={4} />
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* Modal của thêm sản phẩm */}
                    <Modal
                        title="Thêm sản phẩm"
                        open={isModalProduct}  // Sử dụng giá trị state là true/false để điều khiển modal
                        onCancel={handleCancelProduct}
                        footer={[
                            <Button key="cancel" onClick={handleCancelProduct}>
                                Hủy
                            </Button>,

                        ]}
                        width="70%" // Cập nhật chiều rộng modal xuống 70%
                    >
                        <Row gutter={[16, 16]} align="middle" justify="space-between" wrap className="d-flex mt-2 mb-4 ">
                            <Col flex="auto">
                                <Search
                                    placeholder="Tìm kiếm theo tên sản phẩm"
                                    value={searchValueSCT}
                                    onChange={(e) => setSearchValueSCT(e.target.value)}
                                    enterButton={<Button type="primary" icon={<SearchOutlined />} onClick={searchSPCT} />}
                                    style={{ width: '100%', marginTop: '28px' }}
                                />
                            </Col>

                            <Col flex="auto">
                                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Giá</div>
                                <Select
                                    placeholder="Chọn giá"
                                    value={filterPrice}
                                    onChange={handlePriceChange}
                                    style={{ width: '100%' }}
                                >
                                    <Select.Option value="All">Tất cả</Select.Option>
                                    <Select.Option value="1-300000">Dưới 300đ</Select.Option>
                                    <Select.Option value="300000-700000">Từ 300đ đến 700đ</Select.Option>
                                    <Select.Option value="700000-1000000">Trên 700đ</Select.Option>
                                </Select>
                            </Col>

                            <Col flex="auto">
                                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Chất liệu</div>
                                <Select
                                    placeholder="Chọn chất liệu"
                                    value={selectedChatLieu}
                                    onChange={handleChatLieu}
                                    style={{ width: '100%' }}
                                >
                                    <Select.Option value="All">Tất cả</Select.Option>
                                    {chatLieu.map((cl) => (
                                        <Select.Option key={cl.id} value={cl.id}>
                                            {cl.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>

                            <Col flex="auto">
                                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Màu sắc</div>
                                <Select
                                    placeholder="Chọn màu sắc"
                                    value={selectedMauSac}
                                    onChange={handleMauSac}
                                    style={{ width: '100%' }}
                                >
                                    <Select.Option value="All">Tất cả</Select.Option>
                                    {mauSac.map((ms) => (
                                        <Select.Option key={ms.id} value={ms.id}>
                                            {ms.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>

                            <Col flex="auto">
                                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Kích cỡ</div>
                                <Select
                                    placeholder="Chọn kích cỡ"
                                    value={selectedKichCo}
                                    onChange={handleKichCo}
                                    style={{ width: '100%' }}
                                >
                                    <Select.Option value="All">Tất cả</Select.Option>
                                    {kichCo.map((kc) => (
                                        <Select.Option key={kc.id} value={kc.id}>
                                            {kc.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>

                            <Col flex="auto">
                                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Thương hiệu</div>
                                <Select
                                    placeholder="Chọn thương hiệu"
                                    value={selectedThuongHieu}
                                    onChange={handleThuongHieu}
                                    style={{ width: '100%' }}
                                >
                                    <Select.Option value="All">Tất cả</Select.Option>
                                    {thuongHieu.map((th) => (
                                        <Select.Option key={th.id} value={th.id}>
                                            {th.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>


                        <Form
                            id="formNote"
                            form={form}
                            style={{ width: '102%' }}  // Đảm bảo Form có chiều rộng 100% của modal
                            layout="vertical"  // Điều chỉnh layout cho đẹp hơn
                            onFinish={handleCancelBillStatus}
                        >
                            <Table
                                style={{ width: '100%' }}  // Đảm bảo bảng chiếm toàn bộ chiều rộng của modal
                                columns={columns}
                                dataSource={searchSPCT}
                                pagination={{
                                    pageSize: pageSize,
                                    current: currentPage,
                                    pageSizeOptions: [5, 10, 20, 50, 100],
                                    onChange: handleChangePage,
                                    showSizeChanger: true,
                                    onShowSizeChange: handlePageSizeChange,
                                }}
                                rowKey="id"
                                scroll={{ x: 'max-content', y: 400 }} // Cuộn ngang và dọc nếu bảng lớn
                            />
                        </Form>
                    </Modal>

                    {/* Modal của chọn sản phẩm  */}
                    <Modal
                        title={
                            "Số lượng sản phẩm"
                        }
                        open={isModalClickProduct}
                        onCancel={handleCancelClickProduct}
                        footer={[
                            <Button key="cancel" onClick={handleCancelClickProduct}>
                                Hủy
                            </Button>,
                            <Button form="formNote" onClick={handleSubmitProduct} type="primary" htmlType="submit">
                                Xác nhận
                            </Button>,
                        ]}
                    >
                        <Form
                            id="formNote"
                            onFinish={handleCancelClickProduct}
                            form={form}
                            layout="vertical" // Điều chỉnh layout cho đẹp hơn
                        >
                            <Form form={form} layout="vertical">
                                <Form.Item
                                    label="Số lượng"
                                    name="quantity"
                                    rules={[
                                        { required: true, message: "Số lượng không được để trống!" },
                                    ]}
                                >
                                    <InputNumber
                                        min={1}  // Bạn có thể thêm giá trị tối thiểu, ví dụ là 1
                                        placeholder="Nhập số lượng"
                                        style={{ width: '100%' }} // Để làm cho InputNumber có độ rộng như các trường khác
                                    />
                                </Form.Item>
                            </Form>

                        </Form>
                    </Modal>


                    {/* Modal của thay đổi địa chỉ  */}
                    <Modal
                        title={
                            "Thông tin địa chỉ"
                        }
                        open={isModalAdress}
                        onCancel={handleCancelAdress}
                        footer={[
                            <Button key="cancel" onClick={handleCancelAdress}>
                                Hủy
                            </Button>,
                            <Button form="formNote" onClick={updateDiaChi} type="primary" htmlType="submit">
                                Thay đổi
                            </Button>,
                        ]}
                    >
                        <Form

                            id="formNote"
                            onFinish={handleCancelAdress}
                            form={form}
                            layout="vertical" // Điều chỉnh layout cho đẹp hơn
                        >
                            <Form layout="vertical" form={form} >
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item label="Họ và Tên" required>
                                            <Input
                                                value={hoTen || undefined}
                                                onChange={(e) => setHoTen(e.target.value)}
                                                placeholder="Nhập họ tên"
                                            />
                                            {errors.hoTen && <div style={{ color: 'red' }}>{errors.hoTen}</div>}
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Số Điện Thoại" required>
                                            <Input
                                                value={soDienThoai || undefined}
                                                onChange={(e) => setSoDienThoai(e.target.value)}
                                                placeholder="Nhập số điện thoại"
                                            />
                                            {errors.soDienThoai && <div style={{ color: 'red' }}>{errors.soDienThoai}</div>}
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Địa Chỉ Cụ Thể" required>
                                            <Input
                                                onChange={(e) => setDiaChiCuThe(e.target.value)}
                                                value={diaChiCuThe || undefined}
                                                placeholder="Nhập địa chỉ cụ thể"
                                            />
                                            {errors.diaChiCuThe && <div style={{ color: 'red' }}>{errors.diaChiCuThe}</div>}
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item label="Thành phố" rules={[{ required: true, message: 'Thành phố không được để trống!' }]}>
                                            <Select
                                                name="thanhPho"
                                                showSearch
                                                placeholder="Chọn thành phố"
                                                value={selectedProvince || undefined}
                                                onChange={(value) => {
                                                    setThanhPho(value);
                                                    handleProvinceChange(value);
                                                }}
                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}

                                            >
                                                {provinces.map((province) => (
                                                    <Select.Option key={province.ProvinceID} value={province.ProvinceID}>
                                                        {province.ProvinceName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="Huyện" rules={[{ required: true, message: "Huyện không được để trống!" }]}>
                                            <Select
                                                name="huyen"
                                                showSearch
                                                placeholder="Chọn huyện"
                                                value={selectedDistrict || undefined}
                                                onChange={handleDistrictChange}
                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                            >
                                                {districts.map((district) => (
                                                    <Select.Option key={district.DistrictID} value={district.DistrictID}>
                                                        {district.DistrictName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="Phường" rules={[{ required: true, message: "Phường không được để trống!" }]}>
                                            <Select
                                                name="phuong"
                                                showSearch
                                                placeholder="Chọn phường"
                                                value={phuong || undefined}
                                                onChange={handleWardChange}
                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                            >
                                                {wards.map((ward) => (
                                                    <Select.Option key={ward.WardCode} value={ward.WardCode}>
                                                        {ward.WardName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                </Row>
                                <Form.Item label="Phí vận chuyển mới">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Input
                                            name="shippingFee"
                                            value={shippingFee === 0 ? "Miễn phí vận chuyển" : FormatCurrency({ value: shippingFee })} // Gọi hàm và truyền giá trị
                                            onChange={(e) => setShippingFee(e.target.value)} // Lưu giá trị số trong state
                                            disabled
                                            style={{ height: '32px' }}
                                        />
                                    </div>
                                </Form.Item>

                            </Form>

                        </Form>

                    </Modal>


                    {/* Modal của lịch sử thanh toán */}
                    <Modal
                        title="Lịch sử thanh toán"
                        open={isModalPayments}
                        onCancel={handleCancelPayments}
                        footer={[
                            <Button key="cancel" onClick={handleCancelPayments} style={{ fontSize: '16px', padding: '10px 20px' }}>
                                Thoát
                            </Button>
                        ]}
                        style={{ fontSize: '16px' }}  // Tăng kích thước font cho modal
                        width={800}  // Điều chỉnh độ rộng modal
                    >
                        <Form
                            id="formNote"
                            onFinish={handleCancelPayments}
                            form={form}
                            layout="vertical"
                            style={{ width: '100%' }}  // Đảm bảo Form có chiều rộng 100% của modal
                        >
                            <Table
                                style={{ width: '100%' }}
                                columns={columnsPayments}
                                dataSource={payments}
                                rowKey="createAt"
                                pagination={false}
                                className="bill-history-table"
                                size="middle"  // Tăng kích thước của bảng
                            />
                        </Form>
                    </Modal>


                </Card>
            </Card>
            <ToastContainer />
        </div>
    );
};

export default TrackingDetail;
