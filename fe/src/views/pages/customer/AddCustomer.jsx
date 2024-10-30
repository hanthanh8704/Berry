import { Breadcrumb, Button, Col, Divider, Form, Input, Modal, Radio, Row } from "antd";
import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as request from 'views/utilities/httpRequest';
import GHN from "ui-component/GHN";

function AddCustomer() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [dataAddress, setDataAddress] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [image, setImage] = useState(null);

  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(file);
      setPreviewUrl(imageUrl);
    } catch (e) {
      setPreviewUrl(null);
    }
  };

  const handleAddCustomer = (data) => {
    if (dataAddress == null) {
      toast.error("Vui lòng chọn địa chỉ!");
      return;
    }

    if (image == null) {
      toast.error("Vui lòng chọn ảnh đại diện!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    console.log("Image : ", image);
    
    formData.append("addressRepuest.fullName", data.fullName);
    console.log("Address Request Full name : " + data.fullName);
    
    formData.append("addressRepuest.phoneNumber", data.phoneNumber);
    console.log("Address Request Phone number : " + data.phoneNumber);
    
    formData.append("addressRepuest.defaultAddress", true);
    console.log("Address Request Default address : true");
    
    formData.append("addressRepuest.city", dataAddress.city);
    console.log("Address Request City : " + dataAddress.city);
    
    formData.append("addressRepuest.district", dataAddress.district);
    console.log("Address Request District : " + dataAddress.district);
    
    formData.append("addressRepuest.ward", dataAddress.ward);
    console.log("Address Request Ward : " + dataAddress.ward);
    
    formData.append("addressRepuest.detailedAddress", data.detailedAddress);
    console.log("Address Request Detailed Address : " + data.detailedAddress);
    
    formData.append("fullName", data.fullName);
    console.log("Full name : " + data.fullName);
    
    formData.append("gender", data.gender);
    console.log("Gender : " + data.gender);
    
    formData.append("dateOfBirth", data.dateOfBirth);
    console.log("Date of Birth : " + data.dateOfBirth);
    
    formData.append("email", data.email);
    console.log("Email : " + data.email);
    
    formData.append("phoneNumber", data.phoneNumber);
    console.log("Phone number : " + data.phoneNumber);    

    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm khách hàng?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        request.post("/customer", formData, { headers: { "Content-Type": "multipart/form-data" } })
          .then((response) => {
            if (response.data.success) {
              toast.success("Thêm thành công!");
              navigate("/api/customer");
            } else {
              toast.error("Đã xảy ra lỗi khi thêm khách hàng.");
            }
          })
          .catch((error) => {
            toast.error(error.message || "Đã xảy ra lỗi khi thêm khách hàng.");
          });
      },
    });
  };

  const validateAge = (_, value) => {
    if (!value) return Promise.reject("Ngày sinh không được để trống!");
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) return Promise.reject("Khách hàng phải ít nhất 18 tuổi!");
    return Promise.resolve();
  };

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #ddd", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <Form onFinish={handleAddCustomer} layout="vertical" form={form}>
        <Row gutter={24}>
          {/* Col for Image - Left side */}
          <Col span={6}>
            {previewUrl !== null ? (
              <div className="text-center">
                <img src={previewUrl} alt="Preview" style={{ width: "100%", maxWidth: "162px", height: "162px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }} className="mt-2 border border-warning shadow-lg bg-body-tertiary object-fit-contain" />
                <Button className="position-absolute border-0" onClick={() => { setPreviewUrl(null); setImage(null); }}>Xóa ảnh</Button>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center">
                <div className="position-relative rounded-circle border border-warning mt-2 d-flex align-items-center justify-content-center" style={{ width: "162px", height: "162px", backgroundColor: "#f7f7f7", borderRadius: "6px" }}>
                  <Input type="file" accept="image/*" onChange={handleImageSelect} className="position-absolute opacity-0 py-5" />
                  <div className="text-center text-secondary">
                    <i className="fas fa-plus"></i> <br />
                    <span>Chọn ảnh đại diện</span>
                  </div>
                </div>
              </div>
            )}
          </Col>

          {/* Col for Form - Right side */}
          <Col span={18}>
            <h6 style={{ fontWeight: "600", fontSize: "16px", color: "#5e35b1", marginBottom: "20px" }}>Thông tin chi tiết</h6>
            <Divider />
            <Row gutter={10}>
            <Col span={12}>
                <Form.Item
                  label="Tên khách hàng"
                  name="fullName"
                  rules={[
                    { required: true, message: "Tên không được để trống!" }              
                      ]}
                >
                  <Input placeholder="Nhập số điện thoại ..." style={{ borderRadius: "6px", border: "1px solid #ddd", padding: "10px" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    { required: true, message: "Số điện thoại không được để trống!" },
                    { pattern: /^0[0-9]{9}$/, message: "Số điện thoại không đúng định dạng!" }
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại ..." style={{ borderRadius: "6px", border: "1px solid #ddd", padding: "10px" }} />
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
                  <Input placeholder="Nhập email ..." style={{ borderRadius: "6px", border: "1px solid #ddd", padding: "10px" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày sinh"
                  name="dateOfBirth"
                  rules={[
                    { required: true, message: "Ngày sinh không được để trống!" }
                  ]}
                >
                  <Input type="date" style={{ borderRadius: "6px", border: "1px solid #ddd", padding: "10px" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[{ required: true, message: "Giới tính không được để trống!" }]}
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
                  name="detailedAddress"
                  rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!" }]}>
                  <Input placeholder="Nhập địa chỉ cụ thể ..." style={{ borderRadius: "6px", border: "1px solid #ddd" }} />
                </Form.Item>
              </Col>
              <GHN dataAddress={setDataAddress} />
            </Row>
            <Form.Item className="mt-3 float-end">
              <Button type="primary" htmlType="submit" style={{ backgroundColor: "#5e35b1", borderColor: "#5e35b1", borderRadius: "6px", padding: "10px 20px", fontWeight: "600", marginRight: '600px' }}>
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

