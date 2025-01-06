import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Col, Collapse, Divider, Row, Pagination, Select,notification  } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ItemAddress from './ItemAddress';
import * as request from 'views/utilities/httpRequest';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
const AddressCustomerDetail = (idCustomer) => {
  const navigate = useNavigate();
  const [listAddress, setListAddress] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const { id } = useParams();
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const [dataAddress, setDataAddress] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  
  const customerId = idCustomer.idCustomer ? idCustomer.idCustomer : id;

  console.log("ID Khách hàng : " + customerId);
  const configApi = {
    headers: {
      "Content-Type": "application/json",
      Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694",
      ShopId: 192796,
    },
  };

  useEffect(() => {
    loadData(customerId, currentPage, pageSize);
  }, [customerId, currentPage, pageSize]);

  const loadData = (customerId, currentPage, pageSize) => {
    request
      .get(`/address/${customerId}`, {
        params: {
          page: currentPage,
          sizePage: pageSize,
          status: false,
        },
      })
      .then((response) => {
        setListAddress(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleAdd = (data) => {
    data.idKhachHang = customerId;
    confirm({
      title: 'Xác nhận',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn có chắc muốn thêm địa chỉ mới?', // Dấu phẩy bị thiếu ở đây
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        data.idKhachHang = customerId;
        request
          .post('/address', data)
          .then((response) => {
            setCurrentPage(1);
            loadData(customerId, currentPage, pageSize);
            form.resetFields();
            notification.success({
              message: 'Thêm mới thành công!',
              duration: 2, // Thời gian hiển thị thông báo (2 giây)
            });
          })
          .catch((e) => console.log(e));
      },      
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  useEffect(() => {
    request.get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", configApi)
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error('Error fetching provinces:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${selectedProvince}`, configApi)
        .then((response) => {
          setDistricts(response.data);
        })
        .catch((error) => {
          console.error('Error fetching districts:', error);
        });

      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${selectedDistrict}`, configApi)
        .then((response) => {
          setWards(response.data);
        })
        .catch((error) => {
          console.error('Error fetching wards:', error);
        });
    }
  }, [selectedProvince, selectedDistrict]);

  const handleProvinceChange = (provinceCode) => {
    setSelectedProvince(provinceCode);
    setSelectedDistrict(null);
    setSelectedWard(null);
    if (provinceCode) {
      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceCode}`, configApi)
        .then((response) => {
          setDistricts(response.data);
        })
        .catch((error) => {
          console.error('Error fetching districts:', error);
        });
    }
  };

  const handleDistrictChange = (districtCode) => {
    setSelectedDistrict(districtCode);
    setSelectedWard(null);
    if (districtCode) {
      request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`, configApi)
        .then((response) => {
          setWards(response.data);
        })
        .catch((error) => {
          console.error('Error fetching wards:', error);
        });
    }
  };

  const handleWardChange = (wardCode) => {
    setSelectedWard(wardCode);
  };

  useEffect(() => {
    if (dataAddress) {
      dataAddress({
        city: selectedProvince,
        district: selectedDistrict,
        ward: selectedWard,
      });
    }
  }, [selectedProvince, selectedDistrict, selectedWard, dataAddress]);

  return (
    <>
      <Collapse
        expandIcon={({ isActive }) => (
          <span>{isActive ? <i className="fa-solid fa-xmark text-danger fw-bold"></i> : <i className="fa-solid fa-plus text-success fw-bold"></i>}</span>
        )}
        size="small"
        items={[
          {
            key: '0',
            label: <span className="fw-bold text-success">Tạo địa chỉ mới</span>,
            children: (
              <Form onFinish={handleAdd} layout="vertical" form={form}>
                <Row gutter={10}>
                  <Col xl={12}>
                    <Form.Item
                      label="Tên"
                      name="fullName"
                      rules={[{ required: true, message: 'Tên không được để trống!' }]}
                    >
                      <Input placeholder="Nhập tên người nhận..." />
                    </Form.Item>
                  </Col>
                  <Col xl={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phoneNumber"
                      rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                    >
                      <Input placeholder="Nhập số điện thoại..." />
                    </Form.Item>
                  </Col>
                  <Col xl={24}>
                    <Form.Item
                      label="Địa chỉ cụ thể"
                      name="detailedAddress"
                      rules={[{ required: true, message: 'Địa chỉ cụ thể không được để trống!' }]}
                    >
                      <Input placeholder="Nhập địa chỉ cụ thể ..." />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="city"
                      label="Thành Phố"
                      rules={[{ required: true, message: "Thành phố không được để trống!" }]}
                    >
                      <Select
                        showSearch
                        placeholder="Chọn thành phố"
                        optionFilterProp="children"
                        onChange={handleProvinceChange}
                        value={selectedProvince}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                      >
                        {provinces.map((province) => (
                          <Select.Option key={province.ProvinceID} value={province.ProvinceID}>
                            {province.ProvinceName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="district"
                      label="Huyện"
                      rules={[{ required: true, message: "Huyện không được để trống!" }]}
                    >
                      <Select
                        showSearch
                        placeholder="Chọn huyện"
                        optionFilterProp="children"
                        onChange={handleDistrictChange}
                        value={selectedDistrict}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                      >
                        {districts.map((district) => (
                          <Select.Option key={district.DistrictID} value={district.DistrictID}>
                            {district.DistrictName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="ward"
                      label="Phường"
                      rules={[{ required: true, message: "Phường không được để trống!" }]}
                    >
                      <Select
                        showSearch
                        placeholder="Chọn phường"
                        optionFilterProp="children"
                        onChange={handleWardChange}
                        value={selectedWard}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                      >
                        {wards.map((ward) => (
                          <Select.Option key={ward.WardCode} value={ward.WardCode}>
                            {ward.WardName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <Button type="primary" htmlType="submit" className="bg-success">
                    <i className="fas fa-plus-circle me-1"></i> Thêm
                  </Button>
                </div>
              </Form>
            ),
          },
        ]}
      />
      <Divider orientation="left" />

      {listAddress.map((item, index) => (
        <Collapse
          key={item.index}
          size="small"
          defaultActiveKey={item.index}
          className="mb-3 rounded-0 border-0"
          items={[
            {
              key: `${item.index}`,
              label: <span className="fw-semibold">Địa chỉ {item.index}</span>,
              children: <ItemAddress props={item} onSuccess={() => loadData(customerId, currentPage, pageSize)} />,
              className: 'border-bottom-0',
            },
          ]}
        />
      ))}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination
          showSizeChanger
          current={currentPage}
          pageSize={pageSize}
          pageSizeOptions={['2', '5', '10', '20']}
          total={totalPages * pageSize}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }}
          onShowSizeChange={(current, size) => setPageSize(size)}
        />
      </div>
    </>
  );
};

export default AddressCustomerDetail;
