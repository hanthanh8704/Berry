// const [isSoLuongDisabled, setIsSoLuongDisabled] = useState(false);
// const [loaiGiamGia, setLoaiGiamGia] = useState(); // Mặc định là '%'

// const handleChange = (event) => {
//     const { name, value } = event.target;
//     if (name === 'hinhThucGiam') {
//         setLoaiGiamGia(value); // Cập nhật trạng thái loại giảm giá
//     }
//     setFormValues({ ...formValues, [name]: value });
//     if (name === 'loai' && value === 'Cá nhân') {
//       setIsSoLuongDisabled(true);
//       setFormValues((prevState) => ({ ...prevState, soLuong: '1' })); // Reset giá trị số lượng khi chọn "Cá nhân"
//     } else if (name === 'loai' && value === 'Công khai') {
//       setIsSoLuongDisabled(false);
//     }
// };

// const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formValues);
// };

// const handleSelectOrder = (event, id) => {
//     if (event.target.checked) {
//     setSelectedOrders([...selectedOrders, id]); // Thêm id vào mảng selectedOrders
//     }
// else {
// setSelectedOrders(selectedOrders.filter(orderId => orderId !== id)); // Xoá id khỏi mảng selectedOrders
//     }
// };

// const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     let validatedValue = value;
//     if (name === 'giaTriGiam' && loaiGiamGia === '%') {
//         validatedValue = Math.min(value, 100); // Giới hạn giá trị tại 100 nếu là phần trăm
//     }
//     setFormValues({ ...formValues, [name]: validatedValue });
// };

