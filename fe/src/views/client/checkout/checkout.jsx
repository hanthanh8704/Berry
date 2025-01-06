
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
import { detailKH, selectedPhieuGiamGia, updateDiaChi, createDiaChi, selectedDC, thanhToan }
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

    const [weightTong, setWeightTong] = useState(0);

    useEffect(() => {
        let totalWeight = 0;


        gioHang?.listCartDetails?.forEach(item => {
            const weight = item.productDetail?.weight;
            if (weight) {
                totalWeight += weight * item.quantity;

            }
        });

        setWeightTong(totalWeight);
    }, [gioHang.listCartDetails]);


    // const configApiShip = {
    //     headers: {
    //         "Content-Type": "application/json",
    //         Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694", // Sử dụng token hợp lệ
    //         ShopId: 192796
    //     },
    // };

    const configApiShip = {
        headers: {
            "Content-Type": "application/json",
            Token: '693d8a79-3a3d-11ef-8e53-0a00184fe694',// Sử dụng token hợp lệ
            ShopId: '192796'
        },
    };

    // Gọi API phí vận chuyển
    useEffect(() => {
        const fetchShippingFee = async () => {
            try {
                if (tongTien >= 2000000) {
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
                    from_district_id: 3290, // ID quận/huyện gửi hàng
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
                setShippingFee(response.data.data.total);

                console.log('Phi ship pppppppppppp', shippingFee);
                console.log('Phi ship pppppppppppp', response.data.data);
                console.log('Phi ship pppppppppppp', response.data);
            } catch (error) {
                console.error("Lỗi khi gọi API phí vận chuyển:", error);
            }
        };

        fetchShippingFee();
    }, [huyen, phuong, tongTien]); // Thêm các phụ thuộc cần thiết



    // Tính tổng tiền thanh toán
    useEffect(() => {
        if (!phieuGiamGiaDetail) {
            // Nếu phieuGiamGiaDetail là undefined, không thực hiện gì cả
            setTongTienThanhToan(tongTien + shippingFee);
            return;
        }

        let giamGia = 0;

        // Kiểm tra hình thức giảm giá có phải là giảm theo phần trăm không
        if (phieuGiamGiaDetail.discountMethod === 'PHAN_TRAM') {
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


            console.log("Tổng giá trị sản phẩm ddddddddddddd:", total);
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
        const phonePattern = /^0(3\d|5[689]|7[06789]|8[1-689]|9[0-46-9])\d{7}$/;

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

        const MAX_ALLOWED_AMOUNT = 20000000;

        if (tongTien > MAX_ALLOWED_AMOUNT) {
            AntdModal.error({
                title: 'Thông báo',
                content: `Đơn hàng có tổng tiền vượt quá giới hạn cho phép là ${MAX_ALLOWED_AMOUNT.toLocaleString()} VNĐ. Vui lòng giảm số lượng sản phẩm.`,
                okText: 'OK',
            });
            return;
        }

        console.log("Lỗi khi cập nhật địa chỉ ddddddddddddddddddd:", phieuGiamGiaDetail);

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
                                voucherId: phieuGiamGiaDetail?.id,
                                paymentId: paymentMethod, // Thanh toán qua VNPAY
                                customerId: customerId,
                                recipientName: hoTen,
                                recipientPhone: phone,
                                idSPCTs: selectedSanPhamDetailIds,
                                recipientEmail: email,
                                discountAmount: phieuGiamGiaDetail?.id == null ? 0 : phieuGiamGiaDetail.discountMethod === 'PHAN_TRAM' ? (tongTien * phieuGiamGiaDetail.discountValue) / 100 : phieuGiamGia.discountValue,
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
                                voucherId: phieuGiamGiaDetail?.id,
                                paymentId: paymentMethod, // Thanh toán khi nhận 
                                // customer: khachHang,
                                customerId: customerId,
                                recipientName: hoTen,
                                recipientPhone: phone,
                                recipientEmail: email,
                                idSPCTs: selectedSanPhamDetailIds,
                                discountAmount: phieuGiamGiaDetail?.id == null ? 0 : phieuGiamGiaDetail.discountMethod === 'PHAN_TRAM' ? (tongTien * phieuGiamGiaDetail.discountValue) / 100 : phieuGiamGia.discountValue,
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
            if (!paymentMethod) {
                AntdModal.error({
                    title: 'Chưa chọn phương thức thanh toán',
                    content: 'Vui lòng chọn phương thức thanh toán trước khi tiếp tục.',
                    okText: 'OK',
                });
                return;
            }

            const MAX_ALLOWED_AMOUNT = 20000000;

            if (tongTien > MAX_ALLOWED_AMOUNT) {
                AntdModal.error({
                    title: 'Thông báo',
                    content: `Đơn hàng có tổng tiền vượt quá giới hạn cho phép là ${MAX_ALLOWED_AMOUNT.toLocaleString()} VNĐ. Vui lòng giảm số lượng sản phẩm.`,
                    okText: 'OK',
                });
                return;
            }

            if (validateForm()) {
                handleSendOtp();
                handleShowEmail();
            }
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
        const phonePattern = /^0(3\d|5[689]|7[06789]|8[1-689]|9[0-46-9])\d{7}$/;

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
        if (customerId) {
            GetAllPhieuGiamGia(customerId); // Gọi API nếu customerId tồn tại
        }
    }, [customerId]); // Theo dõi customerId để gọi lại nếu giá trị thay đổi

    const GetAllPhieuGiamGia = (id) => {
        axios
            .get(`http://localhost:8080/api/gio-hang/voucher/${id}`)
            .then((response) => {
                setPhieuGiamGia(response.data); // Cập nhật state với dữ liệu từ API

                console.log('Fetched Vouchers:', response.data); // Log dữ liệu từ API
            })
            .catch((error) => {
                console.error('Error fetching Phieu Giam Gia:', error.response?.data || error.message); // Log lỗi nếu có
            });
    };


    useEffect(() => {
        autoSelectVoucher(); // Gọi API nếu customerId tồn tại
    }, [tongTien]); // Theo dõi customerId để gọi lại nếu giá trị thay đổi

    const autoSelectVoucher = () => {
        axios
            .get(`http://localhost:8080/api/gio-hang/auto/select/voucher`, {
                params: {
                    price: tongTien, // Truyền idNhanVien nếu có, nếu không thì null
                    idKH: customerId,
                },
            })
            .then((response) => {
                setPhieuGiamGiaDetail(response.data);
                setMaPhieuGiamGia(response.data.code);
                setGiamGia(response.data.discountValue);
                console.log('Fetched Vouchers select ttttttttttt ddddddddddddd:', response.data); // Log dữ liệu từ API
            })
            .catch((error) => {
                console.error('Error fetching Phieu Giam Gia:', error.response?.data || error.message); // Log lỗi nếu có
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
            toast.error('Bạn chưa chọn Voucher nào!');
            return; // Dừng hàm nếu chưa chọn voucher
        }

        // Tìm phiếu giảm giá đã chọn
        const selectedVoucher = phieuGiamGia.find(
            (phieu) => phieu.id === selectedVoucherId
        );

        if (!selectedVoucher) {
            toast.error('Phiếu giảm giá không hợp lệ!');
            return;
        }



        const { minOrderValue, maxDiscountValue } = selectedVoucher;

        // Kiểm tra điều kiện áp dụng phiếu giảm giá

        if (tongTien < minOrderValue || tongTien > maxDiscountValue) {
            const formattedMinValue = <FormatCurrency value={minOrderValue} />;
            const formattedMaxValue = <FormatCurrency value={maxDiscountValue} />;
            console.log("Mãx laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", maxDiscountValue)
            if (maxDiscountValue !== 0) {
                toast.error(
                    <span>
                        Voucher này chỉ áp dụng cho đơn hàng từ {formattedMinValue} đến {formattedMaxValue}!
                    </span>
                );
                return; // Dừng hàm nếu không đủ điều kiện
            }

        }


        // Nếu vượt qua các điều kiện, tiến hành áp dụng phiếu giảm giá
        selectedPhieuGiamGia(selectedVoucherId)
            .then((response) => {
                toast.success('Chọn thành công Voucher!');
                setMaPhieuGiamGia(response.data.code);
                setGiamGia(response.data.discountValue);
                setPhieuGiamGiaDetail(response.data);
                console.log('Phieu giam gia dc chon ', response.data);
                handleClosePhieuGiamGia();
            })
            .catch((error) => {
                console.error('Lỗi khi áp dụng voucher:', error);
                toast.error('Có lỗi xảy ra khi áp dụng voucher!');
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
        <div className="container  pt-3" style={{ backgroundColor: 'whitesmoke' }}>
            <Row display="flex" alignItems="center" className='px-2 py-2' style={{ backgroundColor: 'white', borderRadius: '8px' }} >
                <Typography>
                    <Link to="/cart" strong style={{ color: 'black', textDecoration: 'none', fontSize: '18px' }}>
                        Giỏ hàng
                    </Link>
                </Typography>
                <Typography className='mx-2' style={{ color: 'black', fontSize: '18px' }}>|</Typography>
                <Typography>
                    <Link to={`/checkout`} style={{ color: 'black', textDecoration: 'none', fontSize: '18px' }}>
                        Thông tin thanh toán
                    </Link>
                </Typography>
            </Row>
            <Row gutter={24} className='mt-3'>
                {/* Thông tin giao hàng */}
                <Col className='mb-3' span={13} style={{ marginLeft: '10px', marginRight: '30px', height: '750px', backgroundColor: 'white', borderRadius: '7px' }}>
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
                        <ToastContainer />
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
                                            <p>{gh.productDetail.product.name} {gh.productDetail.brand.name}  {gh.productDetail.collar.name} {gh.productDetail.sleeve.name}</p>
                                            <p>Size: {gh.productDetail.size.name}</p>
                                            <p style={{ fontSize: '14px' }} className='d-flex '> <p style={{ marginRight: '5px' }}> Giá:</p>
                                                {gh.productDetail.discountPercentage !== 0 ? (
                                                    <>

                                                        {/* Giá giảm */}
                                                        <span style={{
                                                            color: '#ff4d4f', // Màu đỏ nổi bật
                                                            fontWeight: 'bold',
                                                            fontSize: '16px', // Làm giá giảm nổi bật hơn
                                                            verticalAlign: 'middle', // Căn chỉnh giữa
                                                        }}>
                                                            <FormatCurrency value={gh.productDetail.price * (1 - gh.productDetail.discountPercentage / 100)} />
                                                        </span>
                                                        {/* Giá gốc */}
                                                        <span style={{
                                                            color: '#7d7d7d', // Màu xám nhạt
                                                            textDecoration: 'line-through',
                                                            fontSize: '12px',
                                                            marginRight: '8px', // Khoảng cách với giá mới
                                                            verticalAlign: 'middle', // Căn chỉnh giữa
                                                        }}>
                                                            <FormatCurrency value={gh.productDetail.price} />
                                                        </span>
                                                    </>
                                                ) : (
                                                    // Giá bình thường
                                                    <span style={{
                                                        color: '#333', // Màu đen bình thường
                                                        fontSize: '14px',
                                                        fontWeight: 'normal',
                                                    }}>
                                                        <FormatCurrency value={gh.productDetail.price} />
                                                    </span>
                                                )}
                                            </p>

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
                            <Button type="primary" className='mx-2' onClick={handleShowPhieuGiamGia}>Chọn</Button>
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
                                                    <div key={index} className="voucher-card mb-3 p-3 shadow-sm rounded border">
                                                        <div className="d-flex align-items-center px-2">
                                                            <input
                                                                className="me-3"
                                                                type="checkbox"
                                                                checked={selectedVoucherId === phieu.id}
                                                                onChange={() => handleCheckboxChangePhieu(phieu.id)}
                                                            />
                                                            {/* Ảnh phiếu giảm giá */}
                                                            <img
                                                                alt={phieu.name}
                                                                src={'/src/assets/images/ditcumay.png'}
                                                                style={{ height: "50px", objectFit: "cover", borderRadius: "8px 8px 0 0", marginRight: '10px' }}
                                                            />

                                                            {/* Thông tin chi tiết */}
                                                            <div className="voucher-details flex-grow-1">
                                                                <h5 className=" fw-bold text-primary">{phieu.name}</h5>
                                                                <p>
                                                                    <strong>Còn lại:</strong> {phieu.quantity}
                                                                </p>
                                                                <p>
                                                                    <strong>Áp dụng cho hóa đơn tối thiểu:</strong> <FormatCurrency value={phieu.minOrderValue} />
                                                                </p>
                                                                <p>
                                                                    <strong>Áp dụng tối đa:</strong> <FormatCurrency value={phieu.maxDiscountValue} />
                                                                </p>
                                                                <p>
                                                                    <strong>Giảm giá:</strong>{" "}
                                                                    {phieu.discountMethod === 'PHAN_TRAM' ? (
                                                                        `${phieu.discountValue}%`
                                                                    ) : (
                                                                        <FormatCurrency value={phieu.discountValue} />
                                                                    )}
                                                                </p>
                                                                <p>
                                                                    <strong>Hình thức giảm:</strong> {phieu.discountMethod === 'CO_DINH' ? 'Cố định' : 'Phần trăm'}
                                                                </p>
                                                            </div>
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
                                phieuGiamGiaDetail.discountMethod === 'PHAN_TRAM' ? (
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
            {/* <ToastContainer /> */}

        </div >

    );
};

export default CheckOut;
