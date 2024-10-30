


//Bản Anh
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Form, Select, Input, Button, Row, Col } from 'antd';
import { detailKH, createDiaChi, updateDiaChi } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { Modal } from 'react-bootstrap';
import { Modal as AntdModal, message } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
const { Option } = Select;


const Address = () => {
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

    // console.log("User sau khi đăng nhập product detail:", user);

    // Kiểm tra nếu `user` đã có dữ liệu thì mới truy xuất `customerId`
    if (user) {
        // console.log("Customer ID:", customerId);
    } else {
        console.log("User chưa được load");
    }

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


    const handleProvinceChange = (provinceCode) => {
        setThanhPho(provinceCode);
        setHuyen(null);
        setPhuong(null);
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


    const detail = async () => {
        try {
            const response = await detailKH(customerId);
            setKhachHang(response.data);
            if (response.data.listAddress && response.data.listAddress.length > 0) {
                const diaChiMacDinh = response.data.listAddress.find(diaChi => diaChi.defaultAddress === true);
                if (diaChiMacDinh) {
                    setSelectedAddressId(diaChiMacDinh.id);
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

    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleCreateDC = async () => {
        if (validateFormCreteDC()) {
            AntdModal.confirm({
                title: 'Xác nhận',
                maskClosable: true,
                content: 'Bạn có chắc chắn muốn thêm địa chỉ này?',
                okText: 'Xác nhận',
                cancelText: 'Hủy',
                onOk: async () => {
                    const diaCHi = {
                        customerId: customerId,
                        fullName: hoTen,
                        phoneNumber: soDienThoai,
                        city: thanhPho,
                        district: huyen,
                        ward: phuong,
                        detailedAddress: diaChiCuThe,
                    };

                    try {
                        const response = await createDiaChi(diaCHi);
                        if (response.status === 200) {
                            toast.success("Thêm địa chỉ mới thành công!");
                        }
                        setTimeout(() => {
                            handleClose();
                            detail();
                        }, 2000);
                    } catch (error) {
                        console.error('Error creating address:', error);
                        toast.error("Thêm địa chỉ không thành công!");
                    }
                },
            });
        } else {
            toast.error('Vui lòng kiểm tra lại thông tin!');
        }
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


    //Check box cuar dia chi 
    const [selectedAddressId, setSelectedAddressId] = useState(null);

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

    const handleCheckboxChange = (id) => {
        setSelectedAddressId(id); // Cập nhật ID địa chỉ được chọn
    };
    // Hàm để chọn địa chỉ mặc định
    const handleSelectDefaultAddress = () => {
        const defaultAddress = khachHang?.listAddress?.find(diaChi => diaChi.defaultAddress === true);
        if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id); // Cập nhật ID địa chỉ mặc định
        }
    };

    useEffect(() => {
        handleSelectDefaultAddress();
    }, []);

    // useEffect(() => {
    //     // Gọi lại API lấy districts và wards khi ID của tỉnh hoặc huyện thay đổi
    //     if (thanhPho) fetchDistricts(thanhPho);
    //     if (huyen) fetchWards(huyen);
    // }, [thanhPho, huyen]); 


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
        <div className="container py-3 px-5" style={{ backgroundColor: 'white' }}>
            <h3>Địa Chỉ của tôi</h3>
            <Button type="primary" onClick={handleShow} style={{ marginBottom: '20px' }}>
                + Thêm địa chỉ
            </Button>
            <div>
                {
                    khachHang ? (
                        <div className="d-flex flex-column">
                            {khachHang.listAddress.length > 0 ? (
                                khachHang.listAddress.map((diaChi, index) => {
                                    return (
                                        <div key={index} className="d-flex mb-3">
                                            <div className="flex-grow-1">
                                                <input
                                                    className='mx-2'
                                                    type="checkbox"
                                                    checked={selectedAddressId === diaChi.id}
                                                    onChange={() => handleCheckboxChange(diaChi.id)}
                                                />
                                                <b>{diaChi.fullName} - {diaChi.phoneNumber}</b>
                                                <p>{addressDetails[diaChi.id] || 'Đang tải...'}</p>
                                                <p>
                                                    {diaChi.defaultAddress ? (
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
                                            {selectedAddressId === diaChi.id && (
                                                <div style={{ marginLeft: '30px' }}>
                                                    <Button
                                                        style={{ backgroundColor: diaChi.defaultAddress ? '#6A0DAD' : 'white', color: diaChi.defaultAddress ? 'white' : 'black' }}
                                                        onClick={() => handleSetDefaultAddress(diaChi.id)}
                                                        disabled={diaChi.defaultAddress}
                                                    >
                                                        {diaChi.defaultAddress ? 'Mặc định' : 'Thiết lập mặc định'}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p>Chưa có địa chỉ nào</p>
                            )}
                        </div>
                    ) : (
                        <p>Đang tải dữ liệu...</p>
                    )
                }

                <Modal
                    show={showModal}
                    onHide={handleClose}
                    dialogClassName="modal-90w"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Thêm mới địa chỉ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form layout="vertical">
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item label="Họ và Tên" required>
                                        <Input
                                            onChange={(e) => setHoTen(e.target.value)}
                                            placeholder="Nhập họ tên"
                                        />
                                        {errors.hoTen && <div style={{ color: 'red' }}>{errors.hoTen}</div>}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Số Điện Thoại" required>
                                        <Input
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
                                            // value={thanhPho|| undefined}
                                            onChange={handleProvinceChange}
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
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
                                            value={huyen || undefined}
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
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={handleClose}>Đóng</Button>
                        <Button type="primary" onClick={handleCreateDC}>Thêm</Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer />
            </div>
        </div>
    );
};

export default Address;