import { Modal, Button, Col, Form, Input, InputNumber, Row, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as request from 'views/utilities/httpRequest';
import TableCustomer from './TableCustomer';
import moment from 'moment';

function VoucherDetail() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState({});
  const [listCustomer, setListCustomer] = useState([]);
  const [hinhThucGiam, setHinhThucGiam] = useState('%');
  const [inputValue, setInputValue] = useState(null);
  const [showCustomerTable, setShowCustomerTable] = useState(false);
  const [giaTriGiamMin, setGiaTriGiamMin] = useState(1);
  const [giaTriGiamMax, setGiaTriGiamMax] = useState(50);
  const [soLuongCaNhan, setSoLuongCaNhan] = useState(1);
  const [loaiPhieuGiamGia, setLoaiPhieuGiamGia] = useState('Công khai');

  useEffect(() => {
    setShowCustomerTable(loaiPhieuGiamGia === 'Cá nhân');
  }, [loaiPhieuGiamGia]);

  const handleInputFocus = () => {
    if (inputValue === null) {
      setInputValue(0);
    }
  };

  const validateDiscountValue = (_, value) => {
    if (hinhThucGiam === '%') {
      if (value >= 1 && value <= 50) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Giá trị giảm phải nằm trong khoảng từ 1 đến 50%'));
    } else if (hinhThucGiam === 'VNĐ') {
      if (value >= 1 && value <= 1000000) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Giá trị giảm phải nằm trong khoảng từ 1 đến 1,000,000 VNĐ'));
    }
    return Promise.resolve();
  };

  const validateDateRange = (_, value) => {
    const currentDate = moment();
    if (!value) {
      return Promise.reject(new Error('Ngày bắt đầu không được để trống!'));
    }
    if (value && moment(value).isBefore(currentDate)) {
      return Promise.reject(new Error('Ngày bắt đầu phải lớn hơn hoặc bằng ngày giờ hiện tại!'));
    }
    return Promise.resolve();
  };

  const validateDateRange1 = (_, value) => {
    const startDate = form.getFieldValue('ngayBatDau');
    if (!value) {
      return Promise.reject(new Error('Ngày kết thúc không được để trống!'));
    }
    if (startDate && value && moment(value).isBefore(moment(startDate))) {
      return Promise.reject(new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu!'));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    loadVoucher(form, id);
  }, [form, id]);

  useEffect(() => {
    if (listCustomer.length === 0) {
      form.setFieldsValue({
        type: true
      });
    } else {
      form.setFieldsValue({
        type: false
      });
    }
  }, [listCustomer]);

  const loadVoucher = (form, id) => {
    request
      .get(`/voucher/${id}`)
      .then((response) => {
        console.log(response);
        setVoucher(response);
        form.setFieldsValue({
          ma: response.ma,
          ten: response.ten,
          soLuong: response.soLuong,
          giaTriHoaDonDuocApDung: response.giaTriHoaDonDuocApDung,
          giaTriHoaDonDuocGiam: response.giaTriHoaDonDuocGiam,
          ngayBatDau: response.ngayBatDau,
          ngayKetThuc: response.ngayKetThuc,
          hinhThucGiam: response.hinhThucGiam,
          loai: response.loai
        });
        if (response.customer !== null) {
          setListCustomer(response.customer.split(',').map(Number));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const onSubmit = async (data) => {
    Modal.confirm({
      title: 'Xác nhận',
      maskClosable: true,
      content: 'Xác nhận cập nhật phiếu giảm giá ?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        if (loaiPhieuGiamGia === 'Cá nhân') {
          data.soLuong = 1;
          data.customers = listCustomer;
        }
        setLoading(true);
        setTimeout(() => {
          data.customers = listCustomer;
          request
            .put(`/voucher/update/${id}`, data)
            .then((response) => {
              console.log(response);
              sessionStorage.setItem('voucherUpdateSuccess', 'Thêm thành công!');
              loadVoucher(form, id);
            })
            .catch((e) => {
              toast.error(e.response.data);
              setLoading(false);
            });
        }, 1000);
      }
    });
  };

  return (
    <div className="container">
      <Form
        onFinish={onSubmit}
        layout="vertical"
        form={form}
        tialValues={{ soLuong: loaiPhieuGiamGia === 'Cá nhân' ? soLuongCaNhan : undefined }}
        initialValues={{ soLuong: 1 }}
        // onValuesChange={validateDateRange}
      >
        <Row gutter={10}>
          <Col xl={11}>
            <Row gutter={10}>
              <Col xl={12}>
                <Form.Item label={'Mã phiếu giảm giá'} name={'ma'}>
                  <Input placeholder="Nhập mã phiếu giảm giá..." disabled />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label={'Tên phiếu giảm giá'}
                  name={'ten'}
                  rules={[{ required: true, message: 'Tên phiếu giảm giá không được để trống!' }]}
                >
                  <Input placeholder="Nhập tên phiếu giảm giá..." />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label={'Hình thức giảm giá'}
                  name={'hinhThucGiam'}
                  rules={[{ required: true, message: 'Ngày kết thúc không được để trống!' }]}
                >
                  <Radio.Group onChange={(e) => setHinhThucGiam(e.target.value)}>
                    <Radio value={'%'}>Phần trăm</Radio>
                    <Radio value={'VNĐ'}>VNĐ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label={'Loại phiếu giảm giá'}
                  name={'loai'}
                  onChange={(e) => setLoaiPhieuGiamGia(e.target.value)}
                  rules={[{ required: true, message: 'Ngày kết thúc không được để trống!' }]}
                >
                  <Radio.Group>
                    <Radio value={'Công khai'}>Công khai</Radio>
                    <Radio value={'Cá nhân'}>Cá nhân</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label={'Số lượng'}
                  name={'soLuong'}
                  rules={[
                    { required: loaiPhieuGiamGia === 'Công khai', message: 'Số lượng không được để trống!' },
                    { type: 'number', min: loaiPhieuGiamGia === 'Cá nhân' ? 1 : undefined }
                  ]}
                >
                  <Input
                    type="number"
                    min={0}
                    max={10000}
                    placeholder="Nhập số lượng..."
                    disabled={loaiPhieuGiamGia === 'Cá nhân'}
                    value={loaiPhieuGiamGia === 'Cá nhân' ? soLuongCaNhan : undefined}
                  />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label="Giá trị giảm"
                  name="giaTriHoaDonDuocGiam"
                  rules={[{ required: true, message: 'Giá trị giảm không được để trống!' }, { validator: validateDiscountValue }]}
                >
                  <Input type="number" min={0} placeholder={`Nhập giá trị giảm (${hinhThucGiam})...`} suffix={hinhThucGiam} />
                </Form.Item>
              </Col>
              <Col xl={24}>
                <Form.Item
                  label={'Giá trị đơn tối thiểu'}
                  name={'giaTriHoaDonDuocApDung'}
                  rules={[{ required: true, message: 'Đơn tối thiểu không được để trống!' }]}
                >
                  {/* <InputNumber  style={{ width: "100%" }} step={10000} formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : ""} controls={false} min={0} suffix="VNĐ" placeholder="Nhập giá trị đơn tối thiểu..." onFocus={handleInputFocus} value={inputValue} /> */}
                  <InputNumber
                    style={{ width: '100%' }}
                    step={10000}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => (value !== null && value !== undefined ? value.replace(/(,*)/g, '') : '')}
                    controls={false}
                    max={1000000000}
                    min={0}
                    suffix="VNĐ"
                    placeholder="Nhập giá trị tối thiểu..."
                    onFocus={handleInputFocus}
                    value={inputValue}
                  />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label={'Ngày bắt đầu'}
                  name={'ngayBatDau'}
                  rules={[{ required: true, message: 'Ngày bắt đầu không được để trống!' }, { validator: validateDateRange }]}
                >
                  <Input type="datetime-local" />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item
                  label={'Ngày kết thúc'}
                  name={'ngayKetThuc'}
                  rules={[{ required: true, message: 'Ngày kết thúc không được để trống!' }, { validator: validateDateRange1 }]}
                >
                  <Input type="datetime-local" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xl={13}>{showCustomerTable && <TableCustomer setCustomerIds={(value) => setListCustomer(value)} setRowKeys={null} />}</Col>
        </Row>
        <Form.Item className="mt-3 float-end">
          <Button type="primary" htmlType="submit" className="bg-primary">
            <i className="fas fa-edit me-2"></i> Cập nhật phiếu giảm giá
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default VoucherDetail;
