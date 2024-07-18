
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
  useEffect(() => {
    // Thiết lập giá trị tối thiểu và tối đa cho giá trị giảm dựa trên hình thức giảm giá
    if (hinhThucGiam === '%') {
      setGiaTriGiamMin(1);
      setGiaTriGiamMax(50);
    } else if (hinhThucGiam === 'VNĐ') {
      setGiaTriGiamMin(1);
      setGiaTriGiamMax(1000000);
    }
  }, [hinhThucGiam]);
  

  useEffect(() => {
    if (listCustomer.length === 0) {
      form.setFieldsValue({
        type: true
      })
    } else {
      form.setFieldsValue({
        type: false
      })
    }
  }, [listCustomer])

  const validateDateRange = () => {
    const startDate = form.getFieldValue('ngayBatDau');
    const endDate = form.getFieldValue('ngayKetThuc');
    const currentDate = moment();
    if (startDate && moment(startDate).isBefore(currentDate)) {
      form.setFields([
        {
          name: 'ngayBatDau',
          errors: ['Ngày bắt đầu phải lớn hơn hoặc bằng ngày giờ hiện tại!'],
        },
      ]);
      return false;
    }

    return true;
  };
  const validateDateRange1 = () => {
    const startDate = form.getFieldValue('ngayBatDau');
    const endDate = form.getFieldValue('ngayKetThuc');
    const currentDate = moment();
    if (startDate && endDate && moment(endDate).isBefore(moment(startDate))) {
      form.setFields([
        {
          name: 'ngayKetThuc',
          errors: ['Ngày kết thúc phải lớn hơn ngày bắt đầu!'],
        },
      ]);
      return false;
    }
    return true;
  };

  const handAddVoucher = async (data) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm phiếu giảm giá ?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        if (loaiPhieuGiamGia === 'Cá nhân') {
          data.soLuong = 1;
          data.customers = listCustomer;
        }
        request.post("/voucher/add", data).then((response) => {
          if (response.data.success) {
            toast.success("Thêm thành công!");
            navigate("/api/voucher");
          }
        }).catch((e) => {
          toast.error(e.response.data);
        });
        console.log(data);
      },
    });
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
        tialValues={{ soLuong: loaiPhieuGiamGia === 'Cá nhân' ? soLuongCaNhan : undefined }}
         initialValues={{ soLuong: 1 }} 
        // onValuesChange={validateDateRange}
        >
          <Row gutter={10}>
            <Col xl={11}>
              <Row gutter={10}>
                <Col xl={12}>
                  <Form.Item label={"Mã phiếu giảm giá"} name={"ma"}>
                    <Input placeholder="Nhập mã phiếu giảm giá..." />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Tên phiếu giảm giá"} name={"ten"} rules={[{ required: true, message: "Tên phiếu giảm giá không được để trống!", },]}>
                    <Input placeholder="Nhập tên phiếu giảm giá..." />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Hình thức giảm giá"} name={"hinhThucGiam"}
                   rules={[{ required: true, message: "Ngày kết thúc không được để trống!", },]} >
                    <Radio.Group onChange={(e) => setHinhThucGiam(e.target.value)}>
                      <Radio value={'%'}>Phần trăm</Radio>
                      <Radio value={'VNĐ'}>VNĐ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Loại phiếu giảm giá"} name={"loai"} onChange={(e) => setLoaiPhieuGiamGia(e.target.value)}  rules={[{ required: true, message: "Ngày kết thúc không được để trống!", },]} >
                    <Radio.Group>
                      <Radio value={'Công khai'}>Công khai</Radio>
                      <Radio value={'Cá nhân'}>Cá nhân</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Số lượng"} name={"soLuong"}
                  rules={[
                  { required: loaiPhieuGiamGia === 'Công khai', message: "Số lượng không được để trống!" },
                  { type: 'number', min: loaiPhieuGiamGia === 'Cá nhân' ? 1 : undefined },
                ]}
                  >
                    <Input type="number" min={0} max={10000} placeholder="Nhập số lượng..." disabled={loaiPhieuGiamGia === 'Cá nhân'}   value={loaiPhieuGiamGia === 'Cá nhân' ? soLuongCaNhan : undefined}
                   />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Giá trị giảm"} name={"giaTriHoaDonDuocGiam"} rules={[{ required: true, message: "Phần trăm giảm không được để trống!", },
                { type: 'number', min: giaTriGiamMin, max: giaTriGiamMax, message: `Giá trị giảm phải nằm trong khoảng từ ${giaTriGiamMin} đến ${giaTriGiamMax}` },
                ]} >
                    <Input type="number" min={1} placeholder="Nhập phần trăm giảm..." suffix={hinhThucGiam}/>
                  </Form.Item>
                </Col>
                <Col xl={24}>
                  <Form.Item label={"Giá trị đơn tối thiểu"} name={"giaTriHoaDonDuocApDung"} rules={[{ required: true, message: "Đơn tối thiểu không được để trống!", },]} >
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
                  <Form.Item label={"Ngày bắt đầu"} name={"ngayBatDau"} rules={[{ required: true, message: "Ngày bắt đầu không được để trống!", }, { validator: validateDateRange }]} >
                    <Input type="datetime-local" />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item label={"Ngày kết thúc"} name={"ngayKetThuc"} rules={[{ required: true, message: "Ngày kết thúc không được để trống!", }, { validator: validateDateRange1 }]} >
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