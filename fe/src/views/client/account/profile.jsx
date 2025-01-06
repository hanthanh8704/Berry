
//Bản Anh
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Input, Button, Avatar, Upload, message, DatePicker, Modal, Grid } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { detailKH, updateKH } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { confirm } = Modal;

const User = () => {

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
        }
    }, []);

    console.log("User sau khi đăng nhập User:", user);

    const [khachHang, setKhachHang] = useState(null);
    const [hoTen, setHoTen] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [diaChiCuThe, setDiaChiCuThe] = useState('');
    const [email, setEmail] = useState('');
    const [ngaySinh, setNgaySinh] = useState(null);

    const [imageUrl, setImageUrl] = useState(''); // URL ảnh từ backend
    const [imageFile, setImageFile] = useState(null); // Tệp ảnh mới nếu có
    const [previewUrl, setPreviewUrl] = useState(''); // URL để hiển thị preview

    const [errors, setErrors] = useState({
        hoTen: '',
        soDienThoai: '',
        email: '',
        diaChiCuThe: '',
        ngaySinh: ''
    });

    // Kiểm tra và lấy customerId từ user
    const customerId = user ? user.customerId : null;

    // Gọi hàm lấy chi tiết khách hàng khi user đã có
    useEffect(() => {
        if (customerId) {
            detailKHClient(customerId);
        }
    }, [customerId]); // Chạy lại khi customerId thay đổi

    const detailKHClient = async (id) => {
        try {
            const response = await detailKH(id); // Giả sử bạn đã định nghĩa hàm này
            setKhachHang(response.data);
            setHoTen(response.data.fullName || '');
            setEmail(response.data.email || '');
            setSoDienThoai(response.data.phoneNumber || '');
            setNgaySinh(response.data.dateOfBirth ? moment(response.data.dateOfBirth) : null);
            setImageUrl(response.data.imageStr || '');
            setPreviewUrl(response.data.imageStr || '');
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tải thông tin khách hàng.');
            console.error(error);
        }
    };


    //Của anh 
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Kiểm tra định dạng và kích thước đã được xử lý trong Upload component
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
            setImageFile(file); // Cập nhật file ảnh vào state để gửi lên server
        }
    };


    const [messageError, setMessageError] = useState('');

    const validateForm = () => {
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

        // Validate số điện thoại
        const phonePattern = /^0[1-9]\d{8,9}$/;
        if (!soDienThoai.trim()) {
            errorsCopy.soDienThoai = 'Số điện thoại không được để trống!';
            valid = false;
        } else if (!phonePattern.test(soDienThoai)) {
            errorsCopy.soDienThoai = 'Số điện thoại không đúng định dạng!';
            valid = false;
        } else {
            errorsCopy.soDienThoai = '';
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            errorsCopy.email = 'Email không được để trống!';
            valid = false;
        } else if (!emailPattern.test(email)) {
            errorsCopy.email = 'Email không đúng định dạng!';
            valid = false;
        } else {
            errorsCopy.email = '';
        }

        // Validate ngày sinh

        if (!ngaySinh) {
            errorsCopy.ngaySinh = 'Ngày sinh không được để trống!';
            valid = false;
        } else {
            errorsCopy.ngaySinh = '';
            // setMessageError('');
        }

        // else if (messageError || '') {
        //     errorsCopy.ngaySinh = messageError;  // Hiển thị lỗi từ backend nếu có
        //     valid = false;
        // } 
        setErrors(errorsCopy);
        return valid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            confirm({
                title: 'Xác nhận',
                maskClosable: true,
                content: 'Bạn có chắc chắn muốn lưu thay đổi này?',
                okText: 'Xác nhận',
                cancelText: 'Hủy',
                onOk: async () => {
                    const formData = new FormData();
                    formData.append('fullName', hoTen);
                    formData.append('email', email);
                    formData.append('phoneNumber', soDienThoai);
                    formData.append('dateOfBirth', ngaySinh);

                    if (imageFile) {
                        formData.append('image', imageFile); // Chỉ thêm image nếu có thay đổi
                    }

                    try {
                        const response = await updateKH(customerId, formData);
                        if (response.status === 200) {
                            toast.success("Cập nhật thông tin khách hàng thành công!");
                            // Kiểm tra nếu response.data.imageStr có giá trị hợp lệ
                            if (response.data.imageStr) {
                                setImageUrl(response.data.imageStr); // Cập nhật URL ảnh mới
                                setPreviewUrl(response.data.imageStr); // Cập nhật ảnh xem trước
                            }

                            setImageFile(null); // Reset imageFile sau khi cập nhật thành công

                            // if (onSuccess) {
                            //     onSuccess(); // Truyền URL ảnh mới lên (nếu có onSuccess)
                            // }
                        } else {
                            toast.error("Cập nhật thông tin khách hàng thất bại!");
                        }
                    } catch (error) {
                        const errorMessage = error.response?.data.data;
                        setMessageError(errorMessage);
                        toast.error(errorMessage);
                        console.error('errrrrrrrrrrrrrrrrrrrrrrrrr', error);
                    }
                },
            });
        } else {
            message.error('Vui lòng kiểm tra lại thông tin!');
        }
    }

    return (
        <div className="container py-3 px-5" style={{ backgroundColor: 'white' }}>
            <h4>Hồ sơ của tôi</h4>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div className="row">
                    {/* Cột bên trái cho Avatar */}
                    <div className="col-md-4 text-center mb-4">
                        <Avatar size={100} src={previewUrl || imageUrl} alt="Ảnh khách hàng" />
                        <div className="mt-2">
                            <Upload
                                name="anh"
                                listType="picture"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                                    const isLt1M = file.size / 1024 / 1024 < 1;
                                    if (!isJpgOrPng) {
                                        message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
                                    }
                                    if (!isLt1M) {
                                        message.error('Dung lượng file phải nhỏ hơn 1MB!');
                                    }
                                    if (isJpgOrPng && isLt1M) {
                                        handleImageSelect({ target: { files: [file] } }); // Gọi hàm xử lý khi chọn ảnh
                                    }
                                    return false; // Chặn Upload tự động của Ant Design
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                            </Upload>
                        </div>
                        <p className="mt-2">Dung lượng file phải nhỏ hơn 1MB!</p>
                    </div>
                    {/* Cột bên phải cho các trường nhập liệu */}
                    <div className="col-md-8">
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <div className="mb-3">
                                <label className="form-label">Tên khách hàng</label>
                                <Input
                                    name="hoTen"
                                    value={hoTen}
                                    onChange={(e) => setHoTen(e.target.value)}
                                    placeholder="Tên khách hàng"
                                />
                                {errors.hoTen && <div className="text-danger">{errors.hoTen}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <Input
                                    name="soDienThoai"
                                    value={soDienThoai}
                                    onChange={(e) => setSoDienThoai(e.target.value)}
                                    placeholder="Số điện thoại"
                                />
                                {errors.soDienThoai && <div className="text-danger">{errors.soDienThoai}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                />
                                {errors.email && <div className="text-danger">{errors.email}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Ngày sinh </label>
                                <DatePicker
                                    name="ngaySinh"
                                    style={{ width: '100%' }}
                                    value={ngaySinh}
                                    onChange={(date) => setNgaySinh(date)}
                                    format="DD-MM-YYYY"
                                />
                                {errors.ngaySinh && <div className="text-danger">{errors.ngaySinh}</div>}
                            </div>


                            <Button type="primary" htmlType="submit">Cập nhật</Button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default User;
