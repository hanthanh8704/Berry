import { Breadcrumb, Button, Col, Form, Input, InputNumber, Modal, Radio, Row } from "antd";
// import { FaHome } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "views/utilities/httpRequest";
import { toast } from "react-toastify";
import TableCustomer from "./TableCustomer";
import moment from "moment"; 

function AddVoucher() {
  const navigate = useNavigate();
  const [listCustomer, setListCustomer] = useState([]);
  const [form] = Form.useForm();
  const [discountMethod, setDiscountMethod] = useState('%');
  const [inputValue, setInputValue] = useState(null);
  const [showCustomerTable, setShowCustomerTable] = useState(false);
  const [giaTriGiamMin, setGiaTriGiamMin] = useState(1);
  const [giaTriGiamMax, setGiaTriGiamMax] = useState(1000000);
  const [quantityCustomer, setQuantityCustomer] = useState(1);
  const [type, setType] = useState('Công khai');

  useEffect(() => {
    setShowCustomerTable(type === 'Cá nhân');
  }, [type]);
  
  const handleInputFocus = () => {
    if (inputValue === null) {
      setInputValue(0);
    }
  };

  const validateDiscountValue = (_, value) => {
    if (discountMethod === '%') {
      if (value >= 1 && value <= 50) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Giá trị giảm phải nằm trong khoảng từ 1 đến 50%"));
    } else if (discountMethod === 'VNĐ') {
      if (value >= 1 && value <= 1000000) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Giá trị giảm phải nằm trong khoảng từ 1 đến 1,000,000 VNĐ"));
    }
    return Promise.resolve();
  };

  // useEffect(() => {
  //   if (listCustomer.length === 0) {
  //     form.setFieldsValue({
  //       type: true
  //     })
  //   } else {
  //     form.setFieldsValue({
  //       type: false
  //     })
  //   }
  // }, [listCustomer])

  const validateDateRange = (_, value) => {
    const startDate = moment(value);
    const currentDate = moment();
    if (startDate.isBefore(currentDate)) {
      return Promise.reject(new Error("Ngày bắt đầu phải lớn hơn hoặc bằng ngày giờ hiện tại!"));
    }
    return Promise.resolve();
  };

  const validateDateRange1 = (_, value) => {
    const startDate = form.getFieldValue('ngayBatDau');
    const endDate = moment(value);
    if (endDate.isBefore(moment(startDate))) {
      return Promise.reject(new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu!"));
    }
    return Promise.resolve();
  };

  const handAddVoucher = async () => {
    try {
      const values = await form.validateFields();
      
      // Sau khi validate thành công, tiếp tục xử lý dữ liệu
      Modal.confirm({
        title: "Xác nhận",
        maskClosable: true,
        content: "Xác nhận thêm phiếu giảm giá ?",
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: () => {
          if (type === 'Cá nhân') {
            values.quantity = 1;
            values.customers = listCustomer;
          }
          request.post("/voucher/add", values).then((response) => {
            if (response.data.success) {
              sessionStorage.setItem('voucherAddSuccess', 'Thêm thành công!');
              navigate("/api/voucher");
            }
          }).catch((e) => {
            toast.error(e.response.data);
          });
          console.log(values);
        },
      });
    } catch (errorInfo) {
      console.log('Validate Failed:', errorInfo);
    }
  };

  return (
    // <BaseUI>
    //   <Breadcrumb className="mb-2">
    //     <Breadcrumb.Item>
    //       <Link to="/">
    //         <FaHome /> Trang chủ
    //       </Link>
    //     </Breadcrumb.Item>
    //     <Breadcrumb.Item>
    //       <Link to="/admin/voucher">Danh sách phiếu giảm giá</Link>
    //     </Breadcrumb.Item>
    //     <Breadcrumb.Item>Thêm phiếu giảm giá</Breadcrumb.Item>
    //   </Breadcrumb>
      <div className="container">
        <Form onFinish={handAddVoucher} layout="vertical" form={form}
        tialValues={{ soLuong: type === 'Cá nhân' ? quantityCustomer : undefined }}
         initialValues={{ soLuong: 1 }} 
        // onValuesChange={validateDateRange}
        >
          <Row gutter={10}>
            <Col xl={11}>
              <Row gutter={10}>
                <Col xl={12}>
                  <Form.Item label={"Mã phiếu giảm giá"} name={"code"}>
                    <Input placeholder="Nhập mã phiếu giảm giá..." />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Tên phiếu giảm giá"} name={"name"} rules={[{ required: true, message: "Tên phiếu giảm giá không được để trống!", },]}>
                    <Input placeholder="Nhập tên phiếu giảm giá..." />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Hình thức giảm giá"} name={"discountMethod"} rules={[{ required: true, message: "Hình thức giảm giá không được để trống!" },]} >
                    <Radio.Group onChange={(e) => setDiscountMethod(e.target.value)}>
                      <Radio value={'%'}>Phần trăm</Radio>
                      <Radio value={'VNĐ'}>VNĐ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Loại phiếu giảm giá"} name={"type"} onChange={(e) => setType(e.target.value)} rules={[{ required: true, message: "Loại phiếu giảm giá không được để trống!" },]} >
                    <Radio.Group>
                      <Radio value={'Công khai'}>Công khai</Radio>
                      <Radio value={'Cá nhân'}>Cá nhân</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Số lượng"} name={"quantity"} rules={[
                    { required: type === 'Công khai', message: "Số lượng không được để trống!" },
                    { validator: (_, value) => {
                        if (value > 10000) {
                          return Promise.reject("Số lượng không được quá 10000!");
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                    <Input type="number" min={0} placeholder="Nhập số lượng..." disabled={type === 'Cá nhân'} value={type === 'Cá nhân' ? quantityCustomer : undefined} />
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
                  <Form.Item label={"Giá trị đơn tối đa"} name={"maxDiscountValue"}  >
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
                      onFocus={handleInputFocus}
                      value={inputValue}
                    />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Ngày bắt đầu"} name={"startDate"} rules={[
                    { required: true, message: "Ngày bắt đầu không được để trống!" }, 
                    { validator: validateDateRange }
                  ]}>
                    <Input type="datetime-local" />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Ngày kết thúc"} name={"endDate"} rules={[
                    { required: true, message: "Ngày kết thúc không được để trống!" },
                    { validator: validateDateRange1 }
                  ]}>
                    <Input type="datetime-local" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xl={13}>
              {showCustomerTable && (
                <TableCustomer setCustomerIds={(value) => setListCustomer(value)} setRowKeys={null} />
              )}
            </Col>
          </Row>
          <Form.Item className="mt-3 float-end">
            <Button type="primary" htmlType="submit" className="bg-primary">
              <i className="fas fa-plus me-2"></i> Thêm phiếu giảm giá
            </Button>
          </Form.Item>
        </Form>
      </div>
    // </BaseUI>
  );
}

export default AddVoucher;
