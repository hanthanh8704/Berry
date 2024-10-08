import React, { useState, useEffect } from 'react';
import { Table, Space, Modal, Button, Select, Input, DatePicker } from 'antd';
import { SearchOutlined, FileAddOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FormatDate from '../../utilities/FormatDate.jsx';
import VoucherStatus from './DotGiamGiaTrangThai.jsx';
import { listDotGiamGia, deletedDotGiamGia } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DotGiamGia.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const { Option } = Select;

const DotGiamGia = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Kích thước trang mặc định là 5
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [dotGiamGia, setDotGiamGia] = useState([]);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    getAllDotGiamGia();
  }, []);

  function getAllDotGiamGia() {
    listDotGiamGia()
      .then((response) => {
        setDotGiamGia(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      maskClosable: true,
      content: 'Bạn có muốn ngừng hoạt động đợt giảm giá này?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        deletedDotGiamGia(id)
          .then((response) => {
            console.log('Đã xóa thành công:', response);
            toast.success('Ngừng thành công đợt giảm giá!');
            getAllDotGiamGia();
          })
          .catch((error) => {
            console.error('Lỗi khi xóa:', error);
          });
      },
    });
  };

  const handleAddNew = () => {
    navigate('/voucher/dot-giam-gia/add');
    console.log('Thêm mới');
  };

  const handleViewUpdate = (id) => {
    navigate(`/voucher/dot-giam-gia/update/${id}`);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1); // Đặt trang hiện tại về 1 khi thay đổi kích thước trang
  };

  const handleStatusChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handlePriceChange = (value) => {
    setFilterPrice(value);
    setCurrentPage(1);
  };

  const searchTenMaGiaTriLike = dotGiamGia.filter((dotGiamGia) => {
    const isStatusMatch = filterStatus === 'All' || dotGiamGia.status === filterStatus;
    const isNameOrCodeMatch =
      dotGiamGia.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      dotGiamGia.code.toLowerCase().includes(searchValue.toLowerCase()) ||
      dotGiamGia.discountPercentage.toString().toLowerCase().includes(searchValue.toLowerCase());
    const isDateInRange =
      (!startDate || new Date(dotGiamGia.startDate) >= new Date(startDate)) &&
      (!endDate || new Date(dotGiamGia.endDate) <= new Date(endDate));

    let isPriceMatch = true;
    if (filterPrice !== 'All') {
      const [minPrice, maxPrice] = filterPrice.split('-').map(Number);
      isPriceMatch = dotGiamGia.discountPercentage >= minPrice && dotGiamGia.discountPercentage <= maxPrice;
    }

    return isStatusMatch && isNameOrCodeMatch && isDateInRange && isPriceMatch;
  });

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Mã đợt giảm giá',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên đợt giảm giá',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá trị',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: (text) => `${text}%`,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => <FormatDate date={text} />,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => <FormatDate date={text} />,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <VoucherStatus status={text} />,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleViewUpdate(record.id)} />
          <Button type="danger" className='bg-danger' icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="dot-giam-gia-container">
      {/* Search Bar */}
      <div className="search-bar bg-white mb-3 p-4 rounded ">
        <Input.Group compact style={{ marginBottom: '10px' }}>
          <div className='mb-3' style={{ justifyContent: 'space-between' }}>
            <Input.Search
              placeholder="Tìm kiếm theo tên mã và giá trị của đợt giảm giá"
              allowClear
              style={{ width: '500px' }}
              enterButton={<SearchOutlined />}
              onSearch={(value) => setSearchValue(value)}
            />
            <DatePicker 
              style={{ width: '250px' , marginLeft:'45px', marginRight:'40px'}}
              placeholder="Ngày bắt đầu"
              onChange={(date, dateString) => setStartDate(dateString)}
            />
            <DatePicker
             style={{ width: '250px' }}
              placeholder="Ngày kết thúc"
              onChange={(date, dateString) => setEndDate(dateString)}
            />
          </div>
          
          <Select
                defaultValue="All"
                style={{ width: '240px', borderRadius: '10px' }}
                dropdownStyle={{ borderRadius: '10px' }}
                onChange={handleStatusChange}
            >
                <Option value="All">Tất cả</Option>
                <Option value="Sắp diễn ra">Sắp diễn ra</Option>
                <Option value="Đang diễn ra">Đang diễn ra</Option>
                <Option value="Đã kết thúc">Đã kết thúc</Option>
            </Select>         

            <Select
                defaultValue="All"
                className="mx-4"
                style={{ width: '240px', borderRadius: '10px' }}
                dropdownStyle={{ borderRadius: '10px' }}
                onChange={handlePriceChange}
            >
                <Option value="All" >Tất cả</Option>
                <Option value="1-20">1%-20%</Option>
                <Option value="20-40">20%-40%</Option>
                <Option value="40-50">40%-50%</Option>
            </Select>
         
            <Button type="primary" className='mx-3 rounded' icon={<FileAddOutlined />} onClick={handleAddNew}>
              Thêm mới
            </Button>
        </Input.Group>
      </div>

      {/* Orders Table */}
      <Table
        columns={columns}
        dataSource={searchTenMaGiaTriLike}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          pageSizeOptions: [5, 10, 20, 50, 100],
          total: searchTenMaGiaTriLike.length,
          onChange: handleChangePage,
          showSizeChanger: true,
          onShowSizeChange: handlePageSizeChange,
        }}
      />

      <ToastContainer />
    </div>
  );
};

