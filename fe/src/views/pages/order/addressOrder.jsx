import { Modal, Button, Col, Row, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import DetailAddress from 'components/Customer/DetailAddress';
import * as request from 'views/utilities/httpRequest';
import CreateAddressModal from 'components/Customer/CreateAddressCustomerDetail';
import { IconCheck, IconX } from '@tabler/icons-react';
function AddressOrders(idKhachHang, onSuccess) {
  const [addressList, setAddressList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    loadAddress(idKhachHang, currentPage, pageSize);
  }, [idKhachHang, currentPage, pageSize]);

  const loadAddress = (idKhachHang, currentPage, pageSize) => {
    request
      .get(`/address/${idKhachHang}`, {
        params: {
          page: currentPage,
          sizePage: pageSize,
          status: false
        }
      })
      .then((response) => {
        setAddressList(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'indexs',
      key: 'indexs',
      className: 'text-center'
    },
    {
      title: 'Tên người nhận',
      dataIndex: 'fullName',
      key: 'fullName',
      className: 'text-center'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      className: 'text-center'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChiRequest',
      key: 'diaChiRequest',
      className: 'text-center',
      render: (x, item) => (
        <>
          {item.detailedAddress}
          {', '}
          <DetailAddress city={item.city} district={item.district} ward={item.ward} />
        </>
      )
    },
    {
      title: 'Mặc định',
      key: 'defaultAddress',
      className: 'text-center',
      render: (x, item) => 
      <>{
        item.defaultAddress ? 
        <IconCheck className="text-success" /> 
        : <IconX className="text-danger" />
        }</>
    },
    {
      title: 'Action',
      key: 'action',
      className: 'text-center',
      render: (x, record) => <Button onClick={() => handleSelectAddress(record)}>Chọn</Button>
    }
  ];

  const handleSelectAddress = (address) => {
    setIsModalOpen(false);
    onSuccess(address);
    console.log(address);
  };

  return (
    <>
      <Button
        onClick={showModal}
        type="text"
        icon={<i className="fas fa-location-dot"></i>}
        className="text-success fw-semibold"
      >
        Chọn địa chỉ
      </Button>
      <Modal
        title={
          <Row>
            <Col span={18}>
              <div className="flex-grow-1">Chọn địa chỉ khác</div>
            </Col>
            <Col span={6}>
              <CreateAddressModal
                idKhachHang={idKhachHang}
                onSuccess={() => {
                  setCurrentPage(1);
                  loadDataAddress(idKhachHang, currentPage, pageSize);
                }}
              />
            </Col>
          </Row>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        width={1000}
        footer=""
      >
        <Table
          dataSource={addressList}
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
      </Modal>
    </>
  );
}

export default AddressOrders