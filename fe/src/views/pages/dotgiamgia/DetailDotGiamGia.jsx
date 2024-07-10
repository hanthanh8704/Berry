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
import { getDotGiamGiaById } from 'views/utilities/ApiDotGiamGia/DotGiamGiaApi.js'
import FormatDate from 'views/utilities/FormatDate.jsx';
import FormatCurrency from 'views/utilities/FormatCurrency.jsx';
import VoucherStatus from './DotGiamGiaTrangThai.jsx';

const DetailDotGiamGia = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const [ma, setMa] = useState('');
  const [ten, setTen] = useState('');
  const [giaTriGiam, setGiaTriGiam] = useState('');
  const [ngayBatDau, setNgayBatDau] = useState('');
  const [ngayKetThuc, setNgayKetThuc] = useState('');
  const [trangThai, setTrangThai] = useState('');

  const navigate = useNavigate();
  const [dotGiamGiaDetail, setDotGiamGiaDetail] = useState([]);

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
        setDotGiamGiaDetail(response.data);
      }).catch((error) => {
        console.error("Error fetching dot giam gia data:", error);
      })
    }
  }, [id]);

  function quayLai() {
    navigate('/voucher/dot-giam-gia')
  }

  return (
    // Detail View
    <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: '8px' }}>
      <Typography variant="h4" marginBottom={"35px"} gutterBottom>
        Đợt giảm giá chi tiết
      </Typography>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên đợt giảm giá</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Giá cũ</TableCell>
                <TableCell>Giá mới</TableCell>
                <TableCell>Giảm giá</TableCell>
                <TableCell>Ngày bắt đầu</TableCell>
                <TableCell>Ngày kết thúc</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dotGiamGiaDetail.map((dotGiamGiaDetail, index) => (
                <TableRow key={dotGiamGiaDetail.id}>
                  <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>{dotGiamGiaDetail.idDotGiamGia.ten}</TableCell>
                  <TableCell>{dotGiamGiaDetail.idSPCT.sanPham.ten}</TableCell>
                  <TableCell><FormatCurrency value={dotGiamGiaDetail.giaCu} /></TableCell>
                  <TableCell><FormatCurrency value={dotGiamGiaDetail.giaMoi} /></TableCell>
                  <TableCell><FormatCurrency value={dotGiamGiaDetail.giaGiam} /></TableCell>
                  <TableCell>{<FormatDate date={dotGiamGiaDetail.ngayBatDau} />}</TableCell>
                  <TableCell>{<FormatDate date={dotGiamGiaDetail.ngayKetThuc} />}</TableCell>
                  <TableCell><VoucherStatus status={dotGiamGiaDetail.trangThai} /></TableCell>
                  {/* <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Details />} // Icon sẽ được đặt ở phía bắt đầu của Button
                      onClick={() => handleViewDetails(dotGiamGia.id)}
                    >
                      Chi tiết
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
    </Paper>
  )
}

export default DetailDotGiamGia
