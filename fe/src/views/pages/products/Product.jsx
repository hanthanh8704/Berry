import React, { useState } from 'react';
import { Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

const initialTShirts = [
    { id: 1, name: 'Áo phông trắng', code: 'TS001', quantity: 50, status: 'Còn hàng', dateAdded: '2024-01-01' },
    { id: 2, name: 'Áo phông đen', code: 'TS002', quantity: 0, status: 'Hết hàng', dateAdded: '2024-02-15' },
    { id: 3, name: 'Áo phông xanh', code: 'TS003', quantity: 30, status: 'Còn hàng', dateAdded: '2024-03-20' },
    { id: 4, name: 'Áo phông đỏ', code: 'TS004', quantity: 10, status: 'Còn hàng', dateAdded: '2024-04-10' },
    { id: 5, name: 'Áo phông vàng', code: 'TS005', quantity: 0, status: 'Hết hàng', dateAdded: '2024-05-05' },
];

const Product = () => {
    const [tshirts, setTShirts] = useState(initialTShirts);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedTShirt, setSelectedTShirt] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState({ id: '', name: '', code: '', quantity: '', status: '' });

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleStatusChange = (event) => {
        setFilterStatus(event.target.value);
        setCurrentPage(1); // Reset page when status filter changes
    };

    const handleViewDetails = (tshirt) => {
        setSelectedTShirt(tshirt);
    };

    const handleClearDetails = () => {
        setSelectedTShirt(null);
    };

    const handleAddUpdateTShirt = () => {
        if (formValues.id) {
            // Update
            setTShirts(tshirts.map(tshirt => (tshirt.id === formValues.id ? formValues : tshirt)));
        } else {
            // Add
            const newTShirt = { ...formValues, id: tshirts.length + 1, dateAdded: new Date().toISOString().split('T')[0] };
            setTShirts([...tshirts, newTShirt]);
        }
        setIsDialogOpen(false);
        setFormValues({ id: '', name: '', code: '', quantity: '', status: '' });
    };

    const handleDeleteTShirt = (id) => {
        setTShirts(tshirts.filter(tshirt => tshirt.id !== id));
    };

    const openDialog = (tshirt = { id: '', name: '', code: '', quantity: '', status: '' }) => {
        setFormValues(tshirt);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const filteredTShirts = tshirts.filter(tshirt =>
        (filterStatus === 'All' || tshirt.status === filterStatus) &&
        (tshirt.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            tshirt.code.toLowerCase().includes(searchValue.toLowerCase()))
    );

    const paginatedTShirts = filteredTShirts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <Grid container spacing={3}>
            {/* Thanh tìm kiếm */}
            <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Tìm kiếm áo phông..."
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

            {/* Bộ lọc theo trạng thái */}
            <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="filter-status-label">Lọc theo trạng thái</InputLabel>
                    <Select
                        labelId="filter-status-label"
                        id="filter-status"
                        value={filterStatus}
                        onChange={handleStatusChange}
                        label="Lọc theo trạng thái"
                    >
                        <MenuItem value="All">Tất cả</MenuItem>
                        <MenuItem value="Còn hàng">Còn hàng</MenuItem>
                        <MenuItem value="Hết hàng">Hết hàng</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Nút thêm áo phông */}
            <Grid item xs={12} md={3}>
                <Button variant="contained" color="primary" onClick={() => openDialog()}>
                    Thêm áo phông
                </Button>
            </Grid>

            {/* Bảng áo phông */}
            <Grid item xs={12}>
                {selectedTShirt ? (
                    // Chi tiết áo phông
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Chi tiết áo phông
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Mã:</strong> {selectedTShirt.code}<br />
                            <strong>Tên áo:</strong> {selectedTShirt.name}<br />
                            <strong>Số lượng:</strong> {selectedTShirt.quantity}<br />
                            <strong>Trạng thái:</strong> {selectedTShirt.status}<br />
                            <strong>Ngày thêm:</strong> {selectedTShirt.dateAdded}<br />
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleClearDetails}>
                            Quay lại danh sách
                        </Button>
                    </Paper>
                ) : (
                    // Bảng danh sách áo phông
                    <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
                        <Table sx={{ borderCollapse: 'collapse' }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e0f7fa' }}>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Mã</TableCell>
                                    <TableCell>Tên áo</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Ngày thêm</TableCell>
                                    <TableCell>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedTShirts.map((tshirt, index) => (
                                    <TableRow key={tshirt.id}>
                                        <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell>{tshirt.code}</TableCell>
                                        <TableCell>{tshirt.name}</TableCell>
                                        <TableCell>{tshirt.quantity}</TableCell>
                                        <TableCell>
                                            <span
                                                style={{
                                                    backgroundColor: tshirt.status === 'Còn hàng' ? 'green' : 'red',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '20px',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {tshirt.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{tshirt.dateAdded}</TableCell>
                                        <TableCell>
                                            <Box display="flex" justifyContent="space-around">
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleViewDetails(tshirt)}
                                                    sx={{ borderRadius: '8px' }}
                                                >
                                                    Chi tiết
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => openDialog(tshirt)}
                                                    sx={{ borderRadius: '8px' }}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleDeleteTShirt(tshirt.id)}
                                                    sx={{ borderRadius: '8px' }}
                                                >
                                                    Xóa
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

            {/* Phân trang */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                <Pagination
                    count={Math.ceil(filteredTShirts.length / pageSize)}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Grid>

            {/* Dialog thêm/sửa áo phông */}
            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{formValues.id ? 'Sửa áo phông' : 'Thêm áo phông'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Tên áo"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formValues.name}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="code"
                        label="Mã"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formValues.code}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="quantity"
                        label="Số lượng"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formValues.quantity}
                        onChange={handleFormChange}
                    />
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel id="status-label">Trạng thái</InputLabel>
                        <Select
                            labelId="status-label"
                            name="status"
                            value={formValues.status}
                            onChange={handleFormChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="Còn hàng">Còn hàng</MenuItem>
                            <MenuItem value="Hết hàng">Hết hàng</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleAddUpdateTShirt} color="primary">
                        {formValues.id ? 'Lưu' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default Product;
