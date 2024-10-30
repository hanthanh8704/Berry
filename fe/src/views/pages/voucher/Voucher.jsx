import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Select, DatePicker, Pagination, Modal, Slider, Tooltip } from 'antd';
import { SearchOutlined, EditOutlined, ClockCircleOutlined } from '@ant-design/icons';
import * as request from "views/utilities/httpRequest";
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormatCurrency from "views/utilities/FormatCurrency";
import FormatCurrency1 from "views/utilities/FormatCurrency1";
import FormatDate from "views/utilities/FormatDate.jsx";

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
                giaDen,
            });
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, [searchValue, filterKieuGiam, filterLoai, filterTrangThai, pageSize, currentPage, selectedDates, giaTu, giaDen]);

    const loadVoucher = async () => {
        try {
            const response = await request.get('/voucher', {
                params: {
                    code: `%${searchValue}%` || null,
                    name: `%${searchValue}%` || null,
                    page: currentPage,
                    sizePage: pageSize,
                    discountMethod: filterKieuGiam !== 'All' ? filterKieuGiam : null,
                    type: filterLoai !== 'All' ? filterLoai : null,
                    status: filterTrangThai !== 'All' ? filterTrangThai : null,
                   
                    updatedBy: selectedDates?.fromDate,
                    createdBy: selectedDates?.toDate,
                    minOrderValue: giaTu || null,
                    discountValue: giaDen || null,
                },
            }).then(response => {
                setVoucher(response.data);
                setTotalPages(response.totalPages);
            })
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
          })
        } else {
          setSelectedDates(null);
        }
        console.log(selectedDates);
      }

    const handleStatusChange = (value) => {
        setFilterTrangThai(value);
        setCurrentPage(1);
    };

    const showDeleteConfirm = (item) => {
        confirm({
            title: "Xác nhận",
            content: "Bạn có chắc muốn kết thúc phiếu giảm giá này không?",
            okText: "Xác nhận",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                request
                    .put(`/voucher/update/end-date/${item.id}`)
                    .then((response) => {
                        if (response.status === 200) {
                            loadVoucher();
                            toast.success("Kết thúc thành công!");
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                        toast.error(e.response.data);
                    });
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá trị giảm',
            dataIndex: 'discountValue',
            key: 'discountValue',
            render: (text, record) => (
                <span>
                    <FormatCurrency1 value={record.discountValue} /> {record.discountMethod}
                </span>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Giá trị tối thiểu',
            dataIndex: 'minOrderValue',
            key: 'minOrderValue',
            render: (text) => <FormatCurrency value={text} />,
        },
        {
            title: 'Giá trị tối đa',
            dataIndex: 'maxDiscountValue',
            key: 'maxDiscountValue',
            render: (text) => <FormatCurrency value={text} />,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => <FormatDate date={text} />,
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => <FormatDate date={text} />,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <div style={{
                    width: '100px',
                    borderRadius: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2px',
                    color: 'white',
                    background: text === 'Sắp diễn ra' ? 'orange' : text === 'Đang diễn ra' ? 'green' : 'red'
                }}>
                    {text}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (x, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Update">
                        {/* <Button type="primary" icon={<EditOutlined />}> */}
                            <Link  to={`/api/voucher/${record.id}`} ><EditOutlined /></Link>
                        {/* </Button> */}
                    </Tooltip>
                    <Tooltip title="Stop">
                        <Button type="danger" icon={<ClockCircleOutlined />} onClick={() => showDeleteConfirm(record)} style={{ marginLeft: '10px' }} />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px' }}>
                <h4>Bộ lọc</h4>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Input
                        placeholder="Tìm kiếm đơn hàng..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        suffix={<SearchOutlined />}
                        style={{ width: '300px', marginRight: '20px' }}
                    />
                    <Select value={filterTrangThai} onChange={handleStatusChange} style={{ width: '200px', marginRight: '20px' }}>
                        <Option value="All">Tất cả</Option>
                        <Option value="Sắp diễn ra">Sắp diễn ra</Option>
                        <Option value="Đang diễn ra">Đang diễn ra</Option>
                        <Option value="Đã kết thúc">Đã kết thúc</Option>
                    </Select>
                    <Select value={filterKieuGiam} onChange={(value) => setFilterKieuGiam(value)} style={{ width: '200px', marginRight: '20px' }}>
                        <Option value="All">Tất cả</Option>
                        <Option value="%">%</Option>
                        <Option value="VNĐ">VNĐ</Option>
                    </Select>
                    <Select value={filterLoai} onChange={(value) => setFilterLoai(value)} style={{ width: '200px', marginRight: '20px' }}>
                        <Option value="All">Tất cả</Option>
                        <Option value="Cá nhân">Cá nhân</Option>
                        <Option value="Công khai">Công khai</Option>
                    </Select>
                </div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
    <RangePicker onChange={handleDateChange} style={{ marginRight: '10px' }} />
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <Input
            type="number"
            placeholder="Giá từ"
            value={giaTu}
            onChange={(e) => setGiaTu(e.target.value)}
            style={{ marginRight: '10px' }}
        />
        <span style={{ marginRight: '10px' }}>-</span>
        <Input
            type="number"
            placeholder="Giá đến"
            value={giaDen}
            onChange={(e) => setGiaDen(e.target.value)}
            style={{ marginRight: '20px' }}
        />
    </div>
                <Button type="primary">
                    <Link to={'/api/voucher/add'} style={{ color: 'white' }}>
                        Thêm
                    </Link>
                </Button>
</div>

            </div>
            <Table
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
                    }
                  }}
                  className="custom-table"
                />
            <ToastContainer />
        </div>
    );
};

export default Voucher;
