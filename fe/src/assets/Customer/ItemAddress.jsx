import React, { useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Switch, Typography, Divider,notification } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import GHNDetail from "ui-component/GHNDetail";
import * as request from 'views/utilities/httpRequest';
import 'react-toastify/dist/ReactToastify.css';
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function ItemAddress({ props, onSuccess }) {
  const [dataAddress, setDataAddress] = useState({
    city: props?.city,
    district: props?.district,
    ward: props?.ward,
  });
  const [defaultAddress, setDiaChiMacDinh] = useState(props?.defaultAddress);
  const { confirm } = Modal;
  const navigate = useNavigate();

  const handleUpdate = (values) => {
    const data = {
      ...values,
      city: dataAddress.city || props.city,
      district: dataAddress.district || props.district,
      ward: dataAddress.ward || props.ward,
      defaultAddress: defaultAddress !== props.defaultAddress ? defaultAddress : props.defaultAddress,
    };
  
    console.log('Preparing to update address:', data);
  
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn cập nhật địa chỉ này?",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .put(`/address/${props.id}`, data)
          .then((response) => {
            console.log('Update success:', response);
            notification.success({
              message: 'Cập nhật thành công!',
              duration: 2, // Thời gian hiển thị thông báo (2 giây)
            });
          })
          .catch((e) => {
            console.error('Update error:', e);
          //  toast.error("Lỗi khi cập nhật địa chỉ!");
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
    
    
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa địa chỉ này?",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .remove(`/address/${props.id}`)
          .then((response) => {
            if (response.status === 200) {
              notification.success({
                message: 'Xóa thành công!',
                duration: 2, 
              });
              onSuccess();
            }
          })
          .catch((e) => {
            console.error('Delete error:', e);
           // toast.error("Lỗi khi xóa địa chỉ!");
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <Typography.Title level={4}>Cập nhật địa chỉ</Typography.Title>
      <Divider />
      <Form
        layout="vertical"
        initialValues={{
          fullName: props?.fullName,
          phoneNumber: props?.phoneNumber,
          detailedAddress: props?.detailedAddress,
          defaultAddress: props?.defaultAddress,
        }}
        onFinish={handleUpdate}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={"Tên"}
              name={"fullName"}
              rules={[{ required: true, message: "Tên không được để trống!" }]}
            >
              <Input placeholder="Nhập tên ..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={"Số điện thoại"}
              name={"phoneNumber"}
              rules={[{ required: true, message: "Số điện thoại không được để trống!" }]}
            >
              <Input placeholder="Nhập số điện thoại ..." />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={"Địa chỉ cụ thể"}
              name={"detailedAddress"}
              rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!" }]}
            >
              <Input placeholder="Nhập địa chỉ cụ thể..." />
            </Form.Item>
          </Col>
          <GHNDetail
            city={props?.city}
            district={props?.district}
            ward={props?.ward}
            dataAddress={setDataAddress}
          />
          <Col span={24}>
            <Form.Item label="Địa chỉ mặc định">
              <Switch
                checked={defaultAddress}
                onChange={setDiaChiMacDinh}
                checkedChildren={<i className="fa-solid fa-check"></i>}
                unCheckedChildren={<i className="fa-solid fa-xmark"></i>}
                defaultChecked={props.defaultAddress}
              />
              <Typography.Text style={{ marginLeft: '8px' }}>
                {defaultAddress ? 'Đang hoạt động' : 'Không hoạt động'}
              </Typography.Text>
            </Form.Item>
          </Col>
          <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={() => showDeleteConfirm(props.id)} type="primary" danger>
              Xóa
            </Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "#5e35b1", borderColor: "#5e35b1", borderRadius: "6px", fontWeight: "600" }}>
              Cập nhật
            </Button>
          </Col>
        </Row>
      </Form>
    <ToastContainer />
    </div>
  );
}

export default ItemAddress;
