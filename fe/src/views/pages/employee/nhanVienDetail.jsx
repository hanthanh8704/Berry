import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as request from 'views/utilities/httpRequest';
import { Modal, Form, Input, Radio } from 'antd'; // Import đầy đủ từ antd
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Paper, Box, Typography, Button, DialogActions, Grid } from '@mui/material'; // Material-UI

const NhanVienDetail = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    id: id,
    image: '',
    code: '',
    nationalId: '',
    phoneNumber: '',
    name: '',
    status: 'Đang hoạt động',
    gender: '',
    detailedAddress: '',
    email: '',
    dateOfBirth: ''
  });

  // Validate form logic remains the same
  const validateForm = () => {
    const { name, phoneNumber, email, dateOfBirth, nationalId, detailedAddress } = formValues;
    const errors = {};

    if (!name) {
      errors.name = 'Tên nhân viên không được để trống.';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber) {
      errors.phoneNumber = 'Số điện thoại không được để trống.';
    } else if (!phoneRegex.test(phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email không được để trống.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Email không hợp lệ.';
    }

    if (!dateOfBirth) {
      errors.dateOfBirth = 'Ngày sinh không được để trống.';
    }

    if (!nationalId) {
      errors.nationalId = 'CCCD không được để trống.';
    }

    if (!detailedAddress) {
      errors.detailedAddress = 'Địa chỉ không được để trống.';
    }

    if (!image) {
      errors.image = 'Hình ảnh không được để trống.';
    }

    return errors;
  };

  useEffect(() => {
    if (id) {
      loadNhanVien(id); // Load thông tin nhân viên nếu có id
    }
  }, [id]);

  const loadNhanVien = async (id) => {
    try {
      const response = await request.get(`/nhan-vien/${id}`);

      // Log toàn bộ response trước
      console.log('Response:', response);

      // Log từng trường dữ liệu
      console.log('Image:', response.image || '');
      console.log('Code:', response.code || '');
      console.log('National ID:', response.nationalId || '');
      console.log('Phone Number:', response.phoneNumber || '');
      console.log('Name:', response.name || '');
      console.log('Status:', response.status || 'Đang hoạt động');
      console.log('Gender:', response.gender || '');
      console.log('Detailed Address:', response.detailedAddress || '');
      console.log('Email:', response.email || '');
      console.log('Date of Birth:', response.dateOfBirth || '');

      setFormValues({
        image: response.image || '',
        code: response.code || '',
        nationalId: response.nationalId || '',
        phoneNumber: response.phoneNumber || '',
        name: response.name || '',
        status: response.status || 'Đang hoạt động',
        gender: response.gender || '',
        detailedAddress: response.detailedAddress || '',
        email: response.email || '',
        dateOfBirth: response.dateOfBirth || ''
      });

      // Log preview URL if available
      if (response.image) {
        console.log('Setting preview URL:', response.image);
        setPreviewUrl(response.image);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu nhân viên:', error);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
    setImage(file);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => {
        toast.error(error, { autoClose: 2000 });
      });
      return;
    }
  
    const formData = new FormData();
  
    // Thêm tất cả các trường dữ liệu khác (ngoại trừ ảnh)
    Object.keys(formValues).forEach((key) => {
      if (key !== 'image') {
        formData.append(key, formValues[key]);
      }
    });
  
    // Kiểm tra tình huống ảnh:
    if (image) {
      // Trường hợp có ảnh mới
      formData.append('image', image); 
    } else if (formValues.image === '') {
      // Trường hợp ảnh bị xóa
      formData.append('image', ''); 
    }
  
    Modal.confirm({
      title: 'Xác nhận',
      maskClosable: true,
      content: 'Xác nhận cập nhật nhân viên?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await request.put(`/nhan-vien/update/${id}`, formData);
          if (response.status === 200) {
            sessionStorage.setItem('employeeUpdateSuccess', 'Sửa thành công!');
            navigate('/nhan-vien');
          }
        } catch (error) {
          toast.error('Cập nhật nhân viên thất bại', { autoClose: 2000 });
        }
      }
    });
  };
  

  return (
    <>
      <ToastContainer />
      <Box>
        <Paper elevation={3}>
          <Typography variant="h4" gutterBottom style={{ padding: '15px 0 0 15px' }}>
            Cập nhật thông tin nhân viên
          </Typography>

          {/* Bố trí flexbox để ảnh sang phải và form sang trái */}
          <Box p={4} display="flex" justifyContent="space-between" alignItems="flex-start">
            {/* Phần form bên trái */}
            <Box flex={1}>
              <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Grid container spacing={2}>
                  {/* Dùng lưới để thu gọn form */}
                  <Grid item xs={12} sm={6}>
                    <Form.Item label="Mã nhân viên">
                      <Input name="code" value={formValues.code} onChange={handleChange} disabled />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Item label="Tên nhân viên">
                      <Input name="name" value={formValues.name} onChange={handleChange} />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Item label="Số điện thoại">
                      <Input name="phoneNumber" value={formValues.phoneNumber} onChange={handleChange} />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Item label="Email">
                      <Input name="email" value={formValues.email} onChange={handleChange} />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Item label="Ngày sinh">
                      <Input name="dateOfBirth" value={formValues.dateOfBirth} onChange={handleChange} type="date" />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Item label="CCCD">
                      <Input name="nationalId" value={formValues.nationalId} onChange={handleChange} />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12}>
                    <Form.Item label="Địa chỉ">
                      <Input name="detailedAddress" value={formValues.detailedAddress} onChange={handleChange} style={{ width: '100%' }} />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Item label="Giới tính">
                      <Radio.Group name="gender" value={formValues.gender} onChange={handleChange}>
                        <Radio value="Nam">Nam</Radio>
                        <Radio value="Nữ">Nữ</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Item label="Trạng thái">
                      <Radio.Group name="status" value={formValues.status} onChange={handleChange}>
                        <Radio value="Đang hoạt động">Đang hoạt động</Radio>
                        <Radio value="Ngừng hoạt động">Ngừng hoạt động</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Grid>
                </Grid>

                {/* Nút Lưu và Hủy */}
                <Box mt={4} display="flex" justifyContent="flex-end">
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      style={{
                        backgroundColor: '#5e35b1',
                        borderColor: '#5e35b1',
                        borderRadius: '6px',
                        fontWeight: '600',
                        marginRight: '10px'
                      }}
                    >
                      Lưu
                    </Button>
                    <Button variant="contained" onClick={() => navigate('/nhan-vien')} style={{ borderRadius: '6px', fontWeight: '600' }}>
                      Hủy
                    </Button>
                  </DialogActions>
                </Box>
              </Form>
            </Box>

            {/* Phần ảnh bên phải */}
            <Box ml={3} style={{ width: '500px' }}>
              <Form.Item>
                {previewUrl || formValues.image ? ( // Hiển thị ảnh nếu có preview hoặc ảnh cũ
                  <div className="text-center position-relative">
                    <img
                      src={previewUrl || formValues.image} // Hiển thị ảnh mới hoặc ảnh cũ
                      alt="Preview"
                      style={{ width: '162px', height: '162px' }}
                      className="mt-2 border border-warning shadow-lg bg-body-tertiary rounded-circle object-fit-contain"
                    />
                    <Button
                      className="position-absolute"
                      onClick={() => {
                        setPreviewUrl(null);
                        setImage(null);
                        setFormValues({ ...formValues, image: '' });
                      }}
                      style={{ top: '10px', right: '10px', borderRadius: '50%' }}
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center">
                    <div
                      className="position-relative rounded-circle border border-warning mt-2 d-flex align-items-center justify-content-center"
                      style={{ width: '162px', height: '162px' }}
                    >
                      <Input type="file" accept="image/*" onChange={handleImageSelect} className="position-absolute opacity-0 py-5" />
                      <div className="text-center text-secondary">Chọn ảnh</div>
                    </div>
                  </div>
                )}
              </Form.Item>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default NhanVienDetail;
