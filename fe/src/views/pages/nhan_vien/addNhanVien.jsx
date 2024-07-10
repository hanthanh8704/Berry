import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as request from "views/utilities/httpRequest";
import { Modal } from "antd";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import {
  Paper, Typography, TextField, Button, Grid, RadioGroup, Radio,
  FormControlLabel, FormControl
} from '@mui/material';

const AddCustomer = () => {
  const [formValues, setFormValues] = useState({
    ma: "",
    cccd: "",
    soDienThoai: "",
    ten: "",
    trangThai: "",
    gioiTinh: "",
    diaChi: "",
    email: "",
    ngaySinh: "",
    chucVu: "",
    deleted: false
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const { ten, cccd, soDienThoai, email, trangThai, gioiTinh, ngaySinh} = formValues;
    // Kiểm tra tên không được để trống, không chứa số và không chứa ký tự tiếng Việt
    if (!ten || ten.trim() === "" || /\d/.test(ten) || /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/.test(ten)) {
      toast.error("Tên nhân viên không được để trống, không được chứa số và không được chứa ký tự tiếng Việt.");
      return false;
    }
    if (!cccd || cccd.trim() === "" || !/^[\d]{9,12}$/.test(cccd)) {
      toast.error("Căn cước không hợp lệ.");
      return false;
    }
    if (!soDienThoai || !/^[0-9]{10}$/.test(soDienThoai)) {
      toast.error("Số điện thoại không hợp lệ.");
      return false;
    }
    if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.error("Email không hợp lệ.");
      return false;
    }
    if (!ngaySinh) {
      toast.error("Ngày sinh không được để trống.");
      return false;
    } else {
      const birthDate = new Date(ngaySinh);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        toast.error("Nhân viên phải đủ 18 tuổi trở lên.");
        return false;
      }
    }
    if (!trangThai || (trangThai !== "Hoạt động" && trangThai !== "Ngừng hoạt động")) {
      toast.error("Vui lòng chọn trạng thái.");
      return false;
    }
    if (!gioiTinh || (gioiTinh !== "Nam" && gioiTinh !== "Nữ")) {
      toast.error("Vui lòng chọn giới tính.");
      return false;
    }

    return true;
  };
  const handAddVoucher = async (data) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm nhân viên?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        request.post("/nhan-vien/create", data).then((response) => {
          if (response.data.success) {
            toast.success("Thêm thành công!");
            navigate("/account/employee");
          }
        }).catch((e) => {
          toast.error(e.response.data);
        });
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handAddVoucher(formValues);
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Thêm mới nhân viên
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Họ tên nhân viên"
                  name="ten"
                  value={formValues.ten}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Căn cước"
                  name="cccd"
                  value={formValues.cccd}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Số điện thoại"
                  name="soDienThoai"
                  value={formValues.soDienThoai}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Địa chỉ"
                  name="diaChi"
                  value={formValues.diaChi}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="datetime-local"
                  label="Ngày sinh"
                  name="ngaySinh"
                  value={formValues.ngaySinh}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <Typography variant="subtitle1" gutterBottom>
                    Trạng thái
                  </Typography>
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
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <Typography variant="subtitle1" gutterBottom>
                    Giới tính
                  </Typography>
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
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" color="primary" type="submit">
                  Thêm nhân viên
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default AddCustomer;
