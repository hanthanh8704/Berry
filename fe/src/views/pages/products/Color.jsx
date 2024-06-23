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
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const initialColors = [
    { id: 1, name: 'Đỏ', code: 'RED', hex: '#FF0000', dateAdded: '2024-01-01' },
    { id: 2, name: 'Xanh lá', code: 'GRN', hex: '#00FF00', dateAdded: '2024-02-15' },
    { id: 3, name: 'Xanh dương', code: 'BLU', hex: '#0000FF', dateAdded: '2024-03-20' },
    { id: 4, name: 'Vàng', code: 'YEL', hex: '#FFFF00', dateAdded: '2024-04-10' },
    { id: 5, name: 'Đen', code: 'BLK', hex: '#000000', dateAdded: '2024-05-05' },
];

export default function Color() {
    const [colors, setColors] = useState(initialColors);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState({ id: '', name: '', code: '', hex: '' });

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleViewDetails = (color) => {
        setSelectedColor(color);
    };

    const handleClearDetails = () => {
        setSelectedColor(null);
    };

    const handleAddUpdateColor = () => {
        if (formValues.id) {
            // Update
            setColors(colors.map(color => (color.id === formValues.id ? formValues : color)));
        } else {
            // Add
            const newColor = { ...formValues, id: colors.length + 1, dateAdded: new Date().toISOString().split('T')[0] };
            setColors([...colors, newColor]);
        }
        setIsDialogOpen(false);
        setFormValues({ id: '', name: '', code: '', hex: '' });
    };

    const handleDeleteColor = (id) => {
        setColors(colors.filter(color => color.id !== id));
    };

    const openDialog = (color = { id: '', name: '', code: '', hex: '' }) => {
        setFormValues(color);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const filteredColors = colors.filter(color =>
        color.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        color.code.toLowerCase().includes(searchValue.toLowerCase())
    );

    const paginatedColors = filteredColors.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <Grid container spacing={3}>
            {/* Search Bar */}
            <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Tìm kiếm màu sắc..."
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

            {/* Add Color Button */}
            <Grid item xs={12} md={6}>
                <Button variant="contained" color="primary" onClick={() => openDialog()}>
                    Thêm màu
                </Button>
            </Grid>

            {/* Colors Table */}
            <Grid item xs={12}>
                {selectedColor ? (
                    // Color Details
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Chi tiết màu sắc
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Tên màu:</strong> {selectedColor.name}<br />
                            <strong>Mã:</strong> {selectedColor.code}<br />
                            <strong>Mã hex:</strong> {selectedColor.hex}<br />
                            <strong>Ngày thêm:</strong> {selectedColor.dateAdded}<br />
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleClearDetails}>
                            Quay lại danh sách
                        </Button>
                    </Paper>
                ) : (
                    // Colors Table
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Tên màu</TableCell>
                                    <TableCell>Mã</TableCell>
                                    <TableCell>Mã hex</TableCell>
                                    <TableCell>Ngày thêm</TableCell>
                                    <TableCell>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedColors.map((color, index) => (
                                    <TableRow key={color.id}>
                                        <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell>{color.name}</TableCell>
                                        <TableCell>{color.code}</TableCell>
                                        <TableCell>{color.hex}</TableCell>
                                        <TableCell>{color.dateAdded}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" color="primary" onClick={() => handleViewDetails(color)}>
                                                Chi tiết
                                            </Button>
                                            <Button variant="outlined" color="secondary" onClick={() => openDialog(color)}>
                                                Sửa
                                            </Button>
                                            <Button variant="outlined" color="error" onClick={() => handleDeleteColor(color.id)}>
                                                Xóa
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
                    count={Math.ceil(filteredColors.length / pageSize)}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Grid>

            {/* Add/Edit Color Dialog */}
            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{formValues.id ? 'Sửa màu' : 'Thêm màu'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Tên màu"
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
                        name="hex"
                        label="Mã hex"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formValues.hex}
                        onChange={handleFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="secondary">Hủy</Button>
                    <Button onClick={handleAddUpdateColor} color="primary">
                        {formValues.id ? 'Lưu' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
