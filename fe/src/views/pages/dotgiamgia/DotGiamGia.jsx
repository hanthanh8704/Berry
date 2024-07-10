import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, Button } from '@mui/material';
import { Add, Details, Save, Update } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import FormatDate from 'views/utilities/FormatDate.jsx';
import VoucherStatus from "./DotGiamGiaTrangThai.jsx";
import { listDotGiamGia } from 'views/utilities/ApiDotGiamGia/DotGiamGiaApi.js'
import { margin } from '@mui/system';




const DotGiamGia = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dotGiamGia, setDotGiamGia] = useState([]);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  //Diềm nó vào danh sách
  useEffect(() => {
    getAllDotGiamGia();
  }, [])
  //Get hiển thị 
  function getAllDotGiamGia() {
    listDotGiamGia().then((response) => {
      setDotGiamGia(response.data);
    }).catch(error => {
      console.error(error)
    })
  }


  // Sử dụng hàm exportData
  // function handleExport() {
  //   exportData().then(response => {
  //     console.log(response.data);
  //   }).catch(error => {
  //     console.error('Error exporting data:', error);
  //   });
  // }

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(1);
  };
  const handlePriceChange = (event) => {
    setFilterPrice(event.target.value);
    setCurrentPage(1);
  };
  // const handleViewDetails = (dotGiamGia) => {
  //   setSelectedOrder(dotGiamGia);
  // };

  // const handleClearDetails = () => {
  //   setSelectedOrder(null);
  // };
  const handleSearch = () => {
    searchDotGiamGia(searchValue, startDate, endDate)
      .then((response) => {
        setDotGiamGia(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const searchTenMaGiaTriLike = dotGiamGia.filter(dotGiamGia => {
    const isStatusMatch = filterStatus === 'All' || dotGiamGia.trangThai === filterStatus;
    const isNameOrCodeMatch = dotGiamGia.ten.toLowerCase().includes(searchValue.toLowerCase()) ||
      dotGiamGia.ma.toLowerCase().includes(searchValue.toLowerCase()) ||
      dotGiamGia.giaTriGiam.toString().toLowerCase().includes(searchValue.toLowerCase());
    const isDateInRange = (!startDate || new Date(dotGiamGia.ngayBatDau) >= new Date(startDate)) &&
      (!endDate || new Date(dotGiamGia.ngayKetThuc) <= new Date(endDate));

    let isPriceMatch = true;
    if (filterPrice !== 'All') {
      const [minPrice, maxPrice] = filterPrice.split('-').map(Number);
      isPriceMatch = dotGiamGia.giaTriGiam >= minPrice && dotGiamGia.giaTriGiam <= maxPrice;
    }

    return isStatusMatch && isNameOrCodeMatch && isDateInRange && isPriceMatch;
  });


  //Chuyển sang trang thêm mới
  const handleAddNew = () => {
    // Thực hiện logic thêm mới ở đây
    navigate('/voucher/dot-giam-gia/add'); // Chuyển hướng đến /dot-giam-gia/add
    console.log("Thêm mới");
  };
  //Chuyển sang trang detail 
  const handleViewDetails = (id) => {
    navigate(`/voucher/dot-giam-gia/detail/${id}`);
  };

  const handleViewUpdate = (id) => {
    navigate(`/voucher/dot-giam-gia/update/${id}`);
  };

  const paginatedOrders = searchTenMaGiaTriLike.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Grid container spacing={3}>
      <Grid container spacing={3} style={{ backgroundColor: 'white', padding: '10px', marginLeft: '24px', marginTop: '20px', borderRadius: '10px' }}>
        {/* Search Bar */}
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo tên mã và giá trị của đợt giảm giá"
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

        {/* Tìm kiếm theo ngày bắt đầu */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              type="datetime-local"  // Đặt kiểu datetime-local
              placeholder="Ngày bắt đầu"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            // onKeyDown={handleKeyDown}
            />
          </Box>
        </Grid>

        {/* Tìm kiếm theo ngày kết thúc */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              type="datetime-local"  // Đặt kiểu datetime-local
              placeholder="Ngày kết thúc"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            // onKeyDown={handleKeyDown}
            />
          </Box>
        </Grid>

        {/* Filter by Status */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="filter-status-label">Trạng thái</InputLabel>
            <Select
              labelId="filter-status-label"
              id="filter-status"
              value={filterStatus}
              onChange={handleStatusChange}
              label="Filter by Status"
            >
              <MenuItem value="All">Tất cả</MenuItem>
              <MenuItem value="Sắp diễn ra">Sắp diễn ra</MenuItem>
              <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
              <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Box display="flex" margin={"20px"} paddingTop={"5px"}>
          {/* Tim theo khoang gia */}
          <Grid item xs={12} md={20} width={"210px"}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="filter-price-label">Giá trị</InputLabel>
              <Select
                labelId="filter-price-label"
                id="filter-price"
                value={filterPrice}
                onChange={handlePriceChange}
                label="Khoảng giá"
              >
                <MenuItem value="All">Tất cả</MenuItem>
                <MenuItem value="1-20">1%-20%</MenuItem>
                <MenuItem value="20-40">20%-40%</MenuItem>
                <MenuItem value="40-50">40%-50%</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Nút THÊM MỚI */}
          <Grid item xs={12} md={3} marginLeft={"0px"}>
            <Box marginLeft={"25px"} width={"130px"} marginTop={"7px"}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<Add />}
                onClick={handleAddNew}
              >
                THÊM MỚI
              </Button>
            </Box>
          </Grid>
        </Box>
      </Grid>

      {/* Orders Table */}
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Mã đợt giảm giá</TableCell>
                <TableCell>Tên đợt giảm giá</TableCell>
                <TableCell>Giá trị</TableCell>
                <TableCell>Thời gian bắt đầu</TableCell>
                <TableCell>Thời gian kết thúc</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((dotGiamGia, index) => (
                <TableRow key={dotGiamGia.id}>
                  <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>{dotGiamGia.ma}</TableCell>
                  <TableCell>{dotGiamGia.ten}</TableCell>
                  <TableCell>{dotGiamGia.giaTriGiam}%</TableCell>
                  <TableCell>{<FormatDate date={dotGiamGia.ngayBatDau} />}</TableCell>
                  <TableCell>{<FormatDate date={dotGiamGia.ngayKetThuc} />}</TableCell>
                  <TableCell><VoucherStatus status={dotGiamGia.trangThai} /></TableCell>
                  <TableCell>
                    <Button
                      style={{ marginRight: '10px' }}
                      variant="contained"
                      color="primary"
                      startIcon={<Details />} // Icon sẽ được đặt ở phía bắt đầu của Button
                      onClick={() => handleViewDetails(dotGiamGia.id)}
                    >
                      Chi tiết
                    </Button>

                    <Button

                      variant="contained"
                      color="warning"
                      startIcon={<Update />} // Icon sẽ được đặt ở phía bắt đầu của Button
                      onClick={() => handleViewUpdate(dotGiamGia.id)}
                    >
                      Sửa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Pagination */}
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Pagination
          count={Math.ceil(searchTenMaGiaTriLike.length / pageSize)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </Grid>
    </Grid >
  );
};

export default DotGiamGia;
