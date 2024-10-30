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