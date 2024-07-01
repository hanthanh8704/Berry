import { Button, Col, DatePicker, Input, Radio, Row, Table, Typography, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormatDate from "views/utilities/FormatDate";
import * as request from "views/utilities/httpRequest";
import { IconEdit, IconPrinter } from "@tabler/icons-react";
const { Title } = Typography;
const { RangePicker } = DatePicker;

function Customer() {
  const [customerList, setCustomerList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [customerStatus, setCustomerStatus] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    request.get("/customer", {
      params: {
        name: searchValue,
        page: currentPage,
        sizePage: pageSize,
        status: customerStatus,
        startDate: dateRange.length === 2 ? dateRange[0].format("YYYY-MM-DD") : null,
        endDate: dateRange.length === 2 ? dateRange[1].format("YYYY-MM-DD") : null,
      },
    }).then(response => {
      setCustomerList(response.data);
      setTotalPages(response.totalPages);
    }).catch(e => {
      console.log(e);
    })
  }, [searchValue, pageSize, customerStatus, currentPage, dateRange]);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      className: "text-center",
      width: 50,
      render: (text, record, index) => index + 1
    },
    {
      title: 'Tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: (text) => <FormatDate date={text} />
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text) => (
        <span className={text === "Hủy kích hoạt" ? "fw-semibold text-danger" : "fw-semibold text-success"}>
          {text}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text, record) => (
        <Tooltip placement="top" title="Chỉnh sửa">
          <Link to={`/admin/customer/${record.id}`} className="btn btn-sm text-warning">
            <IconEdit/>
          </Link>
        </Tooltip>
      )
    },
  ];
  

  return (
    <>
      <Title level={4}>Danh sách khách hàng</Title>
      <Row gutter={10} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Input
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tìm kiếm khách hàng theo tên, email, sdt ..."
          />
        </Col>
        <Col span={8}>
          <Radio.Group
            defaultValue={null}
            onChange={(event) => setCustomerStatus(event.target.value)}
          >
            <Radio value={null}>Tất cả</Radio>
            <Radio value={false}>Kích hoạt</Radio>
            <Radio value={true}>Hủy kích hoạt</Radio>
          </Radio.Group>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Link to={"/admin/customer/add"}>
            <Button type="primary" className="bg-warning">
              <i className="fas fa-plus-circle me-1"></i>Thêm khách hàng
            </Button>
          </Link>
        </Col>
      </Row>

      <Row gutter={10} style={{ marginBottom: 20 }}>
        <Col span={16}>
          <RangePicker
            style={{ width: '100%' }}
            onChange={(dates) => setDateRange(dates)}
            placeholder={["Từ ngày", "Đến ngày"]}
          />
        </Col>
      </Row>

      <Table
        dataSource={customerList}
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
          },
        }}
      />
    </>
  );
}

export default Customer;
