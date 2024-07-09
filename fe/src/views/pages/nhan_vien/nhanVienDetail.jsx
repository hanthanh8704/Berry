import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as request from "views/utilities/httpRequest";
import { Modal, Form } from "antd";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import {
  Paper, Box, Typography, TextField, Button, Grid, RadioGroup, Radio,
  FormControlLabel, FormControl, FormLabel, DialogActions
} from '@mui/material';

const NhanVienDetail = () => {

  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    id: id,
    ma: "",
    cccd: "",
    soDienThoai: "",
    ten: "",
    trangThai: "Đang hoạt động",
    gioiTinh: "",
    diaChi: "",
    email: "",
    ngaySinh: "",
    chucVu: "",
  });

  const convertTimestampToDate = (timestamp) => {
    if (!timestamp) return ''; // Xử lý trường hợp giá trị null hoặc undefined
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return ''; // Xử lý trường hợp giá trị không hợp lệ
    return date.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`/nhan-vien/` + id);
        console.log('API Response:', response);
        const nhanvienData = response; 
        setFormValues({
          ma: nhanvienData.ma || "",
          cccd: nhanvienData.cccd || "",
          soDienThoai: nhanvienData.soDienThoai || "",
          ten: nhanvienData.ten || "",
          trangThai: nhanvienData.trangThai || "Đang hoạt động",
          gioiTinh: nhanvienData.gioiTinh || "",
          diaChi: nhanvienData.diaChi || "",
          email: nhanvienData.email || "",
          ngaySinh: convertTimestampToDate(nhanvienData.ngaySinh) || "",
          chucVu: nhanvienData.chucVu || "",
        });
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onSubmit = async (data) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận cập nhật nhân viên ?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        setTimeout(() => {
          request.put(`/nhan-vien/update/` + id, data).then((response) => {
            toast.success("Cập nhật nhân viên thành công", { autoClose: 2000 });
            navigate("/nhan-vien");
          }).catch((error) => {
            toast.error("Cập nhật nhân viên thất bại", { autoClose: 2000 });
          });
        }, 1000);
      },
    });
  };

  return (
    <>
      <ToastContainer />
      <Box>
        <Paper elevation={3}>
          <Typography variant="h6" component="h2" gutterBottom style={{ padding: "15px 0 0 15px" }}>
            Cập nhật thông tin nhân viên
          </Typography>
          <Box p={3}>
            <Form form={form} layout="vertical" onFinish={() => onSubmit(formValues)}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Mã nhân viên"
                    name="ma"
                    value={formValues.ma}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Tên nhân viên"
                    name="ten"
                    value={formValues.ten}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="soDienThoai"
                    value={formValues.soDienThoai}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    name="ngaySinh"
                    value={formValues.ngaySinh}
                    onChange={handleChange}
                    type="date-local"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CCCD"
                    name="cccd"
                    value={formValues.cccd}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="diaChi"
                    value={formValues.diaChi}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl>
                    <FormLabel>Giới tính</FormLabel>
                    <RadioGroup
                      name="gioiTinh"
                      value={formValues.gioiTinh}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                      <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl>
                    <FormLabel>Trạng thái</FormLabel>
                    <RadioGroup
                      name="trangThai"
                      value={formValues.trangThai}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel value="Hoạt động" control={<Radio />} label="Hoạt động" />
                      <FormControlLabel value="Ngừng hoạt động" control={<Radio />} label="Ngừng hoạt động" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Box mt={2}>
                <DialogActions>
                  <Button variant="contained" color="primary" type="submit">Lưu</Button>
                  <Button variant="contained" onClick={() => navigate("/nhan-vien")}>Hủy</Button>
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
