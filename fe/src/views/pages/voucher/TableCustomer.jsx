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

import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { Box, Typography, Button } from '@mui/material';

// Dummy data for orders
const orders = [
    { id: 1, code: 'HD001', customer: 'John Doe', totalMoney: 1000, status: 'Completed', details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, code: 'HD002', customer: 'Jane Smith', totalMoney: 1500, status: 'Pending', details: 'Nulla vitae elit libero, a pharetra augue.' },
    { id: 3, code: 'HD003', customer: 'Mike Brown', totalMoney: 800, status: 'Completed', details: 'Donec sed odio dui.' },
    { id: 4, code: 'HD004', customer: 'Emily Johnson', totalMoney: 1200, status: 'Cancelled', details: 'Maecenas sed diam eget risus varius blandit.' },
    { id: 5, code: 'HD005', customer: 'David Wilson', totalMoney: 900, status: 'Completed', details: 'Nullam id dolor id nibh ultricies vehicula ut id elit.' },
    { id: 6, code: 'HD006', customer: 'Sarah Parker', totalMoney: 1100, status: 'Pending', details: 'Maecenas faucibus mollis interdum.' },
    { id: 7, code: 'HD007', customer: 'Adam Taylor', totalMoney: 1300, status: 'Completed', details: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet.' },
    { id: 8, code: 'HD008', customer: 'Olivia White', totalMoney: 950, status: 'Pending', details: 'Cras mattis consectetur purus sit amet fermentum.' },
    { id: 9, code: 'HD009', customer: 'Liam Harris', totalMoney: 850, status: 'Cancelled', details: 'Aenean lacinia bibendum nulla sed consectetur.' },
    { id: 10, code: 'HD010', customer: 'Sophia Martin', totalMoney: 1050, status: 'Completed', details: 'Duis mollis, est non commodo luctus, nisi erat porttitor ligula.' },
];

const Voucher = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };
    const detail = () => {
        navigate('/voucher/detail');
    };
    const add = () => {
        navigate('/voucher/add');
    };
    const status = () => {
        navigate('/voucher/status');
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
    //   const isWithinDateRange = (!startDate || new Date(order.startDate) >= new Date(startDate)) && 
    //                               (!endDate || new Date(order.endDate) <= new Date(endDate));

    const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <Grid container spacing={3}>
            {/* Search Bar */}
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



            {/* Start Date Picker */}
            <Grid item xs={12} md={3}>
                <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            {/* End Date Picker */}
            <Grid item xs={12} md={3}>
                <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            {/* Filter by Status */}
            <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="filter-status-label">Kiểu</InputLabel>
                    <Select
                        labelId="filter-status-label"
                        id="filter-status"
                        value={filterStatus}
                        onChange={handleStatusChange}
                        label="Filter by Status"
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Completed">%</MenuItem>
                        <MenuItem value="Pending">VNĐ</MenuItem>
                        {/* <MenuItem value="Cancelled">Cancelled</MenuItem> */}
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
                        <Button variant="contained" color="primary" onClick={handleClearDetails}>
                            Back to Orders
                        </Button>
                    </Paper>
                ) : (
                    // Orders Table
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Mã</TableCell>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Kiểu</TableCell>
                                    <TableCell>Giá trị giảm</TableCell>
                                    <TableCell>Giá trị tối đa</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Ngày bắt đầu</TableCell>
                                    <TableCell>Ngày bắt kết thúc</TableCell>
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
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Button variant="outlined" color="primary">
                                                    <Link to="/voucher/detail">Dừng</Link>
                                                </Button>
                                                <Button variant="outlined" color="primary">
                                                    <Link to="/voucher/add">Thêm</Link>
                                                </Button>
                                                <Button variant="outlined" color="primary">
                                                    <Link to="/voucher/status">Status</Link>
                                                </Button>
                                            </Box>
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

export default Voucher;
