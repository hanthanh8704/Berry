import React, { useState, useEffect } from 'react';
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
import StarIcon from '@mui/icons-material/Star';
import { useNavigate, useParams } from 'react-router-dom';
import { listSanPham } from '../api/SanPhamApi/SanPham.js'
import { listSanPhamCT } from '../api/ChiTietSanPhamApi/ChiTietSanPhamApi.js'
const AddDotGiamGia = ({ handleAddDotGiamGia }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [searchValueSCT, setsearchValueSCT] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [sanPham, setSanPham] = useState([]);


    const [selectedSanPhamIds, setSelectedSanPhamIds] = useState([]);
    const [sanPhamCT, setSanPhamCT] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const navigate = useNavigate();

    //Diềm nó vào danh sách san pham 
    useEffect(() => {
        getAllSanPham();
    }, [])
    //Get hiển thị 
    function getAllSanPham() {
        listSanPham().then((response) => {
            setSanPham(response.data);
        }).catch(error => {
            console.error(error)
        })
    }

    // Diềm nó vào danh sách chi tiết sản phẩm 
    useEffect(() => {
        getAllSanPhamCT();
    }, [])
    //Get hiển thị 
    function getAllSanPhamCT() {
        listSanPhamCT().then((response) => {
            setSanPhamCT(response.data);
        }).catch(error => {
            console.error(error)
        })
    }

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };


    const handleStatusChange = (event) => {
        setFilterStatus(event.target.value);
        setCurrentPage(1);
    };


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

    function quayLai() {
        navigate('/dot-giam-gia')
    }

    const filteredOrders = sanPham.filter(sanPham =>
        sanPham.ten.toLowerCase().includes(searchValue.toLowerCase())
    );

    const searchSPCT = sanPhamCT.filter(sanPhamCT => sanPhamCT.idSanPham &&
        sanPhamCT.idSanPham.ten.toLowerCase().includes(searchValueSCT.toLowerCase()) ||
        sanPhamCT.idMauSac &&
        sanPhamCT.idMauSac.ten.toLowerCase().includes(searchValueSCT.toLowerCase())
    );


    const handleCheckboxChangeSPCT = (idSanPham) => {
        let updatedSelectedIds = [...selectedSanPhamIds];
        if (updatedSelectedIds.includes(idSanPham)) {
            updatedSelectedIds = updatedSelectedIds.filter(id => id !== idSanPham);  // Bỏ chọn sản phẩm
        } else {
            updatedSelectedIds.push(idSanPham);  // Chọn thêm sản phẩm
        }
        setSelectedSanPhamIds(updatedSelectedIds);

        // Lọc chi tiết sản phẩm tương ứng với các sản phẩm đã chọn
        const filteredSanPhamCT = getAllSanPhamCT.filter(item => updatedSelectedIds.includes(item.idSanPham));
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
            const filteredSanPhamCT = getAllSanPhamCT.filter(item => allIds.includes(item.idSanPham));
            setSanPhamCT(filteredSanPhamCT);
        }
        setAllChecked(!allChecked);
    };
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
                            Mã đợt giảm giá
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="ma"
                            // value={ma}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={6} marginTop={"15px"}>
                        <Typography variant="subtitle1" gutterBottom>  {/* Nhãn cho trường Ngày bắt đầu */}
                            Tên đợt giảm giá
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="ten"
                            // value={ten}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={6} marginTop={"15px"}>
                        <Typography variant="subtitle1" gutterBottom>  {/* Nhãn cho trường Ngày bắt đầu */}
                            Giá trị (%)
                        </Typography>
                        <TextField
                            fullWidth
                            // label="Giá trị (%)"
                            variant="outlined"
                            name="giaTri"
                            // value={giaTri}
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
                            // value={startDate}
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
                            // value={endDate}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-around" mt={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                type="submit"

                            >
                                Thêm mới
                            </Button>

                            <Button
                                onClick={quayLai}
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

                        {/* Search Bar */}
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center">
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Tìm kiếm theo tên sản phẩm, chất liệu, kích cỡ, màu sắc"
                                    value={searchValueSCT}
                                    onChange={(e) => setsearchValueSCT(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={searchSPCT}>
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
                                        <TableCell>STT</TableCell>
                                        <TableCell>Ảnh</TableCell>
                                        <TableCell>Tên sản phẩm</TableCell>
                                        <TableCell>Số lượng tồn</TableCell>
                                        <TableCell>Giá bán</TableCell>
                                        <TableCell>Chất liệu</TableCell>
                                        <TableCell>Màu sắc</TableCell>
                                        <TableCell>Kích cỡ</TableCell>
                                        <TableCell>Thương hiệu</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {searchSPCT.map((ct, index) => (
                                        <TableRow key={ct.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{ct.idAnh && ct.idAnh.anh}</TableCell>
                                            <TableCell>{ct.idSanPham && ct.idSanPham.ten}</TableCell>
                                            <TableCell>{ct.soLuong}</TableCell>
                                            <TableCell>{ct.giaBan}</TableCell>
                                            <TableCell>{ct.idChatLieu && ct.idChatLieu.ten}</TableCell>
                                            <TableCell>{ct.idMauSac && ct.idMauSac.ten}</TableCell>
                                            <TableCell>{ct.idKichCo && ct.idKichCo.ten}</TableCell>
                                            <TableCell>{ct.idThuongHieu && ct.idThuongHieu.ten}</TableCell>
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