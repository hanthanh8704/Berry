import React, { useState, useEffect } from 'react';
import * as request from 'views/utilities/httpRequest';
import FormatDate from 'views/utilities/FormatDate';
import FormatCurrency from 'views/utilities/FormatCurrency';
import { Badge, Button, DatePicker, Input, Table, Tabs, Tag, Tooltip, Select } from 'antd';
import { Link } from 'react-router-dom';
import { IconArrowsMove, IconEdit, IconPrinter, IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
const { RangePicker } = DatePicker;
const { Option } = Select;

const Bill = ({ onload }) => {
  const [listHoaDon, setListHoaDon] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [ma, setMa] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [trangThaiHoaDon, setTrangThaiHoaDon] = useState('');
  const [tabs, setTabs] = useState([]);

  const [selectedDates, setSelectedDates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize, ma, trangThaiHoaDon, fromDate, toDate, onload, selectedDates]);

  // Hàm load danh sách hóa đơn
  const loadOrders = async () => {
    try {
      const response = await request.get(`bill`, {
        params: {
          page: currentPage,
          sizePage: pageSize,
          ma: `%${ma}%` || null,
          soDienThoaiNguoiNhan: `%${ma}%` || null,
          trangThaiHoaDon: trangThaiHoaDon !== '' ? trangThaiHoaDon : null,
          fromDate: selectedDates?.fromDate,
          toDate: selectedDates?.toDate
        }
      });
      console.log('Bill data:', response);
      setListHoaDon(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Lỗi', error);
    }

    try {
      const response = await request.get('/bill/statistic-bill-status');
      setTabs(response);
      console.log('Statistic data:', response);
    } catch (error) {
      console.error('Error fetching bill status:', error);
    }
  };

  const handleDateChange = (dates) => {
    if (dates !== null) {
      setSelectedDates({
        fromDate: dates[0].format('YYYY-MM-DD'),
        toDate: dates[1].format('YYYY-MM-DD')
      });
    } else {
      setSelectedDates(null);
    }
    console.log(selectedDates);
  };

  const handleSearch = () => {
    loadOrders();
  };

  const handleDetail = (id) => {
    navigate(`/bill-detail/${id}`);
  };

  const items = [
    {
      key: '',
      label: (
        <Badge offset={[8, 0]} size="small">
          Tất cả
        </Badge>
      )
    },
    ...tabs.map((item) => ({
      key: item.trangThai,
      label: (
        <Badge count={item.totalCount} offset={[8, 0]} size="small">
          {item.statusName}
        </Badge>
      )
    }))
  ];

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: 'Mã',
      dataIndex: 'ma',
      key: 'ma'
    },
    {
      title: 'Khách hàng',
      dataIndex: 'khachHang',
      key: 'khachHang',
      render: (text) => text || 'Khách hàng lẻ'
    },
    {
      title: 'Nhân viên',
      dataIndex: 'nhanVien',
      key: 'nhanVien',
      render: (text) => (text ? text : 'Chưa có')
    },
    {
      title: 'SDT',
      dataIndex: 'soDienThoaiNguoiNhan',
      key: 'soDienThoaiNguoiNhan',
      render: (text) => text || '-'
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongTienSauGiamGia',
      key: 'tongTienSauGiamGia',
      render: (tongTienSauGiamGia, record) => (
        <span className="fw-semibold text-danger">
          <FormatCurrency value={tongTienSauGiamGia + (record.phiShip || 0)} />
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThaiHoaDon',
      key: 'trangThaiHoaDon',
      render: (text) => (
        <Tag
          style={{ width: '100px' }}
          className="text-center"
          color={
            text === 'Hoàn thành'
              ? '#87d068'
              : text === 'Chờ xác nhận'
                ? '#ffce31'
                : text === 'Đã giao hàng'
                  ? '#108ee9'
                  : text === 'Chờ giao hàng'
                    ? '#6c5ce7'
                    : text === 'Đã thanh toán'
                      ? '#2ed573'
                      : text === 'Chờ giao'
                        ? '#487eb0'
                        : text === 'Đang vận chuyển'
                          ? '#f6b93b'
                          : text === 'Đã hủy'
                            ? '#f50'
                            : '#636e72'
          }
        >
          {text}
        </Tag>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: (ngayTao) => <FormatDate date={ngayTao} />
    },
    {
      title: 'Loại đơn hàng',
      dataIndex: 'loaiHoaDon',
      key: 'loaiHoaDon',
      render: (loaiHoaDon) => (
        <Tag
          style={{ width: '100px' }}
          className="text-center"
          color={loaiHoaDon === 'Tại Quầy' ? '#87d068' : loaiHoaDon === 'Giao hàng' ? '#108ee9' : '#87df'}
          icon={
            loaiHoaDon === 'Tại Quầy' ? (
              <i className="fas fa-shop me-1"></i>
            ) : loaiHoaDon === 'Giao hàng' ? (
              <i className="fas fa-truck-fast me-1"></i>
            ) : (
              <i className="fas fa-plus me-1"></i>
            )
          }
        >
          {loaiHoaDon}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'action',
      render: (id, record) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Link to={`/bill/${id}`}>
              <Button type="text" icon={<IconEdit />} className="custom-button" />
            </Link>
          </Tooltip>
          {record.status !== 'Tạo đơn hàng' && (
            <Tooltip title="In hóa đơn">
              <Link className="px-2" target="blank" to={`/export-pdf/${record.id}`}>
                <IconPrinter />
              </Link>
            </Tooltip>
          )}
        </>
      )
    }
  ];

  return (
    <div className="bg-white p-4 rounded-3">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <Input
          style={{ width: '300px', marginRight: '10px' }}
          placeholder="Tìm kiếm theo mã"
          value={ma}
          onChange={(e) => setMa(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Select
          placeholder="Chọn trạng thái"
          style={{ width: '300px', marginRight: '10px' }}
          onChange={(e) => setTrangThaiHoaDon(e.target.value)}
          value={trangThaiHoaDon}
        >
          <Option value="">Tất cả</Option>
          {tabs.map((item) => (
            <Option key={item.trangThai} value={item.trangThai}>
              {item.trangThai} ({[item.totalCount] || 0})
            </Option>
          ))}
        </Select>
        <RangePicker onChange={handleDateChange} style={{ marginRight: '10px' }} />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>
      <Tabs
        defaultActiveKey={1}
        items={items}
        tabBarGutter={45}
        onChange={(key) => {
          setTrangThaiHoaDon(key);
        }}
      />
      <Table
        dataSource={listHoaDon}
        columns={columns}
        pagination={{
          showSizeChanger: true,
          current: currentPage,
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50],
          showQuickJumper: false,
          total: totalPages * pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }
        }}
        className="custom-table"
      />
    </div>
  );
};

export default Bill;
