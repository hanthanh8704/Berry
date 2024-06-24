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
import { Box, Typography, Button, Tabs, Tab, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { margin } from '@mui/system';

// Dummy data for orders
const orders = [
  {
    id: 1,
    code: 'HD001',
    customer: 'Nguyễn Văn A',
    employee: 'Trần Thị B',
    phone: '0909123456',
    createdDate: '2024-06-20T10:00:00Z',
    totalMoney: 500000,
    status: 'Hoàn thành',
    history: [
      { timestamp: '2024-06-20T10:00:00Z', status: 'Đang xử lý' },
      { timestamp: '2024-06-20T11:30:00Z', status: 'Đã đóng gói' },
      { timestamp: '2024-06-20T13:00:00Z', status: 'Đã giao hàng' },
      { timestamp: '2024-06-20T15:00:00Z', status: 'Đã nhận hàng' },
    ]
  },
  {
    id: 2,
    code: 'HD002',
    customer: 'Phạm Thị C',
    employee: 'Nguyễn Văn D',
    phone: '0909345678',
    createdDate: '2024-06-21T09:00:00Z',
    totalMoney: 700000,
    status: 'Chờ xác nhận',
    history: [
      { timestamp: '2024-06-21T09:00:00Z', status: 'Đang xử lý' },
    ]
  },
  {
    id: 3,
    code: 'HD003',
    customer: 'Trần Văn E',
    employee: 'Hoàng Thị F',
    phone: '0909765432',
    createdDate: '2024-06-22T14:00:00Z',
    totalMoney: 350000,
    status: 'Chờ giao hàng',
    history: [
      { timestamp: '2024-06-22T14:00:00Z', status: 'Đang xử lý' },
      { timestamp: '2024-06-22T15:30:00Z', status: 'Đã đóng gói' },
    ]
  },
  {
    id: 4,
    code: 'HD004',
    customer: 'Lê Thị G',
    employee: 'Trần Văn H',
    phone: '0909987654',
    createdDate: '2024-06-23T11:30:00Z',
    totalMoney: 450000,
    status: 'Đang giao hàng',
    history: [
      { timestamp: '2024-06-23T11:30:00Z', status: 'Đang xử lý' },
    ]
  },
  {
    id: 5,
    code: 'HD005',
    customer: 'Đỗ Văn I',
    employee: 'Lê Thị K',
    phone: '0909876543',
    createdDate: '2024-06-23T15:00:00Z',
    totalMoney: 600000,
    status: 'Hoàn thành',
    history: [
      { timestamp: '2024-06-23T15:00:00Z', status: 'Đang xử lý' },
      { timestamp: '2024-06-23T16:30:00Z', status: 'Đã giao hàng' },
      { timestamp: '2024-06-23T18:00:00Z', status: 'Đã nhận hàng' },
    ]
  },
  {
    id: 6,
    code: 'HD006',
    customer: 'Hoàng Văn L',
    employee: 'Đỗ Thị M',
    phone: '0909123789',
    createdDate: '2024-06-24T10:30:00Z',
    totalMoney: 800000,
    status: 'Chờ xác nhận',
    history: [
      { timestamp: '2024-06-24T10:30:00Z', status: 'Đang xử lý' },
    ]
  },
  {
    id: 7,
    code: 'HD007',
    customer: 'Nguyễn Thị N',
    employee: 'Hoàng Văn P',
    phone: '0909987123',
    createdDate: '2024-06-25T13:45:00Z',
    totalMoney: 900000,
    status: 'Chờ giao hàng',
    history: [
      { timestamp: '2024-06-25T13:45:00Z', status: 'Đang xử lý' },
      { timestamp: '2024-06-25T15:00:00Z', status: 'Đã đóng gói' },
    ]
  },
  {
    id: 8,
    code: 'HD008',
    customer: 'Trần Văn Q',
    employee: 'Nguyễn Thị R',
    phone: '0909345761',
    createdDate: '2024-06-26T08:00:00Z',
    totalMoney: 550000,
    status: 'Đang giao hàng',
    history: [
      { timestamp: '2024-06-26T08:00:00Z', status: 'Đang xử lý' },
    ]
  },
  {
    id: 9,
    code: 'HD009',
    customer: 'Phạm Thị S',
    employee: 'Lê Văn T',
    phone: '0909876354',
    createdDate: '2024-06-26T12:00:00Z',
    totalMoney: 400000,
    status: 'Chờ xác nhận',
    history: [
      { timestamp: '2024-06-26T12:00:00Z', status: 'Đang xử lý' },
    ]
  },
  {
    id: 10,
    code: 'HD010',
    customer: 'Nguyễn Văn U',
    employee: 'Trần Thị V',
    phone: '0909123897',
    createdDate: '2024-06-27T09:30:00Z',
    totalMoney: 650000,
    status: 'Chờ xác nhận',
    history: [
      { timestamp: '2024-06-27T09:30:00Z', status: 'Đang xử lý' },
    ]
  }
];

// Define TabPanel component
const TabPanel = ({ value, index, children }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Bill = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchValue, setSearchValue] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentTab, setCurrentTab] = useState('All'); // State for current tab
  const [filterStatus, setFilterStatus] = useState('All'); // State for filtering by status
  const [startDate, setStartDate] = useState(''); // State for start date filter
  const [endDate, setEndDate] = useState(''); // State for end date filter

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setCurrentPage(1); // Reset page khi chuyển tab
    setFilterStatus('All'); // Reset filter khi chuyển tab
    setStartDate('');
    setEndDate('');
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleClearDetails = () => {
    setSelectedOrder(null);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset page khi áp dụng bộ lọc
  };

  const filteredOrders = orders.filter(order =>
    (currentTab === 'All' || order.status === currentTab) &&
    (filterStatus === 'All' || order.status === filterStatus) &&
    (order.code.toLowerCase().includes(searchValue.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchValue.toLowerCase())) &&
    (startDate === '' || new Date(order.history[0].timestamp) >= new Date(startDate)) &&
    (endDate === '' || new Date(order.history[order.history.length - 1].timestamp) <= new Date(endDate))
  );

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Grid container spacing={3}>
      {/* Search Bar */}
      <Grid item xs={12} md={3}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search orders..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Box>
      </Grid>

      {/* Filter by Status */}
      <Grid item xs={12} md={3}>

        <FormControl fullWidth variant="outlined">
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Chờ xác nhận</MenuItem>
            <MenuItem value="Pending">Đã xác nhận</MenuItem>
            {/* Add more statuses as needed */}
          </Select>
        </FormControl>
      </Grid>

      {/* Date Range Filter */}
      <Grid item xs={12} md={5}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Box ml={2}>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            style={{ marginLeft: '16px' }}
          >
            Search
          </Button>
        </Box>
      </Grid>

      {/* Tabs for Order Status */}
      <Grid item xs={12}>
        <Paper square>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            aria-label="order status tabs"
          >
            <Tab label="All" value="All" />
            <Tab label="Chờ xác nhận" value="Completed" />
            <Tab label="Đã xác nhận" value="Pending" />
            <Tab label="Chờ giao" value="Tab 1" />
            <Tab label="Đang giao" value="Tab 2" />
            <Tab label="Hoàn thành" value="Tab 3" />
            <Tab label="Hủy" value="Tab 4" />
          </Tabs>
        </Paper>
      </Grid>

      {/* Orders Table */}
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Mã hóa đơn</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Nhân Viên</TableCell>
                <TableCell>SĐT</TableCell>
                <TableCell>Ngày Tạo</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>{order.code}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.employee}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{new Date(order.createdDate).toLocaleString()}</TableCell>
                  <TableCell>{order.totalMoney.toLocaleString()} VNĐ</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                  <Button
  variant="outlined"
  color="primary"
  sx={{ backgroundColor: '#fff' }}
  onClick={() => handleViewDetails(order)}
>
  Chi tiết
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
          count={Math.ceil(filteredOrders.length / pageSize)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
          variant="outlined"
          shape="rounded-pill"
        />
      </Grid>
    </Grid>
  );
};

export default Bill;
