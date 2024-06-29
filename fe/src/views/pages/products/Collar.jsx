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

const initialCollarStyles = [
    { id: 1, name: 'Cổ tròn', status: 'Khả dụng', dateAdded: '2024-01-01' },
    { id: 2, name: 'Cổ V', status: 'Khả dụng', dateAdded: '2024-02-15' },
    { id: 3, name: 'Cổ lọ', status: 'Khả dụng', dateAdded: '2024-03-20' },
    { id: 4, name: 'Cổ Đức', status: 'Khả dụng', dateAdded: '2024-04-10' },
    { id: 5, name: 'Cổ sơ mi', status: 'Khả dụng', dateAdded: '2024-05-05' },
];

export default function CollarStyle() {
    const [collarStyles, setCollarStyles] = useState(initialCollarStyles);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [selectedCollarStyle, setSelectedCollarStyle] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState({ id: '', name: '', status: 'Khả dụng' });

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleViewDetails = (collarStyle) => {
        setSelectedCollarStyle(collarStyle);
    };

    const handleClearDetails = () => {
        setSelectedCollarStyle(null);
    };

    const handleAddUpdateCollarStyle = () => {
        if (formValues.id) {
            // Update
            setCollarStyles(collarStyles.map(collarStyle => (collarStyle.id === formValues.id ? formValues : collarStyle)));
        } else {
            // Add
            const newCollarStyle = { ...formValues, id: collarStyles.length + 1, dateAdded: new Date().toISOString().split('T')[0] };
            setCollarStyles([...collarStyles, newCollarStyle]);
        }
        setIsDialogOpen(false);
        setFormValues({ id: '', name: '', status: 'Khả dụng' });
    };

    const handleDeleteCollarStyle = (id) => {
        setCollarStyles(collarStyles.filter(collarStyle => collarStyle.id !== id));
    };

    const openDialog = (collarStyle = { id: '', name: '', status: 'Khả dụng' }) => {
        setFormValues(collarStyle);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const filteredCollarStyles = collarStyles.filter(collarStyle =>
        collarStyle.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const paginatedCollarStyles = filteredCollarStyles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <Grid container spacing={3}>
            {/* Search Bar */}
            <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Tìm kiếm kiểu cổ áo..."
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

            {/* Add Collar Style Button */}
            <Grid item xs={12} md={6}>
                <Button variant="contained" color="primary" onClick={() => openDialog()}>
                    Thêm kiểu cổ áo
                </Button>
            </Grid>

            {/* Collar Styles Table */}
            <Grid item xs={12}>
                {selectedCollarStyle ? (
                    // Collar Style Details
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Chi tiết kiểu cổ áo
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Tên:</strong> {selectedCollarStyle.name}<br />
                            <strong>Trạng thái:</strong> {selectedCollarStyle.status}<br />
                            <strong>Ngày thêm:</strong> {selectedCollarStyle.dateAdded}<br />
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleClearDetails}>
                            Quay lại danh sách
                        </Button>
                    </Paper>
                ) : (
                    // Collar Styles Table
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
                                {paginatedCollarStyles.map((collarStyle, index) => (
                                    <TableRow key={collarStyle.id}>
                                        <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell>{collarStyle.name}</TableCell>
                                        <TableCell>
                                            <span
                                                style={{
                                                    backgroundColor: collarStyle.status === 'Khả dụng' ? 'green' : 'red',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '20px',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {collarStyle.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{collarStyle.dateAdded}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" color="primary" onClick={() => handleViewDetails(collarStyle)}>
                                                Chi tiết
                                            </Button>
                                            <Button variant="outlined" color="secondary" onClick={() => openDialog(collarStyle)}>
                                                Sửa
                                            </Button>
                                            <Button variant="outlined" color="error" onClick={() => handleDeleteCollarStyle(collarStyle.id)}>
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
                    count={Math.ceil(filteredCollarStyles.length / pageSize)}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Grid>

            {/* Add/Edit Collar Style Dialog */}
            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{formValues.id ? 'Sửa kiểu cổ áo' : 'Thêm kiểu cổ áo'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Tên kiểu cổ áo"
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
                    <Button onClick={handleAddUpdateCollarStyle} color="primary">
                        {formValues.id ? 'Lưu' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
