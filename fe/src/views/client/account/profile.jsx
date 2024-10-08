//Việt
// import 'bootstrap/dist/css/bootstrap.min.css';
// import React, { useState, useEffect } from 'react';
// import { Input, Button, Avatar, Upload, message, DatePicker, Modal } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { detailKH, updateKH } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import moment from 'moment';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const { confirm } = Modal;

// const User = () => {
//     const [khachHang, setKhachHang] = useState(null);
//     const [hoTen, setHoTen] = useState('');
//     const [soDienThoai, setSoDienThoai] = useState('');
//     const [diaChiCuThe, setDiaChiCuThe] = useState('');
//     const [email, setEmail] = useState('');
//     const [ngaySinh, setNgaySinh] = useState(null);
//     const [anh, setAnh] = useState(null);
//     const [errors, setErrors] = useState({
//         hoTen: '',
//         soDienThoai: '',
//         email: '',
//         diaChiCuThe: '',
//     });
//     const idKH = 2;

//     useEffect(() => {
//         detailKHClient(idKH);
//     }, []);

//     const detailKHClient = async (id) => {
//         try {
//             const response = await detailKH(id);
//             setKhachHang(response.data);
//             setHoTen(response.data.hoTen || '');
//             setEmail(response.data.email || '');
//             setSoDienThoai(response.data.soDienThoai || '');
//             setNgaySinh(response.data.ngaySinh ? moment(response.data.ngaySinh) : null);
//             setDiaChiCuThe(response.data.diaChi || '');
//             setAnh(response.data.anh || null);
//         } catch (error) {
//             message.error('Đã xảy ra lỗi khi tải thông tin khách hàng.');
//             console.error(error);
//         }
//     };

//     const validateForm = () => {
//         let valid = true;
//         const errorsCopy = { ...errors };

//         // Validate họ tên
//         if (!hoTen.trim()) {
//             errorsCopy.hoTen = 'Họ tên không được để trống!';
//             valid = false;
//         } else if (hoTen.length > 50) {
//             errorsCopy.hoTen = 'Tên không được vượt quá 50 kí tự!';
//             valid = false;
//         } else {
//             errorsCopy.hoTen = '';
//         }

//         // Validate số điện thoại
//         const phonePattern = /^0[1-9]\d{8,9}$/;
//         if (!soDienThoai.trim()) {
//             errorsCopy.soDienThoai = 'Số điện thoại không được để trống!';
//             valid = false;
//         } else if (!phonePattern.test(soDienThoai)) {
//             errorsCopy.soDienThoai = 'Số điện thoại không đúng định dạng!';
//             valid = false;
//         } else {
//             errorsCopy.soDienThoai = '';
//         }

