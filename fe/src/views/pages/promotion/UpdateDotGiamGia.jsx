import React, { useState, useEffect } from 'react';
import { Paper, Box, Grid, Pagination } from '@mui/material';
import { Typography, Input, Modal, Button, Col, Form, Row, Checkbox, Select, Carousel } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import { useNavigate, useParams } from 'react-router-dom';
import { listSanPham } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { updateDotGiamGia } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { detailDotGiamGia } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { getDotGiamGiaDetailByIdDGG } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { findAllByIdSanPhamAndDGG } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DotGiamGia.css';
import { findAllChatLieu } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { findAllKichCo } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { findAllMauSac } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { findAllThuongHieu } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';

const { Search } = Input;
const { Option } = Select;
const UpdateDotGiamGia = () => {

  const [currentPageSP, setCurrentPageSP] = useState(1);
  const [currentPageSPCT, setCurrentPageSPCT] = useState(1);

  const [pageSizeSP, setPageSizeSP] = useState(5);
  const [pageSizeSPCT, setPageSizeSPCT] = useState(5);

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
  const [spcts, setSPCTS] = useState([]);
  // const [dotGiamGia, setDotGiamGia] = useState([]);

  const [thuongHieu, setThuongHieu] = useState([]);
  const [selectedThuongHieu, setSelectedThuongHieu] = useState('All');

  const [chatLieu, setChatLieu] = useState([]);
  const [selectedChatLieu, setSelectedChatLieu] = useState('All');

  const [kichCo, setKichCo] = useState([]);
  const [selectedKichCo, setSelectedKichCo] = useState('All');

  const [mauSac, setMauSac] = useState([]);
  const [selectedMauSac, setSelectedMauSac] = useState('All');

  const [filterPrice, setFilterPrice] = useState('All');

  const [ma, setMa] = useState('');
  const [ten, setTen] = useState('');
  const [giaTriGiam, setGiaTriGiam] = useState('');
  const [ngayBatDau, setNgayBatDau] = useState('');
  const [ngayKetThuc, setNgayKetThuc] = useState('');

  const navigate = useNavigate();
  // const [dotGiamGiaDetail, setDotGiamGiaDetail] = useState([]);

  // Khai bao thong bao vialidate
  const [errors, setErrors] = useState({
    ma: '',
    ten: '',
    giaTriGiam: '',
    ngayBatDau: '',
    ngayKetThuc: ''
  });

  ///Thuong hieu
  useEffect(() => {
    getAllTH();
  }, []);
  //Get hiển thị
  function getAllTH() {
    findAllThuongHieu()
      .then((response) => {
        setThuongHieu(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  ///Chat lieu
  useEffect(() => {
    getAllCL();
  }, []);
  //Get hiển thị
  function getAllCL() {
    findAllChatLieu()
      .then((response) => {
        setChatLieu(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  ///Mau sac
  useEffect(() => {
    getAllMS();
  }, []);
  //Get hiển thị
  function getAllMS() {
    findAllMauSac()
      .then((response) => {
        setMauSac(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  ///Kich co
  useEffect(() => {
    getAllKC();
  }, []);
  //Get hiển thị
  function getAllKC() {
    findAllKichCo()
      .then((response) => {
        setKichCo(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const { id: idDGG } = useParams();
  useEffect(() => {
    if (idDGG) {
      detailDotGiamGia(idDGG)
        .then((response) => {
          // dotGiamGiaDetail(response)
          setMa(response.data.code);
          setTen(response.data.name);
          setGiaTriGiam(response.data.discountPercentage);
          setNgayBatDau(response.data.startDate);
          setNgayKetThuc(response.data.endDate);
          // setSPCTS(spcts);
        })
        .catch((error) => {
          console.error('Error fetching dot giam gia data:', error);
        });
    }
  }, [idDGG]);

  useEffect(() => {
    console.log('idDGG', idDGG);
    if (idDGG) {
      getDotGiamGiaDetailByIdDGG(idDGG)
        .then((response) => {
          setSanPhamCT(response.data);
        })
        .catch((error) => {
          console.error('Error fetching dot giam gia data:', error);
        });
    }
  }, [idDGG]);

  function quayLai() {
    navigate('/voucher/dot-giam-gia');
  }

  //Hàm sửa
  const UpdateDotGiamGia = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (selectedSanPhamDetailIds.length === 0) {
        toast.error('Vui lòng chọn sản phẩm áp dụng');
      } else {
        Modal.confirm({
          title: 'Xác nhận',
          maskClosable: true,
          content: 'Xác nhận sửa đợt giảm giá ?',
          okText: 'Xác nhận',
          cancelText: 'Hủy',
          onOk: async () => {
            const dotGiamGia = { code: ma, name: ten, discountPercentage: giaTriGiam, startDate: ngayBatDau, endDate: ngayKetThuc, productDetails: selectedSanPhamDetailIds };
            try {
              const response = await updateDotGiamGia(idDGG, dotGiamGia);
              console.log(response.data);
              toast.success('Sửa thành công đợt giảm giá!');
              setTimeout(() => {
                navigate('/voucher/dot-giam-gia'); //Sau 2s mới chuyển
              }, 2000);
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

    // Validate mã
    if (!ma.trim()) {

    } else if (ma.length > 20) {
      errorsCopy.ma = 'Mã đợt giảm giá không được vượt quá 20 kí tự!';
      valid = false;

    } else {
      errorsCopy.ma = '';
    }

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
    if (!giaTriGiamNumber === '') {
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
  }, []);
  //Get hiển thị
  function getAllSanPham() {
    listSanPham()
      .then((response) => {
        setSanPham(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleChangePageSP = (event, newPage) => {
    setCurrentPageSP(newPage);
  };

  const handleChangePageSPCT = (event, newPage) => {
    setCurrentPageSPCT(newPage);
  };

  const handlePageSizeChangeSP = (event) => {
    setPageSizeSP(parseInt(event.target.value, 10));
    setCurrentPageSP(1); // Đặt lại trang hiện tại về trang đầu tiên
  };

  const handlePageSizeChangeSPCT = (event) => {
    setPageSizeSPCT(parseInt(event.target.value, 10));
    setCurrentPageSPCT(1); // Đặt lại trang hiện tại về trang đầu tiên
  };

  function quayLai() {
    navigate('/voucher/dot-giam-gia');
  }

  // Làm check box cho sp
  // Chuyển sang SPCT lấy ra theo id
  const fetchSanPhamCT = async (selectedIds) => {
    const promises = selectedIds.map((id) => findAllByIdSanPhamAndDGG(id)); //idDGG
    const results = await Promise.all(promises);
    const allDetails = results.flatMap((result) => result.data);
    setSanPhamCT(allDetails);
  };

  // Xử lý khi checkbox của SP thay đổi
  const handleCheckboxChangeSP = (idSanPham) => {
    let updatedSelectedIds = [...selectedSanPhamIds];
    if (updatedSelectedIds.includes(idSanPham)) {
      updatedSelectedIds = updatedSelectedIds.filter((id) => id !== idSanPham); // Bỏ chọn sản phẩm
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
      const allIds = paginatedOrders.map((sp) => sp.id);
      setSelectedSanPhamIds(allIds);
      fetchSanPhamCT(allIds);
    }
  };

  // Xử lý khi thay đổi giá trị tìm kiếm
  const handleSearchChange = (e) => {
    setSearchValueSCT(e.target.value);
  };

  // Loc theo thuong hieu
  const handleThuongHieu = (value) => {
    setSelectedThuongHieu(value); // Cập nhật giá trị chọn lọc
  };

  // Loc theo MS
  const handleMauSac = (value) => {
    setSelectedMauSac(value); // Cập nhật giá trị chọn lọc
  };

  // Loc theo KT
  const handleKichCo = (value) => {
    setSelectedKichCo(value); // Cập nhật giá trị chọn lọc
  };

  // Loc theo TH
  const handleChatLieu = (value) => {
    setSelectedChatLieu(value); // Cập nhật giá trị chọn lọc
  };


  const handlePriceChange = (value) => {
    setFilterPrice(value);
  };

  // Lọc danh sách chi tiết sản phẩm theo giá trị tìm kiếm
  const searchSPCT = sanPhamCT.filter((ct) => {
    const isStatusTH = selectedThuongHieu === 'All' || ct.brand.id === selectedThuongHieu;
    const isStatusMS = selectedMauSac === 'All' || ct.color.id === selectedMauSac;
    const isStatusKC = selectedKichCo === 'All' || ct.size.id === selectedKichCo;
    const isStatusCL = selectedChatLieu === 'All' || ct.material.id === selectedChatLieu;

    const isNameOrCodeMatch = !searchValueSCT || (ct.product && ct.product.name.toLowerCase().includes(searchValueSCT.toLowerCase()));

    let priceMatch = true;
    if (filterPrice !== 'All') {
      const priceRange = filterPrice.split('-');
      const minPrice = parseFloat(priceRange[0]);
      const maxPrice = parseFloat(priceRange[1]);
      const giaBan = parseFloat(ct.price);
      priceMatch = giaBan >= minPrice && giaBan <= maxPrice;
    }

    return isNameOrCodeMatch && isStatusCL && isStatusTH && isStatusMS && isStatusKC && priceMatch;
  });

  const paginatedChiTietSanPham = searchSPCT.slice((currentPageSPCT - 1) * pageSizeSPCT, currentPageSPCT * pageSizeSPCT);

  const filteredOrders = sanPham.filter((sanPham) => sanPham.name.toLowerCase().includes(searchValue.toLowerCase()));
  const paginatedOrders = filteredOrders.slice((currentPageSP - 1) * pageSizeSP, currentPageSP * pageSizeSP);


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
      <Typography variant="h3" gutterBottom marginBottom={'20px'}>
        Sửa đợt giảm giá
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
        sx={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid black',
          marginTop: '50px'
        }}
      >
        <Form layout="vertical" style={{ marginLeft: '15px', width: '500px' }}>
          <Form.Item label="Mã đợt giảm giá" validateStatus={errors.ma ? 'error' : ''} help={errors.ma} required>
            <Input
              name="ma"
              value={ma}
              onChange={(e) => setMa(e.target.value)}
              disabled
              placeholder="Mời nhập mã đợt giảm giá"
            />
          </Form.Item>

          <Form.Item label="Tên đợt giảm giá" validateStatus={errors.ten ? 'error' : ''} help={errors.ten} required>
            <Input
              name="name"
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              placeholder="Mời nhập tên đợt giảm giá"
            />
          </Form.Item>

          <Form.Item label="Giá trị (%)" validateStatus={errors.giaTriGiam ? 'error' : ''} help={errors.giaTriGiam} required>
            <Input
              type="number"
              name="giaTriGiam"
              value={giaTriGiam}
              onChange={(e) => setGiaTriGiam(e.target.value)}
              placeholder="Mời nhập giá trị giảm giá"
            />
          </Form.Item>
          <Form.Item
            label="Ngày bắt đầu"
            validateStatus={errors.ngayBatDau ? 'error' : ''}
            help={errors.ngayBatDau}
            required
          >
            <Input
              type="datetime-local"
              name="ngayBatDau"
              value={ngayBatDau}
              onChange={(e) => setNgayBatDau(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Ngày kết thúc"
            validateStatus={errors.ngayKetThuc ? 'error' : ''}
            help={errors.ngayKetThuc}
            required
          >
            <Input
              type="datetime-local"
              name="ngayKetThuc"
              value={ngayKetThuc}
              onChange={(e) => setNgayKetThuc(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={(e) => UpdateDotGiamGia(e)}
              style={{ backgroundColor: 'yellow', borderColor: 'yellow', color: 'black' }}>
              Sửa
            </Button>
            <Button onClick={quayLai} style={{ marginLeft: '10px' }}>
              Quay lại
            </Button>
          </Form.Item>
          <ToastContainer />
        </Form>

        <Box id="table" noValidate autoComplete="off" width={'500px'} marginRight={'15px'}>
          {/* //Tim kiem */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Search
                style={{ width: 500 }}
                placeholder="Tìm kiếm theo tên sản phẩm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />} />
                }
              />
            </Col>
          </Row>

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
                      <Checkbox checked={selectedSanPhamIds.includes(sanPham.id)} onChange={() => handleCheckboxChangeSP(sanPham.id)} />
                    </TableCell>
                    <TableCell>{(currentPageSP - 1) * pageSizeSP + index + 1}</TableCell>
                    <TableCell>{sanPham.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination for SP */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
            <Pagination
              count={Math.ceil(filteredOrders.length / pageSizeSP)}
              page={currentPageSP}
              onChange={handleChangePageSP}
              className="custom-pagination"
            />
            <select className="form-select" style={{ width: '80px' }} value={pageSizeSP} onChange={handlePageSizeChangeSP}>
              {[5, 10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </Grid>

        </Box>
      </Box>

      {sanPhamCT.length > 0 && (
        <>
          <Box
            id="table2"
            noValidate
            autoComplete="off"
            sx={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid black',
              marginTop: '50px'
            }}
          >
            <Typography.Title level={3} style={{ marginBottom: '20px', marginTop: '20px' }}>
              Danh sách chi tiết sản phẩm
            </Typography.Title>

            <Row gutter={[16, 16]} align="middle" justify="space-between" wrap>
              <Col flex="280px">
                <Search
                  placeholder="Tìm kiếm theo tên sản phẩm"
                  value={searchValueSCT}
                  onChange={(e) => setSearchValueSCT(e.target.value)}
                  enterButton={
                    <Button type="primary" icon={<SearchOutlined />} onClick={searchSPCT} />
                  }
                />
              </Col>

              <Col flex="150px">
                <Select
                  placeholder="Giá"
                  value={filterPrice}
                  onChange={handlePriceChange}
                  style={{ width: '100%' }}
                >
                  <Option value="All">Tất cả</Option>
                  <Option value="1-300000">Dưới 300đ</Option>
                  <Option value="300000-700000">Từ 300đ đến 700đ</Option>
                  <Option value="700000-1000000">Trên 700đ</Option>
                </Select>
              </Col>

              <Col flex="150px">
                <Select
                  placeholder="Chất liệu"
                  value={selectedChatLieu}
                  onChange={handleChatLieu}
                  style={{ width: '100%' }}
                >
                  <Option value="All">Tất cả</Option>
                  {chatLieu.map((cl) => (
                    <Option key={cl.id} value={cl.id}>
                      {cl.ten}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col flex="150px">
                <Select
                  placeholder="Màu sắc"
                  value={selectedMauSac}
                  onChange={handleMauSac}
                  style={{ width: '100%' }}
                >
                  <Option value="All">Tất cả</Option>
                  {mauSac.map((ms) => (
                    <Option key={ms.id} value={ms.id}>
                      {ms.ten}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col flex="150px">
                <Select
                  placeholder="Kích cỡ"
                  value={selectedKichCo}
                  onChange={handleKichCo}
                  style={{ width: '100%' }}
                >
                  <Option value="All">Tất cả</Option>
                  {kichCo.map((kc) => (
                    <Option key={kc.id} value={kc.id}>
                      {kc.ten}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col flex="150px">
                <Select
                  placeholder="Thương hiệu"
                  value={selectedThuongHieu}
                  onChange={handleThuongHieu}
                  style={{ width: '100%' }}
                >
                  <Option value="All">Tất cả</Option>
                  {thuongHieu.map((th) => (
                    <Option key={th.id} value={th.id}>
                      {th.ten}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {/* Ô chọn tất cả */}
                      <Checkbox checked={allCheckedSPCT} onChange={handleSelectAllSPCT} inputProps={{ 'aria-label': 'Chọn tất cả' }} />
                    </TableCell>
                    <TableCell>STT</TableCell>
                    <TableCell>Ảnh</TableCell>
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
                  {paginatedChiTietSanPham.map((ct, index) => (
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
                      <TableCell>
                        <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: '100px' }}>
                          {ct.images &&
                            ct.images.map((anh, index) => (
                              <div key={index} className="image-container">
                                <img src={anh.url} alt="images" className="object-fit-contain" />
                                {ct.discountPercentage ? <p className="discount-badge">{-ct.discountPercentage}%</p> : null}
                              </div>
                            ))}
                        </Carousel>
                      </TableCell>
                      <TableCell>{ct.product && ct.product.name}</TableCell>
                      <TableCell>{ct.quantity}</TableCell>
                      <TableCell>
                        <FormatCurrency value={ct.price} />
                      </TableCell>
                      <TableCell>{ct.material && ct.material.name}</TableCell>
                      <TableCell>{ct.color && ct.color.name}</TableCell>
                      <TableCell>{ct.size && ct.size.name}</TableCell>
                      <TableCell>{ct.brand && ct.brand.name}</TableCell>
                      <TableCell>{ct.sleeve && ct.sleeve.name}</TableCell>
                      <TableCell>{ct.collar && ct.collar.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination for SPCT */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
              <Pagination
                className="custom-pagination"
                count={Math.ceil(searchSPCT.length / pageSizeSPCT)}
                page={currentPageSPCT}
                onChange={handleChangePageSPCT}
              />
              <select className="form-select" style={{ width: '80px' }} value={pageSizeSPCT} onChange={handlePageSizeChangeSPCT}>
                {[5, 10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </Grid>


          </Box>
        </>
      )}
    </Paper>
  );
};

export default UpdateDotGiamGia;




// import React, { useState, useEffect } from 'react';
// import { Paper, Typography, Button, Box, Grid, Input, TextField, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Table from '@mui/material/Table';
// import Pagination from '@mui/material/Pagination';
// import IconButton from '@mui/material/IconButton';
// import SearchIcon from '@mui/icons-material/Search';

// import { Carousel } from 'antd';
// import { useNavigate, useParams } from 'react-router-dom';
// import { listSanPham } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js'; 
// import { updateDotGiamGia } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { detailDotGiamGia } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { getDotGiamGiaDetailByIdDGG } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { findAllByIdSanPhamAndDGG } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import FormatCurrency from '../../utilities/FormatCurrency.jsx';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Modal } from 'antd';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './DotGiamGia.css';
// import { findAllChatLieu } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { findAllKichCo } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { findAllMauSac } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { findAllThuongHieu } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';

// const UpdateDotGiamGia = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [searchValue, setSearchValue] = useState('');
//   const [sanPham, setSanPham] = useState([]);
//   const [searchValueSCT, setSearchValueSCT] = useState('');
//   const [sanPhamCT, setSanPhamCT] = useState([]);
//   // Check box của sản phẩm
//   const [allCheckedSP, setAllCheckedSP] = useState(false);
//   const [selectedSanPhamIds, setSelectedSanPhamIds] = useState([]);
//   // Check box của SPCT
//   const [allCheckedSPCT, setAllCheckedSPCT] = useState(false);
//   const [selectedSanPhamDetailIds, setSelectedSanPhamDetailIds] = useState([]);
//   const [spcts, setSPCTS] = useState([]);
//   // const [dotGiamGia, setDotGiamGia] = useState([]);

//   const [thuongHieu, setThuongHieu] = useState([]);
//   const [selectedThuongHieu, setSelectedThuongHieu] = useState('All');

//   const [chatLieu, setChatLieu] = useState([]);
//   const [selectedChatLieu, setSelectedChatLieu] = useState('All');

//   const [kichCo, setKichCo] = useState([]);
//   const [selectedKichCo, setSelectedKichCo] = useState('All');

//   const [mauSac, setMauSac] = useState([]);
//   const [selectedMauSac, setSelectedMauSac] = useState('All');

//   const [filterPrice, setFilterPrice] = useState('All');

//   const [ma, setMa] = useState('');
//   const [ten, setTen] = useState('');
//   const [giaTriGiam, setGiaTriGiam] = useState('');
//   const [ngayBatDau, setNgayBatDau] = useState('');
//   const [ngayKetThuc, setNgayKetThuc] = useState('');

//   const navigate = useNavigate();
//   // const [dotGiamGiaDetail, setDotGiamGiaDetail] = useState([]);

//   // Khai bao thong bao vialidate
//   const [errors, setErrors] = useState({
//     ma: '',
//     ten: '',
//     giaTriGiam: '',
//     ngayBatDau: '',
//     ngayKetThuc: ''
//   });
//   ///Thuong hieu
//   useEffect(() => {
//     getAllTH();
//   }, []);
//   //Get hiển thị
//   function getAllTH() {
//     findAllThuongHieu()
//       .then((response) => {
//         setThuongHieu(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }

//   ///Chat lieu
//   useEffect(() => {
//     getAllCL();
//   }, []);
//   //Get hiển thị
//   function getAllCL() {
//     findAllChatLieu()
//       .then((response) => {
//         setChatLieu(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }

//   ///Mau sac
//   useEffect(() => {
//     getAllMS();
//   }, []);
//   //Get hiển thị
//   function getAllMS() {
//     findAllMauSac()
//       .then((response) => {
//         setMauSac(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }

//   ///Kich co
//   useEffect(() => {
//     getAllKC();
//   }, []);
//   //Get hiển thị
//   function getAllKC() {
//     findAllKichCo()
//       .then((response) => {
//         setKichCo(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }

//   const { id: idDGG } = useParams();
//   useEffect(() => {
//     if (idDGG) {
//       detailDotGiamGia(idDGG)
//         .then((response) => {
//           // dotGiamGiaDetail(response)
//           setMa(response.data.ma);
//           setTen(response.data.ten);
//           setGiaTriGiam(response.data.giaTriGiam);
//           setNgayBatDau(response.data.ngayBatDau);
//           setNgayKetThuc(response.data.ngayKetThuc);
//           // setSPCTS(spcts);
//         })
//         .catch((error) => {
//           console.error('Error fetching dot giam gia data:', error);
//         });
//     }
//   }, [idDGG]);

//   useEffect(() => {
//     console.log('idDGG', idDGG);
//     if (idDGG) {
//       getDotGiamGiaDetailByIdDGG(idDGG)
//         .then((response) => {
//           setSanPhamCT(response.data);
//         })
//         .catch((error) => {
//           console.error('Error fetching dot giam gia data:', error);
//         });
//     }
//   }, [idDGG]);

//   function quayLai() {
//     navigate('/voucher/dot-giam-gia');
//   }

//   const handlePageSizeChange = (event) => {
//     setPageSize(parseInt(event.target.value, 10));
//     setCurrentPage(1);
//   };
//   //Hàm sửa
//   const UpdateDotGiamGia = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       if (selectedSanPhamDetailIds.length === 0) {
//         toast.error('Vui lòng chọn sản phẩm áp dụng');
//       } else {
//         Modal.confirm({
//           title: 'Xác nhận',
//           maskClosable: true,
//           content: 'Xác nhận sửa đợt giảm giá ?',
//           okText: 'Xác nhận',
//           cancelText: 'Hủy',
//           onOk: async () => {
//             const dotGiamGia = { ma, ten, giaTriGiam, ngayBatDau, ngayKetThuc, productDetails: selectedSanPhamDetailIds };
//             try {
//               const response = await updateDotGiamGia(idDGG, dotGiamGia);
//               console.log(response.data);
//               toast.success('Sửa thành công đợt giảm giá!');
//               setTimeout(() => {
//                 navigate('/voucher/dot-giam-gia'); //Sau 2s mới chuyển
//               }, 2000);
//             } catch (error) {
//               toast.error(error);
//             }
//           }
//         });
//       }
//     }
//   };

//   function validateForm() {
//     let valid = true;
//     const errorsCopy = { ...errors };

//     // Validate mã
//     if (!ma.trim()) {
//       // errorsCopy.ma = 'Mã đợt giảm giá không được để trống!';
//       // valid = false;
//     } else if (ma.length > 20) {
//       errorsCopy.ma = 'Mã đợt giảm giá không được vượt quá 20 kí tự!';
//       valid = false;
//       // } else if (dotGiamGia.some(dgg => dgg.ma === ma)) {
//       // errorsCopy.ma = 'Mã đợt giảm giá đã tồn tại!';
//       // valid = false;
//     } else {
//       errorsCopy.ma = '';
//     }

//     // Validate tên
//     if (!ten.trim()) {
//       errorsCopy.ten = 'Tên đợt giảm giá không được để trống!';
//       valid = false;
//     } else if (ten.length > 50) {
//       errorsCopy.ten = 'Tên đợt giảm giá không được vượt quá 50 kí tự!';
//       valid = false;
//     } else {
//       errorsCopy.ten = '';
//     }

//     // Validate giá trị giảm
//     const giaTriGiamNumber = parseInt(giaTriGiam);
//     if (!giaTriGiamNumber === '') {
//       errorsCopy.giaTriGiam = 'Giá trị giảm không được để trống!';
//       valid = false;
//     } else if (isNaN(giaTriGiamNumber) || !Number.isInteger(giaTriGiamNumber) || giaTriGiamNumber < 1 || giaTriGiamNumber > 50) {
//       errorsCopy.giaTriGiam = 'Giá trị giảm phải là số nguyên từ 1% đến 50%!';
//       valid = false;
//     } else {
//       errorsCopy.giaTriGiam = '';
//     }

//     // Validate ngày bắt đầu
//     if (!ngayBatDau.trim()) {
//       errorsCopy.ngayBatDau = 'Ngày bắt đầu không được để trống!';
//       valid = false;
//     } else {
//       const ngayBatDauDate = new Date(ngayBatDau);
//       const ngayKetThucDate = new Date(ngayKetThuc);
//       const currentDate = new Date();

//       if (ngayBatDauDate < currentDate.setHours(0, 0, 0, 0)) {
//         errorsCopy.ngayBatDau = 'Ngày bắt đầu phải từ ngày giờ hiện tại trở đi!';
//         valid = false;
//       } else if (ngayBatDauDate >= ngayKetThucDate) {
//         errorsCopy.ngayBatDau = 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc!';
//         valid = false;
//       } else {
//         errorsCopy.ngayBatDau = '';
//       }
//     }

//     // Validate ngày kết thúc
//     if (!ngayKetThuc.trim()) {
//       errorsCopy.ngayKetThuc = 'Ngày kết thúc không được để trống!';
//       valid = false;
//     } else {
//       const ngayBatDauDate = new Date(ngayBatDau);
//       const ngayKetThucDate = new Date(ngayKetThuc);

//       if (ngayKetThucDate <= ngayBatDauDate) {
//         errorsCopy.ngayKetThuc = 'Ngày kết thúc phải lớn hơn ngày bắt đầu!';
//         valid = false;
//       } else {
//         errorsCopy.ngayKetThuc = '';
//       }
//     }

//     setErrors(errorsCopy);
//     return valid;
//   }

//   //     //Diềm nó vào danh sách san pham
//   useEffect(() => {
//     getAllSanPham();
//   }, []);
//   //Get hiển thị
//   function getAllSanPham() {
//     listSanPham()
//       .then((response) => {
//         setSanPham(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }

//   const handleChangePage = (event, newPage) => {
//     setCurrentPage(newPage);
//   };

//   function quayLai() {
//     navigate('/voucher/dot-giam-gia');
//   }

//   const filteredOrders = sanPham.filter((sanPham) => sanPham.ten.toLowerCase().includes(searchValue.toLowerCase()));

//   // Làm check box cho sp
//   // Chuyển sang SPCT lấy ra theo id
//   const fetchSanPhamCT = async (selectedIds) => {
//     const promises = selectedIds.map((id) => findAllByIdSanPhamAndDGG(id)); //idDGG
//     const results = await Promise.all(promises);
//     const allDetails = results.flatMap((result) => result.data);
//     setSanPhamCT(allDetails);
//   };

//   // Xử lý khi checkbox của SP thay đổi
//   const handleCheckboxChangeSP = (idSanPham) => {
//     let updatedSelectedIds = [...selectedSanPhamIds];
//     if (updatedSelectedIds.includes(idSanPham)) {
//       updatedSelectedIds = updatedSelectedIds.filter((id) => id !== idSanPham); // Bỏ chọn sản phẩm
//     } else {
//       updatedSelectedIds.push(idSanPham); // Chọn thêm sản phẩm
//     }
//     setSelectedSanPhamIds(updatedSelectedIds);
//     fetchSanPhamCT(updatedSelectedIds); // Gọi lại API với danh sách idSanPham được chọn
//   };

//   const handleSelectAllSP = () => {
//     if (selectedSanPhamIds.length === paginatedOrders.length) {
//       setSelectedSanPhamIds([]);
//       setSanPhamCT([]);
//     } else {
//       const allIds = paginatedOrders.map((sp) => sp.id);
//       setSelectedSanPhamIds(allIds);
//       fetchSanPhamCT(allIds);
//     }
//   };

//   // Xử lý khi thay đổi giá trị tìm kiếm
//   const handleSearchChange = (e) => {
//     setSearchValueSCT(e.target.value);
//   };
//   //Loc theo thuong hieu
//   const handleThuongHieu = (event) => {
//     setSelectedThuongHieu(event.target.value); // Cập nhật giá trị chọn lọc
//   };
//   //Loc theo MS
//   const handleMauSac = (event1) => {
//     setSelectedMauSac(event1.target.value); // Cập nhật giá trị chọn lọc
//   };
//   //Loc theo KT
//   const handleKichCo = (event2) => {
//     setSelectedKichCo(event2.target.value); // Cập nhật giá trị chọn lọc
//   };
//   //Loc theo TH
//   const handleChatLieu = (event3) => {
//     setSelectedChatLieu(event3.target.value); // Cập nhật giá trị chọn lọc
//   };

//   const handlePriceChange = (event) => {
//     setFilterPrice(event.target.value);
//   };
//   // Lọc danh sách chi tiết sản phẩm theo giá trị tìm kiếm
//   const searchSPCT = sanPhamCT.filter((ct) => {
//     const isStatusTH = selectedThuongHieu === 'All' || ct.idThuongHieu.id === selectedThuongHieu;
//     const isStatusMS = selectedMauSac === 'All' || ct.idMauSac.id === selectedMauSac;
//     const isStatusKC = selectedKichCo === 'All' || ct.idKichCo.id === selectedKichCo;
//     const isStatusCL = selectedChatLieu === 'All' || ct.idChatLieu.id === selectedChatLieu;

//     const isNameOrCodeMatch = !searchValueSCT || (ct.idSanPham && ct.idSanPham.ten.toLowerCase().includes(searchValueSCT.toLowerCase()));

//     let priceMatch = true;
//     if (filterPrice !== 'All') {
//       const priceRange = filterPrice.split('-');
//       const minPrice = parseFloat(priceRange[0]);
//       const maxPrice = parseFloat(priceRange[1]);
//       const giaBan = parseFloat(ct.giaBan);
//       priceMatch = giaBan >= minPrice && giaBan <= maxPrice;
//     }

//     return isNameOrCodeMatch && isStatusCL && isStatusTH && isStatusMS && isStatusKC && priceMatch;
//   });

//   const paginatedChiTietSanPham = searchSPCT.slice((currentPage - 1) * pageSize, currentPage * pageSize);
//   const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   // Check box của SPCT
//   // Xử lý sự kiện chọn tất cả
//   const handleSelectAllSPCT = (event) => {
//     const checked = event.target.checked;
//     setAllCheckedSPCT(checked);
//     const ids = checked ? searchSPCT.map((item) => item.id) : [];
//     setSelectedSanPhamDetailIds(ids);
//   };

//   // Xử lý sự kiện chọn từng checkbox
//   const handleCheckboxChangeSPCT = (event, id) => {
//     const checked = event.target.checked;
//     let updatedIds = [...selectedSanPhamDetailIds];

//     if (checked && !updatedIds.includes(id)) {
//       updatedIds.push(id);
//     } else {
//       updatedIds = updatedIds.filter((item) => item !== id);
//     }

//     setSelectedSanPhamDetailIds(updatedIds);
//   };

//   // Kiểm tra xem tất cả checkbox có được chọn không
//   useEffect(() => {
//     setAllCheckedSPCT(selectedSanPhamDetailIds.length === searchSPCT.length);
//   }, [selectedSanPhamDetailIds, searchSPCT]);

//   return (
//     <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: '8px' }}>
//       <Typography variant="h3" gutterBottom marginBottom={'20px'}>
//         Sửa đợt giảm giá
//       </Typography>

//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mt={3}
//         sx={{
//           backgroundColor: 'white',
//           padding: '20px',
//           borderRadius: '10px',
//           border: '1px solid black',
//           marginTop: '50px'
//         }}
//       >
//         <Box component="form" noValidate autoComplete="off" marginLeft={'15px'} width={'500px'}>
//           {/* <Grid container spacing={1}> */}
//           <Grid item xs={12} md={6} marginTop={'15px'}>
//             <Typography variant="subtitle1" gutterBottom>
//               {' '}
//               {/* Nhãn cho trường Ngày bắt đầu */}
//               Mã đợt giảm giá
//             </Typography>
//             <TextField
//               fullWidth
//               variant="outlined"
//               name="ma"
//               value={ma}
//               className={`${errors.ma ? 'is-invalid' : ''}`}
//               required
//               onChange={(e) => setMa(e.target.value)}
//               disabled
//               placeholder="Mời nhập mã đợt giảm giá"
//             />
//             {errors.ma && <span className="invalid-feedback">{errors.ma}</span>}
//           </Grid>

//           <Grid item xs={12} md={6} marginTop={'15px'}>
//             <Typography variant="subtitle1" gutterBottom>
//               {' '}
//               {/* Nhãn cho trường Ngày bắt đầu */}
//               Tên đợt giảm giá
//             </Typography>
//             <TextField
//               fullWidth
//               variant="outlined"
//               name="ten"
//               value={ten}
//               className={`${errors.ten ? 'is-invalid' : ''}`}
//               placeholder="Mời nhập tên đợt giảm giá"
//               onChange={(e) => setTen(e.target.value)}
//               required
//             />
//             {errors.ten && <span className="invalid-feedback">{errors.ten}</span>}
//           </Grid>

//           <Grid item xs={12} md={6} marginTop="15px">
//             <Typography variant="subtitle1" gutterBottom>
//               Giá trị (%)
//             </Typography>
//             <TextField
//               type="number"
//               fullWidth
//               variant="outlined"
//               name="giaTriGiam"
//               value={giaTriGiam}
//               className={`${errors.giaTriGiam ? 'is-invalid' : ''}`}
//               onChange={(e) => setGiaTriGiam(e.target.value)}
//               required
//               placeholder="Mời nhập giá trị giảm giá"
//             />
//             {errors.giaTriGiam && <div className="invalid-feedback">{errors.giaTriGiam}</div>}
//           </Grid>

//           <Grid item xs={12} md={6} marginTop="15px">
//             <Typography variant="subtitle1" gutterBottom>
//               Ngày bắt đầu
//             </Typography>
//             <TextField
//               fullWidth
//               variant="outlined"
//               name="ngayBatDau"
//               value={ngayBatDau}
//               type="datetime-local"
//               className={`${errors.ngayBatDau ? 'is-invalid' : ''}`}
//               onChange={(e) => setNgayBatDau(e.target.value)}
//               required
//             />
//             {errors.ngayBatDau && <div className="invalid-feedback">{errors.ngayBatDau}</div>}
//           </Grid>

//           <Grid item xs={12} md={6} marginTop="15px">
//             <Typography variant="subtitle1" gutterBottom>
//               Ngày kết thúc
//             </Typography>
//             <TextField
//               fullWidth
//               variant="outlined"
//               name="ngayKetThuc"
//               value={ngayKetThuc}
//               type="datetime-local"
//               className={`${errors.ngayKetThuc ? 'is-invalid' : ''}`}
//               onChange={(e) => setNgayKetThuc(e.target.value)}
//               required
//             />
//             {errors.ngayKetThuc && <div className="invalid-feedback">{errors.ngayKetThuc}</div>}
//           </Grid>

//           <Grid item xs={12}>
//             <ToastContainer />
//             <Box display="flex" justifyContent="space-around" mt={2}>
//               <Button variant="contained" color="warning" type="submit" onClick={(e) => UpdateDotGiamGia(e)}>
//                 Sửa
//               </Button>

//               <Button onClick={quayLai} variant="contained" color="primary">
//                 Quay lại
//               </Button>
//             </Box>
//           </Grid>
//         </Box>

//         <Box id="table" noValidate autoComplete="off" width={'500px'} marginRight={'15px'}>
//           {/* //Tim kiem */}
//           <Grid item xs={12} md={6}>
//             <Box display="flex" alignItems="center">
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 placeholder="Tìm kiếm theo tên sản phẩm"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 InputProps={{
//                   endAdornment: (
//                     <IconButton>
//                       <SearchIcon />
//                     </IconButton>
//                   )
//                 }}
//               />
//             </Box>
//           </Grid>

//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     {/* Ô chọn tất cả */}
//                     <Checkbox
//                       checked={selectedSanPhamIds.length === paginatedOrders.length}
//                       onChange={handleSelectAllSP}
//                       inputProps={{ 'aria-label': 'Chọn tất cả' }}
//                     />
//                   </TableCell>
//                   <TableCell>STT</TableCell>
//                   <TableCell>Tên sản phẩm</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {paginatedOrders.map((sanPham, index) => (
//                   <TableRow key={sanPham.id}>
//                     <TableCell>
//                       {/* Checkbox */}
//                       <Checkbox checked={selectedSanPhamIds.includes(sanPham.id)} onChange={() => handleCheckboxChangeSP(sanPham.id)} />
//                     </TableCell>
//                     <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
//                     <TableCell>{sanPham.ten}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           {/* Pagination */}
//           <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
//             <Pagination
//               count={Math.ceil(filteredOrders.length / pageSize)}
//               page={currentPage}
//               onChange={handleChangePage}
//               className="custom-pagination"
//             />
//             <select className="form-select" style={{ width: '80px' }} value={pageSize} onChange={handlePageSizeChange}>
//               {[5, 10, 20, 50, 100].map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//           </Grid>
//         </Box>
//       </Box>

//       {sanPhamCT.length > 0 && (
//         <>
//           <Box
//             id="table2"
//             noValidate
//             autoComplete="off"
//             sx={{
//               backgroundColor: 'white',
//               padding: '20px',
//               borderRadius: '10px',
//               border: '1px solid black',
//               marginTop: '50px'
//             }}
//           >
//             <Typography variant="h3" gutterBottom marginBottom={'20px'} marginTop={'20px'}>
//               Danh sách chi tiết sản phẩm
//             </Typography>

//             {/* Search Bar */}
//             <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
//               <Grid width={'280px'}>
//                 <TextField
//                   fullWidth
//                   variant="outlined"
//                   placeholder="Tìm kiếm theo tên sản phẩm"
//                   value={searchValueSCT}
//                   onChange={(e) => setSearchValueSCT(e.target.value)}
//                   InputProps={{
//                     endAdornment: (
//                       <IconButton onClick={searchSPCT}>
//                         <SearchIcon />
//                       </IconButton>
//                     )
//                   }}
//                 />
//               </Grid>
//               <Grid width={'150px'}>
//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel id="filter-status-label">Giá</InputLabel>
//                   <Select
//                     labelId="filter-status-label"
//                     id="filter-status"
//                     label="Giá bán"
//                     value={filterPrice} // Sử dụng state lưu giá trị chọn lọc
//                     onChange={handlePriceChange}
//                   >
//                     <MenuItem value="All">Tất cả</MenuItem>
//                     <MenuItem value="1-300000">Dưới 300đ</MenuItem>
//                     <MenuItem value="300000-700000">Từ 300đ đến 700đ</MenuItem>
//                     <MenuItem value="700000-1000000">Trên 700đ</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid width={'150px'}>
//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel id="filter-status-label">Chất liệu</InputLabel>
//                   <Select
//                     labelId="filter-status-label"
//                     id="filter-status"
//                     label="Chất liệu"
//                     value={selectedChatLieu} // Sử dụng state lưu giá trị chọn lọc
//                     onChange={handleChatLieu}
//                   >
//                     <MenuItem value="All">Tất cả</MenuItem>
//                     {chatLieu.map((cl) => (
//                       <MenuItem key={cl.id} value={cl.id}>
//                         {cl.ten}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid width={'150px'}>
//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel id="filter-color-label">Màu sắc</InputLabel>
//                   <Select
//                     labelId="filter-color-label"
//                     id="filter-color"
//                     label="Màu sắc"
//                     value={selectedMauSac} // Sử dụng state lưu giá trị chọn lọc
//                     onChange={handleMauSac}
//                   >
//                     <MenuItem value="All">Tất cả</MenuItem>
//                     {mauSac.map((ms) => (
//                       <MenuItem key={ms.id} value={ms.id}>
//                         {ms.ten}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid width={'150px'}>
//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel id="filter-size-label">Kích cỡ</InputLabel>
//                   <Select
//                     labelId="filter-size-label"
//                     id="filter-size"
//                     label="Kích cỡ"
//                     value={selectedKichCo} // Sử dụng state lưu giá trị chọn lọc
//                     onChange={handleKichCo}
//                   >
//                     <MenuItem value="All">Tất cả</MenuItem>
//                     {kichCo.map((kc) => (
//                       <MenuItem key={kc.id} value={kc.id}>
//                         {kc.ten}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid width={'150px'}>
//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel id="filter-brand-label">Thương hiệu</InputLabel>
//                   <Select
//                     labelId="filter-brand-label"
//                     id="filter-brand"
//                     label="Thương hiệu"
//                     value={selectedThuongHieu} // Sử dụng state lưu giá trị chọn lọc
//                     onChange={handleThuongHieu}
//                   >
//                     <MenuItem value="All">Tất cả</MenuItem>
//                     {thuongHieu.map((th) => (
//                       <MenuItem key={th.id} value={th.id}>
//                         {th.ten}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Box>

//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>
//                       {/* Ô chọn tất cả */}
//                       <Checkbox checked={allCheckedSPCT} onChange={handleSelectAllSPCT} inputProps={{ 'aria-label': 'Chọn tất cả' }} />
//                     </TableCell>
//                     <TableCell>STT</TableCell>
//                     <TableCell>Ảnh</TableCell>
//                     <TableCell>Tên sản phẩm</TableCell>
//                     <TableCell>Số lượng tồn</TableCell>
//                     <TableCell>Giá bán</TableCell>
//                     <TableCell>Chất liệu</TableCell>
//                     <TableCell>Màu sắc</TableCell>
//                     <TableCell>Kích cỡ</TableCell>
//                     <TableCell>Thương hiệu</TableCell>
//                     <TableCell>Tay áo</TableCell>
//                     <TableCell>Cổ áo</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {paginatedChiTietSanPham.map((ct, index) => (
//                     <TableRow key={ct.id}>
//                       <TableCell>
//                         {/* Checkbox */}
//                         <Checkbox
//                           checked={selectedSanPhamDetailIds.includes(ct.id)}
//                           onChange={(e) => handleCheckboxChangeSPCT(e, ct.id)}
//                           inputProps={{ 'aria-label': `Chọn sản phẩm chi tiết ${ct.id}` }}
//                         />
//                       </TableCell>
//                       <TableCell>{index + 1}</TableCell>
//                       <TableCell>
//                         <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: '100px' }}>
//                           {ct.images &&
//                             ct.images.map((anh, index) => (
//                               <div key={index} className="image-container">
//                                 <img src={anh.ten} alt="images" className="object-fit-contain" />
//                                 {ct.phanTramGiam ? <p className="discount-badge">{-ct.phanTramGiam}%</p> : null}
//                               </div>
//                             ))}
//                         </Carousel>
//                       </TableCell>
//                       <TableCell>{ct.sanPham && ct.sanPham.ten}</TableCell>
//                       <TableCell>{ct.soLuong}</TableCell>
//                       <TableCell>
//                         <FormatCurrency value={ct.giaBan} />
//                       </TableCell>
//                       <TableCell>{ct.chatLieu && ct.chatLieu.ten}</TableCell>
//                       <TableCell>{ct.mauSac && ct.mauSac.ten}</TableCell>
//                       <TableCell>{ct.kichCo && ct.kichCo.ten}</TableCell>
//                       <TableCell>{ct.thuongHieu && ct.thuongHieu.ten}</TableCell>
//                       <TableCell>{ct.tayAo && ct.tayAo.ten}</TableCell>
//                       <TableCell>{ct.coAo && ct.coAo.ten}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             {/* Pagination */}
//             <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
//               <Pagination
//                 className="custom-pagination"
//                 count={Math.ceil(searchSPCT.length / pageSize)}
//                 page={currentPage}
//                 onChange={handleChangePage}
//               />
//               <select className="form-select" style={{ width: '80px' }} value={pageSize} onChange={handlePageSizeChange}>
//                 {[5, 10, 20, 50, 100].map((size) => (
//                   <option key={size} value={size}>
//                     {size}
//                   </option>
//                 ))}
//               </select>
//             </Grid>
//           </Box>
//         </>
//       )}
//     </Paper>
//   );
// };

// export default UpdateDotGiamGia;
