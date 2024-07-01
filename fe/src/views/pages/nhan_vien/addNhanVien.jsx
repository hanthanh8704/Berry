import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormatCurrency from "views/utilities/FormatCurrency";
import * as request from "views/utilities/httpRequest";
import { Modal, Form } from "antd";
import SearchIcon from '@mui/icons-material/Search';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Pagination from '@mui/material/Pagination';
import {
  Paper, Box, IconButton, Typography, TextField, Button, Grid, RadioGroup, Radio,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  FormControlLabel, FormControl, Checkbox, Tooltip, Link
} from '@mui/material';

const AddCustomer = () => {
  const [khachHang, setKhachHang] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchValue, setSearchValue] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    // ten: '',
    // giaTriGiam: '',
    // giaTriToiDa: '',
    // loai: '',
    // kieuGiam: '%',
    // soLuong: '',
    // ngayBatDau: '',
    // ngayKetThuc: '',
    // trangThai: 'Sắp diễn ra',
    // nguoiTao: 'Người tạo',
    // nguoiSua: 'Người sửa',
    // customers: ''

    ma: "",
    cccd: "",
    soDienThoai: "",
    ten: "",
    trangThai: "",
    gioiTinh: "",
    diaCh: "",
    email: "",
    ngaySinh: "",
    chucVu: "",
    deleted: false
  });

  

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'kieuGiam') {
      setLoaiGiamGia(value); // Cập nhật trạng thái loại giảm giá
    }
    setFormValues({ ...formValues, [name]: value });

    if (name === 'loai' && value === 'Cá nhân') {
      setIsSoLuongDisabled(true);
      setFormValues((prevState) => ({ ...prevState, soLuong: '' })); // Reset giá trị số lượng khi chọn "Cá nhân"
    } else if (name === 'loai' && value === 'Công khai') {
      setIsSoLuongDisabled(false);
    }
  };


  //   const isWithinDateRange = (!startDate || new Date(order.startDate) >= new Date(startDate)) && 
  //                               (!endDate || new Date(order.endDate) <= new Date(endDate));



  const handAddVoucher = async (data) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm nhân viên ?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        data.customers = selectedOrders;
        request.post("/nhan-vien/create", data).then((response) => {
          if (response.data.success) {
            toast.success("Thêm thành công!");
            navigate("/nhan-vien");
          }
        }).catch((e) => {
          toast.error(e.response.data);
        });
        console.log(data);
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handAddVoucher(formValues);
  };

  const handleSelectOrder = (event, id) => {
    if (event.target.checked) {
      setSelectedOrders([...selectedOrders, id]); // Thêm id vào mảng selectedOrders
    }
    else {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id)); // Xoá id khỏi mảng selectedOrders
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let validatedValue = value;
    if (name === 'giaTriGiam' && loaiGiamGia === '%') {
      validatedValue = Math.min(value, 50); // Giới hạn giá trị tại 100 nếu là phần trăm
    }
    setFormValues({ ...formValues, [name]: validatedValue });
  };

  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const filterOrders = () => {
      if (formValues.loai === 'Cá nhân') {
        return khachHang.filter(item =>
          item.hoTen.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.soDienThoai.includes(searchValue) ||
          item.email.toLowerCase().includes(searchValue.toLowerCase())
        );
      }
      return [];
    };

    setFilteredOrders(filterOrders());
  }, [formValues.loai, searchValue, khachHang]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (

    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h3" gutterBottom>
            Thêm mới phiếu giảm giá
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Họ tên nhân viên  "
                  name="ten"
                  value={formValues.ten}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                
                <TextField
                  fullWidth
                  variant="outlined"
                  label="mã nhân viên  "
                  name="ma"
                  value={formValues.ma}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="căn cước  "
                  name="cccd"
                  value={formValues.cccd}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="so dien thoai   "
                  name="soDienThoai"
                  value={formValues.soDienThoai}
                  onChange={handleChange}
                />
              </Grid>
            
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <Typography variant="subtitle1" gutterBottom>
                    trạng thái
                  </Typography>
                  <RadioGroup
                    label=" "
                    name="trangThai"
                    value={formValues.trangThai}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel value="Đang làm" control={<Radio />} label="Đang làm" />
                    <FormControlLabel value="Nghỉ làm" control={<Radio />} label="Nghỉ làm" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <Typography variant="subtitle1" gutterBottom>
                    Giới tính
                  </Typography>
                  <RadioGroup
                    aria-label="giới tính "
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

              

              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="dia chi   "
                  name="diaChi"
                  value={formValues.diaChi}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="email  "
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="datetime-local"
                  label="ngày sinh "
                  name='ngaySinh'
                  value={formValues.ngaySinh}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              \
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