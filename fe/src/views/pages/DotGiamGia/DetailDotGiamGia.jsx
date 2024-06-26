import React, { useState, useEffect } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Box,
  Typography,
  Button
} from '@mui/material';
import { Add, Details, Save, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getDotGiamGiaById } from '../api/DotGiamGiaApi/DotGiamGiaApi.js'

const DetailDotGiamGia = () => {
  const [ma, setMa] = useState('');
  const [ten, setTen] = useState('');
  const [giaTriGiam, setGiaTriGiam] = useState('');
  const [ngayBatDau, setNgayBatDau] = useState('');
  const [ngayKetThuc, setNgayKetThuc] = useState('');
  const [trangThai, setTrangThai] = useState('');
  const navigate = useNavigate();

  const handleMa = (e) => setMa(e.target.value);
  const handleTen = (e) => setTen(e.target.value);
  const handleGiaTriGiam = (e) => setGiaTriGiam(e.target.value);
  const handleNgayBatDau = (e) => setNgayBatDau(e.target.value);
  const handleNgayKetThuc = (e) => setNgayKetThuc(e.target.value);
  const handleTrangThai = (e) => setTrangThai(e.target.value);

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getDotGiamGiaById(id).then((response) => {
        setMa(response.data.ma);
        setTen(response.data.ten);
        setGiaTriGiam(response.data.giaTriGiam);
        setNgayBatDau(response.data.ngayBatDau);
        setNgayKetThuc(response.data.ngayKetThuc);
        setTrangThai(response.data.trangThai);
      }).catch((error) => {
        console.error("Error fetching dot giam gia data:", error);
      })
    }
  }, [id]);

  function quayLai() {
    navigate('/dot-giam-gia')
  }

  return (
    // Detail View
    <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: '8px' }}>
      <Typography variant="h4" marginBottom={"35px"} gutterBottom>
        Đợt giảm giá chi tiết
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mã đợt giảm giá"
              variant="outlined"
              value={ma}
              InputProps={{
                readOnly: true,
              }}
              onChange={handleMa}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tên đợt giảm giá"
              variant="outlined"
              value={ten}
              InputProps={{
                readOnly: true,
              }}
              onChange={handleTen}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Giá trị"
              variant="outlined"
              value={`${giaTriGiam}%`}
              InputProps={{
                readOnly: true,
              }}
              onChange={handleGiaTriGiam}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ngày bắt đầu"
              variant="outlined"
              value={ngayBatDau}
              InputProps={{
                readOnly: true,
              }}
              onChange={handleNgayBatDau}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ngày kết thúc"
              variant="outlined"
              value={ngayKetThuc}
              InputProps={{
                readOnly: true,
              }}
              onChange={handleNgayKetThuc}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="filter-status-label">Trạng thái</InputLabel>
              <Select
                labelId="filter-status-label"
                id="filter-status"
                value={trangThai}
                label="Filter by Status"
                onChange={handleTrangThai}
                disabled
              >
                <MenuItem value="All">Tất cả</MenuItem>
                <MenuItem value="Sắp diễn ra" >Sắp diễn ra</MenuItem>
                <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
                <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button

                variant="contained"
                color="primary"
                onClick={quayLai}
              >
                Quay lại
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default DetailDotGiamGia
