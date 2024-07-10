import { Breadcrumb, Button, Col, Divider, Form, Input, Modal, Radio, Row } from "antd";
import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "ui-component/Loading";
import * as request from 'views/utilities/httpRequest';
import GHN from "ui-component/GHN";

function AddCustomer() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataAddress, setDataAddress] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [anh, setAnh] = useState(null);

  // Hàm xử lý khi chọn ảnh
  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setAnh(file);
      setPreviewUrl(imageUrl);
    } catch (e) {
      setPreviewUrl(null);
    }
  };

  // Hàm xử lý khi thêm khách hàng
  const handleAddCustomer = (data) => {
    if (dataAddress == null) {
      toast.error("Vui lòng chọn địa chỉ!");
      return;
    }
debugger
    const formData = new FormData();
    formData.append("anh", anh);
    formData.append("diaChiRequest.hoTen", data.hoTen);
    formData.append("diaChiRequest.soDienThoai", data.soDienThoai);
    formData.append("diaChiRequest.diaChiMacDinh", true);
    formData.append("diaChiRequest.thanhPho", dataAddress.thanhPho);
    formData.append("diaChiRequest.huyen", dataAddress.huyen);
    formData.append("diaChiRequest.phuong", dataAddress.phuong);
    formData.append("diaChiRequest.diaChiCuThe", data.diaChiCuThe);

    formData.append("hoTen", data.hoTen);
    formData.append("gioiTinh", data.gioiTinh);
    formData.append("ngaySinh", data.ngaySinh);
    formData.append("email", data.email);
    formData.append("soDienThoai", data.soDienThoai);

    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm khách hàng?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        setLoading(true);
        request.post("/customer", formData, { headers: { "Content-Type": "multipart/form-data" } })
          .then((response) => {
            setLoading(false);
            if (response.data.success) {
              console.log("Hihi",formData)
              toast.success("Thêm thành công!");
              navigate("/api/customer");
            } else {
              toast.error("Đã xảy ra lỗi khi thêm khách hàng.");
            }
          })
          .catch((error) => {
            setLoading(false);
            toast.error(error.message || "Đã xảy ra lỗi khi thêm khách hàng.");
          });
      },
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item href="/">
          <FaHome />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/api/customer">
          Quản lý khách hàng
        </Breadcrumb.Item>
        <Breadcrumb.Item>Thêm khách hàng</Breadcrumb.Item>
      </Breadcrumb>
      <Form onFinish={handleAddCustomer} layout="vertical" form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <h6>Thông tin khách hàng</h6>
            <Divider />
            <Form.Item
              label="Tên khách hàng"
              name="hoTen"
              rules={[
                { required: true, message: "Tên không được để trống!" },
                { pattern: /^[^\d!@#$%^&*()_+={}\\:;"'<>,.?/`~|-]+$/, message: "Tên phải là chữ" }
              ]}
            >
              <Input placeholder="Nhập tên khách hàng..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            {previewUrl !== null ? (
              <div className="text-center">
                <img src={previewUrl} alt="Preview" style={{ width: "162px", height: "162px" }} className="mt-2 border border-warning shadow-lg bg-body-tertiary rounded-circle object-fit-contain" />
                <Button className="position-absolute border-0" onClick={() => { setPreviewUrl(null); setAnh(null); }}>Xóa ảnh</Button>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center">
                <div className="position-relative rounded-circle border border-warning mt-2 d-flex align-items-center justify-content-center" style={{ width: "162px", height: "162px" }}>
                  <Input type="file" accept="image/*" onChange={handleImageSelect} className="position-absolute opacity-0 py-5" required />
                  <div className="text-center text-secondary">
                    <i className="fas fa-plus"></i> <br />
                    <span>Chọn ảnh đại diện</span>
                  </div>
                </div>
              </div>
            )}
          </Col>
          <Col span={16}>
            <h6>Thông tin chi tiết</h6>
            <Divider />
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="soDienThoai"
                  rules={[
                    { required: true, message: "Số điện thoại không được để trống!" },
                    { pattern: /^0[0-9]{9}$/, message: "Số điện thoại không đúng định dạng!" }
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại ..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Email không được để trống!" },
                    { type: "email", message: "Email không đúng định dạng!" }
                  ]}
                >
                  <Input placeholder="Nhập email ..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày sinh"
                  name="ngaySinh"
                  rules={[
                    { required: true, message: "Ngày sinh không được để trống!" }
                  ]}
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giới tính"
                  name="gioiTinh"
                  rules={[
                    { required: true, message: "Giới tính không được để trống!" }
                  ]}
                >
                  <Radio.Group>
                    <Radio value="Nam">Nam</Radio>
                    <Radio value="Nữ">Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Địa chỉ cụ thể"
                  name="diaChiCuThe"
                  rules={[
                    { required: true, message: "Địa chỉ cụ thể không được để trống!" }
                  ]}
                >
                  <Input placeholder="Nhập địa chỉ cụ thể ..." />
                </Form.Item>
              </Col>
              <GHN dataAddress={setDataAddress} />
            </Row>
            <Form.Item className="mt-3 float-end">
              <Button type="primary" htmlType="submit" className="bg-warning">
                Thêm khách hàng
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default AddCustomer;
