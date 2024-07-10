import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { IconEdit, IconCircleX, IconClockPause } from '@tabler/icons-react';
import FormatCurrency from "views/utilities/FormatCurrency";
import * as request from "views/utilities/httpRequest";
import FormatDate from 'views/utilities/FormatDate';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Button, Grid, RadioGroup, Radio, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Breadcrumb, Col, Input, Row, Modal ,Pagination} from "antd";


const Voucher = () => {
    const { confirm } = Modal;
    const [voucher, setVoucher] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [filterKieuGiam, setFilterKieuGiam] = useState('All');
    const [filterTrangThai, setFilterTrangThai] = useState('All');

    const [loaiGiamGia, setLoaiGiamGia] = useState('%');
    const [ngayBatDau, setNgayBatDau] = useState('');
    const [ngayKetThuc, setNgayKetThuc] = useState('');

    useEffect(() => {
        loadVoucher();
        const intervalId = setInterval(() => {
            loadVoucher();
            console.log('e');
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, [searchValue, pageSize, currentPage]);

    const loadVoucher = async () => {
        try {
            const response = await request.get('/voucher', {
                params: {
                    name: searchValue,
                    page: currentPage,
                    sizePage: pageSize,
                },
            }).then(response => {
                console.log('Data fetched:', response.data); 
                setVoucher(response.data);
            setTotalPages(response.totalPages);
            })
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
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     handAddVoucher(formValues);
    // };

    const filteredOrders = voucher.filter(order =>
        (filterKieuGiam === 'All' || order.kieuGiam === filterKieuGiam) &&
        (order.ma && order.ma.toLowerCase().includes(searchValue.toLowerCase())) ||
        (order.ten && order.ten.toLowerCase().includes(searchValue.toLowerCase())) ||
        (filterTrangThai === 'All' || order.trangThai === filterTrangThai)
    );


    // const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);



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
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="filter-status-label">Trạng thái</InputLabel>
                        <Select
                            labelId="filter-status-label"
                            id="filter-status"
                            value={filterTrangThai}
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
                        type="datetime-local"
                        label="Ngày kết thúc"
                        value={ngayKetThuc}
                        onChange={(e) => setNgayKetThuc(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="filter-kieu-label">Kiểu Giảm</InputLabel>
                        <Select
                            labelId="filter-kieu-label"
                            id="filter-kieu"
                            value={filterKieuGiam}
                            onChange={handleStatusChange1}
                            label="Kiểu Giảm"
                        >
                            <MenuItem value="All">Tất cả</MenuItem>
                            <MenuItem value="%">%</MenuItem>
                            <MenuItem value="VNĐ">VNĐ</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button variant="contained" color="primary">
                        <Link to={'/api/voucher/add'}>
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
                                    <TableCell>Giá trị giảm</TableCell>
                                    <TableCell>Loại</TableCell>
                                    <TableCell>Giá trị tối thiểu</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Ngày bắt đầu</TableCell>
                                    <TableCell>Ngày kết thúc</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                            
                                {voucher.map((voucher) => (
                                    <TableRow key={voucher.id}>
                                        <TableCell>{voucher.index}</TableCell>
                                        <TableCell>{voucher.ma}</TableCell>
                                        <TableCell>{voucher.ten}</TableCell>
                                        <TableCell>{(voucher.giaTriHoaDonDuocGiam)}  {voucher.hinhThucGiam}</TableCell>
                                        <TableCell>{voucher.loai}</TableCell>
                                        <TableCell>{voucher.giaTriHoaDonDuocApDung}</TableCell>
                                        <TableCell>{voucher.soLuong}</TableCell>
                                        <TableCell><FormatDate date={voucher.ngayBatDau} /></TableCell>
                                        <TableCell><FormatDate date={voucher.ngayKetThuc} /></TableCell>
                                        <TableCell>{voucher.trangThai}</TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Tooltip title="Update">
                                                    <IconButton
                                                        color="primary"
                                                    >
                                                        <Link to={'/api/voucher/' + voucher.id}><IconEdit /> </Link>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Stop">
                                                    <IconButton color="primary" onClick={() => showDeleteConfirm(voucher)}>
                                                        <IconClockPause />
                                                    </IconButton>
                                                </Tooltip>
                                                {/* <Tooltip title="Delete">
                                                    <IconButton
                                                        color="primary"
                                                    >
                                                        <Link to={'/api/voucher/delete'}><IconCircleX /></Link>

                                                    </IconButton>
                                                </Tooltip> */}
                                            </Box>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    <ToastContainer />
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


export default Voucher;

