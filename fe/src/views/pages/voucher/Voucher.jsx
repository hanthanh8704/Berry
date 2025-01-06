import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Select, DatePicker, Pagination, Modal, Slider, Tooltip } from 'antd';
import { SearchOutlined, EditOutlined, ClockCircleOutlined } from '@ant-design/icons';
import * as request from 'views/utilities/httpRequest';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormatCurrency from 'views/utilities/FormatCurrency';
import FormatCurrency1 from 'views/utilities/FormatCurrency1';
import FormatDate from 'views/utilities/FormatDate.jsx';
import VoucherStatus from '../promotion/DotGiamGiaTrangThai';
import VoucherType from './TypeVocher';
import { IconFilterFilled, IconList } from '@tabler/icons-react';
const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Voucher = () => {
  const [voucher, setVoucher] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchValue, setSearchValue] = useState('');
  const [filterKieuGiam, setFilterKieuGiam] = useState('All');
  const [filterLoai, setFilterLoai] = useState('All');
  const [filterTrangThai, setFilterTrangThai] = useState('All');
  const [giaTu, setGiaTu] = useState();
  const [selectedDates, setSelectedDates] = useState({});
  const [giaDen, setGiaDen] = useState();

  useEffect(() => {
    const successMessage = sessionStorage.getItem('voucherAddSuccess') || sessionStorage.getItem('voucherUpdateSuccess');
    if (successMessage) {
      toast.success(successMessage);
      sessionStorage.removeItem('voucherAddSuccess');
      sessionStorage.removeItem('voucherUpdateSuccess');
    }
    loadVoucher();
    const intervalId = setInterval(() => {
      loadVoucher({
        name: `%${searchValue}%`,
        code: `%${searchValue}%`,
        filterKieuGiam,
        filterLoai,
        filterTrangThai,
        selectedDates,
        giaTu,
        giaDen
      });
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [searchValue, filterKieuGiam, filterLoai, filterTrangThai, pageSize, currentPage, selectedDates, giaTu, giaDen]);

  const loadVoucher = async () => {
    try {
      const response = await request
        .get('/voucher', {
          params: {
            code: `%${searchValue}%` || null,
            name: `%${searchValue}%` || null,
            page: currentPage,
            sizePage: pageSize,
            discountMethod: filterKieuGiam !== 'All' ? filterKieuGiam : null,
            findType: filterLoai !== 'All' ? filterLoai : null,
            status: filterTrangThai !== 'All' ? filterTrangThai : null,

            updatedBy: selectedDates?.fromDate,
            createdBy: selectedDates?.toDate,
            minOrderValue: giaTu || null,
            discountValue: giaDen || null
          }
        })
        .then((response) => {
          setVoucher(response.data);
          setTotalPages(response.totalPages);
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChangePage = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
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

  const handleStatusChange = (value) => {
    setFilterTrangThai(value);
    setCurrentPage(1);
  };

  const showDeleteConfirm = (item) => {
    confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc muốn kết thúc phiếu giảm giá này không?',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        request
          .put(`/voucher/update/end-date/${item.id}`)
          .then((response) => {
            if (response.status === 200) {
              loadVoucher();
              toast.success('Kết thúc thành công!');
            }
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data);
          });
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index'
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
      title: 'Giá trị giảm',
      dataIndex: 'discountMethod', // Truyền đúng trường chứa phương thức giảm giá
      key: 'discountValue',
      render: (text, record) => (
        <span className="" style={{ display: 'flex' }}>
          <FormatCurrency1 value={record.discountValue} /> <VoucherType discountMethod={text} />
        </span>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        // Map giá trị số sang chuỗi tương ứng
        const statusTextMap = {
          CA_NHAN: 'Cá nhân',
          CONG_KHAI: 'Công khai'
        };
        return <div>{statusTextMap[text] || 'Không xác định'}</div>;
      }
    },
    {
      title: 'Giá trị tối thiểu',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      render: (text) => <FormatCurrency value={text} />
    },
    {
      title: 'Giá trị tối đa',
      dataIndex: 'maxDiscountValue',
      key: 'maxDiscountValue',
      render: (text) => <FormatCurrency value={text} />
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => <FormatDate date={text} />
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => <FormatDate date={text} />
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <VoucherStatus status={text} />
    },
    // {
    //     title: 'Trạng thái',
    //     dataIndex: 'status',
    //     key: 'status',
    //     render: (text) => {
    //         // Map giá trị số sang chuỗi tương ứng
    //         const statusTextMap = {
    //             'SAP_DIEN_RA': 'Sắp diễn ra',
    //             'DANG_DIEN_RA': 'Đang diễn ra',
    //             'DA_KET_THUC': 'Đã kết thúc'
    //         };

    //         // Map trạng thái sang màu sắc
    //         const statusColorMap = {
    //             'SAP_DIEN_RA': '#28a745', // Xanh lá
    //             'DANG_DIEN_RA': '#ff5722', // Cam
    //             'DA_KET_THUC': '#007bff'  // Xanh dương
    //         };

    //         return (
    //             <div style={{
    //                 width: '120px',
    //                 borderRadius: '15px',
    //                 textAlign: 'center',
    //                 padding: '5px 10px',
    //                 color: 'white',
    //                 fontWeight: 'bold',
    //                 backgroundColor: statusColorMap[text] || '#6c757d', // Mặc định màu xám
    //             }}>
    //                 {statusTextMap[text] || 'Không xác định'}
    //             </div>
    //         );
    //     }
    // },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (x, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Update">
            {/* <Button type="primary" icon={<EditOutlined />}> */}
            <Link to={`/voucher/${record.id}`}>
              <EditOutlined />
            </Link>
            {/* </Button> */}
          </Tooltip>
          <Tooltip title="Stop">
            <Button type="danger" icon={<ClockCircleOutlined />} onClick={() => showDeleteConfirm(record)} style={{ marginLeft: '10px' }} />
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <div style={{ marginTop: '20px' }}>
      <div
        style={{padding: '15px',backgroundColor: '#fff', borderRadius: '12px',border: '1px solid #e0e0e0',marginBottom: '20px',}}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <IconFilterFilled />
          <h4 style={{ marginLeft: '8px' }}>Bộ lọc</h4>
        </div>
        {/* Hàng đầu tiên */}
        <div
          style={{display: 'flex',flexWrap: 'wrap',justifyContent: 'space-between',gap: '20px',marginBottom: '15px',}}
        >
          <div style={{ flex: '1', minWidth: '220px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Tìm kiếm:</label>
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              suffix={<SearchOutlined />}
              style={{width: '100%',padding: '8px 12px',borderRadius: '8px',border: '1px solid #ccc',boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',}}
            />
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Trạng thái:</label>
            <Select
              value={filterTrangThai}
              onChange={handleStatusChange}
              style={{width: '100%',borderRadius: '8px',boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', }}
            >
              <Option value="All">Tất cả</Option>
              <Option value="SAP_DIEN_RA">Sắp diễn ra</Option>
              <Option value="DANG_DIEN_RA">Đang diễn ra</Option>
              <Option value="DA_KET_THUC">Đã kết thúc</Option>
            </Select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Kiểu giảm:</label>
            <Select
              value={filterKieuGiam}
              onChange={(value) => setFilterKieuGiam(value)}
              style={{width: '100%',borderRadius: '8px',boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', }}
            >
              <Option value="All">Tất cả</Option>
              <Option value="PHAN_TRAM">%</Option>
              <Option value="CO_DINH">VNĐ</Option>
            </Select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Loại:</label>
            <Select
              value={filterLoai}
              onChange={(value) => setFilterLoai(value)}
              style={{width: '100%',borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',}}
            >
              <Option value="All">Tất cả</Option>
              <Option value="CA_NHAN">Cá nhân</Option>
              <Option value="CONG_KHAI">Công khai</Option>
            </Select>
          </div>
        </div>

        {/* Hàng thứ hai */}
        <div
          style={{display: 'flex',alignItems: 'center',justifyContent: 'space-between',flexWrap: 'wrap',gap: '20px',marginBottom: '15px',}}
        >
          {/* Khoảng giá */}
          <div
            style={{flex: '1',minWidth: '220px',}}
          >
            <label
              style={{fontWeight: 'bold',display: 'block',marginBottom: '5px',}} >
              Khoảng giá:
            </label>
            <div
              style={{display: 'flex', alignItems: 'center', gap: '10px',}}
            >
              <Input
                type="number"
                placeholder="Giá từ"
                value={giaTu}
                onChange={(e) => setGiaTu(e.target.value)}
                style={{width: 'calc(70% - 15px)', borderRadius: '8px',boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Giá đến"
                value={giaDen}
                onChange={(e) => setGiaDen(e.target.value)}
                style={{width: 'calc(70% - 15px)',borderRadius: '8px',boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
          </div>

          {/* Khoảng thời gian */}
          <div
            style={{flex: '1', minWidth: '220px',
            }}
          >
            <label
              style={{fontWeight: 'bold',display: 'block',marginBottom: '5px',
              }}
            >
              Khoảng thời gian:
            </label>
            <RangePicker
              onChange={handleDateChange}
              style={{ width: '100%', borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
        </div>

      </div>



      {/* Bảng dữ liệu */}
      <Table
       title={() => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconList size={30} color="black" style={{ marginRight: '8px' }} />
            <h4 style={{ marginLeft: '8px', fontWeight: 'bold', fontSize: '18px' }}>
              Danh sách Phiếu giảm giá
            </h4>
          </div>
          <div
            style={{ flex: '1', minWidth: '220px', display: 'flex',  justifyContent: 'right',}}
          >
            <Button
              type="primary"
              style={{ backgroundColor: '#5e35b1', borderColor: '#5e35b1',   padding: '8px 16px', borderRadius: '8px', }}
            >
              <Link to={'/voucher/add'} style={{ color: 'white', textDecoration: 'none' }}>
                Thêm phiếu giảm giá
              </Link>
            </Button>
          </div>
        </div>
      )}
      
        columns={columns}
        dataSource={voucher}
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
      <ToastContainer />
    </div>
  );

};

export default Voucher;
