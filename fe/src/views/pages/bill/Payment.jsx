// PaymentModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Button, Table, Input } from "antd";
import { NumericFormat } from 'react-number-format';
import * as request from 'views/utilities/httpRequest';
import { IconTrashX } from "@tabler/icons-react";
import { formatCurrency } from "views/utilities/format";

import axios from 'axios';
import FormatCurrency from 'views/utilities/FormatCurrency';

const PaymentModal = ({
  totalMoney,
  products,
  discountValue,
  billPayment,
  shipFee,
  exchangeRateMoney,
  voucher = { discountPrice: 0 },
  props
}) => {


  const [tienKhachDua, setTienKhachDua] = useState(0);
  const [transactionNo, setTransactionNo] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("TIEN_MAT");
  const [extraMoney, setExtraMoney] = useState();
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);

    form.resetFields();
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateBillWhenSavePayMent = async (dataPaymentRequest) => {
    try {
      // const totalBill = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
      // const addressUser = checkNotEmptyAddress() ? 
      //   `${address.detail}, ${address.wards}, ${address.district}, ${address.city}` : "";
      // const idAccount = accountuser ? accountuser.idAccount : "";
      // const itemDiscount = voucher.discountPrice + exchangeRateMoney;
      console.log(props.id);
      const data = {
        id: props.id,
        invoiceType: "TAI_QUAY",
        totalMoney: totalMoney,
        shippingFee: shipFee,
        paymentStatus: "THANH_TOAN",
        vouchers: voucher ? [voucher] : [],
        paymentsMethodRequests: dataPaymentRequest,
      };

      const response = await request.put('/bill/update-bill-wait', data);
      if (response.status === 200) {
        console.log("Cập nhật hóa đơn thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hóa đơn:", error);
    }
  };

  const addPayMent = () => {
    const newPayment = {
      method: paymentMethod,
      totalMoney: tienKhachDua,
      status: "DA_THANH_TOAN",
      transactionNo: transactionNo,

    };

    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có xác nhận không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => {
        // setDataPayMent([...billPayment, newPayment]);
        updateBillWhenSavePayMent([newPayment]);
        setTienKhachDua(0);
        setTransactionNo("");

        
      },
    });
  };


  
  const columnsPayments = [
    {
      title: <div className="title-product">STT</div>,
      dataIndex: "index",
      key: "index",
    },
    {
      title: <div className="title-product">Mã giao dịch</div>,
      dataIndex: "transactionNo",
      key: "transactionNo",
    },
    {
      title: <div className="title-product">Phương thức</div>,
      dataIndex: "method",
      key: "method",
    },
    {
      title: <div className="title-product">Số tiền</div>,
      dataIndex: "totalMoney",
      key: "totalMoney",
    },
    {
      title: <div className="title-product">Trạng thái</div>,
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Button
          style={{
            pointerEvents: "none",
            width: "120px",
            backgroundColor:
              status === "THANH_TOAN" ? "#4CAF50" : "#FF5722", // đổi màu theo trạng thái
            borderColor: status === "THANH_TOAN" ? "#4CAF50" : "#FF5722",
          }}
        >
          {status === "THANH_TOAN" ? "Đã thanh toán" : "Chưa thanh toán"}
        </Button>
      ),
    },
    {
      title: <div className="title-product">Hành động</div>,
      dataIndex: "id",
      key: "action",
      render: (id, record, index) => (
        <Button
          title="Xóa"
          style={{ border: "none" }}
          onClick={(e) => deletePayMent(e, index)}
        >
          <IconTrashX style={{ fontSize: "20px", color: "red" }} />
        </Button>
      ),
    },
  ];

  const calculateExtraMoney = (value) => {
    // Sử dụng `tienKhachDua` đã cập nhật để tính toán `extraMoney`
    setExtraMoney(value - totalMoney + discountValue);
  };
  
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Mở Thanh toán
      </Button>
      <Modal
        title="Thanh toán"
        style={{ fontWeight: "bold" }}
        open={isModalOpen}
        onOk={addPayMent}
        onCancel={closeModal}
        cancelText="huỷ"
        okText="Xác nhận"
        width={650}
      >
        <Form>
          {/* Số tiền */}
          <li className="mb-2">
            Tổng tiền:
            <span className="float-end fw-semibold text-danger">
              <FormatCurrency value={totalMoney - discountValue + (props.invoiceType === 'TRUC_TUYEN' ? shippingFee : 0)} />
            </span>
          </li>
          <Row style={{ width: "100%", marginTop: "10px" }}>


            {/* Mã giao dịch - chỉ hiển thị khi chọn Chuyển khoản */}
            {paymentMethod === "CHUYEN_KHOAN" && (
              <Col span={24} style={{ marginTop: "10px" }}>
                <Row align="middle" style={{ width: "100%" }}>
                  <Col
                    span={4}
                    style={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}
                  >
                    Số tiền:
                  </Col>
                  <Col span={8}>
                  <Form.Item
  name="totalMoney"
  style={{ marginBottom: "10px" }}
  rules={[
    {
      required: true,
      message: "Vui lòng nhập số tiền",
    },
  ]}
>
  <NumericFormat
    thousandSeparator={false}
    placeholder="Nhập số tiền"
    style={{
      width: "100%",
      height: "40px",
      padding: "5px 12px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      transition: "border-color 0.3s",
    }}
    customInput={Input}
    value={tienKhachDua}
    onChange={(e) => {
      const value = e.target.value;
      setTienKhachDua(value);
      // Đặt một hàm tính toán giá trị `extraMoney` bên ngoài
      calculateExtraMoney(value);
    }}
  />
</Form.Item>

                  </Col>
                  <Col
                    span={4}
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "16px",
                    }}
                  >
                    Mã giao dịch:
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="transactionNo"
                      style={{ marginBottom: "20px" }}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã giao dịch",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập mã giao dịch"
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "5px 12px",
                          fontSize: "16px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          transition: "border-color 0.3s",
                        }}
                        value={transactionNo}
                        onChange={(e) => { setTransactionNo(e.target.value) }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            )}
            {paymentMethod === "TIEN_MAT" && (
              <Col span={24} style={{ marginTop: "10px" }}>
                <Row align="middle" style={{ width: "100%" }}>
                  <Col
                    span={4}
                    style={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}
                  >
                    Số tiền:
                  </Col>
                  <Col span={19}>
                  <Form.Item
  name="totalMoney"
  style={{ marginBottom: "10px" }}
  rules={[
    {
      required: true,
      message: "Vui lòng nhập số tiền",
    },
  ]}
>
  <NumericFormat
    thousandSeparator={false}
    placeholder="Nhập số tiền"
    style={{
      width: "100%",
      height: "40px",
      padding: "5px 12px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      transition: "border-color 0.3s",
    }}
    customInput={Input}
    value={tienKhachDua}
    onChange={(e) => {
      const value = e.target.value;
      setTienKhachDua(value);
      // Đặt một hàm tính toán giá trị `extraMoney` bên ngoài
      calculateExtraMoney(value);
    }}
  />
</Form.Item>

                  </Col>
                </Row>
              </Col>
            )}
            <li className="mb-2">
              {extraMoney >= 0 ? "Tiền thừa:" : "Tiền thiếu:"}
              <span className="float-end fw-semibold text-danger">
                <FormatCurrency value={extraMoney} />
              </span>
            </li>
          </Row>

          {/* Nút lựa chọn phương thức thanh toán */}
          <Row style={{ width: "100%", marginTop: "20px" }} justify="center">
            <Col span={10} style={{ textAlign: "center" }}>
              <Button
                type="primary"
                onClick={() => { setPaymentMethod("TIEN_MAT"); }}
                style={{
                  width: "100%",
                  height: "45px",
                  borderRadius: "25px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  backgroundColor: paymentMethod === "TIEN_MAT" ? "#4CAF50" : "#ccc", // đổi màu khi được chọn
                  borderColor: paymentMethod === "TIEN_MAT" ? "#4CAF50" : "#ccc",
                  transition: "background-color 0.3s, border-color 0.3s",
                }}
              >
                Tiền mặt
              </Button>
            </Col>
            <Col span={10} style={{ textAlign: "center" }}>
              <Button
                type="primary"
                // onClick={() => setPaymentMethod("CHUYEN_KHOAN")}
                onClick={(e) => { setPaymentMethod("CHUYEN_KHOAN"); }}
                style={{
                  width: "100%",
                  height: "45px",
                  borderRadius: "25px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  backgroundColor:
                    paymentMethod === "CHUYEN_KHOAN" ? "#1E90FF" : "#ccc", // đổi màu khi được chọn
                  borderColor:
                    paymentMethod === "CHUYEN_KHOAN" ? "#1E90FF" : "#ccc",
                  transition: "background-color 0.3s, border-color 0.3s",
                }}
              >
                Chuyển khoản
              </Button>
            </Col>
          </Row>

          {/* Table và các phần khác */}
          <Row style={{ width: "100%", marginTop: "10px" }}>
          <Table
  style={{ width: "100%" }}
  dataSource={[billPayment]} // Đảm bảo dataSource là mảng
  columns={columnsPayments}
  pagination={{ pageSize: 3 }}
  className="customer-table"
/>


          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default PaymentModal;