//         // Validate email
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!email.trim()) {
//             errorsCopy.email = 'Email không được để trống!';
//             valid = false;
//         } else if (!emailPattern.test(email)) {
//             errorsCopy.email = 'Email không đúng định dạng!';
//             valid = false;
//         } else {
//             errorsCopy.email = '';
//         }

//         // Validate địa chỉ cụ thể
//         if (!diaChiCuThe.trim()) {
//             errorsCopy.diaChiCuThe = 'Địa chỉ cụ thể không được để trống!';
//             valid = false;
//         } else if (diaChiCuThe.length > 50) {
//             errorsCopy.diaChiCuThe = 'Địa chỉ cụ thể không được vượt quá 50 kí tự!';
//             valid = false;
//         } else {
//             errorsCopy.diaChiCuThe = '';
//         }

//         setErrors(errorsCopy);
//         return valid;
//     };

//     const handleSubmit = () => {
//         if (validateForm()) {
//             confirm({
//                 title: 'Xác nhận',
//                 maskClosable: true,
//                 content: 'Bạn có chắc chắn muốn lưu thay đổi này?',
//                 okText: 'Xác nhận',
//                 cancelText: 'Hủy',
//                 onOk: async () => {
//                     const khachHang = {
//                         hoTen,
//                         email,
//                         soDienThoai,
//                         ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DD') : null,
//                         // anh,
//                     };

//                     try {
//                         const response = await updateKH(idKH, khachHang);
//                         if (response.status === 200) {
//                             toast.success("Cập nhật thông tin khách hàng thành công!");
//                         } else {
//                             toast.error("Cập nhật thông tin khách hàng thất bại!");
//                         }
//                     } catch (error) {
//                         toast.error("Đã xảy ra lỗi khi cập nhật thông tin khách hàng!");
//                         console.error(error);
//                     }
//                 },
//             });
//         } else {
//             message.error('Vui lòng kiểm tra lại thông tin!');
//         }
//     };

//     const handleUpload = async (info) => {
//         if (info.file.status === 'done') {
//             setAnh(info.file.response.url);
//             message.success(`${info.file.name} tải lên thành công.`);
//         } else if (info.file.status === 'error') {
//             message.error(`${info.file.name} tải lên thất bại.`);
//         }
//     };

//     return (
//         <div className="container py-3 px-5" style={{ backgroundColor: 'white' }}>
//             <h4>Hồ sơ của tôi</h4>
//             <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
//             <div
//                 style={{
//                     backgroundColor: 'white',
//                     padding: '20px',
//                     borderRadius: '8px',
//                     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//                 }}
//             >
//                 <div className="row">
//                     {/* Cột bên trái cho Avatar */}
//                     <div className="col-md-4 text-center mb-4">
//                         <Avatar size={100} src={anh || 'https://via.placeholder.com/150'} alt="Ảnh khách hàng" />
//                         <div className="mt-2">
//                             <Upload
//                                 name="avatar"
//                                 listType="picture"
//                                 showUploadList={false}
//                                 beforeUpload={(file) => {
//                                     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//                                     const isLt1M = file.size / 1024 / 1024 < 1;
//                                     if (!isJpgOrPng) {
//                                         message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
//                                     }
//                                     if (!isLt1M) {
//                                         message.error('Dung lượng file phải nhỏ hơn 1MB!');
//                                     }
//                                     return isJpgOrPng && isLt1M;
//                                 }}
//                                 customRequest={async ({ file, onSuccess, onError }) => {
//                                     const formData = new FormData();
//                                     formData.append('file', file);

//                                     try {
//                                         const response = await fetch('/api/upload', { // Thay đổi đường dẫn API upload của bạn
//                                             method: 'POST',
//                                             body: formData,
//                                         });
//                                         const data = await response.json();
//                                         if (data.success) {
//                                             onSuccess(data);
//                                             setAnh(data.url);
//                                         } else {
//                                             onError(new Error('Tải ảnh thất bại'));
//                                         }
//                                     } catch (err) {
//                                         onError(err);
//                                     }
//                                 }}
//                             >
//                                 <Button icon={<UploadOutlined />}>Tải ảnh</Button>
//                             </Upload>
//                         </div>
//                         <p className="mt-2">Dung lượng file phải nhỏ hơn 1MB!</p>
//                     </div>

//                     {/* Cột bên phải cho các trường nhập liệu */}
//                     <div className="col-md-8">
//                         <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
//                             <div className="mb-3">
//                                 <label className="form-label">Tên khách hàng</label>
//                                 <Input
//                                     name="hoTen"
//                                     value={hoTen}
//                                     onChange={(e) => setHoTen(e.target.value)}
//                                     placeholder="Tên khách hàng"
//                                 />
//                                 {errors.hoTen && <div className="text-danger">{errors.hoTen}</div>}
//                             </div>

//                             <div className="mb-3">
//                                 <label className="form-label">Số điện thoại</label>
//                                 <Input
//                                     name="soDienThoai"
//                                     value={soDienThoai}
//                                     onChange={(e) => setSoDienThoai(e.target.value)}
//                                     placeholder="Số điện thoại"
//                                 />
//                                 {errors.soDienThoai && <div className="text-danger">{errors.soDienThoai}</div>}
//                             </div>

//                             <div className="mb-3">
//                                 <label className="form-label">Email</label>
//                                 <Input
//                                     name="email"
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     placeholder="Email"
//                                 />
//                                 {errors.email && <div className="text-danger">{errors.email}</div>}
//                             </div>

//                             <div className="mb-3">
//                                 <label className="form-label">Ngày sinh</label>
//                                 <DatePicker
//                                     style={{ width: '100%' }}
//                                     value={ngaySinh}
//                                     onChange={(date) => setNgaySinh(date)}
//                                     format="DD-MM-YYYY"
//                                 />
//                             </div>

//                             <Button type="primary" htmlType="submit">Cập nhật</Button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//             <ToastContainer />
//         </div>
//     );
// };

// export default User;


//Bản Anh
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Input, Button, Avatar, Upload, message, DatePicker, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { detailKH, updateKH } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { confirm } = Modal;

const User = () => {
    const [khachHang, setKhachHang] = useState(null);
    const [hoTen, setHoTen] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [diaChiCuThe, setDiaChiCuThe] = useState('');
    const [email, setEmail] = useState('');
    const [ngaySinh, setNgaySinh] = useState(null);
    const [anh, setAnh] = useState(null);
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
            // setDiaChiCuThe(response.data.diaChi || '');
            setAnh(response.data.image || null);
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tải thông tin khách hàng.');
            console.error(error);
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

        setErrors(errorsCopy);
        return valid;
    };

    const handleSubmit = () => {
        // if (validateForm()) {
        confirm({
            title: 'Xác nhận',
            maskClosable: true,
            content: 'Bạn có chắc chắn muốn lưu thay đổi này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                const khachHang = {
                    fullName: hoTen,
                    email: email,
                    phoneNumber: soDienThoai,
                    dateOfBirth: ngaySinh ? ngaySinh.format('YYYY-MM-DD') : null,
                    // imgae : anh,
                };

                try {
                    const response = await updateKH(idKH, khachHang);
                    if (response.status === 200) {
                        toast.success("Cập nhật thông tin khách hàng thành công!");
                    } else {
                        toast.error("Cập nhật thông tin khách hàng thất bại!");
                    }
                } catch (error) {
                    toast.error("Đã xảy ra lỗi khi cập nhật thông tin khách hàng!");
                    console.error(error);
                }
            },
        });
        // } else {
        //     message.error('Vui lòng kiểm tra lại thông tin!');
        // }
    };

    const handleUpload = async (info) => {
        if (info.file.status === 'done') {
            setAnh(info.file.response.url);
            message.success(`${info.file.name} tải lên thành công.`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} tải lên thất bại.`);
        }
    };

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
                        <Avatar size={100} src={anh || 'https://via.placeholder.com/150'} alt="Ảnh khách hàng" />
                        <div className="mt-2">
                            <Upload
                                name="avatar"
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
                                    return isJpgOrPng && isLt1M;
                                }}
                                customRequest={async ({ file, onSuccess, onError }) => {
                                    const formData = new FormData();
                                    formData.append('file', file);

                                    try {
                                        const response = await fetch('/api/upload', { // Thay đổi đường dẫn API upload của bạn
                                            method: 'POST',
                                            body: formData,
                                        });
                                        const data = await response.json();
                                        if (data.success) {
                                            onSuccess(data);
                                            setAnh(data.url);
                                        } else {
                                            onError(new Error('Tải ảnh thất bại'));
                                        }
                                    } catch (err) {
                                        onError(err);
                                    }
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
