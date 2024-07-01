import { Button, Col, Input, Radio, Row, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as request from "views/utilities/httpRequest";
import FormatDate from "views/utilities/FormatDate";
import FormatCurrency from "views/utilities/FormatCurrency";
import { IconEdit } from "@tabler/icons-react";

function Customer() {
  const [customerList, setCustomerList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [trangThai, setTrangThai] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    request
      .get("/khach-hang", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          status: trangThai,
        },
      })
      .then((response) => {
        setCustomerList(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [searchValue, pageSize, trangThai, currentPage]);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      className: "text-center",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten',
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
      render: (x) => <FormatDate date={x} />,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'deleted',
      key: 'deleted',
      render: (x) => (
        <span className={x ? "fw-semibold text-danger" : "fw-semibold text-success"}>
          {x ? "Hủy kích hoạt" : "Kích hoạt"}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      key: 'action',
      render: (x) => (
        <Tooltip placement="top" title="Chỉnh sửa">
          <Link to={`/admin/customer/${x}`} className="btn btn-sm text-warning">
            <i className="fas fa-edit"></i>
          </Link>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <h6>Danh sách khách hàng</h6>
      <Row gutter={10} className="mb-3">
        <Col span={10}>
          <label className="mb-1">Nhập tên, email, số điện thoại</label>
          <Input
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tìm kiếm khách hàng theo tên, email, sdt ..."
          />
        </Col>
        <Col span={10} className="text-nowrap">
          <div className="mb-1">Trạng thái</div>
          <Radio.Group
            defaultValue={null}
            className="align-middle"
            onChange={(event) => setTrangThai(event.target.value)}
          >
            <Radio value={null}>Tất cả</Radio>
            <Radio value={false}>Kích hoạt</Radio>
            <Radio value={true}>Hủy kích hoạt</Radio>
          </Radio.Group>
        </Col>
        <Col span={4}>
          <div className="mb-1">‍</div>
          <Link to={"/admin/customer/add"}>
            <Button type="primary" className="bg-warning">
              <IconEdit/>Thêm khách hàng
            </Button>
          </Link>
        </Col>
      </Row>

      <Table
        dataSource={customerList}
        columns={columns}
        className="mt-3"
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
    </div>
  );
}

export default Customer;
