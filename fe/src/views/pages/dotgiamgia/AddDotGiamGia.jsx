import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Box, Grid, Input, TextField, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
import { listSanPham } from 'views/utilities/ApiDotGiamGia/DotGiamGiaApi.js'
import { create }  from 'views/utilities/ApiDotGiamGia/DotGiamGiaApi.js'
import { listSanPhamCT } from 'views/utilities/ApiDotGiamGia/DotGiamGiaApi.js'
import { findAllByIdSanPham } from 'views/utilities/ApiDotGiamGia/DotGiamGiaApi.js'
import FormatCurrency from "../../utilities/FormatCurrency.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'antd';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const AddDotGiamGia = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [sanPham, setSanPham] = useState([]);
    const [searchValueSCT, setSearchValueSCT] = useState('');
    const [sanPhamCT, setSanPhamCT] = useState([]);
    // Check box của sản phẩm
    const [allCheckedSP, setAllCheckedSP] = useState(false);
    const [selectedSanPhamIds, setSelectedSanPhamIds] = useState([]);
    // Check box của SPCT 
    const [allCheckedSPCT, setAllCheckedSPCT] = useState(false);
    const [selectedSanPhamDetailIds, setSelectedSanPhamDetailIds] = useState([]);
   
    const navigate = useNavigate();

    // const [ma, setMa] = useState('');
    const [ten, setTen] = useState('');
    const [giaTriGiam, setGiaTriGiam] = useState('');
    const [ngayBatDau, setNgayBatDau] = useState('');
    const [ngayKetThuc, setNgayKetThuc] = useState('');

    const handleMa = (e) => setMa(e.target.value);
    const handleTen = (e) => setTen(e.target.value);
    const handleGiaTriGiam = (e) => setGiaTriGiam(e.target.value);
    const handleNgayBatDau = (e) => setNgayBatDau(e.target.value);
    const handleNgayKetThuc = (e) => setNgayKetThuc(e.target.value);

    // Khai bao thong bao vialidate
    const [errors, setErrors] = useState({
        // ma: '',
        ten: '',
        giaTriGiam: '',
        ngayBatDau: '',
        ngayKetThuc: ''
    });


 // Hàm thêm đợt giảm giá
    const saveDotGiamGia = async (e) => {
    e.preventDefault();
    if (validateForm()) {
        if (selectedSanPhamDetailIds.length === 0) {
            toast.error("Vui lòng chọn sản phẩm áp dụng");
        } else {
            Modal.confirm({
                title: "Xác nhận",
                maskClosable: true,
                content: "Xác nhận thêm đợt giảm giá mới?",
                okText: "Xác nhận",
                cancelText: "Hủy",
                onOk: async () => {
        const dotGiamGia = { ten, giaTriGiam, ngayBatDau, ngayKetThuc, productDetails: selectedSanPhamDetailIds };
        try {
            const response = await create(dotGiamGia);
            console.log(response.data); // Log dữ liệu phản hồi từ server nếu cần
            toast.success("Thêm thành công đợt giảm giá!");
            setTimeout(() => {
                navigate('/dot-giam-gia');
            }, 2000); // Chuyển hướng sau khi thêm thành công sau 2s mới chuyển 
        } catch (error) {
            toast.error(error);
        }
        }
        });
    }
}
};

     function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };
    
        // // Validate mã
        // if (!ma.trim()) {
        //     errorsCopy.ma = 'Mã đợt giảm giá không được để trống!';
        //     valid = false;
        // } else if (ma.length > 20) {
        //     errorsCopy.ma = 'Mã đợt giảm giá không được vượt quá 20 kí tự!';
        //     valid = false;
        // } else {                    
        //     errorsCopy.ma = '';       
        // }
    
        // Validate tên
        if (!ten.trim()) {
            errorsCopy.ten = 'Tên đợt giảm giá không được để trống!';
            valid = false;
        } else if (ten.length > 50) {
            errorsCopy.ten = 'Tên đợt giảm giá không được vượt quá 50 kí tự!';
            valid = false;
        } else {
            errorsCopy.ten = '';
        }
    
        // Validate giá trị giảm
        const giaTriGiamNumber = parseInt(giaTriGiam);
        if (!giaTriGiam.trim()) {
            errorsCopy.giaTriGiam = 'Giá trị giảm không được để trống!';
            valid = false;
        } else if (isNaN(giaTriGiamNumber) || !Number.isInteger(giaTriGiamNumber) || giaTriGiamNumber < 1 || giaTriGiamNumber > 50) {
            errorsCopy.giaTriGiam = 'Giá trị giảm phải là số nguyên từ 1% đến 50%!';
            valid = false;
        } else {
            errorsCopy.giaTriGiam = '';
        }
        // Validate ngày bắt đầu
        if (!ngayBatDau.trim()) {
            errorsCopy.ngayBatDau = 'Ngày bắt đầu không được để trống!';
            valid = false;
        } else {
            const ngayBatDauDate = new Date(ngayBatDau);
            const ngayKetThucDate = new Date(ngayKetThuc);
            const currentDate = new Date();
            
            if (ngayBatDauDate < currentDate.setHours(0, 0, 0, 0)) {
                errorsCopy.ngayBatDau = 'Ngày bắt đầu phải từ ngày giờ hiện tại trở đi!';
                valid = false;
            } else if (ngayBatDauDate >= ngayKetThucDate) {
                errorsCopy.ngayBatDau = 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc!';
                valid = false;
            } else {
                errorsCopy.ngayBatDau = '';
            }
        }
    
        // Validate ngày kết thúc
        if (!ngayKetThuc.trim()) {
            errorsCopy.ngayKetThuc = 'Ngày kết thúc không được để trống!';
            valid = false;
        } else {
            const ngayBatDauDate = new Date(ngayBatDau);
            const ngayKetThucDate = new Date(ngayKetThuc);
    
            if (ngayKetThucDate <= ngayBatDauDate) {
                errorsCopy.ngayKetThuc = 'Ngày kết thúc phải lớn hơn ngày bắt đầu!';
                valid = false;
            } else {
                errorsCopy.ngayKetThuc = '';
            }
        }
    
        setErrors(errorsCopy);
        return valid;
    }
    

