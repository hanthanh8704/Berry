import React, { useState, useEffect } from 'react';
import { Table, Space, Modal, Button, Select, Input, DatePicker } from 'antd';
import { SearchOutlined, FileAddOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FormatDate from '../../utilities/FormatDate.jsx';
import VoucherStatus from './DotGiamGiaTrangThai.jsx';
import { listDotGiamGia, deletedDotGiamGia } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IconFilterFilled, IconList } from '@tabler/icons-react';
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
    navigate('/promotion/add');
    console.log('Thêm mới');
  };

  const handleViewUpdate = (id) => {
    navigate(`/promotion/update/${id}`);
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
      <div
        className="search-bar bg-white mb-3 p-4 rounded"
        style={{ border: '1px solid #d9d9d9', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', marginTop: '20px', }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <IconFilterFilled />
          <h4 style={{ marginLeft: '8px' }}>Bộ lọc</h4>
        </div>
        <Input.Group compact>
          {/* Dòng 1: Ô tìm kiếm */}
          <div
            style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '16px', }}
          >
            <div style={{ flex: '1 1 30%' }}>
              <span style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Tìm kiếm theo tên/mã/giá trị
              </span>
              <Input.Search
                placeholder="Nhập tên, mã hoặc giá trị giảm"
                allowClear
                style={{ width: '49%', borderRadius: '5px' }}
                enterButton={<SearchOutlined />}
                onSearch={(value) => setSearchValue(value.trim())}
              />
            </div>
          </div>

          {/* Dòng 2: Các ô khác */}
          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', }}
          >
            {/* Ngày bắt đầu */}
            <div style={{ flex: '1 1 20%' }}>
              <span style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Ngày bắt đầu</span>
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Chọn ngày bắt đầu"
                onChange={(date, dateString) => setStartDate(dateString)}
              />
            </div>

            {/* Ngày kết thúc */}
            <div style={{ flex: '1 1 20%' }}>
              <span style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Ngày kết thúc</span>
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Chọn ngày kết thúc"
                onChange={(date, dateString) => setEndDate(dateString)}
              />
            </div>

            {/* Trạng thái */}
            <div style={{ flex: '1 1 20%' }}>
              <span style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Trạng thái</span>
              <Select
                defaultValue="All"
                style={{ width: '100%', borderRadius: '5px' }}
                dropdownStyle={{ borderRadius: '10px' }}
                onChange={handleStatusChange}
              >
                <Option value="All">Tất cả</Option>
                <Option value="SAP_DIEN_RA">Sắp diễn ra</Option>
                <Option value="DANG_DIEN_RA">Đang diễn ra</Option>
                <Option value="DA_KET_THUC">Đã kết thúc</Option>
              </Select>
            </div>

            {/* Giá trị giảm */}
            <div style={{ flex: '1 1 20%' }}>
              <span style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Giá trị giảm</span>
              <Select
                defaultValue="All"
                style={{ width: '100%', borderRadius: '5px' }}
                dropdownStyle={{ borderRadius: '10px' }}
                onChange={handlePriceChange}
              >
                <Option value="All">Tất cả</Option>
                <Option value="1-20">1%-20%</Option>
                <Option value="20-40">20%-40%</Option>
                <Option value="40-50">40%-50%</Option>
              </Select>
            </div>
          </div>
        </Input.Group>
      </div>


      {/* Table with Title */}
      <Table
        title={() => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconList size={30} color="black" style={{ marginRight: '8px' }} />
              <h4 style={{ marginLeft: '8px', fontWeight: 'bold', fontSize: '18px' }}>
                Danh sách đợt giảm giá
              </h4>
            </div>
            <div
              style={{
                flex: '1', minWidth: '220px', display: 'flex', justifyContent: 'flex-end', // Đưa nút "Thêm mới" về bên phải
              }}
            >
              <Button
                type="primary"
                className="rounded"
                style={{
                  backgroundColor: '#5e35b1',
                  borderColor: '#5e35b1',
                  padding: '8px 16px',
                  borderRadius: '8px',
                }}
                onClick={handleAddNew}
              >
                Thêm mới
              </Button>
            </div>
          </div>
        )}

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