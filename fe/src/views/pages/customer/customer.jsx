import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { IconEdit, IconMapPinFilled } from '@tabler/icons-react';
import * as request from "views/utilities/httpRequest";
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { Box, Paper, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Modal } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormatTime from 'views/utilities/FormatTime';
import { Pagination} from "antd";
const Customer = () => {
    const { confirm } = Modal;
    const [voucher, setVoucher] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [filterKieuGiam, setFilterKieuGiam] = useState('All');
    const [filterTrangThai, setFilterTrangThai] = useState('All');
    const [ngayBatDau, setNgayBatDau] = useState('');
    const [ngayKetThuc, setNgayKetThuc] = useState('');
    const [openModal, setOpenModal] = useState(false); // State for main modal
    const [openAddAddressModal, setOpenAddAddressModal] = useState(false); // State for add address form

    useEffect(() => {
        loadVoucher();
        const intervalId = setInterval(() => {
            loadVoucher();
            console.log('Data reloaded');
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, [searchValue, pageSize, currentPage]);

    const loadVoucher = async () => {
        try {
            const response = await request.get('/customer', {
                params: {
                    name: searchValue,
                    page: currentPage,
                    sizePage: pageSize,
                },
            });
            console.log('Data fetched:', response.data);
            setVoucher(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleStatusChange = (event) => {
        setFilterTrangThai(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange1 = (event) => {
        setFilterKieuGiam(event.target.value);
        setCurrentPage(1);
    };

    const showDeleteConfirm = (item) => {
        confirm({
            title: "Xác nhận",
            content: "Bạn có chắc muốn kết thúc phiếu giảm giá này không?",
            okText: "Xác nhận",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                request
                    .put(`/voucher/update/end-date/${item.id}`)
                    .then((response) => {
                        if (response.status === 200) {
                            loadVoucher();
                            toast.success("Kết thúc thành công!");
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                        toast.error(e.response.data);
                    });
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    const handleOpenAddAddressModal = () => {
        setOpenModal(false); // Close main modal if open
        setOpenAddAddressModal(true); // Open add address form modal
    };

    const handleCloseAddAddressModal = () => {
        setOpenAddAddressModal(false); // Close add address form modal
        setOpenModal(true); // Re-open main modal
    };

    const handleFormSubmit = (data) => {
        console.log('Submitted data:', data);
        setOpenAddAddressModal(false); // Close add address form modal after submission
        setOpenModal(true); // Re-open main modal after closing add address form modal
    };

    return (
        <Grid container spacing={3}>
            <Grid container spacing={1} style={{ backgroundColor: 'white', padding: '10px', marginLeft: '24px', marginTop: '20px', borderRadius: '10px' }}>
                <Grid item xs={12} md={10}>
                    <Typography variant="h3" gutterBottom>
                        Bộ lọc
                    </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Box display="flex" alignItems="center">
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Tìm kiếm đơn hàng..."
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
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="filter-status-label">Trạng thái</InputLabel>
                        <Select
                            labelId="filter-status-label"
                            id="filter-status"
                            value={filterTrangThai}
                            onChange={handleStatusChange}
                            label="Lọc theo Trạng thái"
                        >
                            <MenuItem value="All">Tất cả</MenuItem>
                            <MenuItem value="Sắp diễn ra">Sắp diễn ra</MenuItem>
                            <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
                            <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="datetime-local"
                        label="Ngày bắt đầu"
                        value={ngayBatDau}
                        onChange={(e) => setNgayBatDau(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="date"
                        label="Ngày kết thúc"
                        value={ngayKetThuc}
                        onChange={(e) => setNgayKetThuc(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button variant="contained" color="primary" >
                    <Link to={'/api/customer/add'}>
                            Thêm
                        </Link>
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid item xs={12} style={{ backgroundColor: 'white', borderRadius: '10px', marginLeft: '10px' }}>
                    <TableContainer component={Paper}>
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Mã</TableCell>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Giới tính</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Số điện thoại</TableCell>
                                    <TableCell>Ngày sinh</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {voucher.map((voucher, index) => (
                                    <TableRow key={voucher.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{voucher.ma}</TableCell>
                                        <TableCell>{voucher.hoTen}</TableCell>
                                        <TableCell>{voucher.gioiTinh}</TableCell>
                                        <TableCell>{voucher.email}</TableCell>
                                        <TableCell>{voucher.soDienThoai}</TableCell>
                                        <TableCell><FormatTime date={voucher.ngaySinh} /></TableCell>
                                        <TableCell>{voucher.trangThai}</TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Tooltip title="Cập nhật">
                                                    <IconButton color="primary">
                                                        <Link to={`/api/customer/${voucher.id}`}><IconEdit /></Link>
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                </Grid>
            </Grid>
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
    );
};

export default Customer;
