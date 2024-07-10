import React, { useState, useEffect } from "react";
import * as request from "views/utilities/httpRequest";
import FormatDate from "views/utilities/FormatDate";
import FormatCurrency from "views/utilities/FormatCurrency";
import { Badge, Button, DatePicker, Input, Table, Tabs, Tag, Tooltip, Select } from "antd";
import { Link } from "react-router-dom";
import { IconArrowsMove,IconEdit, IconPrinter, IconEye } from "@tabler/icons-react";
import "./bill.css"; // Import file CSS để tùy chỉnh màu sắc
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Bill = ({ onload }) => {
  const [listHoaDon, setListHoaDon] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [ma, setMa] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [trangThaiHoaDon, setTrangThaiHoaDon] = useState("");
  const [tabs, setTabs] = useState([]);
  const [billStatistics, setBillStatistics] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize, ma, trangThaiHoaDon, onload, selectedDates]);

  useEffect(() => {
    const statistics = calculateBillStatistics(listHoaDon);
    setBillStatistics(statistics);
  }, [listHoaDon]);

  const loadOrders = async () => {
    try {
      const params = {
        page: currentPage,
        sizePage: pageSize,
      };

      if (ma) params.ma = ma;
      if (trangThaiHoaDon) params.trangThaiHoaDon = trangThaiHoaDon;
      if (selectedDates?.fromDate) params.fromDate = selectedDates.fromDate;
      if (selectedDates?.toDate) params.toDate = selectedDates.toDate;

      const response = await request.get(`bill`, { params });
      console.log('Bill data:', response);
      setListHoaDon(response.data);
      setTotalPages(response.totalPages);
      
      // Calculate statistics from all pages
      const allData = await request.get('bill/all-data'); // Example endpoint to fetch all data
      const statistics = calculateBillStatistics(allData);
      setBillStatistics(statistics);
    } catch (error) {
      console.error("Lỗi", error);
    }

    try {
      const response = await request.get('/bill/statistic-bill-status');
      console.log('Statistic data:', response);
      setTabs(sortTabs(response));
    } catch (error) {
      console.error("Error fetching bill status:", error);
    }
  };

  const calculateBillStatistics = (bills) => {
    return bills.reduce((acc, bill) => {
      if (acc[bill.trangThaiHoaDon]) {
        acc[bill.trangThaiHoaDon]++;
      } else {
        acc[bill.trangThaiHoaDon] = 1;
      }
      return acc;
    }, {});
  };

  const sortTabs = (tabs) => {
    const order = ["Chờ xác nhận", "Chờ giao", "Hoàn thành", "Đã hủy", "Hoàn 1 phần"];
    return tabs.sort((a, b) => order.indexOf(a.trangThai) - order.indexOf(b.trangThai));
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setSelectedDates({
        fromDate: dates[0].format('DD-MM-YYYY'),
        toDate: dates[1].format('DD-MM-YYYY')
      });
      loadOrders(); // Gọi hàm loadOrders để tải lại dữ liệu ngay khi thay đổi khoảng thời gian
    } else {
      setSelectedDates({});
    }
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
      label: <Badge offset={[8, 0]} size="small">Tất cả</Badge>,
      children: <div></div>
    },
    ...(tabs.map(item => ({
      key: item.trangThai,
      label: (
        <span>
          {item.trangThai}
          <Badge count={billStatistics[item.trangThai] || 0} offset={[8, 0]} style={{ backgroundColor: '#fff', color: '#f5222d', marginLeft: '8px' }} />
        </span>
      ),
      children: <div></div>
    })) || []),
  ];

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      className: 'custom-column', // Thêm lớp CSS cho cột '#'
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
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
      dataIndex: 'tongTienSauGiamGia',
      key: 'tongTienSauGiamGia',
      render: (tongTienSauGiamGia, record) => (
        <span className="fw-semibold text-danger">
          <FormatCurrency value={tongTienSauGiamGia + (record.phiShip || 0)} />
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
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: (ngayTao) => <FormatDate date={ngayTao} />,
      // className: 'custom-title', // Thêm lớp CSS cho tiêu đề cột 'Ngày tạo'
    },
    {
      title: 'Loại đơn hàng',
      dataIndex: 'loaiHoaDon',
      key: 'loaiHoaDon',
      render: (loaiHoaDon) => (
        <Tag
          style={{ width: '100px' }}
          className="text-center"
          color={loaiHoaDon === "Tại Quầy" ? "#87d068" : loaiHoaDon === "Giao hàng" ? "#108ee9" : "#87df"}
          icon={loaiHoaDon === "Tại Quầy" ? <i className="fas fa-shop me-1"></i> : loaiHoaDon === "Giao hàng" ? <i className="fas fa-truck-fast me-1"></i> : <i className="fas fa-plus me-1"></i>}
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
              <Button type="text" icon={<IconEdit />} className="custom-button" /> {/* Thêm lớp CSS cho nút */}
            </Link>
          </Tooltip>
          {record.status !== "Tạo đơn hàng" && (
            <Tooltip title="In hóa đơn">
              <Link className="px-2" target="blank" to={`/export-pdf/${record.id}`}><IconPrinter /></Link>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
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
          onChange={(value) => setTrangThaiHoaDon(value)}
          value={trangThaiHoaDon}
        >
          <Option value="">Tất cả</Option>
          {tabs.map(item => (
            <Option key={item.trangThai} value={item.trangThai}>
              {item.trangThai} ({billStatistics[item.trangThai] || 0})
            </Option>
          ))}
        </Select>
        <RangePicker onChange={handleDateChange} style={{ marginRight: '10px' }} />
        <Button type="primary" onClick={handleSearch}>Tìm kiếm</Button>
      </div>
      <Tabs
        items={items}
        onChange={(key) => {
          setTrangThaiHoaDon(key);
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
          pageSizeOptions: [5, 10, 20, 50],
          showQuickJumper: false,
          total: totalPages * pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
        className="custom-table"
      />
    </div>
  );
};

export default Bill;


