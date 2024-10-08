import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, FormControlLabel, Typography, Paper, Divider, Switch, FormControl, FormLabel } from '@mui/material';
import { Input, Modal, Form, Radio } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as request from 'views/utilities/httpRequest';
import AddressCustomerDetail from 'components/Customer/AddressCustomerDetail';

const DetailCustomer = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [anh, setAnh] = useState(null);
  const [customer, setCustomer] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [trangThai, setTrangThai] = useState(true);

  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setAnh(file);
    } catch (e) {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const loadCustomer = () => {
    request
      .get(`/customer/${id}`)
      .then((response) => {
        setCustomer(response);
        form.setFieldsValue({
          hoTen: response.hoTen,
          ngaySinh: response.ngaySinh,
          gioiTinh: response.gioiTinh || '',
          email: response.email,
          soDienThoai: response.soDienThoai,
          trangThai: response.trangThai !== 'Ngừng hoạt động' ? response.trangThai : 'Đang hoạt động'
        });
        setTrangThai(response.trangThai !== 'Ngừng hoạt động' ? response.trangThai : 'Đang hoạt động');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateCustomer = (data) => {
    const formData = new FormData();
    if (anh !== null) {
      formData.append('anh', anh);
    }
    formData.append('hoTen', data.hoTen);
    formData.append('gioiTinh', data.gioiTinh);
    formData.append('email', data.email);
    formData.append('ngaySinh', data.ngaySinh);
    formData.append('soDienThoai', data.soDienThoai);
    formData.append('trangThai', data.trangThai);

    Modal.confirm({
      title: 'Xác nhận',
      maskClosable: true,
      content: 'Xác nhận cập nhật khách hàng?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        request
          .put(`/customer/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .then((response) => {
            if (response.data.success) {
              toast.success('Cập nhật thành công!');
              setAnh(null);
              setPreviewUrl(null);
              navigate('/api/customer');
            }
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data);
          });
      }
    });
  };

  const onFinish = (values) => {
    updateCustomer(values);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h3" gutterBottom>
            Chi tiết khách hàng
          </Typography>
          <Form form={form} onFinish={onFinish}>
            <Grid container spacing={2}>
              <Grid item xs={12} className="text-center">
                {previewUrl !== null ? (
                  <div className="text-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ width: '162px', height: '162px' }}
                      className="mt-2 border border-warning shadow-lg bg-body-tertiary rounded-circle object-fit-contain"
                    />
                    <Button
                      className="position-absolute border-0"
                      onClick={() => {
                        setPreviewUrl(null);
                        setAnh(null);
                      }}
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
                      <div className="text-center text-secondary">
                        <img
                          src={customer.anh}
                          alt="Preview"
                          style={{ width: '162px', height: '162px' }}
                          className="border border-warning shadow-lg bg-body-tertiary rounded-circle object-fit-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                <Form.Item
                  label="Tên khách hàng"
                  name="hoTen"
                  rules={[
                    { required: true, message: 'Tên không được để trống!' },
                    { pattern: /^[^\d!@#$%^&*()_+={}\\:;"'<>,.?/`~|-]+$/, message: 'Tên phải là chữ' }
                  ]}
                >
                  <Input placeholder="Nhập tên khách hàng..." />
                </Form.Item>
              </Grid>
              <Grid item xs={12} md={6}>
                <Form.Item label="Giới tính" name="gioiTinh" rules={[{ required: true, message: 'Giới tính không được để trống!' }]}>
                  <Radio.Group>
                    <Radio value="Nam">Nam</Radio>
                    <Radio value="Nữ">Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Grid>
              <Grid item xs={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Email không được để trống!' },
                    { type: 'email', message: 'Email không đúng định dạng!' }
                  ]}
                >
                  <Input placeholder="Nhập email ..." />
                </Form.Item>
              </Grid>
              <Grid item xs={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="soDienThoai"
                  rules={[
                    { required: true, message: 'Số điện thoại không được để trống!' },
                    { pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không đúng định dạng!' }
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại ..." />
                </Form.Item>
              </Grid>
              <Grid item xs={12}>
                <Form.Item label="Ngày sinh" name="ngaySinh" rules={[{ required: true, message: 'Ngày sinh không được để trống!' }]}>
                  <Input type="date" />
                </Form.Item>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Trạng thái</FormLabel>
                  <FormControlLabel
                    control={
                      <Form.Item name="trangThai" valuePropName="checked" initialValue={true}>
                        <Switch color="primary" checked={trangThai} onChange={() => setTrangThai(!trangThai)} />
                      </Form.Item>
                    }
                    label={trangThai ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" color="primary" type="submit">
                  Cập nhật
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Thông tin địa chỉ</Typography>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <AddressCustomerDetail idKhachHang={id} />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default DetailCustomer;
