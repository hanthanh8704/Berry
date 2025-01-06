import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Col, Divider, Form, Input, Modal, Radio, Row, notification } from "antd";
import { toast, ToastContainer } from "react-toastify";
import QrCode from "components/QrCode";
import 'react-toastify/dist/ReactToastify.css';
import * as request from 'views/utilities/httpRequest';

const AddEmployee = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [image, setAnh] = useState(null);
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);

  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setAnh(file);
        setPreviewUrl(imageUrl);
      }
    } catch (e) {
      setPreviewUrl("");
    }
  };

  const handleQrSuccess = (value) => {
    try {
      if (value.length < 14) {
        throw new Error("QR code không hợp lệ!");
      }

      const nationalId = value.substring(0, 12);
      const withoutNationalId = value.substring(14);
      const splits = withoutNationalId.split("|");

      if (splits.length < 6) {
        throw new Error("Dữ liệu trong QR code không đầy đủ!");
      }

      const [__, name, rawBirthday, gender, detailedAddress, _] = splits;

      if (nationalId.length !== 12 || isNaN(Number(nationalId))) {
        throw new Error("Mã định danh không hợp lệ!");
      }
      console.log(name);
      console.log(rawBirthday);
      console.log(gender);
      console.log(detailedAddress);
      console.log(name);
      if (!/^\d{8}$/.test(rawBirthday)) {
        throw new Error("Ngày sinh không hợp lệ! Ngày sinh phải có định dạng ddMMyyyy.");
      }

      // Đổi định dạng từ ddMMyyyy sang dd-MM-yyyy
      const formattedBirthday = `${rawBirthday.substring(4)}-${rawBirthday.substring(2, 4)}-${rawBirthday.substring(0, 2)}`;
      console.log("formattedBirthday:", formattedBirthday); // Kết quả mong muốn: 02-09-2004

      const finalDetailedAddress = detailedAddress === "null null" ? "" : detailedAddress;

      form.setFieldsValue({
        gender: gender || "",
        nationalId: nationalId,
        name: name || "Chưa rõ",
        dateOfBirth: formattedBirthday,
        detailedAddress: finalDetailedAddress,
      });

      toast.success(`Đã tìm thấy thông tin của ${name}!`);
      setIsQrModalVisible(false);
    } catch (error) {
      toast.error(error.message || "Lỗi khi xử lý QR code!");
    }
  };




  const handleAddStaff = (data) => {
    const today = new Date();
    const birthDate = new Date(data.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const isUnderage = (monthDiff < 0) || (monthDiff === 0 && today.getDate() < birthDate.getDate());

    // if (isUnderage || age < 13) {
    //   toast.error("Nhân viên phải từ 13 tuổi trở lên!");
    //   return;
    // }


    if (!image) {
      toast.error("Ảnh không được để trống!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("nationalId", data.nationalId);
    formData.append("name", data.name);
    formData.append("gender", data.gender);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("detailedAddress", data.detailedAddress);

    request.post("/nhan-vien/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        if (response.data.success) {
          notification.success({
            message: 'Thêm mới thành công!',
            duration: 2,
          }); navigate("/employee");
        } else {
          notification.error({
            message: 'Thêm mới thất bại!',
            duration: 2,
          });
        }
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });

  };

  const showModal = () => {
    setIsQrModalVisible(true);
  };

  const handleCancel = () => {
    setIsQrModalVisible(false);
  };

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #ddd", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <h6 style={{ fontWeight: "600", fontSize: "16px", color: "#5e35b1", marginBottom: "20px" }}>Thông tin nhân viên</h6>
      <div>
        <QrCode onQrSuccess={handleQrSuccess} />
      </div>

      <Form onFinish={handleAddStaff} layout="vertical" form={form}>
        <Row gutter={24}>
          <Col span={16}>
            <Divider />
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  label="Tên nhân viên"
                  name="name"
                  rules={[{ required: true, message: "Tên không được để trống!" }, { pattern: /^[^\d!@#$%^&*()_+={}\\:;"'<>,.?/`~|-]+$/, message: "Tên phải là chữ" }]}
                >
                  <Input placeholder="Nhập tên nhân viên..." style={{ borderRadius: "6px", border: "1px solid #ddd", padding: "10px" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Mã định danh (Số CMT/CCCD)"
                  name="nationalId"
                  rules={[{ required: true, message: "Mã định danh không được để trống!" }, {
                    pattern: /^[0-9]{12}$/,
                    message: "Mã định danh phải có 12 chữ số!"
                  }
                  ]}
                >
                  <Input placeholder="Nhập mã định danh..." style={{ borderRadius: "6px", border: "1px solid #ddd", padding: "10px" }} />
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
                  label="Ngày sinh"
                  name="dateOfBirth"
                  rules={[{ required: true, message: "Ngày sinh không được để trống!" }]}
                >
                  <Input type="date" style={{ borderRadius: "6px", border: "1px solid #ddd", padding: "10px" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Email không được để trống!" },
                    {
                      validator: (_, value) => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!value || emailRegex.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Email không đúng định dạng!"));
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập email ..." style={{ borderRadius: "6px", border: "1px solid #ddd", padding: "10px" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[{ required: true, message: "Số điện thoại không được để trống!" }, { pattern: /^0[0-9]{9}$/, message: "SDT không đúng định dạng!" }]}
                >
                  <Input placeholder="Nhập số điện thoại ..." style={{ borderRadius: "6px", border: "1px solid #ddd", padding: "10px" }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Địa chỉ cụ thể"
                  name="detailedAddress"
                  rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!" }]}
                >
                  <Input type="text" placeholder="Nhập địa chỉ cụ thể" style={{ borderRadius: "6px", border: "1px solid #ddd", padding: "10px" }} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Divider />
            {previewUrl !== null ? (
              <div className="text-center">
                <img src={previewUrl} alt="Preview" style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }} className="mt-2 border border-warning shadow-lg bg-body-tertiary object-fit-contain" />
                <Button className="position-absolute border-0" onClick={() => { setPreviewUrl(null); setAnh(null); }}>Xóa ảnh</Button>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center">
                <div className="position-relative rounded-circle border border-warning mt-2 d-flex align-items-center justify-content-center" style={{ width: "150px", height: "150px", backgroundColor: "#f7f7f7", borderRadius: "6px" }}>
                  <Input type="file" accept="image/*" onChange={handleImageSelect} className="position-absolute opacity-0 py-5" />
                  <div className="text-center text-secondary">
                    <i className="fas fa-plus"></i> <br />
                    <span>Chọn ảnh đại diện</span>
                  </div>
                </div>
              </div>
            )}
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: "#5e35b1", borderColor: "#5e35b1", borderRadius: "6px", padding: "10px 20px", fontWeight: "600", marginLeft: '500px', marginTop: '30px' }}>
                Thêm nhân viên
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default AddEmployee;
