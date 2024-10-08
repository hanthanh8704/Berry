import React, { useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Switch, Typography, Divider } from "antd";
import { toast } from "react-toastify";
import GHNDetail from "ui-component/GHNDetail";
import * as request from 'views/utilities/httpRequest';
import { ExclamationCircleFilled } from "@ant-design/icons";

function ItemAddress({ props, onSuccess }) {
  // debugger
  const [dataAddress, setDataAddress] = useState({
    thanhPho: props.thanhPho,
    huyen: props.huyen,
    phuong: props.phuong,
  });
  const [diaChiMacDinh, setDiaChiMacDinh] = useState(props.diaChiMacDinh);
  const { confirm } = Modal;

  const handleUpdate = (values) => {
    const data = {
      ...values,
      thanhPho: dataAddress.thanhPho || props.thanhPho,
      huyen: dataAddress.huyen || props.huyen,
      phuong: dataAddress.phuong || props.phuong,
      diaChiMacDinh: diaChiMacDinh !== props.diaChiMacDinh ? diaChiMacDinh : props.diaChiMacDinh,
    };

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
          console.log('Hihihi',data)
          .then((response) => {
            console.log(response);
            toast.success("Cập nhật địa chỉ thành công!");
            onSuccess();
          })
          .catch((e) => {
            console.log(e);
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
              toast.success("Thành công!");
              onSuccess();
            }
          })
          .catch((e) => {
            console.log(e);
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
          hoTen: props.hoTen,
          soDienThoai: props.soDienThoai,
          diaChiCuThe: props.diaChiCuThe,
          diaChiMacDinh: props.diaChiMacDinh,
        }}
        onFinish={handleUpdate}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={"Tên"}
              name={"hoTen"}
              rules={[{ required: true, message: "Tên không được để trống!" }]}
            >
              <Input placeholder="Nhập tên ..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={"Số điện thoại"}
              name={"soDienThoai"}
              rules={[{ required: true, message: "Số điện thoại không được để trống!" }]}
            >
              <Input placeholder="Nhập số điện thoại ..." />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={"Địa chỉ cụ thể"}
              name={"diaChiCuThe"}
              rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!" }]}
            >
              <Input placeholder="Nhập địa chỉ cụ thể..." />
            </Form.Item>
          </Col>
          <GHNDetail
            thanhPho={props.thanhPho}
            huyen={props.huyen}
            phuong={props.phuong}
            dataAddress={setDataAddress}
          />
          <Col span={24}>
            <Form.Item label="Địa chỉ mặc định">
              <Switch
                checked={diaChiMacDinh}
                onChange={setDiaChiMacDinh}
                checkedChildren={<i className="fa-solid fa-check"></i>}
                unCheckedChildren={<i className="fa-solid fa-xmark"></i>}
                defaultChecked={props.diaChiMacDinh}
              />
              <Typography.Text style={{ marginLeft: '8px' }}>
                {diaChiMacDinh ? 'Đang hoạt động' : 'Không hoạt động'}
              </Typography.Text>
            </Form.Item>
          </Col>
          <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button
              onClick={() => showDeleteConfirm(props.id)}
              type="primary"
              danger
            >
              Xóa
            </Button>
            <Button type="primary" htmlType="submit" className="bg-warning">
              Cập nhật
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default ItemAddress;
