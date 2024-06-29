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
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const initialSleeveStyles = [
    { id: 1, name: 'Ngắn', status: 'Khả dụng', dateAdded: '2024-01-01' },
    { id: 2, name: 'Dài', status: 'Khả dụng', dateAdded: '2024-02-15' },
    { id: 3, name: 'Ba lỗ', status: 'Khả dụng', dateAdded: '2024-03-20' },
    { id: 4, name: 'Lỡ', status: 'Khả dụng', dateAdded: '2024-04-10' },
    { id: 5, name: 'Raglan', status: 'Khả dụng', dateAdded: '2024-05-05' },
];

export default function SleeveStyle() {
    const [sleeveStyles, setSleeveStyles] = useState(initialSleeveStyles);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [selectedSleeveStyle, setSelectedSleeveStyle] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState({ id: '', name: '', status: 'Khả dụng' });

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleViewDetails = (sleeveStyle) => {
        setSelectedSleeveStyle(sleeveStyle);
    };

    const handleClearDetails = () => {
        setSelectedSleeveStyle(null);
    };

    const handleAddUpdateSleeveStyle = () => {
        if (formValues.id) {
            // Update
            setSleeveStyles(sleeveStyles.map(sleeveStyle => (sleeveStyle.id === formValues.id ? formValues : sleeveStyle)));
        } else {
            // Add
            const newSleeveStyle = { ...formValues, id: sleeveStyles.length + 1, dateAdded: new Date().toISOString().split('T')[0] };
            setSleeveStyles([...sleeveStyles, newSleeveStyle]);
        }
        setIsDialogOpen(false);
        setFormValues({ id: '', name: '', status: 'Khả dụng' });
    };

    const handleDeleteSleeveStyle = (id) => {
        setSleeveStyles(sleeveStyles.filter(sleeveStyle => sleeveStyle.id !== id));
    };

    const openDialog = (sleeveStyle = { id: '', name: '', status: 'Khả dụng' }) => {
        setFormValues(sleeveStyle);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const filteredSleeveStyles = sleeveStyles.filter(sleeveStyle =>
        sleeveStyle.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const paginatedSleeveStyles = filteredSleeveStyles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <Grid container spacing={3}>
            {/* Search Bar */}
            <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Tìm kiếm kiểu tay áo..."
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

            {/* Add Sleeve Style Button */}
            <Grid item xs={12} md={6}>
                <Button variant="contained" color="primary" onClick={() => openDialog()}>
                    Thêm kiểu tay áo
                </Button>
            </Grid>

            {/* Sleeve Styles Table */}
            <Grid item xs={12}>
                {selectedSleeveStyle ? (
                    // Sleeve Style Details
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Chi tiết kiểu tay áo
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Tên:</strong> {selectedSleeveStyle.name}<br />
                            <strong>Trạng thái:</strong> {selectedSleeveStyle.status}<br />
                            <strong>Ngày thêm:</strong> {selectedSleeveStyle.dateAdded}<br />
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleClearDetails}>
                            Quay lại danh sách
                        </Button>
                    </Paper>
                ) : (
                    // Sleeve Styles Table
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Ngày thêm</TableCell>
                                    <TableCell>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedSleeveStyles.map((sleeveStyle, index) => (
                                    <TableRow key={sleeveStyle.id}>
                                        <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell>{sleeveStyle.name}</TableCell>
                                        <TableCell>
                                            <span
                                                style={{
                                                    backgroundColor: sleeveStyle.status === 'Khả dụng' ? 'green' : 'red',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '20px',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {sleeveStyle.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{sleeveStyle.dateAdded}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" color="primary" onClick={() => handleViewDetails(sleeveStyle)}>
                                                Chi tiết
                                            </Button>
                                            <Button variant="outlined" color="secondary" onClick={() => openDialog(sleeveStyle)}>
                                                Sửa
                                            </Button>
                                            <Button variant="outlined" color="error" onClick={() => handleDeleteSleeveStyle(sleeveStyle.id)}>
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
                    count={Math.ceil(filteredSleeveStyles.length / pageSize)}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Grid>

            {/* Add/Edit Sleeve Style Dialog */}
            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{formValues.id ? 'Sửa kiểu tay áo' : 'Thêm kiểu tay áo'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Tên kiểu tay áo"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formValues.name}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="status"
                        label="Trạng thái"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formValues.status}
                        onChange={handleFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="secondary">Hủy</Button>
                    <Button onClick={handleAddUpdateSleeveStyle} color="primary">
                        {formValues.id ? 'Lưu' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
