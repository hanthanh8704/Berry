import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as request from "views/utilities/httpRequest";
import { Breadcrumb, Button, Col, Divider, Form, Input, Modal, Radio, Row, Select } from "antd";
import { toast } from "react-toastify";
import QrCode from "components/QrCode";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

const { Option } = Select;

const AddEmployee = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [anh, setAnh] = useState(null);
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const configApi = {
    headers: {
      "Content-Type": "application/json",
      Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694",
      ShopId: 192796,
    },
  };

  useEffect(() => {
    request.get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", configApi)
      .then((response) => setProvinces(response.data))
      .catch((e) => console.log(e));
  }, []);

  const handleProvinceChange = (provinceCode) => {
    request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceCode}`, configApi)
      .then((response) => setDistricts(response.data))
      .catch((e) => console.log(e));
  };

  const handleDistrictChange = (districtCode) => {
    request.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`, configApi)
      .then((response) => setWards(response.data))
      .catch((e) => console.log(e));
  };

  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setAnh(file);
      setPreviewUrl(imageUrl);
    } catch (e) {
      setPreviewUrl("");
    }
  };

  const handleQrSuccess = (value) => {
    const withoutName = value.substring(14);
    const splits = withoutName.split("|");
    const birthday = splits[1];
    if (value.substring(0, 12).length === 12) {
      toast.success(`Đã tìm thấy ${splits[0]}!`);
      form.setFieldsValue({
        gioiTinh: splits[2],
        cccd: value.substring(0, 12),
        ten: splits[0],
        ngaySinh: `${birthday.substring(4)}-${birthday.substring(2, 4)}-${birthday.substring(0, 2)}`,
        diaChi: splits[3],
      });
      setIsQrModalVisible(false);
    }
  };

  const handleAddStaff = (data) => {
    const formData = new FormData();
    formData.append("anh", anh);
    formData.append("cccd", data.cccd);
    formData.append("ten", data.ten);
    formData.append("gioiTinh", data.gioiTinh);
    formData.append("ngaySinh", data.ngaySinh);
    formData.append("email", data.email);
    formData.append("soDienThoai", data.soDienThoai);
    formData.append("diaChi",data.diaChi);
    formData.append("thanhPho",data.thanhPho);
    formData.append("phuong",data.phuong);
    formData.append("huyen",data.huyen);

    request
      .post("/nhan-vien/create", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((response) => {
        if (response.data.success) {
          if (response.status === 200) {
            sessionStorage.setItem('employeeAddSuccess', 'Thêm thành công!');
            navigate("/nhan-vien");
          }
        } else {
          toast.error("Có lỗi xảy ra!");
        }
      })
      .catch((e) => {
        toast.error(e.response.data);
      });
  };

  const showModal = () => {
    setIsQrModalVisible(true);
  };

  const handleCancel = () => {
    setIsQrModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Quét CCCD
      </Button>
      <Modal
        title="Quét CCCD"
        visible={isQrModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <QrCode onQrSuccess={handleQrSuccess} />
      </Modal>
      <Form onFinish={handleAddStaff} layout="vertical" form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <h6>Thông tin nhân viên</h6>
            <Divider />
            <Form.Item
              label="Tên nhân viên"
              name="ten"
              rules={[
                { required: true, message: "Tên không được để trống!" },
                {
                  pattern: /^[^\d!@#$%^&*()_+={}\\:;"'<>,.?/`~|-]+$/,
                  message: "Tên phải là chữ",
                },
              ]}
            >
              <Input placeholder="Nhập tên nhân viên..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            {previewUrl !== null ? (
              <div className="text-center">
                <img src={previewUrl} alt="Preview" style={{ width: "200px", height: "200px" }} className="mt-2 border border-warning shadow-lg bg-body-tertiary object-fit-contain" />
                <Button className="position-absolute border-0" onClick={() => { setPreviewUrl(null); setAnh(null); }}></Button>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center">
                <div className="position-relative border border-warning mt-2 d-flex align-items-center justify-content-center" style={{ width: "162px", height: "162px" }}>
                  <Input type="file" accept="image/*" onChange={handleImageSelect} className="position-absolute opacity-0 py-5" />
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
                  label="Mã định danh (Số CMT/CCCD)"
                  name="cccd"
                  rules={[
                    { required: true, message: "Mã định danh không được để trống!" },
                    {
                      pattern: /^([0-9]{9}|[0-9]{12})$/,
                      message: "Mã định danh phải có 9 hoặc 12 kí tự!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập mã định danh..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giới tính"
                  name="gioiTinh"
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
                  name="ngaySinh"
                  rules={[{ required: true, message: "Ngày sinh không được để trống!" }]}
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Email không được để trống!" }]}
                >
                  <Input placeholder="Nhập email ..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="soDienThoai"
                  rules={[
                    { required: true, message: "Số điện thoại không được để trống!" },
                    { pattern: /^0[0-9]{9}$/, message: "SDT không đúng định dạng!" },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại ..." />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={16}>
            <h6>Địa chỉ liên hệ</h6>
            <Divider />
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  label="Thành phố/Tỉnh"
                  name="thanhPho"
                  rules={[{ required: true, message: "Thành phố/Tỉnh không được để trống!" }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn thành phố"
                    optionFilterProp="children"
                    onChange={handleProvinceChange}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {provinces.map((province) => (
                      <Option key={province.ProvinceID} value={province.ProvinceID}>
                        {province.ProvinceName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Quận/Huyện"
                  name="huyen"
                  rules={[{ required: true, message: "Quận/Huyện không được để trống!" }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn quận/huyện"
                    optionFilterProp="children"
                    onChange={handleDistrictChange}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {districts.map((district) => (
                      <Option key={district.DistrictID} value={district.DistrictID}>
                        {district.DistrictName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Phường/Xã"
                  name="phuong"
                  rules={[{ required: true, message: "Phường/Xã không được để trống!" }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn phường/xã"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {wards.map((ward) => (
                      <Option key={ward.WardCode} value={ward.WardCode}>
                        {ward.WardName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Địa chỉ cụ thể"
                  name="diaChi"
                  rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!" }]}
                >
                  <Input type='text' placeholder="Nhập địa chỉ cụ thể" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
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
