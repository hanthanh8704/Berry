
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
import { detailKH, getAllByPublic, selectedPhieuGiamGia, updateDiaChi, createDiaChi, selectedDC, thanhToan }
    from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { Form, Input, Select, Button, Radio, Typography, Row, Col, Divider, Carousel, Pagination } from 'antd';
import './checkout.css';
const { Option } = Select;
const { Title, Text } = Typography;
import { Modal } from 'react-bootstrap';
import { Modal as AntdModal, message } from 'antd';
// import { ToastContainer, toast } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import * as request from 'views/utilities/httpRequest';
import { number } from 'prop-types';

const configApi = {
    headers: {
        "Content-Type": "application/json",
        "Token": "693d8a79-3a3d-11ef-8e53-0a00184fe694",
        "ShopId": 192796,
    },
};

const CheckOut = () => {

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
            console.log("Using existing customer dddddddddd:", { customerId, customerName });
        }
    }, []);


    const [thanhPhoDiaChi, setThanhPhoDiaChi] = useState(null);
    const [huyenDiaChi, setHuyenDiaChi] = useState(null);
    const [phuongDiaChi, setPhuongDiaChi] = useState(null);

    const [provincesDiaChi, setProvincesDiaChi] = useState([]);
    const [districtsDiaChi, setDistrictsDiaChi] = useState([]);
    const [wardsDiaChi, setWardsDiaChi] = useState([]);

    const [gioHang, setGioHang] = useState({});
    const [khachHang, setKhachHang] = useState(null);
    const location = useLocation();
    const [dataAddress, setDataAddress] = useState(null);

    const [thanhPho, setThanhPho] = useState(null);
    const [email, setEmail] = useState(null);
    const [huyen, setHuyen] = useState(null);
    const [phuong, setPhuong] = useState(null);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const [selectedProvinceName, setSelectedProvinceName] = useState(null);
    const [selectedDistrictName, setSelectedDistrictName] = useState(null);
    const [selectedWardName, setSelectedWardName] = useState(null);

    const [phieuGiamGiaDetail, setPhieuGiamGiaDetail] = useState();
    const [form] = Form.useForm();
    const [hoTen, setHoTen] = useState('');
    const [phone, setPhone] = useState('');
    const [diaChiCuThe, setDiaChiCuThe] = useState('');
    const [ghiChu, setGhiChu] = useState('');
    const [errors, setErrors] = useState({
        hoTen: '',
        phone: '',
        diaChiCuThe: '',
        thanhPho: '',
        huyen: '',
        phuong: '',
        email: ''
    });



    const navigate = useNavigate(); // Sử dụng hook useNavigate


    //Call api phí vận chuyển 
    const [shippingFee, setShippingFee] = useState(null);
    const [tongTien, setTongTien] = useState(0);
    const [giamGia, setGiamGia] = useState(0);
    const [tongTienThanhToan, setTongTienThanhToan] = useState(0);

    const sizeAttributes = {
        XS: { length: 18, width: 14, height: 5 },
        S: { length: 20, width: 15, height: 5 },
        M: { length: 25, width: 20, height: 5 },
        L: { length: 30, width: 25, height: 5 },
        XL: { length: 35, width: 30, height: 5 },
        XXL: { length: 40, width: 35, height: 5 },
        XXXL: { length: 45, width: 40, height: 5 },
        XXXXL: { length: 50, width: 45, height: 5 }
    };

    const [weightTong, setWeightTong] = useState(0);
    const [lengthTong, setLengthTong] = useState(0);
    const [widthTong, setWidthTong] = useState(0);
    const [heightTong, setHeightTong] = useState(0);

    useEffect(() => {
        let totalWeight = 0;
        let totalLength = 0;
        let totalWidth = 0;
        let totalHeight = 0;

        gioHang?.listCartDetails?.forEach(item => {
            const weight = item.productDetail?.weight;
            const { length, width, height } = sizeAttributes[item.productDetail?.size.name] || {};
            if (weight) {
                totalWeight += weight * item.quantity;
                totalLength = length;
                totalWidth = width;
                totalHeight = height;
            }
        });

        setWeightTong(totalWeight);
        setLengthTong(totalLength);
        setWidthTong(totalWidth);
        setHeightTong(totalHeight);
    }, [gioHang.listCartDetails]);


    const configApiShip = {
        headers: {
            "Content-Type": "application/json",
            Token: "7193b816-920d-11ef-9ced-968cd2ac9a7e", // Sử dụng token hợp lệ
            ShopId: 5411273
        },
    };

    useEffect(() => {
        const fetchShippingFee = async () => {
            if (tongTien >= 1000000) {
                setShippingFee(0); // Miễn phí ship
            } else if (huyen) {
                const data = {
                    service_id: 53320,
                    insurance_value: tongTien,
                    coupon: null,
                    from_district_id: 1488,
                    to_district_id: Number(huyen),
                    weight: weightTong,
                    length: lengthTong,
                    width: widthTong,
                    height: heightTong
                };

                console.log('Data being sent to API:', data);
                console.log("Token being sent:", configApiShip.headers.Token);

                try {
                    const response = await axios.post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee", data, configApiShip);
                    console.log('API Responsezzzzzzzzzzzzzzzzzzzzzzzzzzzzz:', response.data);
                    if (response.data && response.data.data) {
                        setShippingFee(response.data.data.total);
                    } else {
                        console.error('Invalid shipping fee data:', response.data);
                    }
                } catch (error) {
                    if (error.response) {
                        console.error('API Error Response:', error.response.data);
                    } else {
                        console.error('Unknown API Error:', error);
                    }
                }
            }
        };

        fetchShippingFee();
    }, [huyen, tongTien, weightTong, lengthTong, widthTong, heightTong]);


    // Tính tổng tiền thanh toán
    useEffect(() => {
        if (!phieuGiamGiaDetail) {
            // Nếu phieuGiamGiaDetail là undefined, không thực hiện gì cả
            setTongTienThanhToan(tongTien + shippingFee);
            return;
        }

        let giamGia = 0;

        // Kiểm tra hình thức giảm giá có phải là giảm theo phần trăm không
        if (phieuGiamGiaDetail.discountMethod === 'Giảm theo phần trăm') {
            // Tính giảm giá theo phần trăm
            giamGia = (tongTien * phieuGiamGiaDetail.discountValue) / 100;
        } else {
            // Nếu không phải giảm theo phần trăm, có thể là giảm giá trực tiếp
            giamGia = phieuGiamGiaDetail.discountValue;
        }


        // Tính tổng tiền thanh toán (tổng tiền - giảm giá + phí ship)
        setTongTienThanhToan(tongTien - giamGia + shippingFee);
    }, [tongTien, shippingFee, phieuGiamGiaDetail]);


    //Call dịa chi 
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await request.get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", configApi);
                if (Array.isArray(response.data)) {
                    setProvinces(response.data);
                    setProvincesDiaChi(response.data);
                } else {
                    console.error('Invalid provinces data:', response.data);
                }
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchProvinces();
    }, []);

    const fetchDistricts = async (provinceId, setDistrictsFunc) => {
        try {
            const response = await request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`, configApi);
            if (Array.isArray(response.data)) {
                setDistrictsFunc(response.data);
            } else {
                console.error('Invalid districts data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const fetchWards = async (districtId, setWardsFunc) => {
        try {
            const response = await request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`, configApi);
            if (Array.isArray(response.data)) {
                setWardsFunc(response.data);
            } else {
                console.error('Invalid wards data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    useEffect(() => {
        const selectedProvinceId = thanhPho || thanhPhoDiaChi;
        if (selectedProvinceId) {
            fetchDistricts(selectedProvinceId, (data) => {
                setDistricts(data);
                setDistrictsDiaChi(data);
            });
        }
    }, [thanhPho, thanhPhoDiaChi]);

    useEffect(() => {
        if (huyen || huyenDiaChi) {
            const selectedDistrictId = huyen || huyenDiaChi;
            fetchWards(selectedDistrictId, (data) => {
                setWards(data);
                setWardsDiaChi(data);
            });
        }
    }, [huyen, huyenDiaChi]);

    const handleProvinceChange = (provinceCode) => {
        setThanhPho(provinceCode);
        setHuyen(null);
        setPhuong(null);

        fetchDistricts(provinceCode, setDistricts);
    };

    const handleDistrictChange = (districtCode) => {
        setHuyen(districtCode);
        setPhuong();
        fetchWards(districtCode, setWards);
    };

    const handleWardChange = (wardCode) => {
        setPhuong(wardCode);
    };

    const handleProvinceChangeDiaChi = (provinceCode) => {
        setThanhPhoDiaChi(provinceCode);
        setHuyenDiaChi(null);
        setPhuongDiaChi(null);
        fetchDistricts(provinceCode, setDistrictsDiaChi);
    };

    const handleDistrictChangeDiaChi = (districtCode) => {
        setHuyenDiaChi(districtCode);
        setPhuongDiaChi(null);
        fetchWards(districtCode, setWardsDiaChi);
    };

    const handleWardChangeDiaChi = (wardCode) => {
        setPhuongDiaChi(wardCode);
    };


    useEffect(() => {
        if (dataAddress) {
            dataAddress({
                thanhPho: selectedProvince,
                huyen: selectedDistrict,
                phuong: selectedWard,
            });
        }
    }, [selectedProvince, selectedDistrict, selectedWard, dataAddress]);

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
                setSelectedProvinceName(selectedProvince.ProvinceName);
            }
        }

        // Xử lý huyện
        if (huyen && districts.length > 0) {
            const selectedDistrict = districts.find(district => district.DistrictID === Number(huyen));
            if (selectedDistrict) {
                setSelectedDistrictName(selectedDistrict.DistrictName);
            }
        }

        // Xử lý phường
        if (phuong && wards.length > 0) {
            const selectedWard = wards.find(ward => ward.WardCode === String(phuong));
            if (selectedWard) {
                setSelectedWardName(selectedWard.WardName);
            }
        }
    }, [thanhPho, huyen, phuong, provinces, districts, wards]);


    useEffect(() => {
        fetchGioHang();
    }, []);

    const fetchGioHang = () => {
        const gioHangAo = location.state?.gioHangAo || {};
        console.log('Giỏ hàng ảo từ location.state:', gioHangAo);

        if (gioHangAo && Array.isArray(gioHangAo.listCartDetails) && gioHangAo.listCartDetails.length > 0) {
            setGioHang(gioHangAo);

            setHoTen(gioHangAo.customer.fullName);
            setPhone(gioHangAo.customer.phoneNumber);

            console.log('Ho ten khach hang la ', gioHangAo.customer.fullName)
            console.log('SDT khach hang', gioHangAo.customer.phoneNumber)

            console.log('Giỏ hàng ảo lấy location.state:', gioHang);

            // Tính tổng giá trị sản phẩm
            const total = gioHangAo.listCartDetails.reduce((acc, item) => {
                const gia = item.productDetail.discountPrice === 0
                    ? item.productDetail.price * item.quantity
                    : item.productDetail.discountPrice * item.quantity;
                return acc + gia;
            }, 0);

            // const total = gioHangAo.listGioHangChiTiet.reduce((acc, item) => {
            //     const gia = item.chiTietSanPham.giaBan * item.soLuong
            //     return acc + gia;
            // }, 0);
            console.log("Tổng giá trị sản phẩm:", total);
            setTongTien(total);

            // Tính tổng giá trị giảm giá
            const totalDiscount = gioHangAo.listCartDetails.reduce((acc, item) => {
                const giamGiaSanPham = (item.productDetail.price - (item.productDetail.discountPrice || item.productDetail.price)) * item.quantity;
                return acc + giamGiaSanPham;
            }, 0);
            console.log("Tổng giảm giá:", totalDiscount);
            setGiamGia(totalDiscount);
        }
    };


    //Detail KH 
    const detail = () => {
        if (gioHang && gioHang.customer && gioHang.customer?.id) {
            detailKH(gioHang.customer?.id)
                .then(response => {
                    setKhachHang(response.data); // Set data của khách hàng
                    setEmail(response.data.email);
                    console.log("Khach hang dddddddd q    qqq ddddd zzzzzzzzzzzzzzzzz: ", response.data);
                    // Kiểm tra nếu listDiaChi tồn tại và không rỗng
                    if (response.data.listAddress && response.data.listAddress.length > 0) {
                        // Tìm địa chỉ có diaChiMacDinh = 1
                        const diaChiMacDinh = response.data.listAddress.find(diaChi => diaChi.defaultAddress === true);

                        if (diaChiMacDinh) {
                            setThanhPho(diaChiMacDinh.city);
                            setHuyen(Number(diaChiMacDinh.district));
                            setPhuong(diaChiMacDinh.ward);
                            setDiaChiCuThe(diaChiMacDinh.detailedAddress);

                            // In ra console để kiểm tra giá trị
                            console.log("Thanh pho: ", diaChiMacDinh.city);
                            console.log("Thanh pho state: ", thanhPho);
                            console.log("Huyen: ", diaChiMacDinh.district);
                            console.log("Huyen state: ", huyen);
                            console.log("Phuong: ", diaChiMacDinh.ward);
                            console.log("Phuong state: ", phuong);
                            console.log("Địa chỉ mặc định: ", diaChiMacDinh);
                            console.log("Địa chỉ cụ thể: ", diaChiMacDinh.detailedAddress);
                        } else {
                            console.log("Không có địa chỉ mặc định nào!");
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching Khách Hàng chi tiết:', error);
                });
        }
    };


    useEffect(() => {
        if (gioHang && gioHang.customer && gioHang.customer?.id) {
            detail(); // Chỉ gọi detail nếu id có giá trị
        }
    }, [gioHang.customer?.id]);


    useEffect(() => {
        // Kiểm tra các giá trị thanhPho, huyen, phuong
        console.log("Thanh pho trong useEffect: ", thanhPho);
        console.log("Huyen trong useEffect: ", huyen);
        console.log("Phuong trong useEffect: ", phuong);
    }, [thanhPho, huyen, phuong]);

    //Modal dal cho chọn địa chỉ 
    const [showModal, setShowModal] = useState(false); // State để điều khiển hiển thị modal

    // Hàm mở modal
    const handleShow = () => setShowModal(true);

    // Hàm đóng modal
    const handleClose = () => setShowModal(false);

    //Cập nhật lại mặc định cho địa chỉ 
    const handleSetDefaultAddress = (id) => {
        // Gọi API để cập nhật địa chỉ mặc định
        updateDiaChi(id)
            .then((response) => {
                // Nếu API trả về thành công, cập nhật danh sách địa chỉ trong state
                const updatedAddresses = khachHang.listAddress.map(diaChi => {
                    if (diaChi.id === id) {
                        return { ...diaChi, defaultAddress: true }; // Đặt địa chỉ này thành mặc định
                    } else {
                        return { ...diaChi, defaultAddress: false }; // Các địa chỉ khác không còn là mặc định
                    }
                });

                setKhachHang(prevState => ({
                    ...prevState,
                    listAddress: updatedAddresses,
                }));
            })
            .catch((error) => {
                // Xử lý lỗi nếu API trả về lỗi
                console.error("Lỗi khi cập nhật địa chỉ mặc định:", error);
            });
    };


    //Check box cuar dia chi 
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const handleCheckboxChange = (id) => {
        setSelectedAddressId(id); // Cập nhật ID địa chỉ được chọn
    };

    // Hàm để chọn địa chỉ mặc định
    const handleSelectDefaultAddress = () => {
        const defaultAddress = khachHang.listAddress.find(diaChi => diaChi.defaultAddress === true);
        if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id); // Cập nhật ID địa chỉ mặc định
        }
    };

    const handleButtonClick = () => {
        handleShow(); // Gọi hàm handleShow
        handleSelectDefaultAddress(); // Gọi hàm handleSelectDefaultAddress
    };

    //Nut xác nhận 
    const handleConfirm = () => {
        if (selectedAddressId) {
            // Gọi API để lấy thông tin địa chỉ chi tiết dựa vào selectedAddressId
            selectedDC(selectedAddressId)
                .then(response => {
                    const diaChi = response.data;
                    // Điền thông tin lên form detail
                    setThanhPho(diaChi.city);
                    setHuyen(Number(diaChi.district));
                    setPhuong(diaChi.ward);
                    setDiaChiCuThe(diaChi.detailedAddress);
                    setHoTen(diaChi.fullName);
                    setPhone(diaChi.phoneNumber);

                    handleClose();
                })
                .catch(error => {
                    console.error('Error fetching Dia Chi:', error);
                });
        }
    };


    //Thanh toán 
    const [paymentMethod, setPaymentMethod] = useState(0); // Mặc định là 2 (Thanh toán khi nhận hàng)

    // Hàm xử lý thay đổi phương thức thanh toán
    const handlePaymentMethodChange = (e) => {
        const newPaymentMethod = e.target.value; // Lưu giá trị mới từ radio button
        setPaymentMethod(newPaymentMethod); // Cập nhật trạng thái với giá trị mới
        console.log('id Hinh thuc', newPaymentMethod); // In ra giá trị phương thức thanh toán đã chọn
        // Để in ra giá trị chính xác của paymentMethod, cần phải sử dụng giá trị mới từ newPaymentMethod
        console.log('id Hinh thuc paymentMethod', newPaymentMethod); // In ra giá trị phương thức thanh toán đã chọn
    };

    //Valid
    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        // Kiểm tra họ tên
        if (!hoTen || !hoTen.trim()) {
            errorsCopy.hoTen = 'Họ tên không được để trống!';
            valid = false;
        } else if (hoTen.length > 50) {
            errorsCopy.hoTen = 'Tên không được vượt quá 50 kí tự!';
            valid = false;
        } else {
            errorsCopy.hoTen = '';
        }

        // Kiểm tra số điện thoại
        const phonePattern = /^0[1-9]\d{8,9}$/;
        if (!phone || !phone.trim()) {
            errorsCopy.phone = 'Số điện thoại không được để trống!';
            valid = false;
        } else if (!phonePattern.test(phone)) {
            errorsCopy.phone = 'Số điện thoại không đúng định dạng!';
            valid = false;
        } else {
            errorsCopy.phone = '';
        }

        // Kiểm tra địa chỉ cụ thể
        if (!diaChiCuThe || !diaChiCuThe.trim()) {
            errorsCopy.diaChiCuThe = 'Địa chỉ cụ thể không được để trống!';
            valid = false;
        } else if (diaChiCuThe.length > 50) {
            errorsCopy.diaChiCuThe = 'Địa chỉ cụ thể không được vượt quá 50 kí tự!';
            valid = false;
        } else {
            errorsCopy.diaChiCuThe = '';
        }

        // Kiểm tra email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email || !email.trim()) {
            errorsCopy.email = 'Email không được để trống!';
            valid = false;
        } else if (!emailRegex.test(email)) {
            errorsCopy.email = 'Email không hợp lệ!';
            valid = false;
        } else {
            errorsCopy.email = '';
        }


        // Kiểm tra thành phố, huyện, phường
        if (thanhPho === null) {
            errorsCopy.thanhPho = 'Thành phố không được để trống!';
            valid = false;
        } else {
            errorsCopy.thanhPho = '';
        }

        if (huyen === null) {
            errorsCopy.huyen = 'Huyện không được để trống!';
            valid = false;
        } else {
            errorsCopy.huyen = '';
        }

        if (phuong === null) {
            errorsCopy.phuong = 'Phường không được để trống!';
            valid = false;
        } else {
            errorsCopy.phuong = '';
        }

        setErrors(errorsCopy);
        return valid;
    };



    const [selectedSanPhamDetailIds, setSelectedSanPhamDetailIds] = useState([]);

    useEffect(() => {
        console.log('Giỏ hàng:', gioHang); // Log giỏ hàng để kiểm tra dữ liệu
        if (gioHang?.listCartDetails?.length > 0) {
            const ids = gioHang.listCartDetails.map(item => item.productDetail?.id).filter(Boolean); // Lọc ra các ID hợp lệ
            setSelectedSanPhamDetailIds(ids);
        }
    }, [gioHang]);

    useEffect(() => {
        console.log('Danh sách ID sản phẩm chi tiết đã chọn:', selectedSanPhamDetailIds); // Log sau khi cập nhật state
    }, [selectedSanPhamDetailIds]);


    //VnpAY
    function generateUUID() {
        // Public Domain/MIT
        var d = new Date().getTime(); //Timestamp
        var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16; //random number between 0 and 16
            if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    }
    const customerId = user ? user.customerId : null;
    console.log("User sau khi đăng nhập product detail:", user);

    // Kiểm tra nếu `user` đã có dữ liệu thì mới truy xuất `customerId`
    if (user) {
        console.log("Customer ID:", customerId);
    } else {
        console.log("User chưa được load");
    }

    // Hàm xử lý thanh toán
    const handleThanhToan = async () => {
        // Kiểm tra xem người dùng đã chọn phương thức thanh toán hay chưa
        if (!paymentMethod) {
            AntdModal.error({
                title: 'Chưa chọn phương thức thanh toán',
                content: 'Vui lòng chọn phương thức thanh toán trước khi tiếp tục.',
                okText: 'OK',
            });
            return;
        }

        // Nếu đã chọn phương thức và form hợp lệ
        if (validateForm()) {
            if (paymentMethod === 1) {
                // Trường hợp thanh toán bằng VNPAY
                AntdModal.confirm({
                    title: 'Xác nhận thanh toán qua VNPAY',
                    maskClosable: true,
                    content: 'Bạn có chắc chắn muốn thanh toán qua VNPAY?',
                    okText: 'Xác nhận',
                    cancelText: 'Hủy',
                    onOk: async () => {
                        try {
                            const hoaDon = {
                                voucher: phieuGiamGiaDetail,
                                paymentId: paymentMethod, // Thanh toán qua VNPAY
                                customerId: customerId,
                                recipientName: hoTen,
                                recipientPhone: phone,
                                idSPCTs: selectedSanPhamDetailIds,
                                recipientEmail: email,
                                discountAmount: !phieuGiamGiaDetail ? giamGia : phieuGiamGiaDetail.discountMethod === 'Giảm theo phần trăm' ? (tongTien * phieuGiamGiaDetail.discountValue) / 100 : phieuGiamGia.discountValue,
                                totalMoney: tongTien,
                                shippingFee: shippingFee,
                                // tongTienSauGiamGia: !phieuGiamGiaDetail ? tongTien - giamGia : phieuGiamGiaDetail.hinhThucGiam === 'Giảm theo phần trăm' ? tongTien - (tongTien * phieuGiamGiaDetail.giaTriHoaDonDuocGiam) / 100 : tongTien - phieuGiamGia.giaTriHoaDonDuocGiam,
                                address: `${diaChiCuThe}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`,
                                note: ghiChu,
                            };

                            // Thêm idTransaction và lưu thông tin checkout vào localStorage
                            const updatedHoaDon = { ...hoaDon, idTransaction: generateUUID() };
                            localStorage.setItem('checkout', JSON.stringify(updatedHoaDon));

                            // Gọi API tạo link thanh toán qua VNPAY
                            const responseDB = await axios.get(
                                `http://localhost:8080/api/vn-pay/payment?id=${updatedHoaDon.idTransaction}&total=${Math.floor(tongTienThanhToan)}`
                            );

                            // // Gọi API thanh toán
                            // const responseThanhToan = await thanhToan(hoaDon);

                            // Nếu thành công, điều hướng đến trang thanh toán của VNPAY
                            if (responseDB.status === 200) {
                                window.location.href = responseDB.data.data; // Link thanh toán trả về từ VNPAY
                                // Cập nhật địa chỉ thành địa chỉ mặc định
                                if (selectedAddressId) {
                                    try {
                                        await axios.post(`http://localhost:8080/api/gio-hang/update-dia-chi/${selectedAddressId}`);
                                    } catch (error) {
                                        console.error("Lỗi khi cập nhật địa chỉ:", error);
                                    }
                                } else {
                                    console.warn("Không có địa chỉ được chọn để cập nhật.");
                                }

                            } else {
                                message.error("Đã xảy ra lỗi trong quá trình thanh toán qua VNPAY!");
                            }

                        } catch (error) {
                            message.error("Đã xảy ra lỗi trong quá trình thanh toán qua VNPAY!");
                            console.error('Error during VNPAY payment:', error);
                        }
                    },
                });
            } else if (paymentMethod === 2) {
                // Trường hợp thanh toán khi nhận hàng
                AntdModal.confirm({
                    title: 'Xác nhận thanh toán khi nhận hàng',
                    maskClosable: true,
                    content: 'Bạn có chắc chắn muốn thanh toán khi nhận hàng?',
                    okText: 'Xác nhận',
                    cancelText: 'Hủy',
                    onOk: async () => {
                        try {
                            const hoaDon = {
                                voucher: phieuGiamGiaDetail,
                                paymentId: paymentMethod, // Thanh toán khi nhận 
                                // customer: khachHang,
                                customerId: customerId,
                                recipientName: hoTen,
                                recipientPhone: phone,
                                recipientEmail: email,
                                idSPCTs: selectedSanPhamDetailIds,
                                discountAmount: !phieuGiamGiaDetail ? giamGia : phieuGiamGiaDetail.discountMethod === 'Giảm theo phần trăm' ? (tongTien * phieuGiamGiaDetail.discountValue) / 100 : phieuGiamGia.discountValue,
                                totalMoney: tongTien,
                                shippingFee: shippingFee,
                                // tongTienSauGiamGia: !phieuGiamGiaDetail ? tongTien - giamGia : phieuGiamGiaDetail.hinhThucGiam === 'Giảm theo phần trăm' ? tongTien - (tongTien * phieuGiamGiaDetail.giaTriHoaDonDuocGiam) / 100 : tongTien - phieuGiamGia.giaTriHoaDonDuocGiam,
                                address: `${diaChiCuThe}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`,
                                note: ghiChu,
                            };

                            // Gọi API thanh toán khi nhận hàng
                            const response = await thanhToan(hoaDon);
                            toast.success("Đặt hàng thành công!");
                            if (response.status === 200) {
                                // Cập nhật địa chỉ thành địa chỉ mặc định
                                if (selectedAddressId) {
                                    try {
                                        await axios.post(`http://localhost:8080/api/gio-hang/update-dia-chi/${selectedAddressId}`);
                                    } catch (error) {
                                        console.error("Lỗi khi cập nhật địa chỉ:", error);
                                    }
                                } else {
                                    console.warn("Không có địa chỉ được chọn để cập nhật.");
                                }

                                setTimeout(() => {
                                    navigate('/home');
                                }, 2000);
                            }
                        } catch (error) {
                            message.error("Đã xảy ra lỗi trong quá trình thanh toán khi nhận hàng!");
                            console.error(error);
                        }
                    },
                });
            }
        } else {
            message.error('Vui lòng kiểm tra lại thông tin!');
        }
    };

    const handleThanhToanAndEmail = async () => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            handleThanhToan();
        } else {
            handleSendOtp();
            handleShowEmail();
        }
    }

    //Modal cho email OTP 
    const [otp, setOtp] = useState(''); // OTP khách hàng nhập
    const [showModalEmail, setShowModalEmail] = useState(false); // State để điều khiển hiển thị modal

    // Hàm mở modal
    const handleShowEmail = () => setShowModalEmail(true);

    // Hàm đóng modal
    const handleCloseEmail = () => setShowModalEmail(false);

    // Gửi OTP tới email
    const handleSendOtp = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/send-otp", { email });
            if (response.status === 200) {
                message.success("Mã OTP đã được gửi về email của bạn");
            }
        } catch (error) {
            console.error("Lỗi khi gửi OTP:", error);
            message.error("Không thể gửi OTP, vui lòng thử lại.");
        }
    };

    // Xác thực OTP trước khi thanh toán
    const handleVerifyOtpAndPay = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/validate-otp", {
                email: email, // biến email cần đúng tên và định dạng mà backend yêu cầu
                otp: otp // biến otp phải đúng tên và định dạng mà backend yêu cầu
            });
            if (response.status === 200) {
                // Xác thực thành công
                handleThanhToan(); // hoặc các xử lý tiếp theo
            }
        } catch (error) {
            console.error("Lỗi khi xác thực OTP:", error);
            message.error("Mã OTP không đúng hoặc đã hết hạn.");
        }
    };


    ///Them dia chi nhanh
    const [hoTenDiaChi, setHoTenDiaChi] = useState('');
    const [phoneDiaChi, setPhoneDiaChi] = useState('');
    const [diaChiCuTheDiaChi, setDiaChiCuTheDiaChi] = useState('');
    const [errorsDiaChi, setErrorsDiaChi] = useState({
        hoTenDiaChi: '',
        phoneDiaChi: '',
        phuongDiaChi: '',
        thanhPhoDiaChi: '',
        huyenDiaChi: '',
    });


    const handleCreateDC = async () => {
        if (validateFormCreteDC()) {
            AntdModal.confirm({
                title: 'Xác nhận',
                maskClosable: true,
                content: 'Bạn có chắc chắn muốn thêm địa chỉ này?',
                okText: 'Xác nhận',
                cancelText: 'Hủy',
                onOk: async () => {
                    const diaChi = {
                        customerId: user.customerId,
                        fullName: hoTenDiaChi,
                        phoneNumber: phoneDiaChi,
                        city: thanhPhoDiaChi,
                        district: huyenDiaChi,
                        ward: phuongDiaChi,
                        detailedAddress: diaChiCuTheDiaChi,
                    };

                    try {
                        const response = await createDiaChi(diaChi);

                        if (response.status === 200) {
                            toast.success("Thêm địa chỉ mới thành công!");
                            handleClose1(); // Đóng modal ngay khi thành công
                            handleShow(); // Cập nhật lại danh sách
                            detail(); // Gọi lại hàm để hiển thị chi tiết
                        }
                    } catch (error) {
                        console.error('Lỗi khi thêm địa chỉ:', error);
                        toast.error('Thêm địa chỉ thất bại, vui lòng thử lại!');
                    }
                },
            });
        } else {
            toast.error('Vui lòng kiểm tra lại thông tin!');
        }
    };




    //Modal dal cho thêm địa chỉ 
    const [showModal1, setShowModal1] = useState(false); // State để điều khiển hiển thị modal

    // Hàm mở modal
    const handleShow1 = () => setShowModal1(true);

    // Hàm đóng modal
    const handleClose1 = () => setShowModal1(false);



    function validateFormCreteDC() {
        let valid = true;
        const errorsCopy = { ...errors };

        // Validate họ tên
        if (!hoTenDiaChi.trim()) {
            errorsCopy.hoTenDiaChi = 'Họ tên không được để trống!';
            valid = false;
        } else if (hoTenDiaChi.length > 50) {
            errorsCopy.hoTenDiaChi = 'Tên không được vượt quá 50 kí tự!';
            valid = false;
        } else {
            errorsCopy.hoTenDiaChi = '';
        }

        // Pattern kiểm tra số điện thoại bắt đầu với số 0 và có từ 9 đến 10 chữ số
        const phonePattern = /^0[1-9]\d{8,9}$/;

        // Validate số điện thoại
        if (!phoneDiaChi.trim()) {
            errorsCopy.phoneDiaChi = 'Số điện thoại không được để trống!';
            valid = false;
        } else if (!phonePattern.test(phoneDiaChi)) {
            errorsCopy.phoneDiaChi = 'Số điện thoại không đúng định dạng!';
            valid = false;
        } else {
            errorsCopy.phoneDiaChi = '';
        }

        // Validate địa chỉ cụ thể
        if (!diaChiCuTheDiaChi.trim()) {
            errorsCopy.diaChiCuTheDiaChi = 'Địa chỉ cụ thể không được để trống!';
            valid = false;
        } else if (diaChiCuTheDiaChi.length > 50) {
            errorsCopy.diaChiCuTheDiaChi = 'Địa chỉ cụ thể không được vượt quá 50 kí tự!';
            valid = false;
        } else {
            errorsCopy.diaChiCuTheDiaChi = '';
        }
        // Kiểm tra thành phố, huyện, phường
        if (thanhPhoDiaChi === null) {
            errorsCopy.thanhPhoDiaChi = 'Thành phố không được để trống!';
            valid = false;
        } else {
            errorsCopy.thanhPhoDiaChi = '';
        }

        if (huyenDiaChi === null) {
            errorsCopy.huyenDiaChi = 'Huyện không được để trống!';
            valid = false;
        } else {
            errorsCopy.huyenDiaChi = '';
        }

        if (phuongDiaChi === null) {
            errorsCopy.phuongDiaChi = 'Phường không được để trống!';
            valid = false;
        } else {
            errorsCopy.phuongDiaChi = '';
        }
        // Cập nhật state với các lỗi
        setErrorsDiaChi(errorsCopy);
        return valid;
    }

    const handleButtonClickThemDC = () => {
        handleClose();  // Đóng modal hiện tại
        handleShow1();  // Mở modal thêm địa chỉ mới
    };

    //Áp dụng phiếu giảm giá 
    const [maPhieuGiamGia, setMaPhieuGiamGia] = useState('');
    const [phieuGiamGia, setPhieuGiamGia] = useState([]);
    const [selectedVoucherId, setSelectedVouCherId] = useState(null);

    useEffect(() => {
        GetAllPhieuGiamGia();
    }, []); // Thêm dependency array rỗng để chỉ gọi một lần khi component mount

    const GetAllPhieuGiamGia = () => {
        getAllByPublic()
            .then((response) => {
                setPhieuGiamGia(response.data); // Cập nhật state với dữ liệu từ API
                console.log('Fetched Vouchers:', response.data); // Log dữ liệu từ API
            })
            .catch((error) => {
                console.error('Error fetching Phieu Giam Gia:', error); // Log lỗi nếu có
            });
    };

    const handleCheckboxChangePhieu = (id) => {
        // Kiểm tra xem id đã được chọn chưa
        if (selectedVoucherId === id) {
            // Nếu đã chọn, bỏ chọn
            setSelectedVouCherId(null);
        } else {
            // Nếu chưa chọn, cập nhật id đã chọn
            setSelectedVouCherId(id);
        }
    };


    const [showModalPhieuGiamGia, setShowModalPhieuGiamGia] = useState(false); // State để điều khiển hiển thị modal

    // Hàm mở modal
    const handleShowPhieuGiamGia = () => setShowModalPhieuGiamGia(true);

    // Hàm đóng modal
    const handleClosePhieuGiamGia = () => setShowModalPhieuGiamGia(false);

    //Làm chọn phiếu giảm giá
    const handleSelectPhieuGiamGia = () => {
        if (!selectedVoucherId) {
            AntdModal.confirm({
                title: 'Thông báo',
                content: 'Bạn chưa chọn voucher nào!',
                okText: 'OK',
                cancelText: 'Hủy',
            });
            return; // Dừng hàm nếu chưa chọn voucher
        }

        // Tìm phiếu giảm giá đã chọn để kiểm tra giá trị hóa đơn
        const selectedVoucher = phieuGiamGia.find(phieu => phieu.id === selectedVoucherId);

        if (selectedVoucher && tongTien < selectedVoucher.minimumOrderValue && tongTien > selectedVoucher.maximumDiscountValue) {
            AntdModal.confirm({
                title: 'Thông báo',
                content: 'Tổng tiền hóa đơn đang nhỏ hơn giá trị hóa đơn được áp dụng tối thiểu hoặc lớn hơn giá trị hóa đơn được áp dụng tối đa . Vui lòng chọn lại!',
                okText: 'OK',
                cancelText: 'Hủy',
            });
            return; // Dừng hàm nếu tổng tiền nhỏ hơn giá trị áp dụng của voucher
        }

        // Nếu vượt qua các điều kiện, tiến hành áp dụng phiếu giảm giá
        selectedPhieuGiamGia(selectedVoucherId)
            .then((response) => {
                toast.success('Chọn thành công Voucher!');
                setMaPhieuGiamGia(response.data.code);
                setGiamGia(response.data.discountValue)
                setPhieuGiamGiaDetail(response.data)
                console.log('Phieu giam gia dc chon ', phieuGiamGiaDetail)
                handleClosePhieuGiamGia();
            })
            .catch((error) => {
                console.error('Lỗi khi áp dụng voucher:', error);
            });
    };


    // Phan trang 
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(2);

    // Hàm thay đổi trang
    const handleChangePage = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize); // Đảm bảo cập nhật pageSize
    };

    // Kiểm tra nếu `gioHang` hoặc `listGioHangChiTiet` bị undefined hoặc null
    const cartItems = gioHang?.listCartDetails ?? [];

    // Tính toán tổng số mục trong giỏ hàng
    const totalItems = cartItems.length;

    // Lấy danh sách sản phẩm theo phân trang
    const paginatedCart = cartItems.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );



    ///Hàm giúp hiển thị điaj chỉ 

    // Lưu dữ liệu districts và wards đã được tải
    const [addressDetails, setAddressDetails] = useState({});
    // Khai báo cache cho quận/huyện và xã/phường\
    const provincesCache = new Map();
    const districtCache = new Map();
    const wardCache = new Map();

    // Hàm lấy dữ liệu thành phố và lưu vào cache
    const fetchProvincesHT = async () => {
        if (provincesCache.size > 0) {
            console.log("Provinces from cache:", Array.from(provincesCache.values()));
            return Array.from(provincesCache.values());
        }

        try {
            const response = await axios.get(
                "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
                configApi
            );
            if (Array.isArray(response.data.data)) {
                response.data.data.forEach(province => {
                    provincesCache.set(province.ProvinceID, province);
                });
                console.log("Fetched and cached provinces:", response.data.data);
                return response.data.data;
            } else {
                console.error("Invalid provinces data:", response.data);
                return [];
            }
        } catch (error) {
            console.error("Error fetching provinces:", error);
            return [];
        }
    };

    const fetchDistrictsHT = async (provinceId) => {
        if (districtCache.has(provinceId)) {
            return districtCache.get(provinceId); // Trả về từ cache nếu đã có
        }

        try {
            const response = await axios.get(
                `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
                configApi
            );
            if (Array.isArray(response.data.data)) {
                districtCache.set(provinceId, response.data.data); // Lưu vào cache
                return response.data.data; // Trả về dữ liệu
            } else {
                console.error('Invalid districts data:', response.data);
                return []; // Trả về mảng rỗng nếu không hợp lệ
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
            return []; // Trả về mảng rỗng nếu có lỗi
        }
    };

    const fetchWardsHT = async (districtId) => {
        if (wardCache.has(districtId)) {
            return wardCache.get(districtId); // Trả về từ cache nếu đã có
        }

        try {
            const response = await axios.get(
                `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
                configApi
            );
            if (Array.isArray(response.data.data)) {
                wardCache.set(districtId, response.data.data); // Lưu vào cache
                return response.data.data; // Trả về dữ liệu
            } else {
                console.error('Invalid wards data:', response.data);
                return []; // Trả về mảng rỗng nếu không hợp lệ
            }
        } catch (error) {
            console.error('Error fetching wards:', error);
            return []; // Trả về mảng rỗng nếu có lỗi
        }
    };

    // Hàm xử lý chi tiết địa chỉ cho mỗi bản ghi
    const getAddressDetailsPerRecord = async (record) => {
        const { ward: idPhuong, city: idTP, district: idHuyen } = record;

        await fetchProvincesHT(); // Đảm bảo cache tỉnh đã sẵn sàng

        const [districts, wards] = await Promise.all([
            fetchDistrictsHT(idTP),
            fetchWardsHT(idHuyen)
        ]);

        const province = provincesCache.get(Number(idTP));
        const provinceName = province ? province.ProvinceName : "Không xác định";
        const districtName = districts.find(d => Number(d.DistrictID) === Number(idHuyen))?.DistrictName || "Không xác định";
        const wardName = wards.find(w => String(w.WardCode) === String(idPhuong))?.WardName || "Không xác định";

        console.log(`Address resolved for record ${record.id}: ${provinceName}, ${districtName}, ${wardName}`);
        return `${provinceName}, ${districtName}, ${wardName}`;
    };

    const processAllRecords = async (records) => {
        const details = {};
        await Promise.all(records.map(async (record) => {
            const addressDetail = await getAddressDetailsPerRecord(record);
            details[record.id] = addressDetail;
        }));
        setAddressDetails(details);
        console.log("All address details:", details);
    };

    useEffect(() => {
        if (khachHang?.listAddress?.length > 0) {
            processAllRecords(khachHang.listAddress);
        }
    }, [khachHang]);

    return (
        <div className="container mt-4 " style={{ backgroundColor: 'whitesmoke' }}>
            <Row justify="start" align="middle" gutter={[16, 0]} style={{ padding: '10px 0' }}>
                <Col>
                    <Typography.Text>
                        <Link to="/cart" strong style={{ color: 'black', textDecoration: 'none', fontSize: '18px' }}>
                            Giỏ hàng
                        </Link>
                    </Typography.Text>
                </Col>
                <Col>
                    <Typography.Text style={{ color: 'black', fontSize: '18px' }}>|</Typography.Text>
                </Col>
                <Col>
                    <Typography.Text>
                        <Link to={`/checkout`} style={{ color: 'black', textDecoration: 'none', fontSize: '18px' }}>
                            Thông tin thanh toán
                        </Link>
                    </Typography.Text>
                </Col>
            </Row>
            <Row gutter={24} className='my-5'>
                {/* Thông tin giao hàng */}
                <Col span={13} style={{ marginLeft: '10px', marginRight: '30px', height: '750px', backgroundColor: 'white', borderRadius: '7px' }}>
                    <div className='d-flex justify-content-between align-items-center mt-3 mb-4'>
                        <Typography.Title level={4}>Thông tin giao hàng</Typography.Title>
                        <Button
                            block
                            style={{ border: '1px solid #6A0DAD', color: '#6A0DAD', marginBottom: '16px', width: '100px' }}
                            onClick={handleButtonClick} // Gọi hàm trung gian
                        >
                            Chọn địa chỉ
                        </Button>
                        <Modal
                            show={showModal}
                            onHide={handleClose}
                            dialogClassName="modal-90w" // Cải thiện độ rộng nếu cần
                            aria-labelledby="example-custom-modal-styling-title"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Địa chỉ của tôi</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {/* Thêm nội dung modal tại đây */}
                                <div>
                                    {khachHang ? (
                                        <div className="d-flex flex-column">
                                            {khachHang.listAddress ? (
                                                khachHang.listAddress.map((diaChi, index) => (
                                                    <div key={index} className="d-flex mb-3">
                                                        <div className="flex-grow-1">
                                                            <input
                                                                className='mx-2'
                                                                type="checkbox"
                                                                checked={selectedAddressId === diaChi.id}
                                                                onChange={() => handleCheckboxChange(diaChi.id)} // Gọi hàm khi chọn checkbox
                                                            />
                                                            <b>{diaChi.fullName} - {diaChi.phoneNumber}</b>
                                                            <p>{addressDetails[diaChi.id] || 'Đang tải...'}</p>
                                                            <p>
                                                                {diaChi.defaultAddress === true ? (
                                                                    <span className='px-2' style={{ width: '80px', border: '1px solid #6A0DAD', color: '#6A0DAD' }}>
                                                                        Mặc định
                                                                    </span>
                                                                ) : (
                                                                    <span className='px-2' style={{ width: '90px', border: '1px solid black', color: 'black' }}>
                                                                        Địa chỉ
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <hr />
                                                        </div>
                                                        {/* Nút cập nhật địa chỉ mặc định cho mỗi địa chỉ */}
                                                        {selectedAddressId === diaChi.id && ( // Hiển thị nút nếu địa chỉ được chọn
                                                            <div style={{ marginLeft: '30px' }}>
                                                                <Button
                                                                    style={{ backgroundColor: diaChi.defaultAddress === true ? '#6A0DAD' : 'white', color: diaChi.defaultAddress === true ? 'white' : 'black' }}
                                                                    onClick={() => handleSetDefaultAddress(diaChi.id)} // Gọi hàm xử lý khi nhấn nút
                                                                    disabled={diaChi.defaultAddress === true} // Vô hiệu hóa nút nếu đã là mặc định
                                                                >
                                                                    {diaChi.defaultAddress === true ? 'Mặc định' : 'Thiết lập mặc định'}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p>Chưa có địa chỉ nào</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p>Khách hàng không có địa chỉ</p>
                                    )}

                                    <Button
                                        variant=""
                                        style={{ backgroundColor: '#6A0DAD', color: 'white' }}
                                        onClick={handleButtonClickThemDC}// Thêm màu chữ cho nút xác nhận
                                    >
                                        + Thêm địa chỉ
                                    </Button>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    style={{ backgroundColor: 'white' }} // Sửa lỗi chính tả màu sắc
                                    onClick={handleClose}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    variant=""
                                    style={{ backgroundColor: '#6A0DAD', color: 'white' }} // Thêm màu chữ cho nút xác nhận
                                    onClick={handleConfirm} // Gọi hàm xác nhận
                                >
                                    Xác nhận
                                </Button>

                            </Modal.Footer>
                        </Modal>
                        {/* Modal của them dia chi  */}
                        <Modal
                            show={showModal1}
                            onHide={handleClose1}
                            dialogClassName="modal-90w" // Cải thiện độ rộng nếu cần
                            aria-labelledby="example-custom-modal-styling-title"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Thêm mới địa chỉ</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {/* Thêm nội dung modal tại đây */}
                                <Form layout="vertical">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Họ và tên"
                                                validateStatus={errorsDiaChi.hoTenDiaChi ? 'error' : ''}
                                                help={errorsDiaChi.hoTenDiaChi}
                                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                            >
                                                <Input
                                                    name="hoTenDiaChi"
                                                    value={hoTenDiaChi}
                                                    onChange={(e) => setHoTenDiaChi(e.target.value)}
                                                    placeholder="Nhập họ tên của bạn"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Số điện thoại"
                                                validateStatus={errorsDiaChi.phoneDiaChi ? 'error' : ''}
                                                help={errorsDiaChi.phoneDiaChi}
                                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                            >
                                                <Input value={phoneDiaChi}
                                                    name="phoneDiaChi"
                                                    onChange={(e) => setPhoneDiaChi(e.target.value)}
                                                    placeholder="Nhập số điện thoại của bạn" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item label="Thành phố" validateStatus={errorsDiaChi.thanhPhoDiaChi ? 'error' : ''}
                                                help={errorsDiaChi.thanhPhoDiaChi} rules={[{ required: true, message: 'Thành phố không được để trống!' }]}>
                                                <Select
                                                    name="thanhPhoDiaChi"
                                                    showSearch
                                                    placeholder="Chọn thành phố"
                                                    value={thanhPhoDiaChi || undefined}
                                                    onChange={handleProvinceChangeDiaChi}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                >
                                                    {provincesDiaChi.map((province) => (
                                                        <Select.Option key={province.ProvinceID} value={province.ProvinceID}>
                                                            {province.ProvinceName}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item label="Huyện" validateStatus={errorsDiaChi.huyenDiaChi ? 'error' : ''}
                                                help={errorsDiaChi.huyenDiaChi} rules={[{ required: true, message: "Huyện không được để trống!" }]}>
                                                <Select
                                                    name="huyenDiaChi"
                                                    showSearch
                                                    placeholder="Chọn huyện"
                                                    value={huyenDiaChi || undefined}
                                                    onChange={handleDistrictChangeDiaChi}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                >
                                                    {districtsDiaChi.map((district) => (
                                                        <Select.Option key={district.DistrictID} value={district.DistrictID}>
                                                            {district.DistrictName}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item label="Phường" validateStatus={errorsDiaChi.phuongDiaChi ? 'error' : ''}
                                                help={errorsDiaChi.phuongDiaChi} rules={[{ required: true, message: "Phường không được để trống!" }]}>
                                                <Select
                                                    name="phuongDiaChi"
                                                    showSearch
                                                    placeholder="Chọn phường"
                                                    value={phuongDiaChi || undefined}
                                                    onChange={handleWardChangeDiaChi}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                >
                                                    {wardsDiaChi.map((ward) => (
                                                        <Select.Option key={ward.WardCode} value={ward.WardCode}>
                                                            {ward.WardName}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item
                                        label="Địa chỉ cụ thể"
                                        validateStatus={errorsDiaChi.diaChiCuTheDiaChi ? 'error' : ''}
                                        help={errorsDiaChi.diaChiCuTheDiaChi}
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể!' }]}
                                    >
                                        <Input name="diaChiCuTheDiaChi"
                                            value={diaChiCuTheDiaChi}
                                            onChange={(e) => setDiaChiCuTheDiaChi(e.target.value)}
                                            placeholder="Nhập địa chỉ cụ thể" />
                                    </Form.Item>

                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    style={{ backgroundColor: 'white' }} // Sửa lỗi chính tả màu sắc
                                    onClick={handleClose1}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    variant=""
                                    style={{ backgroundColor: '#6A0DAD', color: 'white' }} // Thêm màu chữ cho nút xác nhận
                                    onClick={handleCreateDC} // Gọi hàm xác nhận
                                >
                                    Thêm
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <Form
                        layout="vertical"
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Họ và tên"
                                    validateStatus={errors.hoTen ? 'error' : ''}
                                    help={errors.hoTen}
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                >
                                    <Input
                                        name="hoTen"
                                        value={hoTen}
                                        onChange={(e) => setHoTen(e.target.value)}
                                        placeholder="Nhập họ tên của bạn" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Số điện thoại"
                                    validateStatus={errors.phone ? 'error' : ''}
                                    help={errors.phone}
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                >
                                    <Input value={phone}
                                        name="phone"
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Nhập số điện thoại của bạn" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label="Thành phố"
                                    validateStatus={errors.thanhPho ? 'error' : ''}
                                    help={errors.thanhPho}
                                    rules={[{ required: true, message: "Thành phố không được để trống!" }]}
                                >
                                    <Select
                                        name="thanhPho"
                                        showSearch
                                        placeholder="Chọn thành phố"
                                        optionFilterProp="children"
                                        value={selectedProvinceName || undefined}
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
                                <Form.Item
                                    label="Huyện"
                                    validateStatus={errors.huyen ? 'error' : ''}
                                    help={errors.huyen}
                                    rules={[{ required: true, message: "Huyện không được để trống!" }]}
                                >
                                    <Select
                                        name="huyen"
                                        showSearch
                                        placeholder="Chọn huyện"
                                        optionFilterProp="children"
                                        value={huyen || undefined}
                                        onChange={(value) => {
                                            setHuyen(value);
                                            handleDistrictChange(value);
                                        }}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
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
                                <Form.Item
                                    label="Phường"
                                    validateStatus={errors.phuong ? 'error' : ''}
                                    help={errors.phuong}
                                    rules={[{ required: true, message: "Phường không được để trống!" }]}
                                >
                                    <Select
                                        name="phuong"
                                        showSearch
                                        placeholder="Chọn phường"
                                        optionFilterProp="children"
                                        value={phuong || undefined}
                                        onChange={(value) => {
                                            setPhuong(value);
                                            handleWardChange(value);
                                        }}

                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
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
                        <Form.Item
                            label="Email"
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email}
                        >
                            <Input name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email nhận hàng" />
                        </Form.Item>
                        <Form.Item
                            label="Địa chỉ cụ thể"
                            validateStatus={errors.diaChiCuThe ? 'error' : ''}
                            help={errors.diaChiCuThe}
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể!' }]}
                        >
                            <Input name="diaChiCuThe"
                                value={diaChiCuThe}
                                onChange={(e) => setDiaChiCuThe(e.target.value)}
                                placeholder="Nhập địa chỉ cụ thể" />
                        </Form.Item>
                        <Form.Item label="Ghi chú">
                            <Input.TextArea
                                name="ghiChu"
                                value={ghiChu}
                                placeholder="Thêm ghi chú cho đơn hàng (nếu có)"
                                onChange={(e) => setGhiChu(e.target.value)} // Cập nhật state khi người dùng thay đổi nội dung
                            />
                        </Form.Item>

                        {/* Modal của email xác thực thanh toán */}
                        <Modal
                            show={showModalEmail}
                            onHide={handleCloseEmail}
                            dialogClassName="modal-90w" // Cải thiện độ rộng nếu cần
                            aria-labelledby="example-custom-modal-styling-title"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Xác thực email</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {/* Thêm nội dung modal tại đây */}
                                <Form layout="vertical">

                                    <Form.Item label="OTP">
                                        <Input
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Nhập mã OTP"
                                        />
                                    </Form.Item>

                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Row justify="end">
                                    <Button onClick={handleCloseEmail} style={{ marginRight: '8px' }}>
                                        Hủy
                                    </Button>
                                    <Button type="primary" onClick={handleVerifyOtpAndPay}>
                                        Xác nhận và thanh toán
                                    </Button>
                                </Row>
                            </Modal.Footer>
                        </Modal>

                        {/* Phương thức thanh toán */}
                        <Form.Item name="paymentMethod" label="Phương thức thanh toán">
                            <Radio.Group onChange={handlePaymentMethodChange}>
                                <Radio
                                    value={2} // Thanh toán khi nhận hàng
                                    className="align-items-center px-2"
                                    style={{
                                        marginRight: '70px',
                                        border: '1px solid black',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '5px',
                                        width: '300px',
                                        height: '70px',
                                        fontSize: '15px'
                                    }}
                                >
                                    <img style={{ width: '30px', height: '30px', marginLeft: '6px' }} src="/src/assets/images/icons/icon-thanh-toan-1.png" alt="THANHTOAN" />
                                    Thanh toán khi nhận hàng
                                </Radio>
                                <Radio
                                    value={1} // Thanh toán ngay
                                    className="align-items-center px-2"
                                    style={{
                                        border: '1px solid black',
                                        backgroundColor: '#FFFFFF',
                                        width: '300px',
                                        borderRadius: '5px',
                                        height: '70px',
                                        fontSize: '15px'
                                    }}
                                >
                                    <img style={{ width: '30px', height: '30px', marginLeft: '6px' }} src="/src/assets/images/icons/images.png" alt="VNPAY" />
                                    Thanh toán ngay
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Button
                            block
                            style={{ fontSize: '15px', backgroundColor: '#6A0DAD', color: 'white', marginBottom: '16px', height: '50px' }}
                            onClick={handleThanhToanAndEmail}
                        >
                            HOÀN THÀNH ĐẶT HÀNG
                        </Button>
                        {/* <ToastContainer /> */}
                    </Form>
                </Col>

                {/* Thông tin sản phẩm */}
                <Col span={10} style={{ height: '750px', backgroundColor: 'white', borderRadius: '7px' }}>
                    <Title level={3} className="mx-3 mt-4">Sản phẩm đã chọn</Title>
                    <div className="product-summary mx-3">
                        {paginatedCart.length > 0 ? (
                            paginatedCart.map((gh, index) => (
                                <React.Fragment key={index}>
                                    <div className="product-item d-flex mb-3 my-2">
                                        <Carousel
                                            autoplay
                                            autoplaySpeed={3000}
                                            dots={false}
                                            arrows={false}
                                            style={{
                                                height: '100px',
                                                width: '100px',
                                                border: '1px solid #ddd',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {gh.productDetail.images?.map((anh, idx) => (
                                                <div key={idx} className="image-container" style={{ position: 'relative' }}>
                                                    <img
                                                        src={anh.url}
                                                        alt="images"
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            objectFit: 'cover',
                                                            borderRadius: '5px'
                                                        }}
                                                    />
                                                    {gh.productDetail.discountPercentage !== 0 ? (
                                                        <p
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 0,
                                                                backgroundColor: 'red',
                                                                color: 'white',
                                                                padding: '2px 5px',
                                                                borderRadius: '0 0 0 5px',
                                                                margin: 0
                                                            }}
                                                        >
                                                            {-gh.productDetail.discountPercentage}%
                                                        </p>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </Carousel>

                                        <div className="mx-4">
                                            <p>{gh.productDetail.product.name} {gh.productDetail.brand.name} + [{gh.productDetail.collar.name}, {gh.productDetail.sleeve.name}]</p>
                                            <p>Size: {gh.productDetail.size.name}</p>
                                            <p>Giá: <FormatCurrency value={gh.productDetail.price} /></p>
                                            <p>Số lượng: {gh.quantity}</p>
                                        </div>
                                    </div>
                                    {/* Thêm thẻ <hr /> bên ngoài thẻ <div> */}
                                    <hr />
                                </React.Fragment>
                            ))
                        ) : (
                            <p>Không có sản phẩm trong giỏ hàng.</p>
                        )}

                        {/* Pagination controls */}
                        <Pagination
                            className='text-center'
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalItems} // Tổng số mục trong giỏ hàng
                            onChange={handleChangePage} // Gọi hàm thay đổi trang
                        />

                    </div>
                    <Divider />
                    <Row className='mx-3' style={{ width: '800px' }}>
                        <Col span={12}>
                            <Form.Item
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input
                                    value={maPhieuGiamGia}
                                    name="phieuGiamGia"
                                    placeholder="Phiếu giảm giá"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Button type="primary" onClick={handleShowPhieuGiamGia}>Chọn</Button>
                            {/* Modal của áp dụng phiếu giảm giá */}
                            <Modal
                                show={showModalPhieuGiamGia}
                                onHide={handleClosePhieuGiamGia}
                                dialogClassName="modal-90w" // Cải thiện độ rộng nếu cần
                                aria-labelledby="example-custom-modal-styling-title"
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Chọn Beryy Store Voucher</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {/* Thêm nội dung modal tại đây */}
                                    <h5>Vui lòng chọn 1 Voucher</h5>
                                    <hr />
                                    <div>
                                        {phieuGiamGia && phieuGiamGia.length > 0 ? (  // Kiểm tra nếu có dữ liệu trong phieuGiamGia
                                            <div className="d-flex flex-column">
                                                {phieuGiamGia.map((phieu, index) => (
                                                    <div key={index} className="d-flex mb-3">
                                                        <div className="flex-grow-1">
                                                            <input
                                                                className='mx-2'
                                                                type="checkbox"
                                                                checked={selectedVoucherId === phieu.id}
                                                                onChange={() => handleCheckboxChangePhieu(phieu.id)} // Gọi hàm khi chọn checkbox
                                                            />
                                                            <b>{phieu.name} -   {'Còn:'}{phieu.quantity}</b>
                                                            <p className='my-2'>
                                                                {'Hóa đơn được áp dụng tối thiểu: '}
                                                                <FormatCurrency value={phieu.minimumOrderValue} /> <br /> <br />
                                                                {'Hóa đơn được áp dụng tối đa: '}
                                                                <FormatCurrency value={phieu.maximumDiscountValue} />
                                                                <br /> <br />
                                                                {'Hóa đơn được giảm: '}
                                                                {phieu.discountMethod === 'Giảm theo phần trăm' ? (
                                                                    <>
                                                                        {phieu.discountValue} %
                                                                    </>
                                                                ) : (
                                                                    <FormatCurrency value={phieu.discountValue} />
                                                                )}
                                                            </p>
                                                            <p>
                                                                {'Hình thức giảm: ' + phieu.discountMethod}
                                                            </p>
                                                            <hr />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>Không có voucher nào</p>  // Hiển thị khi dữ liệu đang được tải
                                        )}
                                    </div>


                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        style={{ backgroundColor: 'white' }} // Sửa lỗi chính tả màu sắc
                                        onClick={handleClosePhieuGiamGia}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        variant=""
                                        style={{ backgroundColor: '#6A0DAD', color: 'white' }} // Thêm màu chữ cho nút xác nhận
                                        onClick={handleSelectPhieuGiamGia} // Gọi hàm xác nhận
                                    >
                                        Áp dụng
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-between my-1 mx-3">
                        <Text style={{ color: 'gray' }}>Tổng tiền:</Text>
                        <Text style={{ color: 'red' }}> <FormatCurrency value={tongTien} /> </Text>
                    </div>
                    <div className="d-flex justify-content-between  my-2 mx-3">
                        <Text style={{ color: 'gray' }}>Giảm giá:</Text>
                        <Text style={{ color: 'red' }}>
                            {!phieuGiamGiaDetail ? (
                                <FormatCurrency value={0} />
                            ) : (
                                phieuGiamGiaDetail.discountMethod === 'Giảm theo phần trăm' ? (
                                    <>
                                        {-phieuGiamGiaDetail.discountValue} %
                                    </>
                                ) : (
                                    <FormatCurrency value={-phieuGiamGiaDetail.discountValue} />
                                )
                            )}
                        </Text>

                    </div>
                    <div className="d-flex justify-content-between my-2 mx-3">
                        <Text style={{ color: 'gray' }}>Phí vận chuyển:
                            <img style={{ width: '30px', height: '30px', marginLeft: '6px' }} src="/src/assets/images/icons/Logo-GHN-Text.webp" alt="Logo GHN" />
                        </Text>
                        {shippingFee !== null ? (
                            <>
                                {tongTien >= 1000000 ? (
                                    <p className='text-end'>
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
                        )}
                    </div>

                    <div className="d-flex justify-content-between mx-3 mt-2 ">
                        <Text strong style={{ color: 'black', fontSize: '20px' }}>Tổng thanh toán:</Text>
                        <Text strong style={{ color: 'red', fontSize: '20px' }}> <FormatCurrency value={tongTienThanhToan} /> </Text>
                    </div>
                </Col>
            </Row>
            <ToastContainer />

        </div >

    );
};

export default CheckOut;
