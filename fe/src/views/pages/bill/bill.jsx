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
import { Box, Typography, Button, Divider } from '@mui/material';

// Dummy data for orders
const orders = [
  { 
    id: 1, 
    code: 'HD001', 
    customer: 'John Doe', 
    totalMoney: 1000, 
    status: 'Completed', 
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 
    history: [
      { timestamp: '2024-06-20T10:00:00Z', status: 'Processing' },
      { timestamp: '2024-06-20T11:30:00Z', status: 'Packed' },
      { timestamp: '2024-06-20T13:00:00Z', status: 'Shipped' },
      { timestamp: '2024-06-20T15:00:00Z', status: 'Delivered' },
    ]
  },
  { 
    id: 2, 
    code: 'HD002', 
    customer: 'Jane Smith', 
    totalMoney: 1500, 
    status: 'Pending', 
    details: 'Nulla vitae elit libero, a pharetra augue.', 
    history: [
      { timestamp: '2024-06-21T14:30:00Z', status: 'Processing' },
    ]
  },
  // Add more orders as needed
];

const Bill = () => {
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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleClearDetails = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter(order =>
    (filterStatus === 'All' || order.status === filterStatus) &&
    (order.code.toLowerCase().includes(searchValue.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Grid container spacing={3}>
      {/* Search Bar */}
      <Grid item xs={12} md={6}>
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

      {/* Filter by Status */}
      <Grid item xs={12} md={3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="filter-status-label">Filter by Status</InputLabel>
          <Select
            labelId="filter-status-label"
            id="filter-status"
            value={filterStatus}
            onChange={handleStatusChange}
            label="Filter by Status"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Orders Table */}
      <Grid item xs={12}>
        {selectedOrder ? (
          // Detail View
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Order Details
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Code:</strong> {selectedOrder.code}<br />
              <strong>Customer:</strong> {selectedOrder.customer}<br />
              <strong>Total Money:</strong> {selectedOrder.totalMoney} đ<br />
              <strong>Status:</strong> {selectedOrder.status}<br />
              <strong>Details:</strong> {selectedOrder.details}<br />
            </Typography>
            <Typography variant="h6" gutterBottom>
              Order History
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.history.map((step, index) => (
                    <TableRow key={index}>
                      <TableCell>{step.timestamp}</TableCell>
                      <TableCell>{step.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" color="primary" onClick={handleClearDetails} sx={{ mt: 2 }}>
              Back to Orders
            </Button>
          </Paper>
        ) : (
          // Orders Table
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Mã hóa đơn</TableCell>
                  <TableCell>Khách hàng</TableCell>
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
                    <TableCell>{order.totalMoney} đ</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" onClick={() => handleViewDetails(order)}>
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
    </Grid>
  );
};

export default Bill;
