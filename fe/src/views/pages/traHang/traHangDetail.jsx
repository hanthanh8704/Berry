import React, { useState, useEffect } from 'react';
import { Container, Table, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Card, CardContent, Grid, Typography, Checkbox } from '@mui/material';
import { Carousel } from 'antd';
import { findAllSPCTByIdHd, findHDByIdHd, findAllSPCTTra, createTH } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi';
import FormatCurrency from '../../utilities/FormatCurrency';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Modal } from 'antd';

const TraHangDetail = () => {
    const navigate = useNavigate();
    const [sanPhamCT, setSanPhamCT] = useState([]);
    const [sanPhamTra, setSanPhamTra] = useState([]);
    const [tenKH, setTenKH] = useState('');
    const [diaChi, setDiaChi] = useState('');
    const [tenNguoiNhan, setTenNguoiNhan] = useState('');
    const [selectedSPCT, setSelectedSPCT] = useState([]);
    const [allCheckedSPCT, setAllCheckedSPCT] = useState(false);
    const [lyDo, setLyDo] = useState('');


    const [traHangRequest, setTraHangRequest] = useState([]);

    const handleLyDoChange = (event) => {
        setLyDo(event.target.value);
    };

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            findAllSPCTByIdHd(id)
                .then((response) => {
                    setSanPhamCT(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching product details:', error);
                });
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            findHDByIdHd(id)
                .then((response) => {
                    const hoaDon = response.data;
                    setTenKH(hoaDon.khachHang.hoTen);
                    setDiaChi(hoaDon.diaChi);
                    setTenNguoiNhan(hoaDon.tenNguoiNhan);
                })
                .catch((error) => {
                    console.error('Error fetching order details:', error);
                });
        }
    }, [id]);

    const trahang = async (e) => {
        e.preventDefault();
        if (sanPhamTra.length === 0) {
            toast.error('Vui lòng chọn sản phẩm để trả hàng');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận',
            maskClosable: true,
            content: 'Xác nhận tạo đơn trả hàng?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                const traHangRequest = {
                    idNhanVien: 1,
                    idHoaDon: parseInt(id),
                    idSpct: sanPhamTra.map(sp => sp.chiTietSanPham.id),
                    soLuong: sanPhamTra.map(sp => sp.soLuong),
                    giaBan: sanPhamTra.map(sp => sp.donGia),
                    tongTien: sanPhamTra.map(sp => sp.donGia * sp.soLuong),
                    lyDo: lyDo,
                };

                // soLuong: sanPhamTra.map((total, sp) => total + sp.soLuong, 0),
                // giaBan: sanPhamTra.map((total, sp) => total + sp.donGia, 0), 
                // tongTien: totalTien,

                console.log('traHangRequest:', traHangRequest); // Thêm log để kiểm tra dữ liệu gửi đi

                try {
                    const response = await createTH(traHangRequest);
                    console.log('Return order created successfully:', response.data);
                    toast.success('Tạo đơn trả hàng thành công!');
                    setTimeout(() => {
                        navigate('/tra-hang'); // Thay đổi đường dẫn chuyển hướng sau khi tạo thành công
                    }, 2000); // Chuyển hướng sau 2 giây
                } catch (error) {
                    console.error('Error creating return order:', error);
                    toast.error('Tạo đơn trả hàng thất bại!');
                    // Thêm thông tin chi tiết lỗi
                    if (error.response) {
                        console.error('Response data:', error.response.data);
                        console.error('Response status:', error.response.status);
                        console.error('Response headers:', error.response.headers);
                    } else if (error.request) {
                        console.error('Request data:', error.request);
                    } else {
                        console.error('Error message:', error.message);
                    }
                }
            }
        });
    };


    const handleSelectAllSPCT = (event) => {
        const newChecked = event.target.checked;
        setAllCheckedSPCT(newChecked);

        if (newChecked) {
            const allSPCTIds = sanPhamCT.map((spct) => spct.id);
            setSelectedSPCT(allSPCTIds);
            fetchSanPhamTra(allSPCTIds);
        } else {
            setSelectedSPCT([]);
            setSanPhamTra([]);
        }
    };

    const handleCheckboxChangeSP = (idSPCT) => {
        let updatedSelectedIds = [...selectedSPCT];
        if (updatedSelectedIds.includes(idSPCT)) {
            updatedSelectedIds = updatedSelectedIds.filter((id) => id !== idSPCT);
        } else {
            updatedSelectedIds.push(idSPCT);
        }
        setSelectedSPCT(updatedSelectedIds);
        fetchSanPhamTra(updatedSelectedIds);
    };


    const [isQuantityValid, setIsQuantityValid] = useState(true);
    const [Quantity, setNewQuantity] = useState(0);
    //Hiển thị số lượng trar 
    const handleQuantityChange = (id, currentQuantity, maxQuantity) => {
        const modalContent = (
            <TextField
                type="text"
                // defaultValue={currentQuantity}
                onChange={(e) => {
                    const newQuantity = parseInt(e.target.value);
                    if (newQuantity < 1) {
                        setIsQuantityValid(false);
                        toast.error('Số lượng trả không được nhỏ hơn 1');
                        setSanPhamTra(prev =>
                            prev.map(item =>
                                item.id === id ? { ...item, soLuong: Quantity } : item
                            )
                        );
                        return;
                    }
                    if (newQuantity > maxQuantity) {
                        setIsQuantityValid(false);
                        toast.error('Số lượng trả lớn hơn số lượng hiện có!');
                        setSanPhamTra(prev =>
                            prev.map(item =>
                                item.id === id ? { ...item, soLuong: Quantity } : item
                            )
                        );
                        return;
                    }

                    setIsQuantityValid(true);
                    // Cập nhật số lượng nếu hợp lệ
                    setSanPhamTra(prev =>
                        prev.map(item =>
                            item.id === id ? { ...item, soLuong: newQuantity } : item
                        )
                    );
                }}

            />
        );

        Modal.confirm({
            title: 'Nhập số lượng muốn trả',
            content: modalContent,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
                console.log("Số lượng đã được xác nhận");
            },
            onCancel: () => {
                console.log("Người dùng đã hủy");
            }
        });
    };



    // const handleQuantityChange = (id, newQuantity) => {
    //     const maxQuantity = sanPhamCT.find(item => item.id === id)?.soLuong || Infinity;
    //     const validQuantity = Math.min(Math.max(newQuantity, 1), maxQuantity);

    //     if (isNaN(validQuantity)) return;

    //     // Cập nhật số lượng trong sanPhamCT
    //     setSanPhamCT(prev =>
    //         prev.map(item =>
    //             item.id === id ? { ...item, soLuong: validQuantity } : item
    //         )
    //     );

    //     // Cập nhật số lượng trong sanPhamTra nếu sản phẩm đã được chọn
    //     setSanPhamTra(prev =>
    //         prev.map(item =>
    //             item.chiTietSanPham.id === id ? { ...item, soLuong: validQuantity } : item
    //         )
    //     );
    // };


    // const handleQuantityChange = (id, newQuantity) => {
    //     const maxQuantity = sanPhamCT.find(item => item.id === id)?.soLuong || Infinity;
    //     const validQuantity = Math.min(Math.max(newQuantity, 1), maxQuantity);

    //     if (isNaN(validQuantity)) return;

    //     setSanPhamCT(prev =>
    //         prev.map(item =>
    //             item.id === id ? { ...item, soLuong: validQuantity } : item
    //         )
    //     );

    //     if (selectedSPCT.includes(id)) {
    //         setSanPhamTra(prev =>
    //             prev.map(item =>
    //                 item.id === id ? { ...item, soLuong: validQuantity } : item
    //             )
    //         );
    //     } else {
    //         fetchSanPhamTra(selectedSPCT);
    //     }
    // };


    const fetchSanPhamTra = async (selectedIds) => {
        if (selectedIds.length === 0) {
            setSanPhamTra([]);
            return;
        }

        const promises = selectedIds.map((id) => findAllSPCTTra(id));
        const results = await Promise.all(promises);
        const allDetails = results.map(result => result.data);

        const updatedSanPhamTra = allDetails.map(detail => {
            const spct = sanPhamCT.find(spct => spct.id === detail.id);
            return { ...detail, soLuong: spct ? spct.soLuong : 0 };
        });

        setSanPhamTra(updatedSanPhamTra);
    };


    const columns = [
        {
            id: 'selectAll',
            label: (
                <Checkbox
                    checked={allCheckedSPCT}
                    onChange={handleSelectAllSPCT}
                    inputProps={{ 'aria-label': 'Chọn tất cả' }}
                />
            ),
        },
        { id: 'sanPham', label: 'Sản phẩm' },
        { id: 'soLuong', label: 'Số lượng' },
        { id: 'giaBan', label: 'Đơn giá' },
    ];

    const columns_Tra = [
        { id: 'stt', label: 'STT' },
        { id: 'sanPham', label: 'Sản phẩm' },
        { id: 'soLuong', label: 'Số lượng' },
        { id: 'dongia', label: 'Đơn giá' },
        { id: 'tongTien', label: 'Tổng tiền' },
        { id: 'ghiChu', label: 'Ghi chú' },
    ];

    const totalTien = sanPhamTra.reduce((total, sp) => total + sp.soLuong * sp.donGia, 0);

    return (
        <Container>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Typography variant="h5" className='mx-3' style={{ marginTop: '20px' }}>Danh sách sản phẩm</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id}>{column.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sanPhamCT.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedSPCT.includes(row.id)}
                                        onChange={() => handleCheckboxChangeSP(row.id)}
                                        inputProps={{ 'aria-label': 'Chọn sản phẩm' }}
                                    />
                                </TableCell>
                                <TableCell className='d-flex align-items-center'>
                                    <Carousel
                                        autoplay
                                        autoplaySpeed={3000}
                                        dots={false}
                                        arrows={false}
                                        style={{ width: '100px', height: '100px' }}
                                    >
                                        {row.chiTietSanPham?.anhList?.map((anh, index) => (
                                            <div key={index} className="image-container">
                                                <img
                                                    src={anh.anh}
                                                    alt="images"
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                    <div>
                                        {row.chiTietSanPham ? (
                                            <>
                                                {row.chiTietSanPham.idSanPham.ten} + {row.chiTietSanPham.idMauSac.ten} + [{row.chiTietSanPham.idKichCo.ten}]
                                            </>
                                        ) : (
                                            'N/A'
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={row.soLuong}
                                        onClick={() => handleQuantityChange(row.id, row.soLuong, row.soLuong)} // Truyền số lượng tối đa vào hàm
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{<FormatCurrency value={row.donGia} />}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box className='d-flex'>
                {sanPhamTra.length > 0 && (
                    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                        <Typography variant="h5" className='mx-3' style={{ marginTop: '20px' }}>Danh sách sản phẩm trả</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns_Tra.map((column) => (
                                        <TableCell key={column.id}>{column.label}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sanPhamTra.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className='d-flex align-items-center'>
                                            <Carousel
                                                autoplay
                                                autoplaySpeed={3000}
                                                dots={false}
                                                arrows={false}
                                                style={{ width: '100px', height: '100px' }}
                                            >
                                                {row.chiTietSanPham?.anhList?.map((anh, index) => (
                                                    <div key={index} className="image-container">
                                                        <img
                                                            src={anh.anh}
                                                            alt="images"
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                        />
                                                    </div>
                                                ))}
                                            </Carousel>
                                            <div>
                                                {row.chiTietSanPham ? (
                                                    <>
                                                        {row.chiTietSanPham.idSanPham.ten} + {row.chiTietSanPham.idMauSac.ten} + [{row.chiTietSanPham.idKichCo.ten}]
                                                    </>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {row.soLuong}
                                        </TableCell>
                                        <TableCell>{<FormatCurrency value={row.donGia} />}</TableCell>
                                        <TableCell>{<FormatCurrency value={row.donGia * row.soLuong} />}</TableCell>
                                        <TableCell>
                                            <TextField
                                                label="Lý do trả hàng"
                                                value={lyDo}
                                                onChange={handleLyDoChange}
                                                multiline
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Card className='mx-2' style={{ marginTop: '20px', width: '450px' }}>
                    <CardContent>
                        <Box spacing={2}>
                            <Typography variant="h3" className='my-3 text-center' style={{ color: '#6A0DAD' }}>Thông tin hoàn trả</Typography>
                            <Grid item xs={12} sm={6} style={{ height: '140px', backgroundColor: 'whitesmoke', borderRadius: '3px' }}>
                                <Typography className='my-1 p-2'><strong>Khách hàng:</strong> {tenKH}</Typography>
                                <Typography className='my-1 p-2'><strong>Người nhận:</strong> {tenNguoiNhan}</Typography>
                                <Typography className='my-1 p-2'><strong>Địa chỉ:</strong> {diaChi}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} className='my-3'>
                                <Typography className='d-flex'><strong style={{ marginRight: '100px' }}>Tổng tiền:</strong> <p style={{ color: 'red' }}>{<FormatCurrency value={totalTien} />}</p></Typography>
                                <Typography className='d-flex'><strong style={{ marginRight: '60px' }}>Số tiền hoàn trả:</strong> <p style={{ color: 'red' }}>{<FormatCurrency value={totalTien} />}</p></Typography>
                                <Button style={{ backgroundColor: '#6A0DAD', width: '270px' }} variant="contained" onClick={trahang}>Trả hàng</Button>     </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            <ToastContainer />
        </Container>
    );
};

export default TraHangDetail;
