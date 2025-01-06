import { Modal, Button, Col, Row, List, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import DetailAddress from '../order/DetailAddress';
import * as request from 'views/utilities/httpRequest';
import CreateAddressModal from 'components/Customer/CreateAddressCustomerDetail';
import { IconCheck, IconX } from '@tabler/icons-react';

function AddressOrders({ customer, onClosse }) {
  const [addressList, setAddressList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [hoveredAddressId, setHoveredAddressId] = useState(null); // ID đang được hover
  const [selectedAddressId, setSelectedAddressId] = useState(null); // ID được chọn
console.log("Customerrrrrr :", customer);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    onClosse();
  };

  useEffect(() => {
    loadAddress(customer, currentPage, pageSize);
    onClosse();
  }, [customer, currentPage, pageSize]);

  const loadAddress = (customer, currentPage, pageSize) => {
    console.log('ninh add', customer);
    request
      .get(`/address/${customer}`, {
        params: {
          page: currentPage,
          sizePage: pageSize
        }
      })
      .then((response) => {
        setAddressList(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id); // Lưu lại ID được chọn
    updateAddress(address.id);
  };

  const handleMouseEnter = (id) => {
    setHoveredAddressId(id); // Lưu lại ID của địa chỉ đang được hover
  };

  const handleMouseLeave = () => {
    setHoveredAddressId(null); // Xóa trạng thái hover khi chuột rời khỏi
  };

  const updateAddress = (selectedId) => {
    request
      .put(`/address/address/${selectedId}`, { defaultAddress: true })
      .then(() => {
        const updatePromises = addressList
          .filter((address) => address.id !== selectedId)
          .map((address) => request.put(`/address/address/${address.id}`, { defaultAddress: false }));

        Promise.all(updatePromises)
          .then(() => {
            loadAddress(customer, currentPage, pageSize);
            onClosse();
          })
          .catch((error) => {
            console.error('Failed to update other addresses:', error);
          });
      })
      .catch((error) => {
        console.error('Failed to update selected address:', error);
      });
  };

  return (
    <>
      <Button onClick={showModal} type="text" icon={<i className="fas fa-location-dot"></i>} className=" fw-semibold">
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
                customer={customer}
                onSuccess={() => {
                  setCurrentPage(1);
                  loadAddress(customer, currentPage, pageSize);
                }}
              />
            </Col>
          </Row>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        width={800}
        footer=""
      >
        <div className="container" style={{ maxHeight: 400, overflowY: 'auto' }}>
          <List
            itemLayout="vertical"
            dataSource={addressList}
            renderItem={(item) => (
              <div
                key={item.indexs}
                className={`address-item d-flex align-items-start border p-4 rounded mb-4 ${
                  item.defaultAddress ? 'border-primary m-4' : 'border-secondary'
                } ${'selected'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelectAddress(item)}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex-grow-1">
                  <div className="fw-semibold">{item.fullName}</div>
                  <div>{item.phoneNumber}</div>
                  <div>
                    {item.detailedAddress}, 
                    <DetailAddress idcustomer={customer} provincesCache={item.prov} districtCache={item.distr} wardCache={item.war} />
                  </div>
                </div>
                <div className="ms-3">
                  {item.defaultAddress === true ? (
                    <Tag color="green">
                      <IconCheck /> Mặc định
                    </Tag>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            )}
          />
        </div>
      </Modal>
    </>
  );
}

export default AddressOrders;