export default DotGiamGia;





// import React, { useState, useEffect } from 'react';
// import Grid from '@mui/material/Grid';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import Pagination from '@mui/material/Pagination';
// import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import IconButton from '@mui/material/IconButton';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import SearchIcon from '@mui/icons-material/Search';
// import { Box, Typography, Button } from '@mui/material';
// import { Add, Delete, Details, Save, Update } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import FormatDate from '../../utilities/FormatDate.jsx';
// import VoucherStatus from './DotGiamGiaTrangThai.jsx';
// import { listDotGiamGia } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { deletedDotGiamGia } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { margin } from '@mui/system';
// import './DotGiamGia.css'; // Đường dẫn đến file CSS hoặc SCSS
// import { Modal } from 'antd';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const DotGiamGia = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [searchValue, setSearchValue] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [filterPrice, setFilterPrice] = useState('All');
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [dotGiamGia, setDotGiamGia] = useState([]);
//   const navigate = useNavigate();
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   //Diềm nó vào danh sách
//   useEffect(() => {
//     getAllDotGiamGia();
//   }, []);
//   //Get hiển thị
//   function getAllDotGiamGia() {
//     listDotGiamGia()
//       .then((response) => {
//         setDotGiamGia(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }

//   const handleDelete = (id) => {
//     Modal.confirm({
//       title: 'Xác nhận',
//       maskClosable: true,
//       content: 'Bạn có muốn ngừng hoạt động đợt giảm giá này?',
//       okText: 'Xác nhận',
//       cancelText: 'Hủy',
//       onOk: async () => {
//         deletedDotGiamGia(id)
//           .then((response) => {
//             console.log('Đã xóa thành công:', response);
//             toast.success('Ngừng thành công đợt giảm giá!');
//             // Gọi lại hàm getAllDotGiamGia để cập nhật danh sách
//             getAllDotGiamGia();
//           })
//           .catch((error) => {
//             console.error('Lỗi khi xóa:', error);
//           });
//       }
//     });
//   };

//   const handleChangePage = (event, newPage) => {
//     setCurrentPage(newPage);
//   };
//   const handlePageSizeChange = (event) => {
//     setPageSize(parseInt(event.target.value, 10));
//     setCurrentPage(1);
//   };

//   const handleStatusChange = (event) => {
//     setFilterStatus(event.target.value);
//     setCurrentPage(1);
//   };

//   const handlePriceChange = (event) => {
//     setFilterPrice(event.target.value);
//     setCurrentPage(1);
//   };


//   const searchTenMaGiaTriLike = dotGiamGia.filter((dotGiamGia) => {
//     const isStatusMatch = filterStatus === 'All' || dotGiamGia.trangThai === filterStatus;
//     const isNameOrCodeMatch =
//       dotGiamGia.ten.toLowerCase().includes(searchValue.toLowerCase()) ||
//       dotGiamGia.ma.toLowerCase().includes(searchValue.toLowerCase()) ||
//       dotGiamGia.giaTriGiam.toString().toLowerCase().includes(searchValue.toLowerCase());
//     const isDateInRange =
//       (!startDate || new Date(dotGiamGia.ngayBatDau) >= new Date(startDate)) &&
//       (!endDate || new Date(dotGiamGia.ngayKetThuc) <= new Date(endDate));

//     let isPriceMatch = true;
//     if (filterPrice !== 'All') {
//       const [minPrice, maxPrice] = filterPrice.split('-').map(Number);
//       isPriceMatch = dotGiamGia.giaTriGiam >= minPrice && dotGiamGia.giaTriGiam <= maxPrice;
//     }

//     return isStatusMatch && isNameOrCodeMatch && isDateInRange && isPriceMatch;
//   });

//   //Chuyển sang trang thêm mới
//   const handleAddNew = () => {
//     // Thực hiện logic thêm mới ở đây
//     navigate('/voucher/dot-giam-gia/add'); // Chuyển hướng đến /dot-giam-gia/add
//     console.log('Thêm mới');
//   };

//   const handleViewUpdate = (id) => {
//     navigate(`/voucher/dot-giam-gia/update/${id}`);
//   };

