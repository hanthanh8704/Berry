import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormatCurrency from "views/utilities/FormatCurrency";
import * as request from "views/utilities/httpRequest";
import { Modal, Form } from "antd";
import SearchIcon from '@mui/icons-material/Search';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import {  Pagination} from "antd";
import { Paper, Box, IconButton, Typography, TextField, Button, Grid, RadioGroup, Radio,
    TableContainer, Table, TableHead,TableRow, TableCell,TableBody, 
    FormControlLabel, FormControl, Checkbox, Tooltip, Link} from '@mui/material';

const VoucherDetail = () => {
    const [khachHang, setKhachHang] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(5);
    const { id } = useParams();
    const [searchValue, setSearchValue] = useState('');
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [formValues, setFormValues] = useState({
      id:id,
        ten: '',
        giaTriHoaDonDuocGiam: '',
        giaTriHoaDonDuocApDung: '',
        loai: '',
        hinhThucGiam: '%',
        soLuong: '1',
        ngayBatDau: '',
        ngayKetThuc: '',
        nguoiTao: 'Người tạo',
        nguoiSua: 'Người sửa',
        customers:'',
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
              const response = await request.get(`/voucher/`+id);
              console.log(response);
              const voucherData = response;
              setFormValues({
                  ten: voucherData.ten ,
                  giaTriHoaDonDuocGiam: voucherData.giaTriHoaDonDuocGiam ,
                  giaTriHoaDonDuocApDung: voucherData.giaTriHoaDonDuocApDung ,
                  loai: voucherData.loai ,
                  hinhThucGiam: voucherData.hinhThucGiam ,
                  soLuong: voucherData.soLuong,
                  ngayBatDau: convertTimestampToDate(voucherData.ngayBatDau),
                  ngayKetThuc: convertTimestampToDate(voucherData.ngayKetThuc),
                  nguoiTao: voucherData.nguoiTao ,
                  nguoiSua: voucherData.nguoiSua ,
              });
              if (voucherData.idKhachHang !== null && voucherData.idKhachHang !== undefined) {
                setSelectedOrders(voucherData.idKhachHang.split(',').map(Number));
              } else {
                setSelectedOrders([]);
              }
          } catch (error) {
              console.error('Error fetching voucher data:', error);
          }
      };

      fetchData();
  },[]);



    useEffect(() => {
        // Gọi API để lấy dữ liệu voucher khi component được mount
        const fetchData = async (item) => {
            try {
                const response = await request.get('/voucher/khach-hang/'+id, {
                    params: {
                        name: searchValue,
                        page: currentPage,
                        sizePage: pageSize,
                    },
                }).then(response => {
                    console.log('Data fetched:', response.data); 
                    setKhachHang(response.data);
                setTotalPages(response.totalPages);
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    
   
    const [isSoLuongDisabled, setIsSoLuongDisabled] = useState(false);
    const [loaiGiamGia, setLoaiGiamGia] = useState(); // Mặc định là '%'

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



   const onSubmit = async (data) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận cập nhật phiếu giảm giá ?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        setTimeout(() => {
        data.customers = setSelectedOrders;
        request.put(`/voucher/update/`+id, data).then((response) => {
          if (response.data.success) {
          console.log(response);
          toast.success("Cập nhật thành công!");
          navigate("/api/voucher");
          }
        }).catch((e) => {
          toast.error(e.response.data);
        });
      }, 1000);
      },
    });
  };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formValues);
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
        if (name === 'giaTriHoaDonDuocGiam' && loaiGiamGia === '%') {
            validatedValue = Math.min(value, 100); // Giới hạn giá trị tại 100 nếu là phần trăm
        }
        setFormValues({ ...formValues, [name]: validatedValue });
    };
    
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

  
    // if (loading) {
    //   return <Loading />;
    // }
    return (
      <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h3" gutterBottom>
                  Sửa phiếu giảm giá
              </Typography>
              <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                      <Grid item xs={12} md={12}>
                          <TextField
                              fullWidth
                              variant="outlined"
                              label="Tên phiếu"
                              name="ten"
                              value={formValues.ten}
                              onChange={handleChange}
                          />
                      </Grid>
                      <Grid item xs={12} md={6}>
                          <FormControl component="fieldset">
                              <Typography variant="subtitle1" gutterBottom>
                                  Hình thức giảm
                              </Typography>
                              <RadioGroup
                                  aria-label="kieuGiam"
                                  name="hinhThucGiam"
                                  value={formValues.hinhThucGiam}
                                  onChange={handleChange}
                                  row
                              >
                                  <FormControlLabel value="%" control={<Radio />} label="%" />
                                  <FormControlLabel value="VNĐ" control={<Radio />} label="VNĐ" />
                              </RadioGroup>
                          </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                          <FormControl component="fieldset">
                              <Typography variant="subtitle1" gutterBottom>
                                  Loại
                              </Typography>
                              <RadioGroup
                                  aria-label="loai"
                                  name="loai"
                                  value={formValues.loai}
                                  onChange={handleChange}

                                  row
                              >
                                  <FormControlLabel value="Công khai" control={<Radio />} label="Công khai" />
                                  <FormControlLabel value="Cá nhân" control={<Radio />} label="Cá nhân" />
                              </RadioGroup>
                          </FormControl>
                      </Grid>
                      <Grid item xs={12} md={12}>
                          <TextField
                              fullWidth
                              variant="outlined"
                              label={`Giá trị giảm (${loaiGiamGia === '%' ? '%' : 'VNĐ'})`}
                              name="giaTriHoaDonDuocGiam"
                              type="number"
                              value={formValues.giaTriHoaDonDuocGiam}
                              onChange={handleInputChange}
                              inputProps={{ min: 0 }}
                          />
                      </Grid>
                      <Grid item xs={12} md={6}>
                          <TextField
                              fullWidth
                              variant="outlined"
                              label="Giá trị tối thiểu"
                              name="giaTriHoaDonDuocApDung"
                              type="number"
                              value={formValues.giaTriHoaDonDuocApDung}
                              onChange={handleChange}
                              inputProps={{ min: 0 }}
                          />
                      </Grid>
                      <Grid item xs={12} md={6}>
                          <TextField
                              fullWidth
                              variant="outlined"
                              label="Số lượng"
                              name="soLuong"
                              type="number"
                              value={formValues.soLuong}
                              onChange={handleChange}
                              inputProps={{ min: 1 }}
                              required={isSoLuongDisabled}
                          />
                      </Grid>
                      <Grid item xs={12} md={6}>
                          <TextField
                              fullWidth
                              variant="outlined"
                              type="datetime-local"
                              label="Ngày bắt đầu"
                              name='ngayBatDau'
                              value={formValues.ngayBatDau}
                              onChange={handleChange}
                              InputLabelProps={{ shrink: true }}
                          />
                      </Grid>
                      <Grid item xs={12} md={6}>
                          <TextField
                              fullWidth
                              variant="outlined"
                              type="datetime-local"
                              label="Ngày kết thúc"
                              name='ngayKetThuc'
                              value={formValues.ngayKetThuc}
                              onChange={handleChange}
                              InputLabelProps={{ shrink: true }}
                          />
                      </Grid>
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Button variant="contained" color="primary" type="submit">
                              Sửa phiếu giảm giá
                          </Button>
                      </Grid>
                  </Grid>
              </form>
          </Paper>
      </Grid>
      {formValues.loai === 'Cá nhân' && (
      <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 2 }}>
              <Grid item xs={12} style={{ backgroundColor: 'white', borderRadius: '10px', marginLeft: '10px' }}>
              <Grid item xs={12} md={8}>
                  <Box display="flex" alignItems="center">
                      <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Search orders..."
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          InputProps={{
                              endAdornment: (
                                  <IconButton>
                                      <SearchIcon />
                                  </IconButton>
                              )
                          }}
                      />
                  </Box>
              </Grid>
                  <TableContainer component={Paper}>
                      <Table>
                          <TableHead>
                              <TableRow>
                                  <TableCell>Chọn</TableCell>
                                  <TableCell>Họ tên</TableCell>
                                  <TableCell>Số điện thoại</TableCell>
                                  <TableCell>Giới tính</TableCell>
                                  <TableCell>Email</TableCell>
                                  <TableCell>Ngày sinh</TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {khachHang.map((khachHang) => (
                                  <TableRow key={khachHang.id}>
                                      <TableCell>
                                          <Checkbox
                                              checked={selectedOrders.includes(khachHang.id)}
                                              name='customers'
                                              onChange={(event) => handleSelectOrder(event, khachHang.id)}
                                          />
                                      </TableCell>
                                      <TableCell>{khachHang.hoTen}</TableCell>
                                      <TableCell>{khachHang.soDienThoai}</TableCell>
                                      <TableCell>{(khachHang.gioiTinh)}</TableCell>
                                      <TableCell>{khachHang.email}</TableCell>
                                      {/* <TableCell>{order.kieuGiam}</TableCell> */}
                                      <TableCell>
                                          <Box display="flex" alignItems="center">
                                              <Tooltip title="Update">
                                                  <IconButton
                                                      color="primary"
                                                  >
                                                      <Link to={'/api/voucher/' + khachHang.id}> </Link>
                                                  </IconButton>
                                              </Tooltip>
                                              <Tooltip title="Stop">
                                                  <IconButton
                                                      color="primary"
                                                      onClick={() => showDeleteConfirm(item)}
                                                  >
                                                     
                                                  </IconButton>
                                              </Tooltip>
                                              <Tooltip title="Delete">
                                                  <IconButton
                                                      color="primary"
                                                  >
                                                      <Link to={'/api/voucher/delete'}></Link>

                                                  </IconButton>
                                              </Tooltip>
                                          </Box>
                                      </TableCell>

                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </TableContainer>
              </Grid>
          </Paper>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
            <Pagination
        className="mt-3"
        showSizeChanger
        current={currentPage}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        showQuickJumper
        total={totalPages * pageSize}
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
        />
            </Grid> 
      </Grid>
      )}
      <ToastContainer />
  </Grid>
      
        
        
    );
};

export default VoucherDetail;
