import { Col, Input, Row, Table, Tooltip, Tag, Button, Form, Select, InputNumber, DatePicker, Radio, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as request from 'views/utilities/httpRequest';
import { IconEdit, IconPlus } from '@tabler/icons-react';
const { Option } = Select;

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [filterTrangThai, setFilterTrangThai] = useState('All');

  useEffect(() => {
    const successMessage = sessionStorage.getItem('employeeAddSuccess') || sessionStorage.getItem('employeeUpdateSuccess');
    if (successMessage) {
      toast.success(successMessage);
      sessionStorage.removeItem('employeeAddSuccess');
      sessionStorage.removeItem('employeeUpdateSuccess');
    }
    request
      .get('/nhan-vien', {
        params: {
          ma: `%${searchValue}%` || null,
          ten: `%${searchValue}%` || null,
          cccd: `%${searchValue}%` || null,
          soDienThoai: `%${searchValue}%` || null,
          email: `%${searchValue}%` || null,
          page: currentPage,
          sizePage: pageSize,
          trangThai: filterTrangThai !== 'All' ? filterTrangThai : null
        }
      })
      .then((response) => {
        setStaffList(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [searchValue, pageSize, filterTrangThai, currentPage]);

  const handleStatusChange = (value) => {
    setFilterTrangThai(value);
    setCurrentPage(1);
  };

  const FormatDate = ({ date }) => {
    const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return <span>{formattedDate}</span>;
  };

  const renderTrangThai = (trangThai) => {
    const style = {
      width: '150px',
      borderRadius: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2px',
      border: '2px solid',
      color: 'white',
      backgroundColor: trangThai === 'Ngừng hoạt động' ? '#e84118' : trangThai === 'Đang hoạt động' ? '#4cd137' : '#4cd137'
    };

    return <div style={style}>{trangThai}</div>;
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'integer',
      key: 'integer',
      className: 'text-center'
    },
    {
      title: 'Mã',
      dataIndex: 'ma',
      key: 'ma'
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten'
    },
    {
      title: 'CCCD',
      dataIndex: 'cccd',
      key: 'cccd'
    },
    {
      title: 'SĐT',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      render: (x) => <FormatDate date={x} />
    },
    {
      title: 'Chức vụ',
      dataIndex: 'chucVu',
      key: 'chucVu'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text) => (
        <Tag
          style={{ width: '120px' }}
          className="text-center"
          color={text === 'Đang hoạt động' ? '#2ed573' : text === 'Ngừng hoạt động' ? '#f50' : '#636e72'}
        >
          {text}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      key: 'action',
      render: (id) => (
        <>
          <Tooltip placement="top" title="Chỉnh sửa">
            <Link
              to={'/nhan-vien/' + id}
              style={{
                color: '#5e35b1' /* Màu chữ trắng */,
                border: 'none' /* Loại bỏ viền */
              }}
            >
              <IconEdit />
            </Link>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <Row gutter={16}>
      {/* Search Bar */}
      <Col xs={24} md={16}>
        <Input placeholder="Tìm kiếm khách hàng theo tên, email, số điện thoại ..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} suffix={<SearchOutlined />} />
      </Col>

      {/* Filter by Status */}
      <Col xs={24} md={4}>
        <Select value={filterTrangThai} onChange={handleStatusChange} style={{ width: '100%' }}>
          <Option value="All">Tất cả</Option>
          <Option value="Đang hoạt động">Đang hoạt động</Option>
          <Option value="Ngừng hoạt động">Ngừng hoạt động</Option>
        </Select>
      </Col>

      <Col xs={24} md={4}>
        <Link to={'/nhan-vien/add'}>
          <Button
            type="primary"
            style={{
              backgroundColor: '#5e35b1' /* Màu nền tím */,
              color: 'white' /* Màu chữ trắng */
            }}
          >
            <IconPlus />
            Thêm nhân viên
          </Button>
        </Link>
      </Col>

      <Col xs={24}>
        <Table
          dataSource={staffList}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            current: currentPage,
            pageSize: pageSize,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showQuickJumper: true,
            total: totalPages * pageSize,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            }
          }}
          rowKey="id"
          style={{ marginTop: '20px' }}
        />
      </Col>
      <ToastContainer />
    </Row>
  );
}

export default Staff;