//   const paginatedOrders = searchTenMaGiaTriLike.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   return (
//     <Grid container spacing={3}>
//       <Grid
//         container
//         spacing={3}
//         style={{ backgroundColor: 'white', padding: '10px', marginLeft: '24px', marginTop: '20px', borderRadius: '10px' }}
//       >
//         {/* Search Bar */}
//         <Grid item xs={12} md={6}>
//           <Box display="flex" alignItems="center">
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Tìm kiếm theo tên mã và giá trị của đợt giảm giá"
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               InputProps={{
//                 endAdornment: (
//                   <IconButton>
//                     <SearchIcon />
//                   </IconButton>
//                 )
//               }}
//             />
//           </Box>
//         </Grid>

//         {/* Tìm kiếm theo ngày bắt đầu */}
//         <Grid item xs={12} md={3}>
//           <Box display="flex" alignItems="center">
//             <TextField
//               fullWidth
//               variant="outlined"
//               type="datetime-local" // Đặt kiểu datetime-local
//               placeholder="Ngày bắt đầu"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               // onKeyDown={handleKeyDown}
//             />
//           </Box>
//         </Grid>

//         {/* Tìm kiếm theo ngày kết thúc */}
//         <Grid item xs={12} md={3}>
//           <Box display="flex" alignItems="center">
//             <TextField
//               fullWidth
//               variant="outlined"
//               type="datetime-local" // Đặt kiểu datetime-local
//               placeholder="Ngày kết thúc"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               // onKeyDown={handleKeyDown}
//             />
//           </Box>
//         </Grid>

//         {/* Filter by Status */}
//         <Grid item xs={12} md={3}>
//           <FormControl fullWidth variant="outlined">
//             <InputLabel id="filter-status-label">Trạng thái</InputLabel>
//             <Select
//               labelId="filter-status-label"
//               id="filter-status"
//               value={filterStatus}
//               onChange={handleStatusChange}
//               label="Filter by Status"
//             >
//               <MenuItem value="All">Tất cả</MenuItem>
//               <MenuItem value="Sắp diễn ra">Sắp diễn ra</MenuItem>
//               <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
//               <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>

//         <Box display="flex" margin={'20px'} paddingTop={'5px'}>
//           {/* Tim theo khoang gia */}
//           <Grid item xs={12} md={20} width={'210px'}>
//             <FormControl fullWidth variant="outlined">
//               <InputLabel id="filter-price-label">Giá trị</InputLabel>
//               <Select labelId="filter-price-label" id="filter-price" value={filterPrice} onChange={handlePriceChange} label="Khoảng giá">
//                 <MenuItem value="All">Tất cả</MenuItem>
//                 <MenuItem value="1-20">1%-20%</MenuItem>
//                 <MenuItem value="20-40">20%-40%</MenuItem>
//                 <MenuItem value="40-50">40%-50%</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* Nút THÊM MỚI */}
//           <Grid item xs={12} md={3} marginLeft={'0px'}>
//             <Box marginLeft={'25px'} width={'130px'} marginTop={'7px'}>
//               <Button fullWidth variant="contained" color="secondary" startIcon={<Add />} onClick={handleAddNew}>
//                 THÊM MỚI
//               </Button>
//             </Box>
//           </Grid>
//         </Box>
//       </Grid>

//       {/* Orders Table */}
//       <Grid item xs={12}>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>STT</TableCell>
//                 <TableCell>Mã đợt giảm giá</TableCell>
//                 <TableCell>Tên đợt giảm giá</TableCell>
//                 <TableCell>Giá trị</TableCell>
//                 <TableCell>Thời gian bắt đầu</TableCell>
//                 <TableCell>Thời gian kết thúc</TableCell>
//                 <TableCell>Trạng thái</TableCell>
//                 <TableCell>Thao tác</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedOrders.map((dotGiamGia, index) => (
//                 <TableRow key={dotGiamGia.id}>
//                   <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
//                   <TableCell>{dotGiamGia.ma}</TableCell>
//                   <TableCell>{dotGiamGia.ten}</TableCell>
//                   <TableCell>{dotGiamGia.giaTriGiam}%</TableCell>
//                   <TableCell>{<FormatDate date={dotGiamGia.ngayBatDau} />}</TableCell>
//                   <TableCell>{<FormatDate date={dotGiamGia.ngayKetThuc} />}</TableCell>
//                   <TableCell>
//                     <VoucherStatus status={dotGiamGia.trangThai} />
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       color="warning"
//                       startIcon={<Update />} // Icon sẽ được đặt ở phía bắt đầu của Button
//                       onClick={() => handleViewUpdate(dotGiamGia.id)}
//                     ></Button>

//                     <Button
//                       color="error" // Thay đổi thành 'error' để sử dụng màu đỏ
//                       startIcon={<Delete />} // Icon sẽ được đặt ở phía bắt đầu của Button
//                       onClick={() => handleDelete(dotGiamGia.id)}
//                     ></Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Grid>

//       {/* Pagination */}
//       <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end', pt: 2 }}>
//         {/* Pagination */}
//         <Pagination
//           count={Math.ceil(searchTenMaGiaTriLike.length / pageSize)}
//           page={currentPage}
//           onChange={handleChangePage}
          
//           className="custom-pagination" // Áp dụng lớp CSS tùy chỉnh
//         />

//         {/* Select box để chọn kích thước trang */}
//         <select className="form-select" style={{ width: '80px', marginLeft: '10px' }} value={pageSize} onChange={handlePageSizeChange}>
//           {[5, 10, 20, 50].map((size) => (
//             <option key={size} value={size}>
//               {size}
//             </option>
//           ))}
//         </select>
//       </Grid>

//       <ToastContainer />
//     </Grid>
//   );
// };

// export default DotGiamGia;
