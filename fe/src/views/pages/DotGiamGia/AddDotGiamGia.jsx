import React, { useState } from 'react';
import { Paper, Typography, Button, Box, Grid, TextField, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import Pagination from '@mui/material/Pagination';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const AddDotGiamGia = ({ handleAddDotGiamGia }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedSanPhamIds, setSelectedSanPhamIds] = useState([]);
    const [sanPhamCT, setSanPhamCT] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

    const handleCheckboxChange = (sanPhamId) => {
        setSelectedCheckboxes((prevSelectedCheckboxes) => ({
            ...prevSelectedCheckboxes,
            [sanPhamId]: !prevSelectedCheckboxes[sanPhamId], // Đảo ngược trạng thái checkbox
        }));
    };

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


    const [formData, setFormData] = useState({
        ten: '',
        giaTri: '',
        startDate: '',
        endDate: '',
        status: 'All'
    });

    const sanPham = [
        { id: 1, ten: 'Sản phẩm 1', },
        { id: 2, ten: 'Sản phẩm 2', },
        { id: 3, ten: 'Sản phẩm 3', },
        { id: 4, ten: 'Sản phẩm 4', },
        { id: 5, ten: 'Sản phẩm 5', },
        { id: 6, ten: 'Sản phẩm 6', },
        { id: 7, ten: 'Sản phẩm 7', },
        { id: 8, ten: 'Sản phẩm 8', },
    ];

    const handleCheckboxChangeSPCT = (idSanPham) => {
        let updatedSelectedIds = [...selectedSanPhamIds];
        if (updatedSelectedIds.includes(idSanPham)) {
            updatedSelectedIds = updatedSelectedIds.filter(id => id !== idSanPham);  // Bỏ chọn sản phẩm
        } else {
            updatedSelectedIds.push(idSanPham);  // Chọn thêm sản phẩm
        }
        setSelectedSanPhamIds(updatedSelectedIds);

        // Lọc chi tiết sản phẩm tương ứng với các sản phẩm đã chọn
        const filteredSanPhamCT = sanPhamCTData.filter(item => updatedSelectedIds.includes(item.idSanPham));
        setSanPhamCT(filteredSanPhamCT);

        // Cập nhật trạng thái của checkbox "Chọn tất cả"
        setAllChecked(updatedSelectedIds.length === paginatedOrders.length);
    };
    const handleSelectAll = () => {
        if (allChecked) {
            setSelectedSanPhamIds([]);
            setSanPhamCT([]);
        } else {
            const allIds = paginatedOrders.map(sanPham => sanPham.id);
            setSelectedSanPhamIds(allIds);
            const filteredSanPhamCT = sanPhamCTData.filter(item => allIds.includes(item.idSanPham));
            setSanPhamCT(filteredSanPhamCT);
        }
        setAllChecked(!allChecked);
    };


    const sanPhamCTData = [
        { id: 1, idAnh: 'img1', idSanPham: 1, soLuongTon: 30, giaBan: 200000, idChatLieu: 1, idMau: 1, idKichCo: 1, idDanhMuc: 1 },
        { id: 2, idAnh: 'img2', idSanPham: 2, soLuongTon: 25, giaBan: 250000, idChatLieu: 2, idMau: 2, idKichCo: 2, idDanhMuc: 2 },
        { id: 3, idAnh: 'img3', idSanPham: 3, soLuongTon: 40, giaBan: 300000, idChatLieu: 3, idMau: 3, idKichCo: 3, idDanhMuc: 3 },
        { id: 4, idAnh: 'img4', idSanPham: 4, soLuongTon: 20, giaBan: 150000, idChatLieu: 4, idMau: 4, idKichCo: 4, idDanhMuc: 4 },
        { id: 5, idAnh: 'img5', idSanPham: 5, soLuongTon: 35, giaBan: 220000, idChatLieu: 5, idMau: 5, idKichCo: 5, idDanhMuc: 5 },
        { id: 6, idAnh: 'img6', idSanPham: 6, soLuongTon: 45, giaBan: 270000, idChatLieu: 6, idMau: 6, idKichCo: 6, idDanhMuc: 6 },
        { id: 7, idAnh: 'img7', idSanPham: 7, soLuongTon: 50, giaBan: 320000, idChatLieu: 7, idMau: 7, idKichCo: 7, idDanhMuc: 7 },
        { id: 8, idAnh: 'img8', idSanPham: 8, soLuongTon: 15, giaBan: 180000, idChatLieu: 8, idMau: 8, idKichCo: 8, idDanhMuc: 8 },
        { id: 9, idAnh: 'img9', idSanPham: 9, soLuongTon: 10, giaBan: 210000, idChatLieu: 9, idMau: 9, idKichCo: 9, idDanhMuc: 9 },
        { id: 10, idAnh: 'img10', idSanPham: 10, soLuongTon: 60, giaBan: 350000, idChatLieu: 10, idMau: 10, idKichCo: 10, idDanhMuc: 10 },
    ];


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddDotGiamGia(formData);
        setFormData({
            ten: '',
            giaTri: '',
            startDate: '',
            endDate: '',
            status: ''
        });
    };


    const filteredOrders = sanPham.filter(sanPham =>
        sanPham.ten.toLowerCase().includes(searchValue.toLowerCase())
    );

    const filteredSPCT = sanPhamCT.filter(sanPhamCT =>
        sanPhamCT.idAnh.toLowerCase().includes(searchValue.toLowerCase())
    );

    const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: '8px' }}>
            <Typography variant="h3" gutterBottom marginBottom={"20px"}>
                Thêm đợt giảm giá
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} sx={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid black',
                marginTop: '50px'
            }}>
                <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} marginLeft={"15px"} width={"600px"}>

                    {/* <Grid container spacing={1}> */}

                    <Grid item xs={12} md={6} marginTop={"15px"}>
                        <Typography variant="subtitle1" gutterBottom>  {/* Nhãn cho trường Ngày bắt đầu */}
                            Tên đợt giảm giá
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="ten"
                            value={formData.ten}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} marginTop={"15px"}>
                        <Typography variant="subtitle1" gutterBottom>  {/* Nhãn cho trường Ngày bắt đầu */}
                            Giá trị
                        </Typography>
                        <TextField
                            fullWidth
                            // label="Giá trị (%)"
                            variant="outlined"
                            name="giaTri"
                            value={formData.giaTri}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} marginTop={"15px"}>
                        <Typography variant="subtitle1" gutterBottom>  {/* Nhãn cho trường Ngày bắt đầu */}
                            Ngày bắt đầu
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} marginTop={"15px"}>
                        <Typography variant="subtitle1" gutterBottom>  {/* Nhãn cho trường Ngày kết thúc */}
                            Ngày kết thúc
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} marginTop={"15px"}>
                        <Typography variant="subtitle1" gutterBottom>  {/* Nhãn cho trường Ngày bắt đầu */}
                            Trạng thái
                        </Typography>
                        <FormControl fullWidth variant="outlined" required>
                            <Select
                                labelId="filter-status-label"
                                id="filter-status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                label="Trạng thái"
                            >
                                <MenuItem value="All">Tất cả</MenuItem>
                                <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
                                <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-around" mt={2}>
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"

                            >
                                Thêm mới
                            </Button>

                            <Button

                                variant="contained"
                                color="primary"
                            >
                                Quay lại
                            </Button>
                        </Box>
                    </Grid>

                </Box>
                <Box id="table" noValidate autoComplete="off" width={"600px"} marginRight={"15px"}>
                    {/* //Tim kiem */}
                    <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center">
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Tìm kiếm theo tên sản phẩm"
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
                                    <TableCell>
                                        {/* Ô chọn tất cả */}
                                        <Checkbox
                                           indeterminate={selectedSanPhamIds.length > 0 && selectedSanPhamIds.length < paginatedOrders.length}
                                           checked={allChecked}
                                           onChange={handleSelectAll}
                                           inputProps={{ 'aria-label': 'Chọn tất cả' }}
                                        />
                                    </TableCell>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Tên đợt giảm giá</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedOrders.map((sanPham, index) => (
                                    <TableRow key={sanPham.id}>
                                        <TableCell>
                                            {/* Checkbox */}
                                            <Checkbox
                                                checked={selectedSanPhamIds.includes(sanPham.id)}
                                                onChange={() => handleCheckboxChangeSPCT(sanPham.id)}
                                                inputProps={{ 'aria-label': `Chọn sản phẩm ${sanPham.id}` }}
                                            />
                                        </TableCell>
                                        <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell>{sanPham.ten}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Pagination */}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                        <Pagination
                            count={Math.ceil(filteredOrders.length / pageSize)}
                            page={currentPage}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </Grid>
                </Box>
            </Box>


            {sanPhamCT.length > 0 && (
                <>
                    <Box id="table2" noValidate autoComplete="off" sx={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid black',
                        marginTop: '50px'
                    }} >
                        <Typography variant="h3" gutterBottom marginBottom={"20px"} marginTop={"20px"}>
                            Danh sách chi tiết sản phẩm
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Ảnh</TableCell>
                                        <TableCell>Số lượng tồn</TableCell>
                                        <TableCell>Giá bán</TableCell>
                                        <TableCell>Chất liệu</TableCell>
                                        <TableCell>Màu sắc</TableCell>
                                        <TableCell>Kích cỡ</TableCell>
                                        <TableCell>Danh mục</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sanPhamCT.map((ct, index) => (
                                        <TableRow key={ct.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{ct.idAnh}</TableCell>
                                            <TableCell>{ct.soLuongTon}</TableCell>
                                            <TableCell>{ct.giaBan}</TableCell>
                                            <TableCell>{ct.idChatLieu}</TableCell>
                                            <TableCell>{ct.idMau}</TableCell>
                                            <TableCell>{ct.idKichCo}</TableCell>
                                            <TableCell>{ct.idDanhMuc}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            )
            }

        </Paper >
    );
};

export default AddDotGiamGia;
