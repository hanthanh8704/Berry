import React, { useState, useEffect } from "react";
import * as request from "views/utilities/httpRequest";
import FormatDate from "views/utilities/FormatDate";
import FormatCurrency from "views/utilities/FormatCurrency";
import { Badge, Button, DatePicker, Input, Table, Tabs, Tag, Tooltip, Select } from "antd";
import { Link } from "react-router-dom";
import { IconBrandOpenai } from "@tabler/icons-react";
import "./bill.css"; // Import file CSS để tùy chỉnh màu sắc

const { RangePicker } = DatePicker;
const { Option } = Select;

const Bill = ({ onload }) => {
  const [listHoaDon, setListHoaDon] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [status, setStatus] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [activeTab, setActiveTab] = useState(""); 

  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize, searchValue, status, onload, selectedDates]);

  const loadOrders = async () => {
    try {
      const response = await request.get(`bill`, {
        params: {
          page: currentPage,
          sizePage: pageSize,
          status: status,
          code: searchValue,
          fromDate: selectedDates?.fromDate,
          toDate: selectedDates?.toDate,
        }
      });
      console.log('Bill data:', response);
      setListHoaDon(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Lỗi", error);
    }

    try {
      const response = await request.get('/bill/statistic-bill-status');
      console.log('Statistic data:', response);
      setTabs(response);
    } catch (error) {
      console.error("Error fetching bill status:", error);
    }
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setSelectedDates({
        fromDate: dates[0].format('YYYY-MM-DD'),
        toDate: dates[1].format('YYYY-MM-DD')
      });
    } else {
      setSelectedDates({});
    }
  };

  const handleSearch = () => {
    loadOrders();
  };

  const items = [
    {
      key: '',
      label: <Badge offset={[8, 0]} size="small">Tất cả</Badge>,
      children: <div></div>
    },
    ...(tabs.map(item => ({
      key: item.trangThai,
      label: <Badge count={item.totalCount} offset={[8, 0]} size="small">{item.trangThai}</Badge>,
      children: <div></div>
    })) || []), // Sử dụng [] nếu tabs không có dữ liệu
  ];

  const columns = [
    {
      title: '#',
      dataIndex: 'integer',
      key: 'integer',
      className: 'custom-column', // Thêm lớp CSS cho cột '#'
    },
    {
      title: 'Mã',
      dataIndex: 'ma',
      key: 'ma',
      className: 'custom-column', // Thêm lớp CSS cho cột 'Mã'
    },
    {
      title: 'Khách hàng',
      dataIndex: 'khachHang',
      key: 'khachHang',
      render: (text) => text || "Khách hàng lẻ",
      className: 'custom-column', // Thêm lớp CSS cho cột 'Khách hàng'
    },
    {
      title: 'Nhân viên',
      dataIndex: 'nhanVien',
      key: 'nhanVien',
      render: (text) => text ? text : "Chưa có",
    },
    {
      title: 'SDT',
      dataIndex: 'soDienThoaiNguoiNhan',
      key: 'soDienThoaiNguoiNhan',
      render: (text) => text || '-',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (tongTien, record) => (
        <span className="fw-semibold text-danger">
          <FormatCurrency value={tongTien + (record.phiShip || 0)} />
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThaiHoaDon',
      key: 'trangThaiHoaDon',
      render: (text) => text || 'null',
    },
    {
      title: 'Loại đơn hàng',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag
          style={{ width: '100px' }}
          className="text-center"
          color={type === "Tại quầy" ? "#87d068" : type === "Giao hàng" ? "#108ee9" : "#87df"}
          icon={type === "Tại quầy" ? <i className="fas fa-shop me-1"></i> : type === "Giao hàng" ? <i className="fas fa-truck-fast me-1"></i> : <i className="fas fa-plus me-1"></i>}
        >
          {type === "Tại quầy" ? "Tại quầy" : type === "Giao hàng" ? "Giao hàng" : "Đơn mới"}
        </Tag>
      )
    },
    // {
    //   title: 'Ngày tạo',
    //   dataIndex: 'ngayTao',
    //   key: 'ngayTao',
    //   render: (ngayTao) => <FormatDate date={ngayTao} />,
    //   className: 'custom-title', // Thêm lớp CSS cho tiêu đề cột 'Ngày tạo'
    // },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'action',
      render: (id, record) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Link to={`/admin/bill/${id}`}>
              <Button type="text" icon={<IconBrandOpenai />} className="custom-button" /> {/* Thêm lớp CSS cho nút */}
            </Link>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div className="custom-table">
      {/* Bộ lọc */}
      <div className="d-flex mb-4 flex-wrap align-items-center">
        <Input
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Tìm kiếm theo mã hóa đơn"
          style={{ width: '400px', marginRight: '10px' }}
        />
        <Select
          placeholder="Chọn trạng thái"
          style={{ width: '300px', marginRight: '10px' }}
          onChange={(value) => setStatus(value)}
          value={status}
        >
          <Option value="">Tất cả</Option>
          {tabs.map(item => (
            <Option key={item.trangThai} value={item.trangThai}>{item.trangThai}</Option>
          ))}
        </Select>
        <RangePicker onChange={handleDateChange} style={{ marginRight: '10px' }} />
        <Button type="primary" onClick={handleSearch}>
          Tìm
        </Button>
      </div>
      <Tabs
        defaultActiveKey=""
        tabBarGutter={74}
        items={items}
        onChange={(key) => {
          setStatus(key);
          setActiveTab(key); 
          loadOrders(); // Load lại dữ liệu khi tab thay đổi
        }}
        activeKey={activeTab} // Chỉ định tab đang hoạt động
      />
      <Table
        dataSource={listHoaDon}
        columns={columns}
        pagination={{
          showSizeChanger: true,
          current: currentPage,
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showQuickJumper: false,
          showTotal: total => `Tổng ${total} mục`,
          total: totalPages * pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
        className="custom-table" // Thêm lớp CSS cho bảng
      />
    </div>
  );
};

export default Bill;
