import { Modal, Button, Col, Form, Input, InputNumber, Row, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as request from "views/utilities/httpRequest";
import TableCustomer from "./TableCustomer";
import moment from "moment";

function VoucherDetail() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState({});
  const [listCustomer, setListCustomer] = useState([]);
  const [discountMethod, setDiscountMethod] = useState();
  const [inputValue, setInputValue] = useState(null);
  const [showCustomerTable, setShowCustomerTable] = useState(false);
  const [giaTriGiamMin, setGiaTriGiamMin] = useState(1);
  const [giaTriGiamMax, setGiaTriGiamMax] = useState(50);
  const [quantityCustomer, setQuantityCustomer] = useState(1);
  const [type, setType] = useState('CONG_KHAI');

  useEffect(() => {
    setShowCustomerTable(type === 'CA_NHAN');
  }, [type]);

  const handleInputFocus = () => {
    if (inputValue === null) {
      setInputValue(0);
    }
  };

  const validateDiscountValue = (_, value) => {
    if (discountMethod === 'PHAN_TRAM') {
      if (value >= 1 && value <= 100) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Giá trị giảm phải nằm trong khoảng từ 1 đến 100%"));
    } else if (discountMethod === 'CO_DINH') {
      if (value >= 1 && value <= 1000000) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Giá trị giảm phải nằm trong khoảng từ 1 đến 1,000,000 VNĐ"));
    }
    return Promise.resolve();
  };

  const validateDateRange = (_, value) => {
    const currentDate = moment();
    if (value && moment(value).isBefore(currentDate)) {
      return Promise.reject(new Error("Ngày bắt đầu phải lớn hơn hoặc bằng ngày giờ hiện tại!"));
    }
    return Promise.resolve();
  };

  const validateDateRange1 = (_, value) => {
    const startDate = form.getFieldValue('startDate');
    if (startDate && value && moment(value).isBefore(moment(startDate))) {
      return Promise.reject(new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu!"));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    loadVoucher(form, id);
  }, [form, id]);

  // useEffect(() => {
  //   if (listCustomer.length === 0) {
  //     form.setFieldsValue({
  //       type: true
  //     });
  //   } else {
  //     form.setFieldsValue({
  //       type: false
  //     });
  //   }
  // }, [listCustomer]);

  const loadVoucher = (form, id) => {
    request.get(`/voucher/${id}`).then((response) => {
      console.log(response);
      setVoucher(response);
      form.setFieldsValue({
        code: response.code,
        name: response.name,
        quantity: response.quantity,
        minOrderValue: response.minOrderValue,
        maxDiscountValue: response.maxDiscountValue,
        discountValue: response.discountValue,
        startDate: (response.startDate ),
        endDate:(response.endDate),
        discountMethod: response.discountMethod,
        type: response.type,
      });
      setType(response.type);
    setShowCustomerTable(response.type === 'CA_NHAN');
    if (response.customers) {
      setListCustomer(response.customers.split(',').map(Number));
    } else {
      setListCustomer([]); // Hoặc một giá trị mặc định khác nếu cần
    }
    }).catch((error) => {
      console.log(error);
    });
    setLoading(false);
  };

  const onSubmit = async (data) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận cập nhật phiếu giảm giá ?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        if (type === 'CA_NHAN') {
          data.quantity = 1;
        }
        setLoading(true);
        setTimeout(() => {
          data.customers = listCustomer;
          request.put(`voucher/update/${id}`, data).then((response) => {
            if (response.data.success) {
            console.log(response);
            sessionStorage.setItem('voucherUpdateSuccess', 'Cập nhật thành công!');
            loadVoucher(form, id);
            navigate("/voucher");
          }
          }).catch((e) => {
            toast.error(e.response.data);
            setLoading(false);
          });
        }, 1000);
      },
    });
  };

  return (
    <div className="container">
      <Form onFinish={onSubmit} layout="vertical" form={form}
        tialValues={{ quantity: type === 'CA_NHAN' ? quantityCustomer : undefined }}
         initialValues={{ quantity: 1 }} 
        // onValuesChange={validateDateRange}
        >
          <Row gutter={10}>
            <Col xl={11}>
              <Row gutter={10}>
                <Col xl={12}>
                  <Form.Item label={"Mã phiếu giảm giá"} name={"code"}>
                    <Input placeholder="Nhập mã phiếu giảm giá..." disabled/>
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Tên phiếu giảm giá"} name={"name"} rules={[{ required: true, message: "Tên phiếu giảm giá không được để trống!", },]}>
                    <Input placeholder="Nhập tên phiếu giảm giá..." />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Hình thức giảm giá"} name={"discountMethod"}
                   rules={[{ required: true, message: "Ngày kết thúc không được để trống!", },]} >
                    <Radio.Group onChange={(e) => setDiscountMethod(e.target.value)}>
                      <Radio value={'PHAN_TRAM'}>Phần trăm</Radio>
                      <Radio value={'CO_DINH'}>VNĐ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                
               
                
                <Col xl={12}>
                  <Form.Item label="Giá trị giảm" name="discountValue" rules={[
                    { required: true, message: "Giá trị giảm không được để trống!" },
                    { validator: validateDiscountValue }
                  ]}>
                    <Input type="number" min={0} placeholder={`Nhập giá trị giảm (${discountMethod})...`} suffix={discountMethod} />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Giá trị đơn tối thiểu"} name={"minOrderValue"} rules={[{ required: true, message: "Đơn tối thiểu không được để trống!", },]} >
                    {/* <InputNumber  style={{ width: "100%" }} step={10000} formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : ""} controls={false} min={0} suffix="VNĐ" placeholder="Nhập giá trị đơn tối thiểu..." onFocus={handleInputFocus} value={inputValue} /> */}
                    <InputNumber
                      style={{ width: "100%" }}
                      step={10000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => (value !== null && value !== undefined ? value.replace(/(,*)/g, "") : "")}
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
                  <Form.Item label={"Giá trị đơn tối đa"} name={"maxDiscountValue"} 
                  rules={[
                    {
                      validator: (_, value) => {
                        const minOrderValue = form.getFieldValue("minOrderValue"); // Lấy giá trị tối thiểu
                        if (value !== undefined && minOrderValue !== undefined && value <= minOrderValue) {
                          return Promise.reject(new Error("Giá trị tối đa phải lớn hơn giá trị tối thiểu!"));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]} >
                    {/* <InputNumber  style={{ width: "100%" }} step={10000} formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : ""} controls={false} min={0} suffix="VNĐ" placeholder="Nhập giá trị đơn tối thiểu..." onFocus={handleInputFocus} value={inputValue} /> */}
                    <InputNumber
                      style={{ width: "100%" }}
                      step={10000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => (value !== null && value !== undefined ? value.replace(/(,*)/g, "") : "")}
                      controls={false}
                      max={1000000000}
                      min={0}
                      suffix="VNĐ"
                      placeholder="Nhập giá trị tối đa..."
                      // onFocus={handleInputFocus}
                      // value={inputValue}
/>
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Ngày bắt đầu"} name={"startDate"} rules={[
                    { required: true, message: "Ngày bắt đầu không được để trống!", },
                     { validator: validateDateRange }
                     ]} >
                    <Input type="datetime-local" />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Ngày kết thúc"} name={"endDate"} rules={[
                    { required: true, message: "Ngày kết thúc không được để trống!", },
                     { validator: validateDateRange1 }
                     ]} >
                    <Input type="datetime-local" />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Loại phiếu giảm giá"} name={"type"} onChange={(e) => setType(e.target.value)}  rules={[{ required: true, message: "Ngày kết thúc không được để trống!", },]} >
                    <Radio.Group >
                      <Radio value={'CONG_KHAI'}>Công khai</Radio>
                      <Radio value={'CA_NHAN'}>Cá nhân</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Số lượng"} name={"quantity"} rules={[
                    { required: type === 'CONG_KHAI', message: "Số lượng phải là số và không được để trống!" },
                    {
                      type: 'number', // Đảm bảo giá trị là số
                      min: type === 'CA_NHAN' ? 1 : 0,
                      message: `Số lượng tối thiểu là ${type === 'CA_NHAN' ? 1 : 0}!`,
                      transform: (value) => (value ? Number(value) : 0), // Chuyển đổi thành số trước kiểm tra
                    },
                    { validator: (_, value) => {
                        if (value > 10000) {
                          return Promise.reject("Số lượng không được quá 10000!");
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                    <Input type="number" min={0} placeholder="Nhập số lượng..." disabled={type === 'CA_NHAN'} value={type === 'CA_NHAN' ? quantityCustomer : undefined} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xl={13}>
            {showCustomerTable && (
    <TableCustomer setCustomerIds={(value) => setListCustomer(value)} setRowKeys={listCustomer} />
  )}
             
            </Col>
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
