import { Col, Input, Row, Table, Tooltip, Tag, Button, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as request from 'views/utilities/httpRequest';
import { IconEdit, IconPlus, IconFilterFilled, IconList } from '@tabler/icons-react';
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
    fetchStaffData(); // Gọi hàm để lấy dữ liệu
  }, [pageSize, filterTrangThai, currentPage]);

  // Hàm lấy dữ liệu nhân viên từ API
  const fetchStaffData = () => {
    request
      .get('/nhan-vien', {
        params: {
          code: `%${searchValue}%` || null,
          name: `%${searchValue}%` || null,
          nationalId: `%${searchValue}%` || null,
          phoneNumber: `%${searchValue}%` || null,
          email: `%${searchValue}%` || null,
          page: currentPage,
          sizePage: pageSize,
          status: filterTrangThai !== 'All' ? filterTrangThai : null,
        }
      })
      .then((response) => {
        setStaffList(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleStatusChange = (value) => {
    setFilterTrangThai(value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Đặt lại trang về 1 khi tìm kiếm
    fetchStaffData(); // Gọi lại hàm để tìm kiếm
  };

  const handleResetFilters = () => {
    setSearchValue('');
    setFilterTrangThai('All');
    setCurrentPage(1); // Đặt lại trang về 1 khi làm mới bộ lọc
    fetchStaffData(); // Gọi lại hàm để làm mới danh sách
  };

  const FormatDate = ({ date }) => {
    const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return <span>{formattedDate}</span>;
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
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'CCCD',
      dataIndex: 'nationalId',
      key: 'nationalId'
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (x) => <FormatDate date={x} />
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
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
                color: '#5e35b1',
                border: 'none'
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
    <Row
      gutter={16}
      style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
      }}
    >
      {/* Bộ lọc tìm kiếm */}
      <Col
        xs={24}
        style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid #d9d9d9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <IconFilterFilled />
          <h5 style={{ marginLeft: '8px' }}>Bộ lọc</h5>
        </div>

        <Row gutter={[16, 16]} justify="center">
          {/* Hàng chứa tiêu đề và ô input */}
          <Col xs={24} md={12} lg={7}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <label style={{ marginRight: '8px', marginBottom: '10px' }}>Tìm kiếm:</label>
              <Input
                placeholder="Tìm kiếm nhân viên theo tên, cccd, số điện thoại..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                suffix={<SearchOutlined />}
                style={{
                  borderRadius: '8px',
                  flex: 1, // Để ô input chiếm phần còn lại
                  marginBottom: '10px', // Khoảng cách dưới ô input
                }}
              />
            </div>
          </Col>

          {/* Hàng chứa tiêu đề và select */}
          <Col xs={24} md={6} lg={5}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <label style={{ marginRight: '8px' }}>Trạng thái:</label>
              <Select
                value={filterTrangThai}
                onChange={handleStatusChange}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  flex: 1,
                  // Khoảng cách giữa label và select
                }}
              >
                <Option value="All">Tất cả</Option>
                <Option value="Đang hoạt động">Đang hoạt động</Option>
                <Option value="Ngừng hoạt động">Ngừng hoạt động</Option>
              </Select>
            </div>
          </Col>

        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '10px', justifyContent: 'center' }}>
          {/* Các nút ở hàng dưới cùng */}
          <Col xs={24} md={6} lg={4} style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              onClick={handleSearch}
              style={{
                backgroundColor: '#4169E1',
                color: 'white',
                borderRadius: '8px',
                width: '100%',
              }}
            >
              Tìm kiếm
            </Button>
          </Col>

          <Col xs={24} md={6} lg={4} style={{ textAlign: 'center' }}>
            <Button
              onClick={handleResetFilters}
              style={{
                borderRadius: '8px',
                width: '100%',
                backgroundColor: '#d9d9d9',
              }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Col>


      {/* Bảng nhân viên */}
      <Col
        xs={24}
        style={{
          marginTop: '40px',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid #d9d9d9',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconList size={30} color="black" style={{ fontWeight: 'bold' }} />
            <h5 style={{ marginLeft: '8px', fontWeight: 'bold', fontSize: '18px' }}>Danh sách nhân viên</h5>
          </div>
          <Link to="/nhan-vien/add">
            <Button
              type="primary"
              style={{
                backgroundColor: '#5e35b1',
                color: 'white',
                borderRadius: '8px', width: '100%',
                marginTop: '10px',
              }}
            >
              <IconPlus /> Thêm nhân viên
            </Button>
          </Link>
        </div>

        <Table
          dataSource={staffList}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            current: currentPage,
            pageSize,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showQuickJumper: true,
            total: totalPages * pageSize,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
          rowKey="id"
          style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        />
      </Col>

      {/* Thông báo Toast */}
      <ToastContainer />
    </Row>
  );

}

export default Staff;
