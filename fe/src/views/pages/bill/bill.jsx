import React, { useState, useEffect } from 'react';
import * as request from 'views/utilities/httpRequest';
import FormatDate from 'views/utilities/FormatDate';
import FormatCurrency from 'views/utilities/FormatCurrency';
import { Badge, Button, DatePicker, Input, Table, Tabs, Tag, Tooltip, Select } from 'antd';
import { Link } from 'react-router-dom';
import { IconArrowsMove, IconEdit, IconPrinter, IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { Switch } from 'antd';
import { FaRegFileAlt, FaTruck, FaTruckLoading } from 'react-icons/fa'; // FontAwesome icons
import { GiConfirmed } from 'react-icons/gi'; // Game Icons
import { MdOutlineConfirmationNumber, MdPayment, MdOutlineCancelPresentation, MdOutlineChangeCircle, MdCancel, MdOutlineReplayCircleFilled } from 'react-icons/md'; // Material Design icons
import { toast } from 'react-toastify';

const listStatus = [
  { id: 0, name: "Tạo hóa đơn", status: "TAO_HOA_DON", color: "#007BFF", title: "Tạo hóa đơn", icon: FaRegFileAlt }, // Xanh dương nhạt (thông tin)
  { id: 1, name: "Chờ xác nhận", status: "CHO_XAC_NHAN", color: "#FFC107", title: "Chờ xác nhận", icon: FaRegFileAlt }, // Vàng (cảnh báo)
  { id: 2, name: "Xác nhận", status: "XAC_NHAN", color: "#17A2B8", title: "Xác nhận", icon: MdOutlineConfirmationNumber }, // Xanh dương lục (hành động)
  { id: 3, name: "Chờ vận chuyển", status: "CHO_VAN_CHUYEN", color: "#FD7E14", title: "Chờ vận chuyển", icon: MdPayment }, // Cam (tiến trình)
  { id: 4, name: "Vận chuyển", status: "VAN_CHUYEN", color: "#28A745", title: "Vận chuyển", icon: FaTruck }, // Xanh lá (thành công)
  { id: 5, name: "Đã thanh toán", status: "DA_THANH_TOAN", color: "#20C997", title: "Đã thanh toán", icon: FaTruckLoading }, // Xanh lục sáng (hoàn thành)
  { id: 6, name: "Thành công", status: "THANH_CONG", color: "#218838", title: "Thành công", icon: GiConfirmed }, // Xanh lá đậm (hoàn tất)
  { id: 7, name: "Đã hủy", status: "DA_HUY", color: "#DC3545", title: "Đã hủy", icon: MdOutlineCancelPresentation }, // Đỏ (hủy)
  { id: 10, name: "Trả hàng", status: "TRA_HANG", color: "#138496", title: "Trả hàng", icon: MdOutlineChangeCircle }, // Xanh dương đậm (xử lý)
  { id: 8, name: "Yêu cầu hủy", status: "YEU_CAU_HUY", color: "#FF4500", title: "Yêu cầu hủy", icon: MdCancel }, // Đỏ cam (yêu cầu)
  { id: 9, name: "Thay đổi", status: "THAY_DOI", color: "#6A5ACD", title: "Thay đổi", icon: MdOutlineReplayCircleFilled } // Tím xanh (đặt lại)
];



const listStatusType = [
  { name: "Trực tuyến", status: "TRUC_TUYEN" },
  { name: "Tại quầy", status: "TAI_QUAY" },
  { name: "Giao hàng", status: "GIAO_HANG" },
]

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

  // Nút ấn hiển thị cho đơn hàng yêu cầu hủy 
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = (checked) => {
    setIsChecked(checked); // Cập nhật trạng thái Switch
  };

  useEffect(() => {
    if (isChecked) {
      // Nếu Switch bật, tải danh sách yêu cầu hủy
      GetAllDonYeuCauHuy();
    } else {
      // Nếu Switch tắt, tải danh sách mặc định
      loadOrders();
    }
  }, [isChecked, currentPage, pageSize, ma, trangThaiHoaDon, selectedDates]); // Bổ sung các phụ thuộc cần thiết

  // Hàm load danh sách yêu cầu hủy
  const GetAllDonYeuCauHuy = async () => {
    try {
      const response = await request.get(`bill/request-cancel-bill`, {
        params: {
          page: currentPage,
          sizePage: pageSize,
          code: ma ? `%${ma}%` : null,
          recipientPhone: ma ? `%${ma}%` : null,
          invoiceStatus: trangThaiHoaDon || null,
          fromDate: selectedDates?.fromDate || null,
          toDate: selectedDates?.toDate || null,
        },
      });
      console.log('Danh sách yêu cầu hủy:', response.data);
      setListHoaDon(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Lỗi khi tải danh sách yêu cầu hủy:', error);
    }
  };

  // useEffect(() => {
  //   // Kiểm tra nếu listHoaDon có dữ liệu và là một mảng
  //   listHoaDon.forEach(bill => {
  //     if (bill.invoiceStatus === 9) {
  //       toast.success(`Đơn hàng ${bill.code} đang yêu cầu hủy!`);
  //     }
  //   });
  // }, [listHoaDon]); // Thêm phụ thuộc vào listHoaDon


  // Hàm load danh sách hóa đơn
  const loadOrders = async () => {
    try {
      const response = await request.get(`bill`, {
        params: {
          page: currentPage,
          sizePage: pageSize,
          code: `%${ma}%` || null,
          recipientPhone: `%${ma}%` || null,
          invoiceStatus: trangThaiHoaDon !== '' ? trangThaiHoaDon : null,
          fromDate: selectedDates?.fromDate,
          toDate: selectedDates?.toDate
        }
      });
      console.log('Bill data ddddddddddddddd:', response);

      // Xử lý phản hồi của API hóa đơn


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
        <Badge offset={[12, 0]} size="small">
          Tất cả
        </Badge>
      )
    },
    ...tabs.map((item) => ({
      key: item.invoiceStatus,
      label: (
        <Badge count={item.totalCount} offset={[12, 0]} size="small">
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
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Khách hàng',
      dataIndex: 'nameCustomer',
      key: 'nameCustomer',
      render: (text) => text || 'Khách hàng lẻ'
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee',
      key: 'employee',
      render: (text) => (text ? text : 'Chưa có')
    },
    {
      title: 'SDT',
      dataIndex: 'recipientPhone',
      key: 'recipientPhone',
      render: (text, record) => {
        const soDienThoai = record.recipientPhone || record.soDienThoai;
        return soDienThoai || '-';
      }
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (totalMoney, record) => (
        <span className="fw-semibold text-danger">
          <FormatCurrency value={totalMoney + (record.shippingFee || 0)} />
        </span>
      )
    },

    {
      title: 'Trạng thái',
      dataIndex: 'invoiceStatus',
      key: 'invoiceStatus',
      render: (invoiceStatus) => {
        const statusItem = listStatus.find((status) => status.id === invoiceStatus);

        if (statusItem) {
          return (
            <Tag
              style={{ width: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              color={
                statusItem.id === 0
                  ? '#007BFF'
                  : statusItem.id === 1
                    ? '#FFC107'
                    : statusItem.id === 2
                      ? '#17A2B8'
                      : statusItem.id === 3
                        ? '#FD7E14'
                        : statusItem.id === 4
                          ? '#28A745'
                          : statusItem.id === 5
                            ? '#20C997'
                            : statusItem.id === 6
                              ? '#28A745'
                              : statusItem.id === 7
                                ? '#DC3545'
                                : statusItem.id === 8
                                  ? '#17A2B8'
                                  : statusItem.id === 9
                                    ? '#FF6347'
                                    : statusItem.id === 10
                                      ? '#6A5ACD'
                                      : '#636e72'
              }
            >
              {statusItem.icon} {/* Hiển thị icon */}
              <span style={{ marginLeft: '5px' }}>{statusItem.name}</span> {/* Hiển thị tên trạng thái */}
            </Tag>
          );
        }

        // Trường hợp không tìm thấy status
        return <Tag color="#636e72">Không xác định</Tag>;
      }
    },


    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => <FormatDate date={createdAt} />
    },

    {
      title: 'Loại đơn hàng',
      dataIndex: 'invoiceType',
      key: 'invoiceType',
      render: (invoiceType) => {
        // Tìm đối tượng trong listStatusType dựa trên giá trị invoiceType
        const typeItem = listStatusType.find((type) => type.status === invoiceType);

        if (typeItem) {
          return (
            <Tag
              style={{ width: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              color={
                invoiceType === 'TAI_QUAY'
                  ? '#87d068'
                  : invoiceType === 'TRUC_TUYEN'
                    ? '#108ee9'
                    : invoiceType === 'GIAO_HANG'
                      ? '#9b59b6'
                      : '#636e72'
              }
            >
              {invoiceType === 'TAI_QUAY' ? (
                <i className="fas fa-store me-1"></i> // Icon cho Tại quầy
              ) : invoiceType === 'TRUC_TUYEN' ? (
                <i className="fas fa-globe me-1"></i> // Icon cho Trực tuyến
              ) : invoiceType === 'GIAO_HANG' ? (
                <i className="fas fa-shipping-fast me-1"></i> // Icon cho Giao hàng
              ) : (
                <i className="fas fa-question-circle me-1"></i> // Icon mặc định
              )}
              <span style={{ marginLeft: '5px' }}>{typeItem.name}</span>
            </Tag>

          );
        }

        // Trường hợp không tìm thấy loại đơn hàng
        return <Tag color="#636e72">Không xác định</Tag>;
      }
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
              <Link className="px-2" target="blank" to={`/bill/create/${record.id}`}>
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
          onChange={(value) => setTrangThaiHoaDon(value)} // Không cần e.target.value, value đủ rồi
          value={trangThaiHoaDon}
        >
          <Option value="">Tất cả</Option>
          {listStatus.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name} ({tabs.find((tab) => tab.invoiceStatus === item.id)?.totalCount || 0})
            </Option>
          ))}
        </Select>

        <RangePicker onChange={handleDateChange} style={{ marginRight: '10px' }} />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>

      {/* Tabs Section */}


      {/* Switch Section */}
      <div className="d-flex justify-content-between align-items-center my-4">
        <h4 className="m-0">Danh sách hóa đơn</h4>
        <Switch
          checked={isChecked}
          onChange={handleToggle}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
        />
      </div>
      <Tabs
        defaultActiveKey={1}
        items={items}
        tabBarGutter={45}
        onChange={(key) => {
          setTrangThaiHoaDon(key);

        }}
      />
      {/* Table Section */}
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
