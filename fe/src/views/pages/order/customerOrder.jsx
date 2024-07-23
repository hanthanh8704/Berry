import { AutoComplete, Avatar, Button, Col, Table, DatePicker, Divider, Drawer, Form, Input, Modal, Radio, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import * as request from 'views/utilities/httpRequest';
import FormatTime from 'views/utilities/FormatTime';
import GHNDetail from 'ui-component/GHNDetail';
import { IconEdit, IconPlus } from '@tabler/icons-react';

function CustomerOrder({ handleSelect }) {
  const [customerData, setCustomerData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalKHOpen, setIsModalKHOpen] = useState(false);

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
  };

  const handleKHCancel = () => {
    setIsModalKHOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
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
  }, []);

  const loadCustomer = (value) => {
    const successMessage = sessionStorage.getItem('customerAddSuccess') || sessionStorage.getItem('customerUpdateSuccess');
    if (successMessage) {
      toast.success(successMessage);
      sessionStorage.removeItem('customerAddSuccess');
      sessionStorage.removeItem('customerUpdateSuccess');
    }
    request
      .get('/customer', {
        params: {
          hoTen: value
        }
      })
      .then((response) => {
        setCustomerData(response.data);
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
    handleSelect(value);
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'anh',
      key: 'anh',
      render: (text) => <Avatar src={text} className="me-2" />
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text, record) => <Button onClick={() => handleSelect(record.id)}>Chọn</Button>
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
    formData.append('anh', Anh);
    formData.append('diaChiRequest.hoTen', data.hoTen);
    formData.append('diaChiRequest.soDienThoai', data.soDienThoai);
    formData.append('diaChiRequest.diaChiMacDinh', true);
    formData.append('diaChiRequest.thanhPho', dataAddress.thanhPho);
    formData.append('diaChiRequest.huyen', dataAddress.huyen);
    formData.append('diaChiRequest.phuong', dataAddress.phuong);
    formData.append('diaChiRequest.diaChiCuThe', data.diaChiCuThe);

    formData.append('hoTen', data.hoTen);
    formData.append('gioiTinh', data.gioiTinh);
    formData.append('ngaySinh', data.ngaySinh);
    formData.append('email', data.email);
    formData.append('soDienThoai', data.soDienThoai);
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
            }
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data);
          });
      }
    });
  };

  return (
    <>
      <div className="d-flex">
        <div className="flex-grow-1 me-1">
          <Button type="primary" className="bg-warning text-dark" onClick={showModalSelectCustomer}>
            Chọn khách hàng
          </Button>
        </div>
      </div>

      <Modal title="Khách hàng mới" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000} footer="">
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
                    <FaTrash className="text-danger" />
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
                label={'Tên khách hàng'}
                name={'hoTen'}
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
                    label={'Giới tính'}
                    name={'gioiTinh'}
                    rules={[
                      {
                        required: true,
                        message: 'Giới tính không được để trống!'
                      }
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={'Nam'}>Nam</Radio>
                      <Radio value={'Nữ'}>Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={'Ngày sinh'}
                    name={'ngaySinh'}
                    rules={[
                      {
                        required: true,
                        message: 'Ngày sinh không được để trống!'
                      }
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format={'DD-MM-YYYY'}
                      placeholder={'Chọn ngày sinh'}
                      disabledDate={(current) => {
                        return current && current > moment();
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={'Số điện thoại'}
                    name={'soDienThoai'}
                    rules={[
                      {
                        required: true,
                        message: 'Số điện thoại không được để trống!'
                      },
                      {
                        pattern: /^(?:\+84|0)(?:\d{9})$/,
                        message: 'Số điện thoại không đúng định dạng!'
                      }
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại..." />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={'Email'}
                    name={'email'}
                    rules={[
                      {
                        required: true,
                        message: 'Email không được để trống!'
                      },
                      {
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Email không đúng định dạng!'
                      }
                    ]}
                  >
                    <Input placeholder="Nhập email..." />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <GHNDetail setDataAddress={setDataAddress} />
          <Divider />
          <Form.Item className="text-center mb-0">
            <Button type="primary" htmlType="submit">
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Danh sách khách hàng"
        visible={isModalKHOpen}
        onCancel={handleKHCancel} // Giữ lại onCancel để đóng modal bằng cách nhấn ngoài modal hoặc nút đóng
        width={1000}
        footer={null} // Xóa nút Ok và Cancel
      >
        <div className="d-flex justify-content-between mb-2">
          <Input.Search
            placeholder="Tìm kiếm khách hàng..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
          />

          <Button type="primary" className="bg-warning text-dark" onClick={showModal}>
            Thêm mới KH
          </Button>
        </div>
        <Table
          dataSource={customerData}
          columns={columns}
          pagination={{
            pageSize: 5
          }}
        />
      </Modal>
    </>
  );
}

export default CustomerOrder;
