
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

const User = ({ onSuccess }) => {
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
    });
    const idKH = 2;

    useEffect(() => {
        detailKHClient(idKH);
    }, []);

    const detailKHClient = async (id) => {
        try {
            const response = await detailKH(id);
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
                    formData.append('dateOfBirth', ngaySinh ? ngaySinh.format('YYYY-MM-DD') : '');

                    if (imageFile) {
                        formData.append('image', imageFile); // Chỉ thêm image nếu có thay đổi
                    }

                    try {
                        const response = await updateKH(idKH, formData);
                        if (response.status === 200) {
                            toast.success("Cập nhật thông tin khách hàng thành công!");
                            setImageUrl(response.data.imageStr || '');
                            setPreviewUrl(response.data.imageStr || '');
                            setImageFile(null); // Reset imageFile sau khi cập nhật thành công
                            if (onSuccess) {
                                onSuccess(response.data.imageStr); // Truyền URL ảnh mới lên
                            }
                        } else {
                            toast.error("Cập nhật thông tin khách hàng thất bại!");
                        }
                    } catch (error) {
                        toast.error("Đã xảy ra lỗi khi cập nhật thông tin khách hàng!");
                        console.error(error);
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
                                    style={{ width: '100%' }}
                                    value={ngaySinh}
                                    onChange={(date) => setNgaySinh(date)}
                                    format="DD-MM-YYYY"
                                />
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
