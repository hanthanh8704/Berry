import React, { useState } from 'react';
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
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, Button } from '@mui/material';
import { Add, Details, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

// Dummy data for orders
const dotGiamGia = [
  { id: 1, ten: 'Giảm giá 10%', giaTri: '10%', status: 'Đang hoạt động', startDate: '21/1/2024 12:30', endDate: '30/12/2024 12:30' },
  { id: 2, ten: 'Chào mừng Noel 25%', giaTri: '25%', status: 'Ngừng hoạt động', startDate: '21/1/2024 12:30', endDate: '30/12/2024 12:30' },
  { id: 3, ten: 'Khuyến mãi hè', giaTri: '15%', status: 'Đang hoạt động', startDate: '10/6/2024 08:00', endDate: '31/8/2024 23:59' },
  { id: 4, ten: 'Săn sale tháng 7', giaTri: '20%', status: 'Đang hoạt động', startDate: '1/7/2024 00:00', endDate: '31/7/2024 23:59' },
  { id: 5, ten: 'Black Friday', giaTri: '30%', status: 'Ngừng hoạt động', startDate: '26/11/2024 00:00', endDate: '27/11/2024 23:59' },
  { id: 6, ten: 'Sale mùa thu', giaTri: '18%', status: 'Đang hoạt động', startDate: '1/9/2024 00:00', endDate: '30/11/2024 23:59' },
  { id: 7, ten: 'Khuyến mãi đầu năm', giaTri: '12%', status: 'Đang hoạt động', startDate: '1/1/2024 00:00', endDate: '31/1/2024 23:59' },
  { id: 8, ten: 'Giảm giá cuối năm', giaTri: '22%', status: 'Đang hoạt động', startDate: '1/12/2024 00:00', endDate: '31/12/2024 23:59' },
];

const DotGiamGia = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(1); // Reset page when status filter changes
  };

  const handleViewDetails = (dotGiamGia) => {
    setSelectedOrder(dotGiamGia);
  };

  const handleClearDetails = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = dotGiamGia.filter(dotGiamGia =>
    (filterStatus === 'All' || dotGiamGia.status === filterStatus)
    || (filterStatus === 'All' || dotGiamGia.giaTri === filterStatus)
    && (dotGiamGia.ten.toLowerCase().includes(searchValue.toLowerCase()))
  );


  //   const [startDate, setStartDate] = useState('');
  //   const [endDate, setEndDate] = useState('');

  //   const handleSearch = () => {
  //     // Thực hiện tìm kiếm dựa trên startDate và endDate
  //     console.log("Tìm kiếm từ ngày:", startDate, "đến ngày:", endDate);
  //     // Thực hiện logic tìm kiếm ở đây
  //   };

  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     handleSearch();
  //   }
  // };
  const navigate = useNavigate();
  //Export
  // const handleExport = () => {
  // Thực hiện logic xuất Excel ở đây
  //   console.log("Export Excel");
  // };

  //Them moi
  const handleAddNew = () => {
    // Thực hiện logic thêm mới ở đây
    navigate('/dot-giam-gia/add'); // Chuyển hướng đến /dot-giam-gia/add
    console.log("Thêm mới");
  };



  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Grid container spacing={3}>
      <Grid container spacing={3} style={{ backgroundColor: 'white', padding: '10px', marginLeft: '24px', marginTop: '20px', borderRadius: '10px' }}>
        {/* Search Bar */}
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo tên đợt giảm giá"
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
            // value={startDate}
            // onChange={(e) => setStartDate(e.target.value)}
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
            // value={endDate}
            // onChange={(e) => setEndDate(e.target.value)}
            // onKeyDown={handleKeyDown}
            />
          </Box>
        </Grid>

        {/* Tìm kiếm giá trị */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="filter-status-label">Giá trị</InputLabel>
            <Select
              labelId="filter-status-label"
              id="filter-status"
              value={filterStatus}
              onChange={handleStatusChange}
              label="Filter by Status"
            >
              <MenuItem value="All">Tất cả</MenuItem>
              <MenuItem value="10%">10%</MenuItem>
              <MenuItem value="45%">45%</MenuItem>
              <MenuItem value="25%">25%</MenuItem>
            </Select>
          </FormControl>
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
              <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
              <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Box display="flex" margin={"20px"} paddingTop={"10px"}>
          {/* Nút EXPORT EXCEL */}
          <Grid item xs={12} md={3}>
            <Box marginLeft={"5px"} width={"153px"} height={"1px"}>
              <Button
                fullWidth
                fullHeight
                variant="contained"
                color="primary"
                startIcon={<Save />}
              // onClick={handleExport}
              >
                EXPORT EXCEL
              </Button>
            </Box>
          </Grid>

          {/* Nút THÊM MỚI */}
          <Grid item xs={12} md={3} marginLeft={"0px"}>
            <Box marginLeft={"70px"} width={"153px"} >
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
        {selectedOrder ? (
          // Detail View
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: '8px' }}>
            <Typography variant="h4" marginBottom={"15px"} gutterBottom>
              Đợt giảm giá chi tiết
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ID"
                    variant="outlined"
                    value={selectedOrder.id}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tên đợt giảm giá"
                    variant="outlined"
                    value={selectedOrder.ten}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Giá trị"
                    variant="outlined"
                    value={`${selectedOrder.giaTri} đ`}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ngày bắt đầu"
                    variant="outlined"
                    value={selectedOrder.startDate}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ngày kết thúc"
                    variant="outlined"
                    value={selectedOrder.endDate}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Trạng thái"
                    variant="outlined"
                    value={selectedOrder.status}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button

                      variant="contained"
                      color="primary"
                      onClick={handleClearDetails}
                    >
                      Back to Orders
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        ) : (
          // Orders Table
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tên đợt giảm giá</TableCell>
                  <TableCell>Giá trị</TableCell>
                  <TableCell>Thời gian bắt đầu</TableCell>
                  <TableCell>Thời gian kết thúc</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hoạt động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((dotGiamGia, index) => (
                  <TableRow key={dotGiamGia.id}>
                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                    <TableCell>{dotGiamGia.ten}</TableCell>
                    <TableCell>{dotGiamGia.giaTri}</TableCell>
                    <TableCell>{dotGiamGia.startDate} </TableCell>
                    <TableCell>{dotGiamGia.endDate} </TableCell>
                    <TableCell>{dotGiamGia.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Details />} // Icon sẽ được đặt ở phía bắt đầu của Button
                        onClick={() => handleViewDetails(dotGiamGia)}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>

      {/* Pagination */}
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Pagination
          count={Math.ceil(filteredOrders.length / pageSize)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </Grid>
    </Grid >
  );
};

export default DotGiamGia;
