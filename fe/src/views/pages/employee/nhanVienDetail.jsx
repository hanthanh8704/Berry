import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as request from 'views/utilities/httpRequest';
import { Modal, Form, Input,Col } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import {Paper,Box,Typography,TextField,Button,Grid,RadioGroup,Radio,FormControlLabel,FormControl,FormLabel,DialogActions} from '@mui/material';
import { Option } from "antd/es/mentions";
import GHNDetail from 'ui-component/GHNDetail';

const NhanVienDetail = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [anh, setAnh] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    id: id,
    ma: '',
    cccd: '',
    soDienThoai: '',
    ten: '',
    trangThai: 'Đang hoạt động',
    gioiTinh: '',
    diaChi: '',
    thanhPho: '',
    huyen: '',
    phuong: '',
    email: '',
    ngaySinh: '',
    chucVu: ''
  });

  const [thanhPho, setThanhPho] = useState([]);
  const [huyen, setHuyen] = useState([]);
  const [phuong, setPhuong] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const configApi = {
    headers: {
      "Content-Type": "application/json",
      Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694",
      ShopId: 192796,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`/nhan-vien/${id}`);
        console.log('API Response:', response);
        const nhanvienData = response;
        setFormValues({
          anh: nhanvienData.anh || '',
          ma: nhanvienData.ma || '',
          cccd: nhanvienData.cccd || '',
          soDienThoai: nhanvienData.soDienThoai || '',
          ten: nhanvienData.ten || '',
          trangThai: nhanvienData.trangThai || 'Đang hoạt động',
          gioiTinh: nhanvienData.gioiTinh || '',
          diaChi: nhanvienData.diaChi || '',
          thanhPho: nhanvienData.thanhPho || '',
          phuong: nhanvienData.phuong || '',
          huyen: nhanvienData.huyen || '',
          email: nhanvienData.email || '',
          ngaySinh: nhanvienData.ngaySinh || '',
          chucVu: nhanvienData.chucVu || ''
        });

        if (nhanvienData.anh) {
          setPreviewUrl(nhanvienData.anh);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
    

    fetchData();

    // Fetch provinces data
    request.get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", configApi)
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    // If huyen and phuong are defined, fetch districts and wards data
    if (formValues.huyen !== undefined && formValues.phuong !== undefined) {
      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${formValues.thanhPho}`, configApi)
        .then((response) => {
          setDistricts(response.data);
        })
        .catch((e) => {
          console.log(e);
        });

      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${formValues.huyen}`, configApi)
        .then((response) => {
          setWards(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [id, formValues.huyen, formValues.phuong, formValues.thanhPho]);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onSubmit = async () => {
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });
    if (anh) {
      formData.append('anh', anh);
    }

    Modal.confirm({
      title: 'Xác nhận',
      maskClosable: true,
      content: 'Xác nhận cập nhật nhân viên?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        setTimeout(() => {
          request
            .put(`/nhan-vien/update/${id}`, formData)
            .then((response) => {
              if (response.status === 200) {
                sessionStorage.setItem('employeeUpdateSuccess', 'Sửa thành công!');
                navigate('/nhan-vien');
              }
            })
            .catch((error) => {
              toast.error('Cập nhật nhân viên thất bại', { autoClose: 2000 });
            });
        }, 1000);
      },
      onCancel() {}
    });
  };

  const handleProvinceChange = (provinceCode) => {
    request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceCode}`, configApi)
      .then((response) => {
        setDistricts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    setSelectedProvince(provinceCode);
    setFormValues({ ...formValues, thanhPho: provinceCode });
  };

  const handleDistrictChange = (districtCode) => {
    request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`, configApi)
      .then((response) => {
        setWards(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    setSelectedDistrict(districtCode);
    setFormValues({ ...formValues, huyen: districtCode });
  };

  const handleWardChange = (wardCode) => {
    setSelectedWard(wardCode);
    setFormValues({ ...formValues, phuong: wardCode });
  };

  return (
    <>
      <ToastContainer />
      <Box>
        <Paper elevation={3}>
          <Typography variant="h6" component="h2" gutterBottom style={{ padding: '15px 0 0 15px' }}>
            Cập nhật thông tin nhân viên
          </Typography>
          <Box p={3}>
            <Form form={form} layout="vertical" onFinish={onSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} className="text-center">
                  {previewUrl ? (
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
                            src={formValues.anh}
                            alt="Preview"
                            style={{ width: '162px', height: '162px' }}
                            className="border border-warning shadow-lg bg-body-tertiary rounded-circle object-fit-contain"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Mã nhân viên" name="ma" value={formValues.ma} onChange={handleChange} disabled />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Tên nhân viên" name="ten" value={formValues.ten} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Số điện thoại" name="soDienThoai" value={formValues.soDienThoai} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Email" name="email" value={formValues.email} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Ngày sinh" name="ngaySinh" value={formValues.ngaySinh} onChange={handleChange} type="date" />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="CCCD" name="cccd" value={formValues.cccd} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Địa chỉ" name="diaChi" value={formValues.diaChi} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                  <FormControl>
                    <FormLabel>Giới tính</FormLabel>
                    <RadioGroup name="gioiTinh" value={formValues.gioiTinh} onChange={handleChange} row>
                      <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                      <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl>
                    <FormLabel>Trạng thái</FormLabel>
                    <RadioGroup name="trangThai" value={formValues.trangThai} onChange={handleChange} row>
                      <FormControlLabel value="Đang hoạt động" control={<Radio />} label="Đang hoạt động" />
                      <FormControlLabel value="Ngừng hoạt động" control={<Radio />} label="Ngừng hoạt động" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <GHNDetail
                  dataAddress={(addressData) => setFormValues({ ...formValues, ...addressData })}
                  thanhPho={formValues.thanhPho}
                  huyen={formValues.huyen}
                  phuong={formValues.phuong}
                  disabledValue={false} // Adjust this based on your logic
                />
              </Grid>
              <Box mt={2}>
                <DialogActions>
                  <Button variant="contained" color="primary" type="submit">
                    Lưu
                  </Button>
                  <Button variant="contained" onClick={() => navigate('/nhan-vien')}>
                    Hủy
                  </Button>
                </DialogActions>
              </Box>
            </Form>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default NhanVienDetail;
