import { AutoComplete, Avatar, Button, Col, Table, DatePicker, Divider, Drawer, Form, Input, Modal, Radio, Row, message } from 'antd';
import React, { useEffect, useState } from 'react';
import * as request from 'views/utilities/httpRequest';

function CustomerOrder({ idBill,handleSelect,onClosed }) {
  const [customerData, setCustomerData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalKHOpen, setIsModalKHOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('left');

  const [previewUrl, setPreviewUrl] = useState(null);
  const [Anh, setAnh] = useState(null);
  const [dataAddress, setDataAddress] = useState(null);
  const [form] = Form.useForm();

  const showModalSelectCustomer = () => {
    setIsModalKHOpen(true);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleKHOk = () => {
    setIsModalKHOpen(false);
    onClosed();
  };

  const handleKHCancel = () => {
    setIsModalKHOpen(false);
    onClosed();
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    onClosed();
    setIsModalOpen(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loadCustomer('');
  }, [currentPage, pageSize]);
  const token = localStorage.getItem('token');
  // Lấy dữ liệu từ localStorage
  const idNhanVienInt = localStorage.getItem('employeeId');

  const loadCustomer = (value) => {
    // const successMessage = sessionStorage.getItem('customerAddSuccess') || sessionStorage.getItem('customerUpdateSuccess');
    // if (successMessage) {
    //   toast.success(successMessage);
    //   sessionStorage.removeItem('customerAddSuccess');
    //   sessionStorage.removeItem('customerUpdateSuccess');
    // }
    request
      .get('/customer', {
        params: {
          page: currentPage,
          sizePage: pageSize
        },
      })
      .then((response) => {
        setCustomerData(response.data);
        console.log("Dataaa :", customerData);
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  };
  const addCustomer = (value) => {
    const requestData = {
      customerId: value.id, // Lấy từ statvvvvvve
      recipientName: value.fullName, // Lấy từ statvvvvvve
      recipientPhone: value.phoneNumber, // Lấy từ statvvvvvve
    };
    console.log(requestData);
    
    request
      .put('/bill/change-info-customer/'+idBill.id+'/'+idNhanVienInt, requestData,{
      })
      .then((response) => {
        console.error('Error fetching customer ninh:');
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    loadCustomer(value);
  };

  const onSelect = (value) => {
    setSearchValue('');
    addCustomer(value)
    handleSelect(value);
    onClosed();
    setIsModalKHOpen(false);
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'integer',
      key: 'integer'
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <Avatar src={text} className="me-2" />
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text, record) => <Button onClick={() => onSelect(record)}>Chọn</Button> // Thay handleSelect bằng onSelect
    }
  ];

  // Hàm xử lý ảnh
  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setAnh(file);
      setPreviewUrl(imageUrl);
    } catch (e) {
      setPreviewUrl('');
    }
  };

  const handleAddCustomer = (data) => {
    const formData = new FormData();
    formData.append('image', Anh);
    formData.append('addressRequest.fullName', data.fullName);
    formData.append('addressRequest.phoneNumber', data.phoneNumber);
    formData.append('addressRequest.defaultAddress', true);
    formData.append('addressRequest.city', dataAddress.city);
    formData.append('addressRequest.district', dataAddress.district);
    formData.append('addressRequest.ward', dataAddress.ward);
    formData.append('addressRequest.detailedAddress', data.detailedAddress);

    formData.append('fullName', data.fullName);
    formData.append('gender', data.gender);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    Modal.confirm({
      title: 'Xác nhận',
      maskClosable: true,
      content: 'Xác nhận thêm khách hàng ?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        request
          .post('/customer', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          .then((response) => {
            console.log(response);
            setLoading(true);
            if (response.data.success) {
              setLoading(false);
              sessionStorage.setItem('customerAddSuccess', 'Thêm thành công!');
              setIsModalOpen(false);
              form.resetFields();
              loadCustomer('');
              handleSelect();
              onClosed();
            }
          })
          .catch((e) => {
            console.log(e);
            message.error(e.response.data);
          });
      }
    });
  };

  useEffect(() => {
    loadCustomer('');
    onClosed();
  }, [currentPage, pageSize]);

  return (
    <>
      <div className="d-flex">
        <div className="flex-grow-1 me-1">
          <Button type="primary" style={{ background: '#a55eea' }} className="text-white" onClick={showModalSelectCustomer}>
            Chọn khách hàng
          </Button>
        </div>
      </div>
  
      {/* Modal thêm khách hàng mới */}
      <Modal title="Khách hàng mới" open={isModalOpen} onCancel={handleCancel} width={1000} footer={null}>
        <Form onFinish={handleAddCustomer} layout="vertical" form={form}>
          <Row gutter={24}>
            <Col span={8}>
              {previewUrl !== null ? (
                <div className="text-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ width: '162px', height: '162px' }}
                    className="mt-2 border border-warning shadow-lg bg-body-tertiary object-fit-contain"
                  />
                  <Button
                    className="position-absolute border-0"
                    onClick={() => {
                      setPreviewUrl(null);
                      setAnh(null);
                    }}
                  >
                    <i className="fas fa-trash text-danger"></i>
                  </Button>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center">
                  <div
                    className="position-relative rounded-circle border border-warning mt-2 d-flex align-items-center justify-content-center"
                    style={{ width: '162px', height: '162px' }}
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="position-absolute opacity-0 py-5"
                      required
                    />
                    <div className="text-center text-secondary">
                      <i className="fas fa-plus"></i> <br />
                      <span>Chọn ảnh đại diện</span>
                    </div>
                  </div>
                </div>
              )}
              <Form.Item
                label="Tên khách hàng"
                name="fullName"
                rules={[
                  { required: true, message: 'Tên không được để trống!' },
                  {
                    pattern: /^[^\d!@#$%^&*()_+={}\\:;"'<>,.?/`~|-]+$/,
                    message: 'Tên phải là chữ'
                  }
                ]}
              >
                <Input placeholder="Nhập tên khách hàng..." />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Row gutter={10}>
                <Col span={24}>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
                  >
                    <Radio.Group>
                      <Radio value="Nam">Nam</Radio>
                      <Radio value="Nữ">Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Ngày sinh"
                    name="dateOfBirth"
                    rules={[{ required: true, message: 'Ngày sinh không được để trống!' }]}
                  >
                    <DatePicker placeholder="Chọn ngày sinh" format="DD/MM/YYYY" className="w-100" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Email không được để trống!' },
                      { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                  >
                    <Input placeholder="Nhập email khách hàng..." />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                      { required: true, message: 'Số điện thoại không được để trống!' },
                      { pattern: /^(03|05|07|08|09)\d{8}$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại..." />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Địa chỉ cụ thể"
                    name="detailedAddress"
                    rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                  >
                    <Input.TextArea rows={2} placeholder="Nhập địa chỉ cụ thể..." />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row justify="end">
            <Col>
              <Button onClick={handleCancel} className="me-2">
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Thêm khách hàng
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
  
      {/* Modal chọn khách hàng */}
      <Modal
        title="Chọn khách hàng"
        open={isModalKHOpen}
        onOk={handleKHOk}
        onCancel={handleKHCancel}
        width={1000}
        footer={null}
      >
        <AutoComplete
          style={{ width: '100%', marginBottom: '16px' }}
          value={searchValue}
          onChange={handleSearch}
          placeholder="Tìm kiếm khách hàng..."
        />
        <Button type="primary" onClick={showModal}>
                Thêm khách hàng
              </Button>
        <Table 
        dataSource={customerData}
         columns={columns} rowKey="id" 
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
            loadCustomer(searchValue); // Tải lại dữ liệu với trang mới
          },
        }} 
          className="custom-table" />
      </Modal>
      
    </>
  );
  
}

export default CustomerOrder;
