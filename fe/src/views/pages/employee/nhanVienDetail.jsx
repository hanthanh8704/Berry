import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as request from 'views/utilities/httpRequest';
import { Modal, Form, Input, Radio, message, notification } from 'antd';
import { Paper, Box, Typography, Button, DialogActions, Grid } from '@mui/material';

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

  useEffect(() => {
    if (id) {
      loadNhanVien(id);
    }
  }, [id]);

  const loadNhanVien = async (id) => {
    try {
      const response = await request.get(`/nhan-vien/${id}`);
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
      if (response.image) {
        setPreviewUrl(response.image);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu nhân viên:', error);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setImage(file);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onSubmit = async () => {
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      if (key !== 'image') {
        formData.append(key, formValues[key]);
      }
    });

    if (image) {
      formData.append('image', image);
    } else if (!formValues.image) {
      formData.append('image', 'ảnh trống');
    }

    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc muốn cập nhật thông tin nhân viên?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await request.put(`/nhan-vien/update/${id}`, formData);
          if (response.status === 200) {
            notification.success({ message: 'Cập nhật thành công!' });
            navigate('/employee');
          }
        } catch (error) {
          message.error(error.response.data.message || 'Đã xảy ra lỗi!');
        }
      }
    });
  };

  return (
    <Box>
      <Paper elevation={3}>
        <Typography variant="h4" gutterBottom style={{ padding: '15px 0 0 15px' }}>
          Cập nhật thông tin nhân viên
        </Typography>
        <Box p={4} display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Form form={form} layout="vertical" onFinish={onSubmit}>
              <Grid container spacing={2}>
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
                    <Input name="detailedAddress" value={formValues.detailedAddress} onChange={handleChange} />
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
              <Box mt={4} display="flex" justifyContent="flex-end">
                <DialogActions>
                  <Button variant="contained" color="primary" type="submit">
                    Lưu
                  </Button>
                  <Button variant="contained" onClick={() => navigate('/employee')}>
                    Hủy
                  </Button>
                </DialogActions>
              </Box>
            </Form>
          </Box>
          <Box ml={3} style={{ width: '500px' }}>
            <Form.Item>
              {previewUrl || formValues.image ? (
                <div className="text-center position-relative">
                  <img
                    src={previewUrl || formValues.image}
                    alt="Preview"
                    style={{ width: '162px', height: '162px', borderRadius: '50%' }}
                  />
                  <Button
                    onClick={() => {
                      setPreviewUrl(null);
                      setImage(null);
                      setFormValues({ ...formValues, image: '' });
                    }}
                  >
                    Xóa ảnh
                  </Button>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center">
                  <div
                    className="position-relative rounded-circle"
                    style={{ width: '162px', height: '162px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Input type="file" accept="image/*" onChange={handleImageSelect} style={{ position: 'absolute', opacity: 0 }} />
                    <Typography>Chọn ảnh</Typography>
                  </div>
                </div>
              )}
            </Form.Item>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NhanVienDetail;