//     //Diềm nó vào danh sách san pham 
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

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    function quayLai() {
        navigate('/voucher/dot-giam-gia')
    }

    const filteredOrders = sanPham.filter(sanPham =>
        sanPham.ten.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Làm check box cho sp 
    // Chuyển sang SPCT lấy ra theo id 
    const fetchSanPhamCT = async (selectedIds) => {
        const promises = selectedIds.map(id => findAllByIdSanPham(id));
        const results = await Promise.all(promises);
        const allDetails = results.flatMap(result => result.data);
        setSanPhamCT(allDetails);
    };

    // Xử lý khi checkbox của SP thay đổi
    const handleCheckboxChangeSP = (idSanPham) => {
        let updatedSelectedIds = [...selectedSanPhamIds];
        if (updatedSelectedIds.includes(idSanPham)) {
            updatedSelectedIds = updatedSelectedIds.filter(id => id !== idSanPham); // Bỏ chọn sản phẩm
        } else {
            updatedSelectedIds.push(idSanPham); // Chọn thêm sản phẩm
        }
        setSelectedSanPhamIds(updatedSelectedIds);
        fetchSanPhamCT(updatedSelectedIds); // Gọi lại API với danh sách idSanPham được chọn
    };

    const handleSelectAllSP = () => {
        if (selectedSanPhamIds.length === paginatedOrders.length) {
            setSelectedSanPhamIds([]);
            setSanPhamCT([]);
        } else {
            const allIds = paginatedOrders.map(sp => sp.id);
            setSelectedSanPhamIds(allIds);
            fetchSanPhamCT(allIds);
        }
    };

    // Xử lý khi thay đổi giá trị tìm kiếm
    const handleSearchChange = (e) => {
        setSearchValueSCT(e.target.value);
    };

    // Lọc danh sách chi tiết sản phẩm theo giá trị tìm kiếm
    const searchSPCT = sanPhamCT.filter(ct =>
        (ct.idSanPham && ct.idSanPham.ten.toLowerCase().includes(searchValueSCT.toLowerCase())) ||
        (ct.idMauSac && ct.idMauSac.ten.toLowerCase().includes(searchValueSCT.toLowerCase())) ||
        (ct.idChatLieu && ct.idChatLieu.ten.toLowerCase().includes(searchValueSCT.toLowerCase())) ||
        (ct.idKichCo && ct.idKichCo.ten.toLowerCase().includes(searchValueSCT.toLowerCase()))
    );

    const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);



    // Check box của SPCT 
    // Xử lý sự kiện chọn tất cả
    const handleSelectAllSPCT = (event) => {
        const checked = event.target.checked;
        setAllCheckedSPCT(checked);
        const ids = checked ? searchSPCT.map((item) => item.id) : [];
        setSelectedSanPhamDetailIds(ids);
    };

    // Xử lý sự kiện chọn từng checkbox
    const handleCheckboxChangeSPCT = (event, id) => {
        const checked = event.target.checked;
        let updatedIds = [...selectedSanPhamDetailIds];

        if (checked && !updatedIds.includes(id)) {
            updatedIds.push(id);
        } else {
            updatedIds = updatedIds.filter((item) => item !== id);
        }

        setSelectedSanPhamDetailIds(updatedIds);
    };

    // Kiểm tra xem tất cả checkbox có được chọn không
    useEffect(() => {
        setAllCheckedSPCT(selectedSanPhamDetailIds.length === searchSPCT.length);
    }, [selectedSanPhamDetailIds, searchSPCT]);

     

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
                <Box component="form" noValidate autoComplete="off" marginLeft={"15px"} width={"500px"}>

                    {/* <Grid container spacing={1}> */}
                    
                    {/* <Grid item xs={12} md={6} marginTop={"15px"}>
                        <Typography variant="subtitle1" gutterBottom> 
                            Mã đợt giảm giá
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="ma"
                            value={ma}
                            className={`${errors.ma ? 'is-invalid' : ''}`}
                            // Đảm bảo rằng bạn đã bỏ comment dòng này để kích hoạt sự kiện onChange
                            required
                            onChange={(e) => setMa(e.target.value)}

                            placeholder="Mời nhập mã đợt giảm giá"
                        />
                        {errors.ma && <span className='invalid-feedback'>{errors.ma}</span>}
                    </Grid> */}

                    <Grid item xs={12} md={6} marginTop={"15px"}>
                        <Typography variant="subtitle1" gutterBottom>  {/* Nhãn cho trường Ngày bắt đầu */}
                            Tên đợt giảm giá
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="ten"
                            value={ten}
                            className={`${errors.ten ? 'is-invalid' : ''}`}
                            placeholder='Mời nhập tên đợt giảm giá'
                            onChange={(e) => setTen(e.target.value)}
                            required
                        />
                        {errors.ten && <span className='invalid-feedback'>{errors.ten}</span>}
                    </Grid>

                    <Grid item xs={12} md={6} marginTop="15px">
                        <Typography variant="subtitle1" gutterBottom>
                            Giá trị (%)
                        </Typography>
                        <TextField
                            type='number'
                            fullWidth
                            variant="outlined"
                            name="giaTriGiam"
                            value={giaTriGiam}
                            className={`${errors.giaTriGiam ? 'is-invalid' : ''}`}
                            onChange={(e) => setGiaTriGiam(e.target.value)}
                            required
                            placeholder='Mời nhập giá trị giảm giá'
                        />
                        {errors.giaTriGiam && <div className='invalid-feedback'>{errors.giaTriGiam}</div>}
                    </Grid>


                    <Grid item xs={12} md={6} marginTop="15px">
                        <Typography variant="subtitle1" gutterBottom>
                            Ngày bắt đầu
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="ngayBatDau"
                            value={ngayBatDau}
                            type="datetime-local"
                            className={`${errors.ngayBatDau ? 'is-invalid' : ''}`}
                            onChange={(e) => setNgayBatDau(e.target.value)}
                            required
                        />
                        {errors.ngayBatDau && <div className='invalid-feedback'>{errors.ngayBatDau}</div>}
                    </Grid>

                    <Grid item xs={12} md={6} marginTop="15px">
                        <Typography variant="subtitle1" gutterBottom>
                            Ngày kết thúc
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            name="ngayKetThuc"
                            value={ngayKetThuc}
                            type="datetime-local"
                            className={`${errors.ngayKetThuc ? 'is-invalid' : ''}`}
                            onChange={(e) => setNgayKetThuc(e.target.value)}
                            required
                        />
                        {errors.ngayKetThuc && <div className='invalid-feedback'>{errors.ngayKetThuc}</div>}
                    </Grid>

                    <Grid item xs={12}>
                    <ToastContainer />
                        <Box display="flex" justifyContent="space-around" mt={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                                onClick={(e) => saveDotGiamGia(e)}
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

                <Box id="table" noValidate autoComplete="off" width={"500px"} marginRight={"15px"}>
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
                                              checked={selectedSanPhamIds.length === paginatedOrders.length}
                                                onChange={handleSelectAllSP}
                                                inputProps={{ 'aria-label': 'Chọn tất cả' }}
                                        />
                                    </TableCell>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Tên sản phẩm</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedOrders.map((sanPham, index) => (
                                    <TableRow key={sanPham.id}>
                                        <TableCell>
                                            {/* Checkbox */}
                                            <Checkbox
                                               
                                                checked={selectedSanPhamIds.includes(sanPham.id)}
                                                onChange={() => handleCheckboxChangeSP(sanPham.id)}
                                                
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
                                    onChange={handleSearchChange}
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
                                        <TableCell>
                                            {/* Ô chọn tất cả */}
                                            <Checkbox
                                                checked={allCheckedSPCT}
                                                onChange={handleSelectAllSPCT}
                                                inputProps={{ 'aria-label': 'Chọn tất cả' }}
                                            />
                                        </TableCell>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Tên sản phẩm</TableCell>
                                        <TableCell>Số lượng tồn</TableCell>
                                        <TableCell>Giá bán</TableCell>
                                        <TableCell>Chất liệu</TableCell>
                                        <TableCell>Màu sắc</TableCell>
                                        <TableCell>Kích cỡ</TableCell>
                                        <TableCell>Thương hiệu</TableCell>
                                        <TableCell>Tay áo</TableCell>
                                        <TableCell>Cổ áo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {searchSPCT.map((ct, index) => (
                                        <TableRow key={ct.id}>
                                            <TableCell>
                                                {/* Checkbox */}
                                                <Checkbox
                                                    checked={selectedSanPhamDetailIds.includes(ct.id)}
                                                    onChange={(e) => handleCheckboxChangeSPCT(e, ct.id)}        
                                                    inputProps={{ 'aria-label': `Chọn sản phẩm chi tiết ${ct.id}` }}
                                                   
                                                />
                                            </TableCell>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{ct.idSanPham && ct.idSanPham.ten}</TableCell>
                                            <TableCell>{ct.soLuong}</TableCell>
                                            <TableCell><FormatCurrency value={ct.giaBan} /></TableCell>
                                            <TableCell>{ct.idChatLieu && ct.idChatLieu.ten}</TableCell>
                                            <TableCell>{ct.idMauSac && ct.idMauSac.ten}</TableCell>
                                            <TableCell>{ct.idKichCo && ct.idKichCo.ten}</TableCell>
                                            <TableCell>{ct.idThuongHieu && ct.idThuongHieu.ten}</TableCell>
                                            <TableCell>{ct.idTayAo && ct.idTayAo.ten}</TableCell>
                                            <TableCell>{ct.idCoAo && ct.idCoAo.ten}</TableCell>
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


// import React, { useState, useEffect } from 'react';
// import { Paper, Typography, Button, Box, Grid, Modal, Input, TextField, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Table from '@mui/material/Table';
// import Pagination from '@mui/material/Pagination';
// import IconButton from '@mui/material/IconButton';
// import SearchIcon from '@mui/icons-material/Search';
// import { useNavigate, useParams } from 'react-router-dom';
// import { listSanPham } from '../api/SanPhamApi/SanPham.js'
// import { create } from '../api/DotGiamGiaApi/DotGiamGiaApi.js'
// import { findAllByIdSanPham } from '../api/ChiTietSanPhamApi/ChiTietSanPhamApi.js'
// import FormatCurrency from "../../utilities/FormatCurrency.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';

// const AddDotGiamGia = () => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize] = useState(5);
//     const [searchValue, setSearchValue] = useState('');
//     const [sanPham, setSanPham] = useState([]);
//     const [searchValueSCT, setSearchValueSCT] = useState('');
//     const [sanPhamCT, setSanPhamCT] = useState([]);
//     // Check box của sản phẩm
//     const [allCheckedSP, setAllCheckedSP] = useState(false);
//     const [selectedSanPhamIds, setSelectedSanPhamIds] = useState([]);
//     // Check box của SPCT 
//     const [allCheckedSPCT, setAllCheckedSPCT] = useState(false);
//     const [selectedSanPhamDetailIds, setSelectedSanPhamDetailIds] = useState([]);

//     const navigate = useNavigate();

//     const [ma, setMa] = useState('');
//     const [ten, setTen] = useState('');
//     const [giaTriGiam, setGiaTriGiam] = useState('');
//     const [ngayBatDau, setNgayBatDau] = useState('');
//     const [ngayKetThuc, setNgayKetThuc] = useState('');

//     const handleMa = (e) => setMa(e.target.value);
//     const handleTen = (e) => setTen(e.target.value);
//     const handleGiaTriGiam = (e) => setGiaTriGiam(e.target.value);
//     const handleNgayBatDau = (e) => setNgayBatDau(e.target.value);
//     const handleNgayKetThuc = (e) => setNgayKetThuc(e.target.value);

//     // Khai bao thong bao vialidate
//     const [errors, setErrors] = useState({
//         ma: '',
//         ten: '',
//         giaTriGiam: '',
//         ngayBatDau: '',
//         ngayKetThuc: ''
//     });

//     // Hàm thêm đợt giảm giá
//     const saveDotGiamGia = async (e) => {
//         e.preventDefault(); // Đảm bảo ngăn chặn hành động mặc định của form
//         if (validateForm()) { // Kiểm tra xem các trường thông tin nhập liệu có hợp lệ không
//             const dotGiamGia = { ma, ten, giaTriGiam, ngayBatDau, ngayKetThuc, productDetails: selectedSanPhamDetailIds };
//             try {
//                 // Gửi yêu cầu tạo mới đợt giảm giá và chờ phản hồi
//                 const response = await create(dotGiamGia);
//                 console.log(response.data); // Log dữ liệu phản hồi từ server nếu cần
//                 navigate('/dot-giam-gia'); // Chuyển hướng sau khi thêm thành công
//             } catch (error) {
//                 console.error("Thêm thất bại dotGiamGia ", error); // Xử lý lỗi nếu có
//             }
//         }
//     };


//     function validateForm() {
//         let valid = true;
//         const errorsCopy = { ...errors };

//         if (ma.trim()) {
//             errorsCopy.ma = '';
//         } else {
//             errorsCopy.ma = 'Mã đợt giảm giá không được để trống!';
//             valid = false;
//         }

//         if (ten.trim()) {
//             errorsCopy.ten = '';
//         } else {
//             errorsCopy.ten = 'Tên đợt giảm giá không được để trống!';
//             valid = false;
//         }

//         if (giaTriGiam.trim()) {
//             errorsCopy.giaTriGiam = '';
//         } else {
//             errorsCopy.giaTriGiam = 'Giá trị giảm không được để trống!';
//             valid = false;
//         }

//         if (ngayBatDau.trim()) {
//             errorsCopy.ngayBatDau = '';
//         } else {
//             errorsCopy.ngayBatDau = 'Ngày bắt đầu không được để trống!';
//             valid = false;
//         }

//         if (ngayKetThuc.trim()) {
//             errorsCopy.ngayKetThuc = '';
//         } else {
//             errorsCopy.ngayKetThuc = 'Ngày kết thúc không được để trống!';
//             valid = false;
//         }

//         setErrors(errorsCopy);
//         return valid;
//     }


//     //Diềm nó vào danh sách san pham 
//     useEffect(() => {
//         getAllSanPham();
//     }, [])
//     //Get hiển thị 
//     function getAllSanPham() {
//         listSanPham().then((response) => {
//             setSanPham(response.data);
//         }).catch(error => {
//             console.error(error)
//         })
//     }

//     const handleChangePage = (event, newPage) => {
//         setCurrentPage(newPage);
//     };

//     function quayLai() {
//         navigate('/dot-giam-gia')
//     }

//     const filteredOrders = sanPham.filter(sanPham =>
//         sanPham.ten.toLowerCase().includes(searchValue.toLowerCase())
//     );

//     // Làm check box cho sp 
//     // Chuyển sang SPCT lấy ra theo id 
//     const fetchSanPhamCT = async (selectedIds) => {
//         const promises = selectedIds.map(id => findAllByIdSanPham(id));
//         const results = await Promise.all(promises);
//         const allDetails = results.flatMap(result => result.data);
//         setSanPhamCT(allDetails);
//     };

//     // Xử lý khi checkbox của SP thay đổi
//     const handleCheckboxChangeSP = (idSanPham) => {
//         let updatedSelectedIds = [...selectedSanPhamIds];
//         if (updatedSelectedIds.includes(idSanPham)) {
//             updatedSelectedIds = updatedSelectedIds.filter(id => id !== idSanPham); // Bỏ chọn sản phẩm
//         } else {
//             updatedSelectedIds.push(idSanPham); // Chọn thêm sản phẩm
//         }
//         setSelectedSanPhamIds(updatedSelectedIds);
//         fetchSanPhamCT(updatedSelectedIds); // Gọi lại API với danh sách idSanPham được chọn
//     };

//     const handleSelectAllSP = () => {
//         if (selectedSanPhamIds.length === paginatedOrders.length) {
//             setSelectedSanPhamIds([]);
//             setSanPhamCT([]);
//         } else {
//             const allIds = paginatedOrders.map(sp => sp.id);
//             setSelectedSanPhamIds(allIds);
//             fetchSanPhamCT(allIds);
//         }
//     };

//     // Xử lý khi thay đổi giá trị tìm kiếm
//     const handleSearchChange = (e) => {
//         setSearchValueSCT(e.target.value);
//     };

//     // Lọc danh sách chi tiết sản phẩm theo giá trị tìm kiếm
//     const searchSPCT = sanPhamCT.filter(ct =>
//         (ct.idSanPham && ct.idSanPham.ten.toLowerCase().includes(searchValueSCT.toLowerCase())) ||
//         (ct.idMauSac && ct.idMauSac.ten.toLowerCase().includes(searchValueSCT.toLowerCase())) ||
//         (ct.idChatLieu && ct.idChatLieu.ten.toLowerCase().includes(searchValueSCT.toLowerCase())) ||
//         (ct.idKichCo && ct.idKichCo.ten.toLowerCase().includes(searchValueSCT.toLowerCase()))
//     );

//     const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);



//     // Check box của SPCT 
//     // Xử lý sự kiện chọn tất cả
//     const handleSelectAllSPCT = (event) => {
//         const checked = event.target.checked;
//         setAllCheckedSPCT(checked);
//         const ids = checked ? searchSPCT.map((item) => item.id) : [];
//         setSelectedSanPhamDetailIds(ids);
//     };

//     // Xử lý sự kiện chọn từng checkbox
//     const handleCheckboxChangeSPCT = (event, id) => {
//         const checked = event.target.checked;
//         let updatedIds = [...selectedSanPhamDetailIds];

//         if (checked && !updatedIds.includes(id)) {
//             updatedIds.push(id);
//         } else {
//             updatedIds = updatedIds.filter((item) => item !== id);
//         }

//         setSelectedSanPhamDetailIds(updatedIds);
//     };

//     // Kiểm tra xem tất cả checkbox có được chọn không
//     useEffect(() => {
//         setAllCheckedSPCT(selectedSanPhamDetailIds.length === searchSPCT.length);
//     }, [selectedSanPhamDetailIds, searchSPCT]);


//     return (
//         <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: '8px' }}>
//             <Typography variant="h3" gutterBottom marginBottom={"20px"}>
//                 Thêm đợt giảm giá
//             </Typography>
//             <form onSubmit={saveDotGiamGia}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} sx={{
//                     backgroundColor: 'white',
//                     padding: '20px',
//                     borderRadius: '10px',
//                     border: '1px solid black',
//                     marginTop: '50px'
//                 }}>
//                     {/* <Box component="form" noValidate autoComplete="off" marginLeft={"15px"} width={"600px"}>
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     label="Mã đợt giảm giá"
//                                     variant="outlined"
//                                     value={ma}
//                                     name='ma'
//                                     onChange={(e) => setMa(e.target.value)}
//                                     fullWidth
//                                     required
//                                     error={!!errors.ma}
//                                     helperText={errors.ma}
//                                     className={`${errors.ma ? 'is-invalid' : ''}`}
//                                     InputLabelProps={{ className: 'custom-label' }}
//                                 />
//                                 {errors.ma && <span className='invalid-feedback'>{errors.ma}</span>}
//                             </Grid>

//                             <Grid item xs={6}>
//                                 <TextField
//                                     label="Tên đợt giảm giá"
//                                     value={ten}
//                                     name='ten'
//                                     onChange={handleTen}
//                                     fullWidth
//                                     required
//                                     error={!!errors.ten}
//                                     helperText={errors.ten}
//                                     InputLabelProps={{ className: 'custom-label' }}
//                                 />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     label="Giá trị giảm"
//                                     value={giaTriGiam}
//                                     name='giaTriGiam'
//                                     onChange={handleGiaTriGiam}
//                                     fullWidth
//                                     required
//                                     error={!!errors.giaTriGiam}
//                                     helperText={errors.giaTriGiam}
//                                     InputLabelProps={{ className: 'custom-label' }}
//                                 />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     label="Ngày bắt đầu"
//                                     type="datetime-local"
//                                     value={ngayBatDau}
//                                     name='ngayBatDau'
//                                     onChange={handleNgayBatDau}
//                                     fullWidth
//                                     required
//                                     InputLabelProps={{ shrink: true, className: 'custom-label' }}
//                                     error={!!errors.ngayBatDau}
//                                     helperText={errors.ngayBatDau}
//                                 />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     label="Ngày kết thúc"
//                                     type="datetime-local"
//                                     value={ngayKetThuc}
//                                     name='ngayKetThuc'
//                                     onChange={handleNgayKetThuc}
//                                     fullWidth
//                                     required
//                                     InputLabelProps={{ shrink: true, className: 'custom-label' }}
//                                     error={!!errors.ngayKetThuc}
//                                     helperText={errors.ngayKetThuc}
//                                 />
//                             </Grid>
//                         </Grid>
//                         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
//                             <Button variant="contained" color="primary" type="submit" sx={{ marginRight: '10px' }}>
//                                 Lưu
//                             </Button>
//                             <Button variant="contained" color="secondary" onClick={quayLai}>
//                                 Quay lại
//                             </Button>
//                         </Box>

//                         <style jsx>{`
//                             .custom-label .MuiFormLabel-asterisk {
//                                 color: red;
//                             }
//                         `}</style>
//                     </Box> */}
//                     <Box component="form" noValidate autoComplete="off" marginLeft="15px" width="600px">
//                         <Grid item xs={12} md={6} marginTop="15px">
//                             <Typography variant="subtitle1" gutterBottom>
//                                 Mã đợt giảm giá
//                             </Typography>
//                             <TextField
//                                 fullWidth
//                                 variant="outlined"
//                                 name="ma"
//                                 className={`${errors.ma ? 'is-invalid' : ''}`}
//                                 value={ma}
//                                 onChange={(e) => setMa(e.target.value)}
//                                 required
//                                 placeholder="Mời nhập mã đợt giảm giá"
                               
//                             />
//                             {errors.ma && <div className='invalid-feedback'>{errors.ma}</div>}
//                         </Grid>

//                         <Grid item xs={12} md={6} marginTop="15px">
//                             <Typography variant="subtitle1" gutterBottom>
//                                 Tên đợt giảm giá
//                             </Typography>
//                             <TextField
//                                 fullWidth
//                                 variant="outlined"
//                                 name="ten"
//                                 className={`${errors.ten ? 'is-invalid' : ''}`}
//                                 value={ten}
//                                 onChange={handleTen}
//                                 required
//                                 placeholder='Mời nhập tên đợt giảm giá'
//                             />
//                             {errors.ten && <div className='invalid-feedback'>{errors.ten}</div>}
//                         </Grid>

//                         <Grid item xs={12} md={6} marginTop="15px">
//                             <Typography variant="subtitle1" gutterBottom>
//                                 Giá trị (%)
//                             </Typography>
//                             <TextField
//                                 fullWidth
//                                 variant="outlined"
//                                 name="giaTriGiam"
//                                 value={giaTriGiam}
//                                 onChange={handleGiaTriGiam}
//                                 required
//                                 placeholder='Mời nhập giá trị giảm giá'
//                             />
//                             {errors.giaTriGiam && <div className='invalid-feedback'>{errors.giaTriGiam}</div>}
//                         </Grid>

//                         <Grid item xs={12} md={6} marginTop="15px">
//                             <Typography variant="subtitle1" gutterBottom>
//                                 Ngày bắt đầu
//                             </Typography>
//                             <TextField
//                                 fullWidth
//                                 variant="outlined"
//                                 name="ngayBatDau"
//                                 type="date"
//                                 value={ngayBatDau}
//                                 onChange={handleNgayBatDau}
//                                 required
//                             />
//                             {errors.ngayBatDau && <div className='invalid-feedback'>{errors.ngayBatDau}</div>}
//                         </Grid>

//                         <Grid item xs={12} md={6} marginTop="15px">
//                             <Typography variant="subtitle1" gutterBottom>
//                                 Ngày kết thúc
//                             </Typography>
//                             <TextField
//                                 fullWidth
//                                 variant="outlined"
//                                 name="ngayKetThuc"
//                                 type="date"
//                                 value={ngayKetThuc}
//                                 onChange={handleNgayKetThuc}
//                                 required
//                             />
//                             {errors.ngayKetThuc && <div className='invalid-feedback'>{errors.ngayKetThuc}</div>}
//                         </Grid>

//                         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
//                             <Button variant="contained" color="primary" type="submit" sx={{ marginRight: '10px' }}>
//                                 Lưu
//                             </Button>
//                             <Button variant="contained" color="secondary" onClick={quayLai}>
//                                 Quay lại
//                             </Button>
//                         </Box>
//                     </Box>


//                     <Box id="table" noValidate autoComplete="off" width={"600px"} marginRight={"15px"}>
//                         {/* Thanh tìm kiếm cửa Sản phẩm */}
//                         {/* //Tim kiem */}
//                         <Grid item xs={12} md={6}>
//                             <Box display="flex" alignItems="center">
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     placeholder="Tìm kiếm theo tên sản phẩm"
//                                     value={searchValue}
//                                     onChange={(e) => setSearchValue(e.target.value)}
//                                     InputProps={{
//                                         endAdornment: (
//                                             <IconButton>
//                                                 <SearchIcon />
//                                             </IconButton>
//                                         )
//                                     }}
//                                 />
//                             </Box>
//                         </Grid>

//                         {/* Bảng sản phẩm  */}

//                         <TableContainer component={Paper}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>
//                                             {/* Ô chọn tất cả */}
//                                             <Checkbox

//                                                 checked={selectedSanPhamIds.length === paginatedOrders.length}
//                                                 onChange={handleSelectAllSP}
//                                                 inputProps={{ 'aria-label': 'Chọn tất cả' }}
//                                             />
//                                         </TableCell>
//                                         <TableCell>STT</TableCell>
//                                         <TableCell>Tên sản phẩm</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {paginatedOrders.map((sanPham, index) => (
//                                         <TableRow key={sanPham.id}>
//                                             <TableCell>
//                                                 {/* Checkbox */}
//                                                 <Checkbox
//                                                     checked={selectedSanPhamIds.includes(sanPham.id)}
//                                                     onChange={() => handleCheckboxChangeSP(sanPham.id)}


//                                                 />
//                                             </TableCell>
//                                             <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
//                                             <TableCell>{sanPham.ten}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                         {/* Pagination */}
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
//                             <Pagination
//                                 count={Math.ceil(filteredOrders.length / pageSize)}
//                                 page={currentPage}
//                                 onChange={handleChangePage}
//                                 color="primary"
//                             />
//                         </Grid>
//                     </Box>
//                 </Box>


//                 {/* {sanPhamCT.length > 0 && (
//                     <> */}
//                 {/* <Box id="table2" noValidate autoComplete="off" sx={{
//                             backgroundColor: 'white',
//                             padding: '20px',
//                             borderRadius: '10px',
//                             border: '1px solid black',
//                             marginTop: '50px'
//                         }} > */}

//                 <Typography variant="h3" gutterBottom marginBottom={"20px"} marginTop={"20px"}>
//                     Danh sách chi tiết sản phẩm
//                 </Typography>
//                 {/* Thanh tìn kiếm của sản phẩm chi tiết */}
//                 {/* Search Bar */}
//                 <Grid item xs={12} md={6}>
//                     <Box display="flex" alignItems="center">
//                         <TextField
//                             fullWidth
//                             variant="outlined"
//                             placeholder="Tìm kiếm theo tên sản phẩm, chất liệu, kích cỡ, màu sắc"
//                             value={searchValueSCT}
//                             onChange={handleSearchChange}
//                             InputProps={{
//                                 endAdornment: (
//                                     <IconButton onClick={searchSPCT}>
//                                         <SearchIcon />
//                                     </IconButton>
//                                 )
//                             }}
//                         />
//                     </Box>
//                 </Grid>
//                 {/*   Bảng sản phẩm chi tiết */}
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell padding="checkbox">
//                                     {/* Ô chọn tất cả */}
//                                     <Checkbox
//                                         checked={allCheckedSPCT}
//                                         onChange={handleSelectAllSPCT}
//                                         inputProps={{ 'aria-label': 'Chọn tất cả' }}
//                                     />
//                                 </TableCell>
//                                 <TableCell>STT</TableCell>
//                                 <TableCell>Tên sản phẩm</TableCell>
//                                 <TableCell>Số lượng tồn</TableCell>
//                                 <TableCell>Giá bán</TableCell>
//                                 <TableCell>Chất liệu</TableCell>
//                                 <TableCell>Màu sắc</TableCell>
//                                 <TableCell>Kích cỡ</TableCell>
//                                 <TableCell>Thương hiệu</TableCell>
//                                 <TableCell>Tay áo</TableCell>
//                                 <TableCell>Cổ áo</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {searchSPCT.map((ct, index) => (
//                                 <TableRow key={ct.id}>
//                                     <TableCell padding="checkbox">
//                                         {/* Checkbox */}
//                                         <Checkbox
//                                             checked={selectedSanPhamDetailIds.includes(ct.id)}
//                                             onChange={(e) => handleCheckboxChangeSPCT(e, ct.id)}

//                                         // inputProps={{ 'aria-label': `Chọn sản phẩm chi tiết ${ct.id}` }}
//                                         />
//                                     </TableCell>
//                                     <TableCell>{index + 1}</TableCell>
//                                     <TableCell>{ct.idSanPham && ct.idSanPham.ten}</TableCell>
//                                     <TableCell>{ct.soLuong}</TableCell>
//                                     <TableCell><FormatCurrency value={ct.giaBan} /></TableCell>
//                                     <TableCell>{ct.idChatLieu && ct.idChatLieu.ten}</TableCell>
//                                     <TableCell>{ct.idMauSac && ct.idMauSac.ten}</TableCell>
//                                     <TableCell>{ct.idKichCo && ct.idKichCo.ten}</TableCell>
//                                     <TableCell>{ct.idThuongHieu && ct.idThuongHieu.ten}</TableCell>
//                                     <TableCell>{ct.idTayAo && ct.idTayAo.ten}</TableCell>
//                                     <TableCell>{ct.idCoAo && ct.idCoAo.ten}</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 {/* </Box>
//                     </>
//                 )
//                 } */}

//             </form>
//         </Paper >
//     );
// };


// export default AddDotGiamGia;